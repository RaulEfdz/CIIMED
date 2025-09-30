# Proceso para Convertir Componentes Estáticos a Dinámicos

## Resumen del Proceso
Esta guía explica paso a paso cómo convertir cualquier componente con datos fijos (hardcoded) para que use datos dinámicos desde la base de datos, usando el panel de administración.

## Proceso Completo (7 Pasos)

### 1. 🔍 **Análisis del Componente Actual**
**Objetivo**: Identificar qué datos están fijos en el código

**Acciones**:
```bash
# Buscar el componente y analizar su estructura
find . -name "*ComponentName*" -type f
grep -r "datos-fijos" components/
```

**Preguntas clave**:
- ¿Qué datos están hardcoded?
- ¿Qué props recibe el componente?
- ¿Dónde se usa el componente?
- ¿Qué configuraciones visuales tiene?

**Ejemplo** (Footer):
```typescript
// ❌ ANTES: Datos fijos
const footerContactInfo = {
  email: "contacto@ejemplo.com",
  phone: "+123 456 7890", 
  address: "Calle Ejemplo, Ciudad, País",
  brand: "CIIMED"
};
```

### 2. 🗄️ **Expandir Modelo de Base de Datos**
**Objetivo**: Agregar campos necesarios al schema de Prisma

**Acciones**:
```prisma
// En prisma/schema.prisma
model InstitutionalInfo {
  // ... campos existentes
  
  // Nuevos campos para el componente
  componentField1 String?  // Descripción del campo
  componentField2 String?  // Otro campo necesario
  componentColor  String?  // Color personalizable
  // etc.
}
```

**Patrones de nomenclatura**:
- `componentName + FieldName` (ej: `footerEmail`, `heroTitle`)
- Usar `String?` para campos opcionales
- Agregar comentarios descriptivos

### 3. 🔄 **Actualizar API Endpoints**
**Objetivo**: Incluir nuevos campos en las operaciones CRUD

**Archivos a modificar**: 
- `app/api/institutional/route.ts` (o el endpoint correspondiente)

**Cambios necesarios**:

a) **Destructuring en POST/PUT**:
```typescript
const {
  // ... campos existentes
  componentField1,
  componentField2,
  componentColor
} = await req.json()
```

b) **Operaciones de base de datos**:
```typescript
// En POST
data: {
  // ... campos existentes
  componentField1: componentField1 || '',
  componentField2: componentField2 || '',
  componentColor: componentColor || '#default'
}

// En PUT (igual estructura)
```

### 4. 📝 **Actualizar Tipos TypeScript**
**Objetivo**: Sincronizar interfaces con nuevos campos

**Archivos a modificar**:
- `hooks/useInstitutionalInfo.ts` (o hook correspondiente)
- `app/admin/content/institutional/components/types.ts`

**Cambios**:
```typescript
export interface InstitutionalInfo {
  // ... campos existentes
  componentField1?: string
  componentField2?: string
  componentColor?: string
}
```

### 5. 🎨 **Modificar Componente para Usar Datos Dinámicos**
**Objetivo**: Reemplazar datos fijos con datos de la DB

**Patrón a seguir**:

a) **Crear función generadora** (si es complejo):
```typescript
// En archivo de utilidades o data.ts
export const generateComponentData = (info: InstitutionalInfo | null) => {
  if (!info) {
    // Valores por defecto
    return {
      field1: 'Default value',
      field2: 'Default value 2',
      color: '#default'
    }
  }

  return {
    field1: info.componentField1 || 'Default value',
    field2: info.componentField2 || 'Default value 2', 
    color: info.componentColor || '#default'
  }
}
```

b) **Actualizar componente padre** (donde se usa):
```typescript
'use client' // Si usa hooks

import { useInstitutionalInfo } from '@/hooks/useInstitutionalInfo'
import { generateComponentData } from './utils'

export const ParentComponent = () => {
  const { institutionalInfo, isLoading } = useInstitutionalInfo()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  const componentData = generateComponentData(institutionalInfo)
  
  return <YourComponent {...componentData} />
}
```

c) **Modificar componente hijo** (si necesario):
```typescript
// Si el componente necesita estilos dinámicos
interface ComponentProps {
  // ... props existentes
  styles?: {
    backgroundColor: string
    textColor: string
  }
}

export const YourComponent = ({ styles, ...props }) => {
  return (
    <div 
      style={{ 
        backgroundColor: styles?.backgroundColor || '#default',
        color: styles?.textColor || '#000'
      }}
    >
      {/* contenido */}
    </div>
  )
}
```

