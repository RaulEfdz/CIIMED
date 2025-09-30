import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { supabaseClient } from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

async function searchRelevantChunks(query: string, limit = 5) {
  try {
    // 1. Generar embedding de la consulta
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query
    })
    
    const queryEmbedding = embeddingResponse.data[0].embedding

    // 2. Buscar chunks similares usando la función SQL
    const { data, error } = await supabaseClient.rpc('match_chunks', {
      query_embedding: queryEmbedding,
      match_count: limit
    })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Search error:', error)
    // Si hay error de OpenAI (cuota excedida), devolver búsqueda básica por texto
    if (error.code === 'insufficient_quota') {
      return await fallbackTextSearch(query, limit)
    }
    return []
  }
}

// Búsqueda de respaldo por texto cuando OpenAI no está disponible
async function fallbackTextSearch(query: string, limit = 5) {
  try {
    const { data, error } = await supabaseClient
      .from('document_chunks')
      .select(`
        id,
        content,
        documents!inner(title, url, metadata)
      `)
      .textSearch('content', query)
      .limit(limit)

    if (error) throw error

    return (data || []).map(chunk => ({
      chunk_id: chunk.id,
      content: chunk.content,
      title: chunk.documents.title,
      url: chunk.documents.url,
      metadata: chunk.documents.metadata,
      similarity: 0.5 // Similaridad fija para búsqueda por texto
    }))
  } catch (error) {
    console.error('Fallback search error:', error)
    return []
  }
}

function buildSystemPrompt(relevantChunks: any[], userQuery: string) {
  const hasContext = relevantChunks.length > 0
  
  if (!hasContext) {
    return {
      role: 'system' as const,
      content: `Eres el asistente virtual del CIIMED (Centro de Investigación e Innovación en Medicina Tropical).

Actualmente no tengo información específica cargada en mi base de conocimientos. 

Responde de manera general sobre el CIIMED basándote en que es un centro de investigación médica en Panamá, y sugiere al usuario contactar directamente al CIIMED para información detallada.

Mantén un tono profesional y amigable. Máximo 100 palabras.`
    }
  }

  const contextText = relevantChunks
    .map(chunk => `### ${chunk.title}\n${chunk.content}`)
    .join('\n\n---\n\n')

  return {
    role: 'system' as const,
    content: `Eres el asistente virtual del CIIMED (Centro de Investigación e Innovación en Medicina Tropical). 

INSTRUCCIONES IMPORTANTES:
- Responde SOLO con información del CONTEXTO proporcionado
- Si no tienes información en el contexto, dilo claramente y sugiere contactar al CIIMED
- Mantén respuestas concisas (máximo 150 palabras)
- Usa un tono profesional pero amigable
- Si incluyes enlaces, usa solo URLs del contexto

CONTEXTO DISPONIBLE:
${contextText}

PREGUNTA DEL USUARIO: ${userQuery}`
  }
}

// Respuesta de respaldo cuando OpenAI no está disponible
function getFallbackResponse(query: string, relevantChunks: any[]): string {
  const lowerQuery = query.toLowerCase()
  
  if (relevantChunks.length > 0) {
    const context = relevantChunks[0].content.substring(0, 200)
    return `Basándome en la información disponible: ${context}...\n\nPara información más detallada, te sugiero contactar directamente al CIIMED a través de sus redes sociales @ciimedpanama o visitando sus instalaciones en el Hospital Nacional.`
  }
  
  // Respuestas básicas sin contexto
  if (lowerQuery.includes('hola') || lowerQuery.includes('buenos') || lowerQuery.includes('buenas')) {
    return '¡Hola! Soy el asistente virtual del CIIMED. Actualmente tengo limitaciones técnicas, pero puedo ayudarte con información general. Para detalles específicos, contáctanos en @ciimedpanama'
  }
  
  if (lowerQuery.includes('contacto') || lowerQuery.includes('teléfono') || lowerQuery.includes('dirección')) {
    return 'Para contactar al CIIMED:\n• Instagram: @ciimedpanama\n• Ubicación: Hospital Nacional, Panamá\n• También puedes contactar a través de la Universidad de Panamá'
  }
  
  if (lowerQuery.includes('investigación') || lowerQuery.includes('estudios')) {
    return 'El CIIMED se dedica a investigación biomédica y clínica, con enfoque en medicina tropical. Nuestras líneas incluyen cáncer, salud mental, enfermedades infecciosas y más. Contáctanos para información específica.'
  }
  
  return 'Soy el asistente del CIIMED (Centro de Investigación e Innovación Médica). Actualmente tengo limitaciones técnicas. Para información detallada, contáctanos en @ciimedpanama o a través del Hospital Nacional.'
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message?.trim()) {
      return new Response('Mensaje requerido', { status: 400 })
    }

    // Buscar información relevante
    const relevantChunks = await searchRelevantChunks(message)
    
    const messages = [
      buildSystemPrompt(relevantChunks, message),
      {
        role: 'user' as const,
        content: message
      }
    ]

    // Crear stream de respuesta
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.3,
            max_tokens: 300,
            stream: true
          })

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              controller.enqueue(new TextEncoder().encode(content))
            }
          }
        } catch (error) {
          console.error('OpenAI streaming error:', error)
          
          // Si es error de cuota, dar respuesta de respaldo
          if (error.code === 'insufficient_quota') {
            const fallbackResponse = getFallbackResponse(message, relevantChunks)
            controller.enqueue(new TextEncoder().encode(fallbackResponse))
          } else {
            controller.enqueue(
              new TextEncoder().encode('⚠️ Error generando respuesta. Por favor intenta nuevamente.')
            )
          }
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Error interno del servidor', { status: 500 })
  }
}

// OPTIONS para CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}