# Sistema de Mapeo de Secciones

Este documento explica el sistema implementado para mapear las secciones del menú público con las secciones administrativas del CMS.

## Archivos Principales

### 1. `config/sections-mapping.ts`
Contiene toda la configuración de mapeo entre secciones públicas y administrativas.

#### Interfaces principales:
- `PublicSection`: Define las secciones del menú público
- `AdminSection`: Define las secciones del panel administrativo

#### Funciones utilitarias:
- `getAdminSectionsForPublic()`: Obtiene secciones admin relacionadas con una pública
- `getPublicSectionsForAdmin()`: Obtiene secciones públicas relacionadas con una admin
- `searchAdminSectionsByTag()`: Busca secciones por etiquetas
- `getNavigationMapping()`: Obtiene el mapeo completo

### 2. `components/admin/NavigationHelper.tsx`
Componentes para mostrar navegación entre secciones:
- `NavigationHelper`: Muestra vínculos a secciones públicas desde el admin
- `AdminBreadcrumb`: Breadcrumbs para navegación en el admin

### 3. `components/admin/QuickAdminAccess.tsx`
Componente flotante para acceso rápido al admin desde páginas públicas.

## Mapeo Implementado

### Secciones Públicas → Administrativas

| Sección Pública | Secciones Administrativas |
|----------------|---------------------------|
| **Inicio** | Configuración del Sitio |
| **Sobre Nosotros** | Información Institucional, Equipo de Trabajo |
| **Áreas de Investigación** | Proyectos de Investigación |
| **Formación y Capacitación** | Eventos y Actividades |
| **Alianzas Estratégicas** | Información Institucional |
| **Participa con Nosotros** | Eventos y Actividades |
| **Divulgación Científica** | Noticias y Publicaciones, Galería de Medios |
| **Contacto** | Información Institucional |

### Etiquetas por Sección Administrativa

**Equipo de Trabajo:**
- personal, investigadores, staff, equipo

**Información Institucional:**
- institucional, misión, visión, valores, historia, contacto

**Noticias y Publicaciones:**
- noticias, publicaciones, artículos, comunicados, prensa

**Eventos y Actividades:**
- eventos, workshops, conferencias, talleres, capacitación

**Proyectos de Investigación:**
- investigación, proyectos, líneas, estudios, ciencia

**Galería de Medios:**
- multimedia, imágenes, videos, galería, recursos

**Configuración del Sitio:**
- configuración, metadatos, SEO, general, sitio

## Características Implementadas

### 1. Panel de Gestión de Contenido Mejorado
- **Etiquetas**: Cada sección muestra sus etiquetas principales
- **Vínculos públicos**: Muestra dónde aparece el contenido en el sitio público
- **Mapeo visual**: Conexión clara entre admin y público

### 2. Navegación Contextual
- **Breadcrumbs**: Navegación clara en páginas administrativas
- **Vínculos directos**: Acceso rápido a páginas públicas relacionadas
- **Preview**: Enlaces para ver contenido aplicado

### 3. Acceso Rápido desde Páginas Públicas
- **Botón flotante**: Para usuarios autenticados
- **Opciones contextuales**: Muestra solo secciones relacionadas
- **Apertura en nueva pestaña**: No interrumpe la navegación pública

## Uso

### Para Administradores

1. **En el panel administrativo:**
   - Las tarjetas de sección muestran etiquetas y vínculos públicos
   - Use "Aparece en" para ver dónde se aplica el contenido
   - Los breadcrumbs facilitan la navegación

2. **En páginas específicas:**
   - El componente `NavigationHelper` muestra vínculos directos
   - Puede ver el contenido aplicado en tiempo real

3. **Desde páginas públicas:**
   - El botón flotante permite edición rápida
   - Solo aparece para usuarios autenticados

### Para Desarrolladores

1. **Añadir nuevas secciones:**
   ```typescript
   // En config/sections-mapping.ts
   export const adminSectionsConfig: AdminSection[] = [
     {
       id: 'nueva-seccion',
       title: 'Nueva Sección',
       description: 'Descripción...',
       publicSections: ['pagina-relacionada'],
       tags: ['etiqueta1', 'etiqueta2'],
       icon: 'IconName',
       color: 'bg-color-600',
       hoverColor: 'hover:bg-color-700'
     }
   ]
   ```

2. **Usar componentes de navegación:**
   ```tsx
   import { NavigationHelper, AdminBreadcrumb } from 'path/to/NavigationHelper'
   
   // En página administrativa
   <NavigationHelper currentSection="team" />
   <AdminBreadcrumb items={[...]} />
   ```

3. **Añadir acceso rápido:**
   ```tsx
   import QuickAdminAccess from 'path/to/QuickAdminAccess'
   
   // En layout público
   <QuickAdminAccess isAuthenticated={isAuthenticated} />
   ```

## Beneficios

1. **Eficiencia**: Navegación rápida entre admin y público
2. **Claridad**: Mapeo visual de relaciones de contenido
3. **Usabilidad**: Acceso contextual a herramientas de edición
4. **Organización**: Etiquetado y categorización clara
5. **Productividad**: Menos clics para tareas comunes

## Extensiones Futuras

- [ ] Filtrado por etiquetas en panel admin
- [ ] Búsqueda de contenido por mapeo
- [ ] Vista previa en tiempo real
- [ ] Historial de cambios por sección
- [ ] Workflow de aprobación por tipo de contenido