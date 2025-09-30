import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE - Eliminar documento y sus chunks
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = params.id

    // Verificar que el documento existe
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        _count: {
          select: { chunks: true }
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
    }

    // Eliminar documento (los chunks se eliminan automáticamente por CASCADE)
    await prisma.document.delete({
      where: { id: documentId }
    })

    return NextResponse.json({
      success: true,
      message: `Documento "${document.title}" eliminado exitosamente`,
      chunksDeleted: document._count.chunks
    })

  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}