### 6. ⚙️ **Actualizar Panel de Administración**
**Objetivo**: Agregar campos editables en el panel admin

**Decisión Arquitectural**: ¿Modal Único vs. Modales Separados?

#### **📋 Estrategia A: Modal Único** (Para componentes simples)
**Archivos a modificar**:
- `app/admin/content/institutional/components/EditInstitutionalModal.tsx`

**Cuándo usar**: 
- Componente tiene < 5 campos específicos
- Configuración no es muy compleja
- Se integra bien con el resto de la información

**Pasos**:

a) **Agregar al formData inicial**:
```typescript
const [formData, setFormData] = useState({
  // ... campos existentes
  componentField1: info.componentField1 || '',
  componentField2: info.componentField2 || '',
  componentColor: info.componentColor || '#default'
})
```

b) **Agregar al body del fetch**:
```typescript
body: JSON.stringify({
  // ... campos existentes
  componentField1: formData.componentField1,
  componentField2: formData.componentField2,
  componentColor: formData.componentColor
})
```

c) **Agregar campos al formulario**:
```jsx
{/* Nueva Sección del Componente */}
<div className="border-t pt-6">
  <h3 className="text-lg font-medium text-gray-900 mb-4">
    Configuración de ComponentName
  </h3>
  <div className="space-y-4">
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Campo 1
      </label>
      <input
        type="text"
        value={formData.componentField1}
        onChange={(e) => setFormData(prev => ({ 
          ...prev, 
          componentField1: e.target.value 
        }))}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        placeholder="Valor por defecto"
      />
    </div>

    {/* Para colores */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Color del Componente
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={formData.componentColor}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            componentColor: e.target.value 
          }))}
          className="w-12 h-10 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={formData.componentColor}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            componentColor: e.target.value 
          }))}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
          placeholder="#000000"
        />
      </div>
    </div>

  </div>
</div>
```

---

#### **🎛️ Estrategia B: Modales Separados** (Para componentes complejos)
**Archivos a crear/modificar**:
- `app/admin/content/institutional/components/EditComponentModal.tsx` (nuevo)
- `app/admin/content/institutional/page.tsx` (página principal)

**Cuándo usar**:
- Componente tiene > 5 campos específicos
- Configuración compleja (colores, preview, múltiples secciones)
- Merece su propia sección en el panel admin
- Experiencia de usuario más limpia

**Pasos Adicionales**:

a) **Crear Modal Especializado**:
```typescript
// components/EditComponentModal.tsx
'use client'

import { useState } from 'react'
import { ComponentIcon } from 'lucide-react'
import { InstitutionalInfo, ModalProps } from './types'

interface EditComponentModalProps extends ModalProps {
  info: InstitutionalInfo
}

export default function EditComponentModal({ 
  info, onClose, onSuccess, setInstitutionalInfo 
}: EditComponentModalProps) {
  const [formData, setFormData] = useState({
    componentField1: info.componentField1 || '',
    componentField2: info.componentField2 || '',
    componentColor: info.componentColor || '#default'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/institutional', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Enviar todos los datos existentes + cambios del componente
          ...info,
          componentField1: formData.componentField1,
          componentField2: formData.componentField2,
          componentColor: formData.componentColor
        })
      })

      if (response.ok) {
        const updatedInfo = {
          ...info,
          ...formData,
          updatedAt: new Date().toISOString()
        }
        setInstitutionalInfo(updatedInfo)
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating component:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-6">
          <ComponentIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold">Configuración del ComponentName</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Secciones específicas del componente */}
          {/* Vista previa si es necesario */}
          {/* Botones */}
        </form>
      </div>
    </div>
  )
}
```

b) **Agregar Estado en Página Principal**:
```typescript
// page.tsx
const [showComponentModal, setShowComponentModal] = useState(false)
```

c) **Crear Sección de Visualización**:
```jsx
{/* Component Configuration Card */}
<div className="bg-white shadow rounded-lg mt-8">
  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
    <h3 className="text-lg font-medium text-gray-900 flex items-center">
      <ComponentIcon className="h-5 w-5 mr-2" />
      Configuración del ComponentName
    </h3>
    <button
      onClick={() => setShowComponentModal(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
    >
      <Edit className="h-4 w-4 mr-2" />
      Editar
    </button>
  </div>
  
  <div className="p-6">
    {/* Mostrar datos actuales del componente */}
    {/* Vista previa opcional */}
  </div>
</div>
```

