'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { ImportModalProps } from './types'

export default function ImportModal({ 
  onClose, 
  onSuccess 
}: ImportModalProps) {
  const [importType, setImportType] = useState<'json' | 'csv'>('json')
  const [file, setFile] = useState<File | null>(null)
  const [jsonText, setJsonText] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importResults, setImportResults] = useState<any>(null)

  const downloadTemplate = (type: 'json' | 'csv') => {
    if (type === 'json') {
      const template = [
        {
          name: "Dr. Juan Pérez",
          position: "Investigador Senior",
          department: "Investigación",
          email: "juan.perez@ciimed.pa",
          phone: "+507 123-4567",
          bio: "Especialista en medicina tropical con 15 años de experiencia.",
          linkedIn: "https://linkedin.com/in/juanperez",
          website: "https://ciimed.pa/team/juan-perez",
          specialties: ["Medicina Tropical", "Investigación Clínica"],
          type: "RESEARCHER",
          status: "ACTIVE",
          order: 1
        }
      ]
      
      const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'plantilla-equipo.json'
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const csvTemplate = `name,position,department,email,phone,bio,linkedin,website,specialties,type,status,order
Dr. Juan Pérez,Investigador Senior,Investigación,juan.perez@ciimed.pa,+507 123-4567,Especialista en medicina tropical,https://linkedin.com/in/juanperez,https://ciimed.pa/team/juan-perez,Medicina Tropical;Investigación Clínica,RESEARCHER,ACTIVE,1
Dra. María González,Directora de Investigación,Dirección,maria.gonzalez@ciimed.pa,+507 234-5678,Líder en investigación médica,https://linkedin.com/in/mariagonzalez,,Oncología;Bioestadística,DIRECTOR,ACTIVE,2`
      
      const blob = new Blob([csvTemplate], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'plantilla-equipo.csv'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setImportResults(null)
      
      if (importType === 'json' && selectedFile.type === 'application/json') {
        try {
          const text = await selectedFile.text()
          setJsonText(text)
        } catch (error) {
          console.error('Error reading JSON file:', error)
        }
      }
    }
  }

  const handleImport = async () => {
    setIsImporting(true)
    setImportResults(null)
    
    try {
      let response: Response
      
      if (importType === 'json') {
        let jsonData = jsonText.trim()
        
        if (file && file.type === 'application/json') {
          jsonData = await file.text()
        }
        
        if (!jsonData) {
          return
        }
        
        try {
          JSON.parse(jsonData)
        } catch (error) {
          console.error('Invalid JSON:', error)
          return
        }
        
        response = await fetch('/api/team/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonData
        })
      } else {
        if (!file) {
          return
        }
        
        const csvText = await file.text()
        response = await fetch('/api/team/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/csv'
          },
          body: csvText
        })
      }
      
      const result = await response.json()
      setImportResults(result)
      
      if (response.ok) {
        if (result.imported > 0) {
          setTimeout(() => {
            onSuccess()
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Import error:', error)
      setImportResults({
        error: 'Error al procesar la importación',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Importación Masiva de Equipo</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de importación
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="json"
                checked={importType === 'json'}
                onChange={(e) => setImportType(e.target.value as 'json')}
                className="mr-2"
              />
              JSON
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="csv"
                checked={importType === 'csv'}
                onChange={(e) => setImportType(e.target.value as 'csv')}
                className="mr-2"
              />
              CSV
            </label>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => downloadTemplate('json')}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              <Download className="h-4 w-4 mr-1" />
              Descargar Plantilla JSON
            </button>
            <button
              onClick={() => downloadTemplate('csv')}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              <Download className="h-4 w-4 mr-1" />
              Descargar Plantilla CSV
            </button>
          </div>
        </div>

        {importType === 'json' ? (
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subir archivo JSON
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Sube un archivo .json con los datos del equipo
              </p>
            </div>
            
            <div className="text-center text-gray-500 mb-4">
              <span>O</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pegar JSON directamente
              </label>
              <textarea
                rows={8}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
                placeholder="Pega aquí el JSON con los datos del equipo..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: Array de objetos o objeto con propiedad "members"
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              El archivo debe tener encabezados en la primera fila
            </p>
          </div>
        )}

        {importResults && (
          <div className={`mb-6 p-4 rounded-md ${
            importResults.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          } border`}>
            {importResults.error ? (
              <div>
                <h4 className="font-medium text-red-800 mb-2">Error de importación</h4>
                <p className="text-red-700">{importResults.error}</p>
                {importResults.details && (
                  <>
                    <p className="text-red-600 text-sm mt-2">Detalles:</p>
                    {Array.isArray(importResults.details) ? (
                      <ul className="text-red-600 text-sm list-disc list-inside">
                        {importResults.details.map((detail: any, index: number) => (
                          <li key={index}>
                            {detail.name || `Fila ${detail.index + 1}`}: {
                              Array.isArray(detail.errors) ? detail.errors.join(', ') : detail.error
                            }
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-600 text-sm">{importResults.details}</p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div>
                <h4 className="font-medium text-green-800 mb-2">Importación exitosa</h4>
                <p className="text-green-700">{importResults.message}</p>
                <p className="text-green-600 text-sm">
                  {importResults.imported} de {importResults.total} miembros importados
                </p>
                {importResults.errors && importResults.errors.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-orange-700 cursor-pointer">
                      Errores parciales ({importResults.errors.length})
                    </summary>
                    <ul className="text-orange-600 text-sm list-disc list-inside mt-1">
                      {importResults.errors.map((error: any, index: number) => (
                        <li key={index}>
                          {error.member}: {error.error}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="font-medium text-blue-800 mb-2">Campos soportados:</h4>
          <div className="text-blue-700 text-sm grid grid-cols-2 gap-2">
            <div>
              <strong>Requeridos:</strong>
              <ul className="list-disc list-inside">
                <li>name (nombre)</li>
                <li>position (cargo)</li>
                <li>department (departamento)</li>
                <li>type: DIRECTOR, RESEARCHER, COLLABORATOR, STAFF</li>
              </ul>
            </div>
            <div>
              <strong>Opcionales:</strong>
              <ul className="list-disc list-inside">
                <li>email, phone, bio</li>
                <li>linkedIn, website, avatar</li>
                <li>specialties (separadas por ; en CSV)</li>
                <li>status: ACTIVE, INACTIVE</li>
                <li>order (número)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isImporting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cerrar
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isImporting ? 'Importando...' : 'Importar'}
          </button>
        </div>
      </div>
    </div>
  )
}