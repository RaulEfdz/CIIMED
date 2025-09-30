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

    const { title, content, url, version } = await req.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
    }

    // 1. Crear documento
    const document = await prisma.document.create({
      data: {
        title,
        content: cleanText(content),
        url: url || null,
        metadata: version ? { version } : null
      }
    })

    // 2. Generar chunks
    const chunks = chunkText(content)
    const chunksData = chunks.map((chunkContent, index) => ({
      documentId: document.id,
      content: chunkContent,
      chunkIndex: index
    }))

    const insertedChunks = await prisma.documentChunk.createMany({
      data: chunksData
    })

    // 3. Obtener chunks creados para generar embeddings
    const createdChunks = await prisma.documentChunk.findMany({
      where: { documentId: document.id },
      orderBy: { chunkIndex: 'asc' }
    })

    // 4. Generar embeddings en batches (con manejo de errores de cuota)
    let embeddingCount = 0
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
      } catch (error) {
        console.error(`Error generating embedding for chunk ${chunk.id}:`, error)
        // Si es error de cuota, continuar sin embeddings
        if (error.code === 'insufficient_quota') {
          console.warn('OpenAI quota exceeded. Document saved without embeddings.')
          break; // Parar de intentar más embeddings
        }
      }
    }

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
    console.error('Ingest error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET para listar documentos (admin)
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documents = await prisma.document.findMany({
      include: {
        _count: {
          select: { chunks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ documents })

  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}