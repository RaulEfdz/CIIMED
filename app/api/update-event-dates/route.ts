import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🚀 Actualizando fechas de eventos a 2025...');

    // Obtener todos los eventos
    const events = await prisma.event.findMany();
    
    let updatedCount = 0;

    for (const event of events) {
      try {
        // Cambiar el año de 2024 a 2025 manteniendo mes y día
        const currentDate = new Date(event.date);
        const newDate = new Date(currentDate);
        newDate.setFullYear(2025);

        // También actualizar eventDate si existe
        const currentEventDate = event.eventDate ? new Date(event.eventDate) : null;
        const newEventDate = currentEventDate ? new Date(currentEventDate) : null;
        if (newEventDate) {
          newEventDate.setFullYear(2025);
        }

        // También actualizar registrationEnd si existe
        const currentRegEnd = event.registrationEnd ? new Date(event.registrationEnd) : null;
        const newRegEnd = currentRegEnd ? new Date(currentRegEnd) : null;
        if (newRegEnd) {
          newRegEnd.setFullYear(2025);
        }

        await prisma.event.update({
          where: { id: event.id },
          data: {
            date: newDate.toISOString().split('T')[0], // YYYY-MM-DD format
            eventDate: newEventDate?.toISOString(),
            registrationEnd: newRegEnd?.toISOString(),
            updatedAt: new Date()
          }
        });

        updatedCount++;
        console.log(`✅ Actualizado: ${event.title} - Nueva fecha: ${newDate.toISOString().split('T')[0]}`);
      } catch (eventError) {
        console.error(`❌ Error actualizando evento "${event.title}":`, eventError);
      }
    }

    // Obtener estadísticas finales
    const totalEvents = await prisma.event.count();

    return NextResponse.json({
      success: true,
      message: 'Fechas de eventos actualizadas exitosamente',
      results: {
        updated: updatedCount,
        total: totalEvents,
        year: 2025
      }
    });

  } catch (error) {
    console.error('Error updating event dates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar fechas de eventos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}