# Plan de Implementación - Sistemas Pendientes CIIMED

## 📋 Estado General del Proyecto

### ✅ **Sistemas Completados**
- [x] **Equipo (Teams)** - Sistema dinámico con gestión de imágenes
- [x] **Noticias (News)** - CRUD completo con panel admin
- [x] **Eventos (Events)** - Sistema avanzado con filtros y búsqueda
- [x] **Información Institucional** - Configuración básica dinámica
- [x] **Footer Dinámico** - Configuración completa con preview

### 🎯 **Sistemas Pendientes**
- [ ] **1. Configuración del Sitio** (Prioridad Alta)
- [ ] **2. Proyectos de Investigación** (Prioridad Media)  
- [ ] **3. Galería de Medios** (Prioridad Media-Alta)

---

## 🗓️ **Plan de Implementación Secuencial**

### **📅 Cronograma Estimado**
```
Semana 1: Configuración del Sitio (2-3 horas)
Semana 2: Proyectos de Investigación (4-5 horas)
Semana 3: Galería de Medios (6-8 horas)
```

---

## ✅ **1. Configuración del Sitio** (COMPLETADO)

### **📊 Estado Actual** ✅ COMPLETADO
- [x] **Análisis del Componente** (Paso 1) ✅
- [x] **Expandir Modelo de BD** (Paso 2) ✅
- [x] **Actualizar API Endpoints** (Paso 3) ✅
- [x] **Actualizar Tipos TypeScript** (Paso 4) ✅
- [x] **Modificar Componente** (Paso 5) ✅
- [x] **Panel de Administración** (Paso 6) ✅
- [x] **Testing y Aplicación** (Paso 7) ✅
- [x] **Carga de Datos Default** (Paso 8) ✅

### **🎯 Objetivos**
- Configuraciones generales del sitio web
- Metadatos SEO dinámicos
- Información de contacto global
- Configuración de colores y temas
- Logos y branding

### **📝 Campos Estimados** (15-20 campos)
```typescript
// Configuración General
siteName: string
siteDescription: string  
siteKeywords: string[]
siteUrl: string

// SEO y Metadatos
metaTitle: string
metaDescription: string
ogImage: string
ogDescription: string

// Contacto Global
globalEmail: string
globalPhone: string
globalAddress: string
emergencyContact: string

// Branding
primaryLogo: string
secondaryLogo: string
favicon: string
primaryColor: string
secondaryColor: string
accentColor: string

// Social Media
facebookUrl: string
twitterUrl: string
linkedinUrl: string
instagramUrl: string
youtubeUrl: string
```

### **🏗️ Componentes a Crear/Modificar**
- [ ] `hooks/useSiteConfig.ts`
- [ ] `app/api/site-config/route.ts` 
- [ ] `app/admin/content/site-config/page.tsx`
- [ ] `app/admin/content/site-config/components/EditSiteConfigModal.tsx`
- [ ] Modificar `layout.tsx` para usar metadatos dinámicos
- [ ] Modificar componentes que usen configuración global

### **⚠️ Riesgos Identificados**
- Metadatos next.js requieren configuración especial
- Cambios de tema pueden afectar todos los componentes
- Logos requerirán manejo de imágenes similar a otros sistemas

---

## 📊 **2. Proyectos de Investigación**

### **📊 Estado Actual**
- [ ] **Análisis del Componente** (Paso 1)
- [ ] **Expandir Modelo de BD** (Paso 2) 
- [ ] **Actualizar API Endpoints** (Paso 3)
- [ ] **Actualizar Tipos TypeScript** (Paso 4)
- [ ] **Modificar Componente** (Paso 5)
- [ ] **Panel de Administración** (Paso 6)
- [ ] **Testing y Aplicación** (Paso 7)
- [ ] **Carga de Datos Default** (Paso 8)

### **🎯 Objetivos**
- Gestión de líneas de investigación activas
- Proyectos con estados y progreso
- Información de investigadores asociados
- Documentos y publicaciones relacionadas
- Cronogramas y presupuestos

### **📝 Campos Estimados** (20-25 campos)
```typescript
// Información Básica
title: string
slug: string
description: string
abstractText: string
objectives: string[]

// Clasificación
researchLine: string
category: string
area: string
status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
priority: number
tags: string[]

// Temporal
startDate: string
endDate: string
estimatedDuration: string
currentProgress: number // 0-100

// Recursos
principalInvestigator: string
coInvestigators: string[]
budget: Decimal
fundingSource: string
currency: string

// Documentación
imageUrl: string
documentsUrls: string[]
publicationsUrls: string[]
presentationsUrls: string[]

// Resultados
expectedResults: string
currentResults: string
impactMeasures: string[]
```

### **🏗️ Componentes a Crear**
- [ ] `model ResearchProject` en Prisma
- [ ] `hooks/useResearchProjects.ts`
- [ ] `app/api/research-projects/route.ts`
- [ ] `components/customs/Features/ResearchProjects.tsx`
- [ ] `components/customs/Cards/ResearchProjectCard.tsx`
- [ ] `app/admin/content/research-projects/page.tsx`
- [ ] `app/admin/content/research-projects/components/EditProjectModal.tsx`
- [ ] `app/data/research-projects.ts`

