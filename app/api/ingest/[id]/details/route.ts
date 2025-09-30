import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: documentId } = await params
    console.log('Fetching details for document:', documentId)

    // Obtener documento con todos sus chunks
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' }
        },
        _count: {
          select: { chunks: true }
        }
      }
    })

    if (!document) {
      console.log('Document not found:', documentId)
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
    }

    console.log('Document found:', document.title, 'with', document.chunks.length, 'chunks')

    // Procesar chunks para mostrar información útil
    const chunksWithInfo = document.chunks.map(chunk => {
      try {
        return {
          id: chunk.id,
          index: chunk.chunkIndex,
          content: chunk.content,
          contentPreview: chunk.content.substring(0, 200) + (chunk.content.length > 200 ? '...' : ''),
          hasEmbedding: chunk.embedding && chunk.embedding.length > 0,
          embeddingDimensions: chunk.embedding ? chunk.embedding.length : 0,
          createdAt: chunk.createdAt,
          wordCount: chunk.content.split(/\s+/).filter(word => word.length > 0).length,
          charCount: chunk.content.length
        }
      } catch (error) {
        console.error('Error processing chunk:', chunk.id, error)
        return {
          id: chunk.id,
          index: chunk.chunkIndex,
          content: chunk.content || '',
          contentPreview: 'Error loading preview',
          hasEmbedding: false,
          embeddingDimensions: 0,
          createdAt: chunk.createdAt,
          wordCount: 0,
          charCount: 0
        }
      }
    })

    // Estadísticas generales
    const stats = {
      totalChunks: document._count.chunks,
      chunksWithEmbeddings: chunksWithInfo.filter(c => c.hasEmbedding).length,
      totalWords: chunksWithInfo.reduce((sum, c) => sum + c.wordCount, 0),
      totalCharacters: chunksWithInfo.reduce((sum, c) => sum + c.charCount, 0),
      avgWordsPerChunk: chunksWithInfo.length > 0 
        ? Math.round(chunksWithInfo.reduce((sum, c) => sum + c.wordCount, 0) / chunksWithInfo.length)
        : 0
    }

    const response = {
      document: {
        id: document.id,
        title: document.title,
        content: document.content,
        url: document.url,
        metadata: document.metadata,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      },
      chunks: chunksWithInfo,
      stats
    }

    console.log('Returning response with', chunksWithInfo.length, 'chunks and stats:', stats)
    return NextResponse.json(response)

  } catch (error) {
    console.error('Get document details error:', error)
    console.error('Stack trace:', error.stack)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}