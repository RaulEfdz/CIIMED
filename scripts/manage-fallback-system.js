#!/usr/bin/env node

/**
 * Script de gestión del sistema de fallback
 * Uso: node scripts/manage-fallback-system.js [comando]
 */

const fs = require('fs')
const path = require('path')

const TEMP_DATA_FILE = path.join(process.cwd(), 'temp-institutional-data.json')

function showHelp() {
  console.log(`
🛠️  Gestor del Sistema de Fallback - CIIMED

Comandos disponibles:
  check          - Verificar estado del sistema
  show-temp      - Mostrar datos temporales guardados
  clear-temp     - Limpiar datos temporales
  backup-temp    - Hacer backup de datos temporales
  restore-temp   - Restaurar backup de datos temporales
  test-db        - Probar conexión a base de datos

Ejemplos:
  node scripts/manage-fallback-system.js check
  node scripts/manage-fallback-system.js show-temp
  node scripts/manage-fallback-system.js clear-temp
`)
}

function checkSystem() {
  console.log('🔍 Verificando estado del sistema de fallback...\n')
  
  // Verificar archivos clave
  const files = [
    'lib/fallback-data.ts',
    'lib/temp-storage.ts', 
    'lib/prisma-wrapper.ts',
    'components/admin/SafeImage.tsx'
  ]
  
  console.log('📁 Archivos del sistema:')
  files.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file))
    console.log(`  ${exists ? '✅' : '❌'} ${file}`)
  })
  
  // Verificar datos temporales
  console.log('\n💾 Almacenamiento temporal:')
  if (fs.existsSync(TEMP_DATA_FILE)) {
    const stats = fs.statSync(TEMP_DATA_FILE)
    console.log(`  ✅ ${TEMP_DATA_FILE}`)
    console.log(`     Tamaño: ${stats.size} bytes`)
    console.log(`     Modificado: ${stats.mtime.toLocaleString()}`)
  } else {
    console.log(`  ⚪ No hay datos temporales guardados`)
  }
  
  // Verificar uploads
  const uploadsDir = path.join(process.cwd(), 'public/uploads')
  console.log('\n🖼️  Directorio de uploads:')
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir)
    console.log(`  ✅ ${uploadsDir}`)
    console.log(`     Archivos: ${files.length}`)
    if (files.length > 0) {
      console.log(`     Últimos: ${files.slice(-3).join(', ')}`)
    }
  } else {
    console.log(`  ❌ Directorio uploads no existe`)
  }
  
  console.log('\n✨ Verificación completada')
}

function showTempData() {
  console.log('📋 Datos temporales guardados:\n')
  
  if (!fs.existsSync(TEMP_DATA_FILE)) {
    console.log('⚪ No hay datos temporales guardados')
    return
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(TEMP_DATA_FILE, 'utf8'))
    console.log(JSON.stringify(data, null, 2))
    
    console.log(`\n📊 Resumen:`)
    console.log(`   Campos modificados: ${Object.keys(data).length - 1}`) // -1 para excluir lastUpdated
    if (data.lastUpdated) {
      console.log(`   Última actualización: ${new Date(data.lastUpdated).toLocaleString()}`)
    }
    
    // Verificar imágenes
    const imageFields = ['heroImage', 'image', 'historyImage', 'logo']
    const images = imageFields.filter(field => data[field]).map(field => ({
      field,
      url: data[field]
    }))
    
    if (images.length > 0) {
      console.log(`\n🖼️  Imágenes modificadas:`)
      images.forEach(img => {
        const isLocal = img.url.startsWith('/uploads/')
        console.log(`   ${img.field}: ${img.url} ${isLocal ? '(local)' : '(externa)'}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error leyendo datos temporales:', error.message)
  }
}

function clearTempData() {
  console.log('🗑️  Limpiando datos temporales...\n')
  
  if (!fs.existsSync(TEMP_DATA_FILE)) {
    console.log('⚪ No hay datos temporales para limpiar')
    return
  }
  
  try {
    // Hacer backup antes de limpiar
    const backupFile = `${TEMP_DATA_FILE}.backup.${Date.now()}`
    fs.copyFileSync(TEMP_DATA_FILE, backupFile)
    console.log(`📦 Backup creado: ${path.basename(backupFile)}`)
    
    // Limpiar archivo
    fs.unlinkSync(TEMP_DATA_FILE)
    console.log('✅ Datos temporales eliminados')
    console.log('\n⚠️  Nota: Los cambios temporales se han perdido.')
    console.log('   Asegúrate de haber migrado los datos importantes a la DB.')
    
  } catch (error) {
    console.error('❌ Error limpiando datos temporales:', error.message)
  }
}

function backupTempData() {
  console.log('📦 Creando backup de datos temporales...\n')
  
  if (!fs.existsSync(TEMP_DATA_FILE)) {
    console.log('⚪ No hay datos temporales para respaldar')
    return
  }
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = `temp-institutional-data.backup.${timestamp}.json`
    
    fs.copyFileSync(TEMP_DATA_FILE, backupFile)
    console.log(`✅ Backup creado: ${backupFile}`)
    
    const stats = fs.statSync(backupFile)
    console.log(`   Tamaño: ${stats.size} bytes`)
    
  } catch (error) {
    console.error('❌ Error creando backup:', error.message)
  }
}

async function testDatabase() {
  console.log('🔍 Probando conexión a la base de datos...\n')
  
  try {
    // Importar dinámicamente el módulo de testing
    const { spawn } = require('child_process')
    
    const child = spawn('node', ['scripts/test-db-connection.js'], {
      stdio: 'inherit'
    })
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Test de conexión completado')
      } else {
        console.log('\n❌ Test de conexión falló')
      }
    })
    
  } catch (error) {
    console.error('❌ Error ejecutando test de DB:', error.message)
  }
}

// Procesamiento de comandos
const command = process.argv[2]

switch (command) {
  case 'check':
    checkSystem()
    break
  case 'show-temp':
    showTempData()
    break
  case 'clear-temp':
    clearTempData()
    break
  case 'backup-temp':
    backupTempData()
    break
  case 'test-db':
    testDatabase()
    break
  case 'help':
  case '--help':
  case '-h':
  default:
    showHelp()
    break
}