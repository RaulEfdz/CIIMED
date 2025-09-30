import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import OpenAI from 'openai'
import { verifyAdminToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { chunkText, cleanText } from '@/lib/text-utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId } = await req.json()
    
    // Verificar que OpenAI API key esté configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found in environment variables')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }
    
    console.log('OpenAI API key found, length:', process.env.OPENAI_API_KEY.length)

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
    }

    // 1. Obtener el documento existente
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { chunks: true }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // 2. Eliminar chunks existentes
    await prisma.documentChunk.deleteMany({
      where: { documentId: document.id }
    })

    // 3. Regenerar chunks con el contenido actual
    const chunks = chunkText(document.content)
    const chunksData = chunks.map((chunkContent, index) => ({
      documentId: document.id,
      content: chunkContent,
      chunkIndex: index
    }))

    await prisma.documentChunk.createMany({
      data: chunksData
    })

    // 4. Obtener chunks creados para generar embeddings
    const createdChunks = await prisma.documentChunk.findMany({
      where: { documentId: document.id },
      orderBy: { chunkIndex: 'asc' }
    })

    // 5. Generar embeddings en batches (con manejo de errores de cuota)
    let embeddingCount = 0
    let lastError = null
    
    console.log(`🔄 RAG REGENERATION: Document "${document.title}" - Processing ${createdChunks.length} chunks`)
    
    for (const chunk of createdChunks) {
      try {
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk.content
        })

        const embedding = embeddingResponse.data[0].embedding

        // Actualizar chunk con embedding
        await prisma.documentChunk.update({
          where: { id: chunk.id },
          data: { 
            embedding: embedding
          }
        })

        embeddingCount++
        console.log(`✅ Chunk ${embeddingCount}/${createdChunks.length} - Embedding saved (${embedding.length}D)`)
        
      } catch (error) {
        lastError = error
        console.error(`❌ EMBEDDING ERROR - Chunk ${embeddingCount + 1}:`, {
          message: error.message,
          code: error.code,
          status: error.status
        })
        
        // Si es error de cuota, continuar sin embeddings
        if (error.code === 'insufficient_quota') {
          console.warn('⚠️ OpenAI quota exceeded - stopping embedding generation')
          break
        }
        
        // Si es error de autenticación u otro error crítico, también parar
        if (error.code === 'invalid_api_key' || error.status === 401) {
          console.error('🚫 OpenAI API key invalid or unauthorized - stopping')
          break
        }
        
        // Para otros errores, continuar pero guardar el error
        console.warn(`⚠️ Non-critical error, continuing...`)
      }
    }
    
    const success = embeddingCount > 0
    const status = success ? '✅ SUCCESS' : '⚠️ NO EMBEDDINGS'
    console.log(`${status} - RAG Regeneration completed: ${embeddingCount}/${createdChunks.length} embeddings created`)
    
    if (lastError && embeddingCount === 0) {
      console.error('🔍 DEBUG - Last error details:', {
        message: lastError.message,
        code: lastError.code,
        stack: lastError.stack?.split('\n')[0]
      })
    }

    // 6. Actualizar timestamp del documento
    await prisma.document.update({
      where: { id: document.id },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title
      },
      stats: {
        chunks: chunks.length,
        embeddings: embeddingCount
      }
    })

  } catch (error) {
    console.error('Regenerate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}