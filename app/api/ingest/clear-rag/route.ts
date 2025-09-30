import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🧹 RAG CLEANUP: Starting complete RAG cleanup')

    // Obtener estadísticas antes de limpiar
    const beforeStats = await prisma.documentChunk.aggregate({
      _count: { id: true }
    })

    const documentsWithChunks = await prisma.document.findMany({
      include: {
        _count: {
          select: { chunks: true }
        }
      }
    })

    const totalChunks = beforeStats._count.id
    const totalDocs = documentsWithChunks.length
    
    console.log(`📊 Found ${totalChunks} chunks across ${totalDocs} documents`)

    // Eliminar todos los chunks (esto también eliminará los embeddings automáticamente)
    const deleteResult = await prisma.documentChunk.deleteMany({})

    console.log(`🗑️ Deleted ${deleteResult.count} chunks and embeddings`)

    // Actualizar timestamp de todos los documentos para indicar que fueron modificados
    const updateResult = await prisma.document.updateMany({
      data: { updatedAt: new Date() }
    })

    console.log(`✅ RAG CLEANUP COMPLETE: ${deleteResult.count} chunks deleted, ${updateResult.count} documents updated`)

    return NextResponse.json({
      success: true,
      message: 'RAG limpiado exitosamente',
      stats: {
        chunksDeleted: deleteResult.count,
        documentsAffected: updateResult.count,
        documentsKept: documentsWithChunks.length
      }
    })

  } catch (error) {
    console.error('Clear RAG error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}