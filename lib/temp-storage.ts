import fs from 'fs'
import path from 'path'

const TEMP_DATA_FILE = path.join(process.cwd(), 'temp-institutional-data.json')

interface TempInstitutionalData {
  heroImage?: string
  image?: string
  historyImage?: string
  logo?: string
  [key: string]: any
}

export function getTempInstitutionalData(): TempInstitutionalData | null {
  try {
    if (fs.existsSync(TEMP_DATA_FILE)) {
      const data = fs.readFileSync(TEMP_DATA_FILE, 'utf8')
      return JSON.parse(data)
    }
    return null
  } catch (error) {
    console.warn('Error reading temp institutional data:', error)
    return null
  }
}

export function saveTempInstitutionalData(data: TempInstitutionalData): void {
  try {
    // Leer datos existentes
    const existing = getTempInstitutionalData() || {}
    
    // Merge con nuevos datos
    const updated = { ...existing, ...data, lastUpdated: new Date().toISOString() }
    
    // Guardar
    fs.writeFileSync(TEMP_DATA_FILE, JSON.stringify(updated, null, 2))
    console.log('Temporary institutional data saved')
  } catch (error) {
    console.error('Error saving temp institutional data:', error)
  }
}

export function clearTempInstitutionalData(): void {
  try {
    if (fs.existsSync(TEMP_DATA_FILE)) {
      fs.unlinkSync(TEMP_DATA_FILE)
      console.log('Temporary institutional data cleared')
    }
  } catch (error) {
    console.error('Error clearing temp institutional data:', error)
  }
}