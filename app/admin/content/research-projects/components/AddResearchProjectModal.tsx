'use client'

import { useState } from 'react';
import { X, Plus, Upload, Loader2 } from 'lucide-react';
import { useResearchProjects } from '@/hooks/useResearchProjects';

interface AddResearchProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddResearchProjectModal: React.FC<AddResearchProjectModalProps> = ({
  onClose,
  onSuccess
}) => {
  const { createProject } = useResearchProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'advanced'>('basic');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    abstract: '',
    researchLine: '',
    category: '',
    area: '',
    status: 'planning',
    priority: 5,
    tags: [],
    startDate: '',
    endDate: '',
    estimatedDuration: '',
    principalInvestigator: '',
    coInvestigators: [],
    budget: '',
    currency: 'USD',
    fundingSource: '',
    currentFunding: '',
    imageUrl: '',
    imageAlt: '',
    objectives: [],
    expectedResults: '',
    methodology: '',
    equipment: [],
    software: [],
    institutionalPartners: [],
    internationalPartners: [],
    studentParticipants: '',
    ethicsApproval: '',
    featured: false,
    published: false,
    allowPublicView: true,
    link: ''
  });

  const [tempInputs, setTempInputs] = useState({
    tag: '',
    coInvestigator: '',
    objective: '',
    equipment: '',
    software: '',
    institutionalPartner: '',
    internationalPartner: ''
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && { slug: generateSlug(value) })
    }));
  };

  const handleTempInputChange = (field: string, value: string) => {
    setTempInputs(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (arrayField: string, tempField: string) => {
    const value = tempInputs[tempField as keyof typeof tempInputs].trim();
    if (value) {
      setFormData(prev => ({
        ...prev,
        [arrayField]: [...(prev[arrayField as keyof typeof prev] as string[]), value]
      }));
      setTempInputs(prev => ({ ...prev, [tempField]: '' }));
    }
  };

  const removeArrayItem = (arrayField: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: (prev[arrayField as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        currentFunding: formData.currentFunding ? parseFloat(formData.currentFunding) : undefined,
        studentParticipants: formData.studentParticipants ? parseInt(formData.studentParticipants) : undefined,
        currentProgress: 0
      };

      const result = await createProject(submitData);
      
      if (result.success) {
        onSuccess();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error al crear el proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'planning', label: 'Planificación' },
    { value: 'active', label: 'Activo' },
    { value: 'paused', label: 'Pausado' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD - Dólar Estadounidense' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'COP', label: 'COP - Peso Colombiano' },
    { value: 'MXN', label: 'MXN - Peso Mexicano' },
    { value: 'BRL', label: 'BRL - Real Brasileño' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Nuevo Proyecto de Investigación</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'basic', label: 'Información Básica' },
            { key: 'details', label: 'Detalles' },
            { key: 'advanced', label: 'Configuración Avanzada' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            
            {/* Tab: Información Básica */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                
                {/* Título y Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Título del proyecto"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="titulo-del-proyecto"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descripción breve del proyecto"
                  />
                </div>

                {/* Abstract */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abstract / Resumen Ejecutivo
                  </label>
                  <textarea
                    rows={4}
                    value={formData.abstract}
                    onChange={(e) => handleInputChange('abstract', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Resumen académico del proyecto"
                  />
                </div>

                {/* Clasificación */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Línea de Investigación
                    </label>
                    <input
                      type="text"
                      value={formData.researchLine}
                      onChange={(e) => handleInputChange('researchLine', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ej. Bioingeniería"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ej. Investigación Básica"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Área
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ej. Ciencias de la Salud"
                    />
                  </div>
                </div>

                {/* Estado y Prioridad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempInputs.tag}
                      onChange={(e) => handleTempInputChange('tag', e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Agregar etiqueta"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', 'tag'))}
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem('tags', 'tag')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-sm text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeArrayItem('tags', index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Detalles */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                
                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración Estimada
                    </label>
                    <input
                      type="text"
                      value={formData.estimatedDuration}
                      onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ej. 2 años"
                    />
                  </div>
                </div>

                {/* Investigadores */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investigador Principal
                  </label>
                  <input
                    type="text"
                    value={formData.principalInvestigator}
                    onChange={(e) => handleInputChange('principalInvestigator', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre del investigador principal"
                  />
                </div>

                {/* Co-investigadores */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Co-investigadores
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempInputs.coInvestigator}
                      onChange={(e) => handleTempInputChange('coInvestigator', e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Agregar co-investigador"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('coInvestigators', 'coInvestigator'))}
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem('coInvestigators', 'coInvestigator')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {formData.coInvestigators.length > 0 && (
                    <div className="space-y-1">
                      {formData.coInvestigators.map((investigator, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                          <span>{investigator}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('coInvestigators', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Presupuesto */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Presupuesto Total
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moneda
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {currencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Financiamiento Actual
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.currentFunding}
                      onChange={(e) => handleInputChange('currentFunding', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Fuente de financiamiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuente de Financiamiento
                  </label>
                  <input
                    type="text"
                    value={formData.fundingSource}
                    onChange={(e) => handleInputChange('fundingSource', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ej. COLCIENCIAS, NSF, etc."
                  />
                </div>

                {/* Participantes estudiantiles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Estudiantes Participantes
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.studentParticipants}
                    onChange={(e) => handleInputChange('studentParticipants', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            {/* Tab: Configuración Avanzada */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                
                {/* Imagen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Imagen
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto Alternativo de Imagen
                    </label>
                    <input
                      type="text"
                      value={formData.imageAlt}
                      onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Descripción de la imagen"
                    />
                  </div>
                </div>

                {/* Objetivos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivos
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempInputs.objective}
                      onChange={(e) => handleTempInputChange('objective', e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Agregar objetivo"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('objectives', 'objective'))}
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem('objectives', 'objective')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {formData.objectives.length > 0 && (
                    <div className="space-y-1">
                      {formData.objectives.map((objective, index) => (
                        <div key={index} className="flex items-start justify-between bg-gray-50 px-3 py-2 rounded-md">
                          <span className="flex-1">{objective}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('objectives', index)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resultados esperados */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resultados Esperados
                  </label>
                  <textarea
                    rows={3}
                    value={formData.expectedResults}
                    onChange={(e) => handleInputChange('expectedResults', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descripción de los resultados esperados"
                  />
                </div>

                {/* Metodología */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metodología
                  </label>
                  <textarea
                    rows={3}
                    value={formData.methodology}
                    onChange={(e) => handleInputChange('methodology', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descripción de la metodología a utilizar"
                  />
                </div>

                {/* Aprobación ética */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aprobación Ética
                  </label>
                  <input
                    type="text"
                    value={formData.ethicsApproval}
                    onChange={(e) => handleInputChange('ethicsApproval', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Número de aprobación del comité de ética"
                  />
                </div>

                {/* Link externo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enlace Externo
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>

                {/* Configuraciones */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                      Proyecto destacado
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => handleInputChange('published', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                      Publicar proyecto
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowPublicView"
                      checked={formData.allowPublicView}
                      onChange={(e) => handleInputChange('allowPublicView', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowPublicView" className="ml-2 block text-sm text-gray-700">
                      Permitir vista pública
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Crear Proyecto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResearchProjectModal;