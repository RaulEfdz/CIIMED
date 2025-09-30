'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import { FileText, Plus, Search, Trash2, Eye, ArrowLeft } from 'lucide-react'
import ChatWidget from '@/components/ChatWidget'

interface Document {
  id: string
  title: string
  url?: string
  metadata?: any
  createdAt: string
  _count: {
    chunks: number
  }
}

interface OpenAIUsage {
  usage?: any
  models?: number
  test?: any
  keyStatus: 'active' | 'error'
}

export default function ChatbotAdmin() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [showRegenerateModal, setShowRegenerateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showClearRAGModal, setShowClearRAGModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [openaiUsage, setOpenaiUsage] = useState<OpenAIUsage | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchDocuments()
    fetchOpenAIUsage()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/ingest')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOpenAIUsage = async () => {
    try {
      const response = await fetch('/api/admin/openai-usage')
      if (response.ok) {
        const data = await response.json()
        setOpenaiUsage(data)
      }
    } catch (error) {
      console.error('Error fetching OpenAI usage:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleDeleteDocument = async (documentId: string, title: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${title}"?\n\nEsta acción no se puede deshacer.`)) {
      return
    }

    try {
      const response = await fetch(`/api/ingest/${documentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        fetchDocuments() // Recargar la lista
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      alert('Error al eliminar documento')
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar TODOS los documentos (${documents.length})?\n\nEsta acción no se puede deshacer.`)) {
      return
    }

    try {
      for (const doc of documents) {
        await fetch(`/api/ingest/${doc.id}`, { method: 'DELETE' })
      }
      alert(`${documents.length} documentos eliminados exitosamente`)
      fetchDocuments()
    } catch (error) {
      alert('Error al eliminar documentos')
    }
  }

  const handleRegenerateRAG = () => {
    setShowRegenerateModal(true)
  }

  const handleClearRAG = () => {
    setShowClearRAGModal(true)
  }

  const handleViewDetails = (document: Document) => {
    setSelectedDocument(document)
    setShowDetailsModal(true)
  }

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/admin')}
                  className="mr-4 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestión del Chatbot CIIMED
                  </h1>
                  <p className="text-gray-600">Administrar documentos y conocimiento del RAG</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Documentos</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Chunks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.reduce((sum, doc) => sum + doc._count.chunks, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Plus className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Último Actualizado</p>
                  <p className="text-sm font-bold text-gray-900">
                    {documents.length > 0 
                      ? new Date(documents[0].createdAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* OpenAI Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  openaiUsage?.keyStatus === 'active' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <div className={`h-4 w-4 rounded-full ${
                    openaiUsage?.keyStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">OpenAI API</p>
                  <p className="text-sm font-bold text-gray-900">
                    {openaiUsage?.keyStatus === 'active' ? 'Activa' : 'Error'}
                  </p>
                  {openaiUsage?.test?.code === 'insufficient_quota' && (
                    <p className="text-xs text-red-600">Sin créditos</p>
                  )}
                  {openaiUsage?.models && (
                    <p className="text-xs text-gray-500">{openaiUsage.models} modelos</p>
                  )}
                </div>
              </div>
              <button 
                onClick={fetchOpenAIUsage}
                className="mt-2 text-xs text-emerald-600 hover:text-emerald-700"
              >
                Actualizar estado
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Documento
              </button>
              
              {documents.length > 0 && (
                <>
                  <button
                    onClick={handleRegenerateRAG}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Regenerar RAG ({documents.length})
                  </button>
                  
                  <button
                    onClick={handleClearRAG}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpiar RAG
                  </button>
                  
                  <button
                    onClick={handleDeleteAll}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Todos ({documents.length})
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
              />
            </div>
          </div>

          {/* Documents List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Documentos del RAG</h3>
            </div>
            
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm ? 'No se encontraron documentos' : 'No hay documentos aún'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{doc.title}</h4>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{doc._count.chunks} chunks</span>
                          <span>•</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                          {doc.url && (
                            <>
                              <span>•</span>
                              <a 
                                href={doc.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                Ver original
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(doc)}
                          className="text-gray-400 hover:text-blue-600"
                          title="Ver detalles del RAG"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDocument(doc.id, doc.title)}
                          className="text-gray-400 hover:text-red-600"
                          title="Eliminar documento"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadForm && (
          <UploadModal 
            onClose={() => setShowUploadForm(false)}
            onSuccess={() => {
              setShowUploadForm(false)
              fetchDocuments()
            }}
          />
        )}

        {/* Regenerate RAG Modal */}
        {showRegenerateModal && (
          <RegenerateRAGModal 
            documents={documents}
            onClose={() => setShowRegenerateModal(false)}
            onSuccess={() => {
              setShowRegenerateModal(false)
              fetchDocuments()
              fetchOpenAIUsage()
            }}
          />
        )}

        {/* Clear RAG Modal */}
        {showClearRAGModal && (
          <ClearRAGModal 
            documents={documents}
            onClose={() => setShowClearRAGModal(false)}
            onSuccess={() => {
              setShowClearRAGModal(false)
              fetchDocuments()
            }}
          />
        )}

        {/* Document Details Modal */}
        {showDetailsModal && selectedDocument && (
          <DocumentDetailsModal 
            document={selectedDocument}
            onClose={() => {
              setShowDetailsModal(false)
              setSelectedDocument(null)
            }}
          />
        )}

        {/* Chat Widget Flotante */}
        <ChatWidget />
      </div>
    </ProtectedRoute>
  )
}

interface ProcessingStep {
  id: string
  label: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  details?: string
}

function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    url: '',
    version: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isProcessingFiles, setIsProcessingFiles] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [immediateProcessing, setImmediateProcessing] = useState(true)

  const updateStep = (stepId: string, updates: Partial<ProcessingStep>) => {
    setProcessingSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    if (immediateProcessing) {
      await processFilesImmediately(files)
    } else {
      await processFilesForPreview(files)
    }
  }

  const processFilesForPreview = async (files: FileList) => {
    setIsProcessingFiles(true)
    let combinedContent = formData.content

    try {
      for (const file of files) {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          const text = await file.text()
          
          if (combinedContent.trim()) {
            combinedContent += '\n\n---\n\n'
          }
          
          combinedContent += `ARCHIVO: ${file.name}\n\n${text}`
          setUploadedFiles(prev => [...prev, file.name])
        }
      }

      setFormData(prev => ({ 
        ...prev, 
        content: combinedContent,
        title: prev.title || files[0].name.replace('.txt', '')
      }))

    } catch (error) {
      alert('Error procesando archivos: ' + error)
    } finally {
      setIsProcessingFiles(false)
    }
  }

  const processFilesImmediately = async (files: FileList) => {
    setShowProgress(true)
    setIsProcessingFiles(true)
    
    // Inicializar pasos del proceso
    const steps: ProcessingStep[] = [
      { id: 'extract', label: 'Extrayendo texto de archivos', status: 'pending' },
      { id: 'document', label: 'Creando documento en la base de datos', status: 'pending' },
      { id: 'chunks', label: 'Generando chunks de texto', status: 'pending' },
      { id: 'embeddings', label: 'Creando embeddings con OpenAI', status: 'pending' },
      { id: 'complete', label: 'Proceso completado', status: 'pending' }
    ]
    setProcessingSteps(steps)

    try {
      // Paso 1: Extraer texto
      updateStep('extract', { status: 'processing' })
      let combinedContent = ''
      let fileNames: string[] = []

      for (const file of files) {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          const text = await file.text()
          
          if (combinedContent.trim()) {
            combinedContent += '\n\n---\n\n'
          }
          
          combinedContent += `ARCHIVO: ${file.name}\n\n${text}`
          fileNames.push(file.name)
        }
      }

      if (!combinedContent.trim()) {
        updateStep('extract', { status: 'error', details: 'No se encontró contenido válido en los archivos' })
        return
      }

      updateStep('extract', { status: 'completed', details: `${fileNames.length} archivos procesados` })

      // Determinar título automáticamente
      const autoTitle = files[0].name.replace('.txt', '') + (files.length > 1 ? ` y ${files.length - 1} más` : '')

      // Paso 2-4: Procesar con la API
      updateStep('document', { status: 'processing' })
      
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title || autoTitle,
          content: combinedContent,
          url: formData.url,
          version: formData.version
        })
      })

      if (!response.ok) {
        const error = await response.json()
        updateStep('document', { status: 'error', details: error.error })
        return
      }

      const result = await response.json()
      updateStep('document', { status: 'completed', details: `Documento "${result.document.title}" creado` })
      updateStep('chunks', { status: 'completed', details: `${result.stats.chunks} chunks generados` })
      updateStep('embeddings', { 
        status: result.stats.embeddings > 0 ? 'completed' : 'error', 
        details: result.stats.embeddings > 0 
          ? `${result.stats.embeddings} embeddings creados`
          : 'Sin créditos OpenAI - funcionará con búsqueda de texto'
      })
      updateStep('complete', { status: 'completed' })

      // Actualizar archivos procesados para mostrar
      setUploadedFiles(fileNames)
      
      // Auto-cerrar después de éxito
      setTimeout(() => {
        onSuccess()
      }, 2000)

    } catch (error) {
      console.error('Error en procesamiento inmediato:', error)
      updateStep('document', { status: 'error', details: 'Error de conexión' })
    } finally {
      setIsProcessingFiles(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) return

    // Si ya se procesó con archivos inmediatamente, no hacer nada
    if (immediateProcessing && showProgress) {
      return
    }

    setIsUploading(true)
    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      alert('Error al subir documento')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nuevo Documento</h2>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Procesamiento inmediato:</label>
            <button
              type="button"
              onClick={() => setImmediateProcessing(!immediateProcessing)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                immediateProcessing ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  immediateProcessing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        {showProgress && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Progreso del Procesamiento</h3>
            <div className="space-y-3">
              {processingSteps.map((step) => (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'processing' ? 'bg-blue-500' :
                    step.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                  }`}>
                    {step.status === 'completed' && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {step.status === 'processing' && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                    {step.status === 'error' && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      step.status === 'error' ? 'text-red-700' : 'text-gray-900'
                    }`}>
                      {step.label}
                    </p>
                    {step.details && (
                      <p className={`text-xs ${
                        step.status === 'error' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {step.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Upload de archivos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subir Archivos {immediateProcessing ? '(procesamiento inmediato)' : '(opcional)'}
            </label>
            <input
              type="file"
              multiple
              accept=".txt,text/plain"
              onChange={handleFileUpload}
              disabled={isProcessingFiles || showProgress}
              className="w-full border border-gray-300 rounded-md px-3 py-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              {immediateProcessing 
                ? "Al seleccionar archivos .txt se procesarán inmediatamente al RAG con progreso visual."
                : "Selecciona archivos .txt. El contenido se extraerá para previsualizar antes de crear el documento."
              }
            </p>
            
            {isProcessingFiles && !showProgress && (
              <div className="mt-2 flex items-center text-emerald-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 mr-2"></div>
                {immediateProcessing ? 'Iniciando procesamiento...' : 'Extrayendo contenido...'}
              </div>
            )}

            {uploadedFiles.length > 0 && !showProgress && (
              <div className="mt-2">
                <p className="text-sm text-green-600 font-medium">Archivos procesados:</p>
                <ul className="text-xs text-gray-600">
                  {uploadedFiles.map((file, index) => (
                    <li key={index}>✓ {file}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {!immediateProcessing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido *
              </label>
              <textarea
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Contenido del documento... (se llenará automáticamente al subir archivos)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes escribir aquí directamente o subir archivos arriba para extraer el contenido automáticamente.
              </p>
            </div>
          )}

          {immediateProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium">Modo de Procesamiento Inmediato Activado</p>
              <p className="text-xs text-blue-600 mt-1">
                Los archivos se procesarán directamente al RAG al seleccionarlos. No es necesario llenar el formulario manualmente.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL (opcional)
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Versión (opcional)
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="v1.0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessingFiles}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              {showProgress ? 'Cerrar' : 'Cancelar'}
            </button>
            {!immediateProcessing && (
              <button
                type="submit"
                disabled={isUploading || isProcessingFiles}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {isUploading ? 'Procesando...' : 'Crear Documento'}
              </button>
            )}
            {immediateProcessing && !showProgress && (
              <div className="text-sm text-gray-500 py-2">
                Selecciona archivos para procesar automáticamente
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

function RegenerateRAGModal({ 
  documents, 
  onClose, 
  onSuccess 
}: { 
  documents: Document[]
  onClose: () => void
  onSuccess: () => void 
}) {
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [currentDocument, setCurrentDocument] = useState('')

  const updateStep = (stepId: string, updates: Partial<ProcessingStep>) => {
    setProcessingSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ))
  }

  const handleRegenerate = async () => {
    if (!confirm(`¿Estás seguro de que quieres regenerar el RAG para ${documents.length} documentos?\n\nEsto recreará todos los chunks y embeddings.`)) {
      return
    }

    setIsRegenerating(true)
    setShowProgress(true)

    // Inicializar pasos del proceso
    const steps: ProcessingStep[] = [
      { id: 'preparing', label: 'Preparando regeneración', status: 'pending' },
      { id: 'processing', label: `Procesando ${documents.length} documentos`, status: 'pending' },
      { id: 'embeddings', label: 'Generando embeddings', status: 'pending' },
      { id: 'complete', label: 'Regeneración completada', status: 'pending' }
    ]
    setProcessingSteps(steps)

    try {
      updateStep('preparing', { status: 'processing' })

      let totalEmbeddings = 0
      let processedDocs = 0

      updateStep('preparing', { status: 'completed' })
      updateStep('processing', { status: 'processing' })

      for (const doc of documents) {
        setCurrentDocument(doc.title)
        
        // Regenerar cada documento usando la API específica de regeneración
        const response = await fetch('/api/ingest/regenerate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            documentId: doc.id
          })
        })

        if (response.ok) {
          const result = await response.json()
          totalEmbeddings += result.stats?.embeddings || 0
          processedDocs++
          
          updateStep('processing', { 
            status: 'processing', 
            details: `${processedDocs}/${documents.length} documentos procesados` 
          })
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error(`Error procesando documento ${doc.title}:`, errorData)
          updateStep('processing', { 
            status: 'error', 
            details: `Error en ${doc.title}: ${errorData.error}` 
          })
          break
        }
      }

      updateStep('processing', { status: 'completed', details: `${processedDocs} documentos procesados` })
      updateStep('embeddings', { 
        status: totalEmbeddings > 0 ? 'completed' : 'error',
        details: totalEmbeddings > 0 
          ? `${totalEmbeddings} embeddings generados`
          : 'Sin créditos OpenAI - funcionará con búsqueda de texto'
      })
      updateStep('complete', { status: 'completed' })

      // Auto-cerrar después de éxito
      setTimeout(() => {
        onSuccess()
      }, 2000)

    } catch (error) {
      console.error('Error en regeneración:', error)
      updateStep('processing', { status: 'error', details: 'Error de conexión' })
    } finally {
      setIsRegenerating(false)
      setCurrentDocument('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Regenerar RAG</h2>
        
        {!showProgress ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">¿Qué hace la regeneración del RAG?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Reprocesa todos los documentos existentes</li>
                <li>• Regenera chunks de texto optimizados</li>
                <li>• Crea nuevos embeddings con OpenAI</li>
                <li>• Mejora la precisión de búsqueda del chatbot</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Documentos a procesar:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {documents.map((doc) => (
                  <div key={doc.id} className="text-sm text-gray-700 flex justify-between">
                    <span>{doc.title}</span>
                    <span className="text-gray-500">{doc._count.chunks} chunks</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Este proceso puede tomar varios minutos dependiendo del número de documentos y la disponibilidad de créditos OpenAI.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Progreso de Regeneración</h3>
              
              {currentDocument && (
                <div className="mb-3 p-2 bg-blue-100 rounded text-sm">
                  <span className="font-medium">Procesando:</span> {currentDocument}
                </div>
              )}

              <div className="space-y-3">
                {processingSteps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-500' :
                      step.status === 'processing' ? 'bg-blue-500' :
                      step.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                    }`}>
                      {step.status === 'completed' && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {step.status === 'processing' && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                      {step.status === 'error' && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        step.status === 'error' ? 'text-red-700' : 'text-gray-900'
                      }`}>
                        {step.label}
                      </p>
                      {step.details && (
                        <p className={`text-xs ${
                          step.status === 'error' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {step.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isRegenerating}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            {showProgress ? 'Cerrar' : 'Cancelar'}
          </button>
          {!showProgress && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isRegenerating ? 'Regenerando...' : `Regenerar RAG (${documents.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ClearRAGModal({ 
  documents, 
  onClose, 
  onSuccess 
}: { 
  documents: Document[]
  onClose: () => void
  onSuccess: () => void 
}) {
  const [isClearing, setIsClearing] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])

  const updateStep = (stepId: string, updates: Partial<ProcessingStep>) => {
    setProcessingSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ))
  }

  const handleClearRAG = async () => {
    if (!confirm(`¿Estás seguro de que quieres LIMPIAR TODO EL RAG?\n\n• Se eliminarán TODOS los chunks de texto\n• Se eliminarán TODOS los embeddings\n• Los documentos originales se mantendrán\n• Tendrás que regenerar el RAG después\n\nEsta acción no se puede deshacer.`)) {
      return
    }

    setIsClearing(true)
    setShowProgress(true)

    // Inicializar pasos del proceso
    const steps: ProcessingStep[] = [
      { id: 'preparing', label: 'Preparando limpieza del RAG', status: 'pending' },
      { id: 'deleting', label: 'Eliminando chunks y embeddings', status: 'pending' },
      { id: 'updating', label: 'Actualizando documentos', status: 'pending' },
      { id: 'complete', label: 'Limpieza completada', status: 'pending' }
    ]
    setProcessingSteps(steps)

    try {
      updateStep('preparing', { status: 'processing' })

      const totalChunks = documents.reduce((sum, doc) => sum + doc._count.chunks, 0)
      updateStep('preparing', { status: 'completed', details: `${totalChunks} chunks encontrados` })

      updateStep('deleting', { status: 'processing' })
      
      const response = await fetch('/api/ingest/clear-rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        updateStep('deleting', { status: 'error', details: errorData.error })
        return
      }

      const result = await response.json()
      updateStep('deleting', { status: 'completed', details: `${result.stats.chunksDeleted} chunks eliminados` })
      updateStep('updating', { status: 'completed', details: `${result.stats.documentsAffected} documentos actualizados` })
      updateStep('complete', { status: 'completed' })

      // Auto-cerrar después de éxito
      setTimeout(() => {
        onSuccess()
      }, 2000)

    } catch (error) {
      console.error('Error en limpieza del RAG:', error)
      updateStep('deleting', { status: 'error', details: 'Error de conexión' })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-orange-900">🧹 Limpiar RAG</h2>
        
        {!showProgress ? (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-medium text-orange-900 mb-2">⚠️ ¿Qué hace la limpieza del RAG?</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• <strong>Elimina TODOS los chunks de texto</strong></li>
                <li>• <strong>Elimina TODOS los embeddings de OpenAI</strong></li>
                <li>• <strong>Mantiene los documentos originales</strong></li>
                <li>• Resetea completamente el sistema RAG</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Estado actual:</h4>
              <div className="space-y-1">
                {documents.map((doc) => (
                  <div key={doc.id} className="text-sm text-gray-700 flex justify-between">
                    <span>{doc.title}</span>
                    <span className="text-orange-600">{doc._count.chunks} chunks → 0</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  Total: {documents.reduce((sum, doc) => sum + doc._count.chunks, 0)} chunks serán eliminados
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-1">💡 Después de limpiar:</h4>
              <p className="text-sm text-blue-800">
                Necesitarás usar <strong>"Regenerar RAG"</strong> para volver a crear los chunks y embeddings.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>⚠️ ADVERTENCIA:</strong> Esta acción no se puede deshacer. El chatbot dejará de funcionar hasta que regeneres el RAG.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Progreso de Limpieza</h3>

              <div className="space-y-3">
                {processingSteps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-500' :
                      step.status === 'processing' ? 'bg-orange-500' :
                      step.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                    }`}>
                      {step.status === 'completed' && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {step.status === 'processing' && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                      {step.status === 'error' && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        step.status === 'error' ? 'text-red-700' : 'text-gray-900'
                      }`}>
                        {step.label}
                      </p>
                      {step.details && (
                        <p className={`text-xs ${
                          step.status === 'error' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {step.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isClearing}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            {showProgress ? 'Cerrar' : 'Cancelar'}
          </button>
          {!showProgress && (
            <button
              onClick={handleClearRAG}
              disabled={isClearing}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              {isClearing ? 'Limpiando...' : '🧹 Limpiar RAG'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface DocumentChunk {
  id: string
  index: number
  content: string
  contentPreview: string
  hasEmbedding: boolean
  embeddingDimensions: number
  createdAt: string
  wordCount: number
  charCount: number
}

interface DocumentDetails {
  document: {
    id: string
    title: string
    content: string
    url?: string
    metadata?: any
    createdAt: string
    updatedAt: string
  }
  chunks: DocumentChunk[]
  stats: {
    totalChunks: number
    chunksWithEmbeddings: number
    totalWords: number
    totalCharacters: number
    avgWordsPerChunk: number
  }
}

function DocumentDetailsModal({ 
  document, 
  onClose 
}: { 
  document: Document
  onClose: () => void 
}) {
  const [details, setDetails] = useState<DocumentDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChunk, setSelectedChunk] = useState<DocumentChunk | null>(null)
  const [showChunkModal, setShowChunkModal] = useState(false)

  useEffect(() => {
    fetchDocumentDetails()
  }, [document.id])

  const fetchDocumentDetails = async () => {
    try {
      const response = await fetch(`/api/ingest/${document.id}/details`)
      if (response.ok) {
        const data = await response.json()
        setDetails(data)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Error fetching document details:', response.status, errorData)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewChunk = (chunk: DocumentChunk) => {
    setSelectedChunk(chunk)
    setShowChunkModal(true)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-2">Cargando detalles...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center py-8 text-red-600">
            Error cargando detalles del documento
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{details.document.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>ID: {details.document.id}</span>
              <span>•</span>
              <span>Creado: {new Date(details.document.createdAt).toLocaleDateString()}</span>
              {details.document.updatedAt !== details.document.createdAt && (
                <>
                  <span>•</span>
                  <span>Actualizado: {new Date(details.document.updatedAt).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-emerald-800">Total Chunks</p>
            <p className="text-2xl font-bold text-emerald-900">{details.stats.totalChunks}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Con Embeddings</p>
            <p className="text-2xl font-bold text-blue-900">{details.stats.chunksWithEmbeddings}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-800">Total Palabras</p>
            <p className="text-2xl font-bold text-purple-900">{details.stats.totalWords.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">Caracteres</p>
            <p className="text-2xl font-bold text-yellow-900">{details.stats.totalCharacters.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-800">Promedio/Chunk</p>
            <p className="text-2xl font-bold text-gray-900">{details.stats.avgWordsPerChunk}</p>
          </div>
        </div>

        {/* RAG Status */}
        <div className="mb-6">
          <div className={`p-4 rounded-lg border-2 ${
            details.stats.chunksWithEmbeddings === details.stats.totalChunks
              ? 'bg-green-50 border-green-200'
              : details.stats.chunksWithEmbeddings > 0
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${
                  details.stats.chunksWithEmbeddings === details.stats.totalChunks
                    ? 'text-green-900'
                    : details.stats.chunksWithEmbeddings > 0
                    ? 'text-yellow-900'
                    : 'text-red-900'
                }`}>
                  Estado del RAG
                </h3>
                <p className={`text-sm ${
                  details.stats.chunksWithEmbeddings === details.stats.totalChunks
                    ? 'text-green-700'
                    : details.stats.chunksWithEmbeddings > 0
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}>
                  {details.stats.chunksWithEmbeddings === details.stats.totalChunks
                    ? '✅ RAG completo - Todos los chunks tienen embeddings'
                    : details.stats.chunksWithEmbeddings > 0
                    ? `⚠️ RAG parcial - ${details.stats.chunksWithEmbeddings}/${details.stats.totalChunks} chunks con embeddings`
                    : '❌ RAG incompleto - Sin embeddings (solo búsqueda de texto)'
                  }
                </p>
              </div>
              <div className={`text-2xl font-bold ${
                details.stats.chunksWithEmbeddings === details.stats.totalChunks
                  ? 'text-green-600'
                  : details.stats.chunksWithEmbeddings > 0
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {Math.round((details.stats.chunksWithEmbeddings / details.stats.totalChunks) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Chunks List */}
        <div className="bg-white border rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Chunks del Documento</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {details.chunks.map((chunk) => (
              <div key={chunk.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">Chunk #{chunk.index + 1}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        chunk.hasEmbedding 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {chunk.hasEmbedding ? `Embedding (${chunk.embeddingDimensions}D)` : 'Sin embedding'}
                      </span>
                      <span className="text-xs text-gray-500">{chunk.wordCount} palabras</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{chunk.contentPreview}</p>
                  </div>
                  <button
                    onClick={() => handleViewChunk(chunk)}
                    className="ml-4 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Ver completo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Chunk Detail Modal */}
      {showChunkModal && selectedChunk && (
        <ChunkDetailModal 
          chunk={selectedChunk}
          onClose={() => {
            setShowChunkModal(false)
            setSelectedChunk(null)
          }}
        />
      )}
    </div>
  )
}

function ChunkDetailModal({ 
  chunk, 
  onClose 
}: { 
  chunk: DocumentChunk
  onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Chunk #{chunk.index + 1}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span>{chunk.wordCount} palabras</span>
              <span>•</span>
              <span>{chunk.charCount} caracteres</span>
              <span>•</span>
              <span className={chunk.hasEmbedding ? 'text-green-600' : 'text-red-600'}>
                {chunk.hasEmbedding ? `Embedding ${chunk.embeddingDimensions}D` : 'Sin embedding'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Contenido del Chunk:</h4>
          <div className="bg-white rounded border p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{chunk.content}</pre>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}