### **⚠️ Riesgos Identificados**
- Sistema más complejo que News/Events
- Relaciones con investigadores (puede requerir modelo separado)
- Manejo de múltiples archivos/documentos
- Cálculos de progreso y métricas

---

## 🎨 **3. Galería de Medios**

### **📊 Estado Actual**
- [ ] **Análisis del Componente** (Paso 1)
- [ ] **Expandir Modelo de BD** (Paso 2)
- [ ] **Actualizar API Endpoints** (Paso 3)
- [ ] **Actualizar Tipos TypeScript** (Paso 4)
- [ ] **Modificar Componente** (Paso 5)
- [ ] **Panel de Administración** (Paso 6)
- [ ] **Testing y Aplicación** (Paso 7)
- [ ] **Carga de Datos Default** (Paso 8)

### **🎯 Objetivos**
- Gestión centralizada de multimedia
- Diferentes tipos: imágenes, videos, documentos
- Organización por álbumes/categorías
- Sistema de etiquetas y búsqueda
- Integración con UploadThing

### **📝 Campos Estimados** (18-22 campos)
```typescript
// Información Básica
title: string
slug: string
description: string
alt: string
caption: string

// Archivo
fileUrl: string
fileName: string
fileSize: number
mimeType: string
dimensions: string // "1920x1080"
duration: number // para videos, en segundos

// Clasificación
type: 'image' | 'video' | 'document' | 'audio'
category: string
album: string
tags: string[]

// Metadatos
uploadedBy: string
sourceCamera: string
location: string
eventDate: string

// Estado
status: 'public' | 'private' | 'draft'
featured: boolean
downloadable: boolean
```

### **🏗️ Componentes a Crear**
- [ ] `model MediaItem` en Prisma
- [ ] `hooks/useMediaGallery.ts`
- [ ] `app/api/media-gallery/route.ts`
- [ ] `components/customs/Features/MediaGallery.tsx`
- [ ] `components/customs/Cards/MediaCard.tsx`
- [ ] `components/customs/MediaViewer/LightboxViewer.tsx`
- [ ] `app/admin/content/media-gallery/page.tsx`
- [ ] `app/admin/content/media-gallery/components/EditMediaModal.tsx`
- [ ] `app/admin/content/media-gallery/components/BulkUpload.tsx`
- [ ] `app/data/media-gallery.ts`

### **⚠️ Riesgos Identificados**
- Sistema más complejo por diferentes tipos de media
- Requiere componente de visualización (lightbox)
- Upload masivo de archivos
- Optimización de imágenes y videos
- Almacenamiento y ancho de banda
- Preview para diferentes tipos de archivo

---

## 📊 **Métricas de Progreso Global**

### **🎯 Sistemas Completados: 6/8 (75%)**
```
✅ Teams (100%)
✅ News (100%)  
✅ Events (100%)
✅ Institutional Info (100%)
✅ Footer (100%)
✅ Site Config (100%) 🎉 NUEVO
🔄 Research Projects (0%)
🔄 Media Gallery (0%)
```

### **📈 Progreso por Categoría**
```
Backend (Models + APIs): 75% (6/8)
Frontend (Components): 75% (6/8)  
Admin Panels: 75% (6/8)
Testing: 75% (6/8)
```

---

## 🎯 **Decisiones Estratégicas**

### **✅ Patrones Validados a Reutilizar**
1. **React Hooks con Estado de Error**
2. **Manejo de Imágenes Rotas** (`onError` pattern)
3. **Eliminación Total de Mock Data**
4. **APIs con Prisma Singleton**
5. **Modales Especializados por Sistema**
6. **Hooks Personalizados con Parámetros**
7. **Paso 8: Datos Default Realistas**

### **🔧 Herramientas y Comandos Validados**
```bash
# Aplicar cambios DB
npx prisma db push

# Verificar errores
npm run build
npx tsc --noEmit

# Debug de datos
npx prisma studio

# Testing local
npm run dev
```

### **📁 Estructura de Archivos Estándar**
```
system-name/
├── model SystemName (en schema.prisma)
├── hooks/useSystemName.ts
├── app/api/system-name/route.ts  
├── components/customs/Features/SystemName.tsx
├── components/customs/Cards/SystemNameCard.tsx
├── app/admin/content/system-name/page.tsx
├── app/admin/content/system-name/components/EditModal.tsx
├── app/data/system-name.ts
└── system-name-sample.json
```

---

## 🏁 **Criterios de Finalización**

### **✅ Cada Sistema se Considera Completo Cuando:**
- [ ] Modelo de BD creado y aplicado
- [ ] API endpoints funcionando (GET, POST, PUT, DELETE)
- [ ] Hook personalizado implementado
- [ ] Componente frontend renderizando datos de DB
- [ ] Panel admin completamente funcional
- [ ] Sistema de imágenes con manejo de errores
- [ ] Cero datos mock o fallbacks estáticos
- [ ] Datos default cargados via sample.json
- [ ] Testing manual completado sin errores
- [ ] Documentación actualizada en proceso

### **🎯 Meta Final**
**8/8 sistemas dinámicos funcionando al 100%** con panel de administración completo y cero dependencia de datos estáticos.

---

**📝 Última Actualización**: 2025-01-01
**👨‍💻 Estado**: Listos para implementar Sistema #1 - Configuración del Sitio
**⏱️ Tiempo Estimado Restante**: 12-16 horas total para los 3 sistemas