d) **Agregar Modal al Render**:
```jsx
{/* Component Modal */}
{showComponentModal && institutionalInfo && (
  <EditComponentModal 
    info={institutionalInfo}
    onClose={() => setShowComponentModal(false)}
    onSuccess={() => {
      setShowComponentModal(false)
      fetchInstitutionalInfo()
    }}
    setInstitutionalInfo={setInstitutionalInfo}
  />
)}
```

**🔍 Criterios de Decisión**:
- **Modal Único**: Hero simple, features básicas, configuraciones menores
- **Modal Separado**: Footer, navigation, galleries, dashboards complejos

**📁 Importaciones Necesarias**:
```typescript
// Para modales separados
import EditComponentModal from './components/EditComponentModal'
```

### 7. 🧪 **Aplicar Cambios y Probar**
**Objetivo**: Sincronizar DB y verificar funcionamiento

**Comandos necesarios**:
```bash
# 1. Aplicar cambios al esquema
npx prisma db push

# 2. Regenerar cliente (si hay problemas)
rm -rf lib/generated/prisma
npx prisma generate

# 3. Iniciar servidor
npm run dev

# 4. Probar en navegador
# - Ir a /admin/content/institutional
# - Hacer clic en "Editar" 
# - Scroll hacia abajo para ver nuevos campos
# - Guardar cambios
# - Verificar que el componente use los nuevos datos
```

## Patrones de Fallbacks Inteligentes

### Patrón 1: Fallback Jerárquico
```typescript
// Específico → General → Por defecto
const value = info.specificField || info.generalField || 'default'
```

### Patrón 2: Fallback con Validación
```typescript
const value = (info.field && info.field.trim()) ? info.field : 'default'
```

### Patrón 3: Fallback para Arrays
```typescript
const items = (info.items && info.items.length > 0) ? info.items : ['default1', 'default2']
```

## Ejemplos de Casos de Uso

### 1. Hero Section
```typescript
// Campos necesarios: heroTitle, heroSubtitle, heroImage, heroOverlay
const heroData = {
  title: info.heroTitle || info.name || 'Título por defecto',
  subtitle: info.heroSubtitle || info.description || 'Subtítulo por defecto',
  image: info.heroImage || info.image || '/default-hero.jpg',
  overlayColor: info.heroOverlay || '#000000'
}
```

### 2. Cards/Features
```typescript
// Campos necesarios: featureTitle, featureText, featureIcon, featureColor
const featuresData = [
  {
    title: info.feature1Title || 'Feature 1',
    text: info.feature1Text || 'Descripción...',
    color: info.feature1Color || '#blue'
  },
  // ... más features
]
```

### 3. Navigation Menu
```typescript
// Campos necesarios: navLogo, navItems (JSON), navStyle
const navData = {
  logo: info.navLogo || info.logo || '/logo.png',
  items: info.navItems || defaultNavItems,
  style: info.navStyle || 'horizontal'
}
```

## Tips y Mejores Prácticas

### ✅ DO
- Usar nombres descriptivos para campos (`headerTitle`, no `title1`)
- Implementar fallbacks inteligentes
- Agrupar campos relacionados en secciones del admin
- Validar datos antes de guardar
- Usar tipos TypeScript estrictos
- Documentar el propósito de cada campo

### ❌ DON'T
- Hardcodear valores sin fallbacks
- Crear campos genéricos (`field1`, `data1`)
- Olvidar agregar validación en el admin
- Mezclar datos de diferentes componentes
- Usar hooks en Server Components

## Estructura de Archivos Recomendada

```
component-name/
├── ComponentName.tsx          # Componente principal
├── data.ts                   # Funciones generadoras
├── types.ts                  # Tipos específicos
├── hooks/                    # Hooks personalizados (si necesario)
└── admin/                    # Formularios admin específicos (si muy complejos)
```

## Comandos de Debug Útiles

```bash
# Verificar schema actual
npx prisma studio

# Ver estructura de tabla
npx prisma db execute --stdin <<< "\\d institutional_info"

# Reset completo (SOLO DESARROLLO)
npx prisma migrate reset --force

# Verificar errores TypeScript
npx tsc --noEmit

# Verificar errores de compilación
npm run build
```

Este proceso puede aplicarse a cualquier componente: navigation, hero sections, cards, testimonials, galleries, etc. La clave está en identificar bien los datos variables y crear una experiencia de administración intuitiva.

---

## 🎓 Lecciones Aprendidas (Del Proyecto Footer)

### **Problema Real Resuelto**: Footer Dinámico
En este proyecto implementamos un footer completamente dinámico siguiendo este proceso exacto. Aquí las lecciones clave:

