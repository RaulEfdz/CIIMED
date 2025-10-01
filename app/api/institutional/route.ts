import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener información institucional (público)
export async function GET(req: NextRequest) {
  try {
    const institutionalInfo = await prisma.institutionalInfo.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ institutionalInfo })

  } catch (error) {
    console.error('Get institutional info error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear información institucional (admin only)
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      description,
      subtitle,
      mission,
      vision,
      values,
      history,
      address,
      phone,
      email,
      website,
      foundingYear,
      logo,
      image,
      heroImage,
      historyImage,
      instagramUrl,
      linkedinUrl,
      youtubeUrl,
      spotifyUrl,
      feature1Title,
      feature1Text,
      feature2Title,
      feature2Text,
      overlayColor,
      footerBrand,
      footerEmail,
      footerPhone,
      footerAddress,
      footerCopyright,
      footerBackgroundColor,
      footerTextColor,
      footerAccentColor
    } = await req.json()

    // Validar campos requeridos
    if (!name || !description || !mission || !vision || !foundingYear) {
      return NextResponse.json(
        { error: 'Nombre, descripción, misión, visión y año de fundación son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si ya existe información institucional
    const existingInfo = await prisma.institutionalInfo.findFirst()
    if (existingInfo) {
      return NextResponse.json(
        { error: 'Ya existe información institucional. Use PUT para actualizar.' },
        { status: 409 }
      )
    }

    const institutionalInfo = await prisma.institutionalInfo.create({
      data: {
        name,
        description,
        subtitle: subtitle || '',
        mission,
        vision,
        values: values || [],
        history: history || '',
        address: address || '',
        phone: phone || '',
        email: email || '',
        website: website || '',
        foundingYear: parseInt(foundingYear),
        logo: logo || '',
        image: image || '',
        heroImage: heroImage || '',
        historyImage: historyImage || '',
        instagramUrl: instagramUrl || '',
        linkedinUrl: linkedinUrl || '',
        youtubeUrl: youtubeUrl || '',
        spotifyUrl: spotifyUrl || '',
        feature1Title: feature1Title || '',
        feature1Text: feature1Text || '',
        feature2Title: feature2Title || '',
        feature2Text: feature2Text || '',
        overlayColor: overlayColor || '#ffffff',
        footerBrand: footerBrand || '',
        footerEmail: footerEmail || '',
        footerPhone: footerPhone || '',
        footerAddress: footerAddress || '',
        footerCopyright: footerCopyright || '',
        footerBackgroundColor: footerBackgroundColor || '#285C4D',
        footerTextColor: footerTextColor || '#ffffff',
        footerAccentColor: footerAccentColor || '#F4633A',
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({
      success: true,
      institutionalInfo
    }, { status: 201 })

  } catch (error) {
    console.error('Create institutional info error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar información institucional (admin only)
export async function PUT(req: NextRequest) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      description,
      subtitle,
      mission,
      vision,
      values,
      history,
      address,
      phone,
      email,
      website,
      foundingYear,
      logo,
      image,
      heroImage,
      historyImage,
      instagramUrl,
      linkedinUrl,
      youtubeUrl,
      spotifyUrl,
      feature1Title,
      feature1Text,
      feature2Title,
      feature2Text,
      overlayColor,
      footerBrand,
      footerEmail,
      footerPhone,
      footerAddress,
      footerCopyright,
      footerBackgroundColor,
      footerTextColor,
      footerAccentColor
    } = await req.json()

    // Validar campos requeridos
    if (!name || !description || !mission || !vision || !foundingYear) {
      return NextResponse.json(
        { error: 'Nombre, descripción, misión, visión y año de fundación son requeridos' },
        { status: 400 }
      )
    }

    // Buscar información institucional existente
    const existingInfo = await prisma.institutionalInfo.findFirst()
    if (!existingInfo) {
      return NextResponse.json(
        { error: 'No existe información institucional para actualizar' },
        { status: 404 }
      )
    }

    const institutionalInfo = await prisma.institutionalInfo.update({
      where: { id: existingInfo.id },
      data: {
        name,
        description,
        subtitle: subtitle || '',
        mission,
        vision,
        values: values || [],
        history: history || '',
        address: address || '',
        phone: phone || '',
        email: email || '',
        website: website || '',
        foundingYear: parseInt(foundingYear),
        logo: logo || '',
        image: image || '',
        heroImage: heroImage || '',
        historyImage: historyImage || '',
        instagramUrl: instagramUrl || '',
        linkedinUrl: linkedinUrl || '',
        youtubeUrl: youtubeUrl || '',
        spotifyUrl: spotifyUrl || '',
        feature1Title: feature1Title || '',
        feature1Text: feature1Text || '',
        feature2Title: feature2Title || '',
        feature2Text: feature2Text || '',
        overlayColor: overlayColor || '#ffffff',
        footerBrand: footerBrand || '',
        footerEmail: footerEmail || '',
        footerPhone: footerPhone || '',
        footerAddress: footerAddress || '',
        footerCopyright: footerCopyright || '',
        footerBackgroundColor: footerBackgroundColor || '#285C4D',
        footerTextColor: footerTextColor || '#ffffff',
        footerAccentColor: footerAccentColor || '#F4633A'
      }
    })

    return NextResponse.json({
      success: true,
      institutionalInfo
    })

  } catch (error) {
    console.error('Update institutional info error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}