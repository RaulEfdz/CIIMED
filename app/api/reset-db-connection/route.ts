import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🔄 Resetting database connection...');

    // Get fresh Prisma client
    const prisma = await getPrismaClient();
    
    // Test the connection with a simple query
    const testResult = await prisma.researchProject.count();
    
    console.log(`✅ Connection reset successful. Found ${testResult} research projects.`);

    return NextResponse.json({
      success: true,
      message: 'Database connection reset successfully',
      testResult: {
        researchProjects: testResult
      }
    });

  } catch (error) {
    console.error('Error resetting database connection:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error resetting database connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}