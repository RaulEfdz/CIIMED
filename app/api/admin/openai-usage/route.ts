import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Obtener información de uso y límites
    const [usageResponse, modelsResponse] = await Promise.all([
      // Uso actual del mes
      fetch('https://api.openai.com/v1/usage', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }),
      // Modelos disponibles (para verificar que la key funciona)
      fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })
    ])

    const usageData = usageResponse.ok ? await usageResponse.json() : null
    const modelsData = modelsResponse.ok ? await modelsResponse.json() : null

    // Si no podemos obtener uso, intentar hacer una llamada de prueba
    let testResult = null
    if (!usageResponse.ok) {
      try {
        const testResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 1
          })
        })

        if (testResponse.ok) {
          testResult = { status: 'active', message: 'API key is working' }
        } else {
          const errorData = await testResponse.json()
          testResult = { 
            status: 'error', 
            message: errorData.error?.message || 'Unknown error',
            code: errorData.error?.code
          }
        }
      } catch (error) {
        testResult = { status: 'error', message: 'Connection failed' }
      }
    }

    return NextResponse.json({
      usage: usageData,
      models: modelsData?.data?.length || 0,
      test: testResult,
      keyStatus: modelsResponse.ok ? 'active' : 'error'
    })

  } catch (error) {
    console.error('OpenAI usage check error:', error)
    return NextResponse.json(
      { error: 'Error checking OpenAI usage' },
      { status: 500 }
    )
  }
}