#### **🔧 Implementación Técnica**
```typescript
// Schema expandido con todos los campos del footer
model InstitutionalInfo {
  // ... campos existentes
  footerBrand             String?
  footerEmail             String?
  footerPhone             String?
  footerAddress           String?
  footerCopyright         String?
  footerBackgroundColor   String?  @default("#285C4D")
  footerTextColor         String?  @default("#ffffff")
  footerAccentColor       String?  @default("#F4633A")
}
```

#### **🎯 Decisiones de Diseño Exitosas**

1. **Modal Separado vs. Integrado**: 
   - **DECISION**: Usamos modal separado para el footer
   - **RAZÓN**: 8 campos específicos + preview + configuración de colores
   - **RESULTADO**: UX mucho más limpia y fácil de usar

2. **Fallbacks Inteligentes**:
   ```typescript
   // ✅ Patrón usado en el footer
   const footerData = {
     brand: info.footerBrand || info.name || 'CIIMED',
     email: info.footerEmail || info.email || 'info@ciimed.pa',
     phone: info.footerPhone || info.phone || '+507 123-4567',
     address: info.footerAddress || info.address || 'Ciudad de la Salud, Panamá'
   }
   ```

3. **Vista Previa en Tiempo Real**:
   - Implementamos preview live en el modal de edición
   - Los cambios se ven inmediatamente antes de guardar
   - Incluye colores, texto, y estructura completa

#### **⚠️ Errores Encontrados y Solucionados**

1. **Error de Prisma "prepared statement already exists"**:
   ```bash
   # Solución que funcionó
   rm -rf lib/generated/prisma
   npx prisma generate
   npx prisma db push
   ```

2. **Error de Server-Side Rendering**:
   - **PROBLEMA**: Usar `useInstitutionalInfo` hook en server component
   - **SOLUCIÓN**: Agregar `'use client'` al componente padre

3. **Datos por defecto mostrándose en lugar de datos reales**:
   - **PROBLEMA**: Los fallbacks ocultaban que los datos no se cargaban
   - **SOLUCIÓN**: Mejor debugging de la cadena de datos API → Hook → Componente

#### **✨ Mejores Prácticas Validadas**

1. **Nomenclatura Consistente**:
   ```typescript
   // ✅ BIEN: Específico y claro
   footerBackgroundColor, footerTextColor, footerAccentColor
   
   // ❌ MAL: Genérico y confuso  
   color1, color2, color3
   ```

2. **Organización de Estados**:
   ```typescript
   // ✅ Estados separados para cada modal
   const [showEditModal, setShowEditModal] = useState(false)
   const [showFooterModal, setShowFooterModal] = useState(false)
   ```

3. **Botones Contextuales**:
   ```jsx
   {/* ✅ Cada sección tiene su propio botón de editar */}
   <button onClick={() => setShowEditModal(true)}>Editar Info General</button>
   <button onClick={() => setShowFooterModal(true)}>Editar Footer</button>
   ```

#### **📈 Métricas de Éxito**

- **Campos dinámicos agregados**: 8 campos específicos del footer
- **Modales implementados**: 2 (principal + footer)
- **Tiempo de implementación**: ~4 horas siguiendo este proceso
- **Errores encontrados**: 3 (todos documentados y solucionados)
- **Experiencia del usuario**: Excelente (cada componente tiene su propio espacio)

#### **🔄 Proceso de Iteración Usado**

1. **Análisis**: Identificamos que el footer tenía 6 valores hardcoded
2. **Expansión DB**: Agregamos 8 campos al schema
3. **API**: Expandimos endpoints para incluir campos del footer
4. **Componente**: Modificamos footer para usar datos dinámicos
5. **Admin**: Creamos modal específico con preview
6. **Testing**: Verificamos funcionamiento completo
7. **Refinamiento**: Ajustamos UX y solucionamos errores

#### **🎯 Aplicabilidad a Otros Componentes**

Este mismo proceso se puede aplicar exactamente igual a:

- **Navigation Menu**: Campos como `navLogo`, `navItems`, `navStyle`
- **Hero Section**: Campos como `heroTitle`, `heroSubtitle`, `heroImage`, `heroOverlay`
- **Contact Section**: Campos como `contactTitle`, `contactForm`, `contactMap`
- **Gallery Component**: Campos como `galleryTitle`, `galleryImages`, `galleryLayout`

**🎯 Template de Modal Reutilizable**: 
El `EditFooterModal.tsx` sirve como template perfecto para crear otros modales especializados.