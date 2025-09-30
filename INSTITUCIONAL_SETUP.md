# Configuración de Información Institucional Dinámica

## Resumen
Se ha implementado un sistema completo para gestionar dinámicamente la información institucional de CIIMED desde la base de datos, reemplazando los datos fijos que estaban en el código.

## Cambios Implementados

### 1. Base de Datos (Prisma Schema)
- ✅ **Modelo expandido**: `InstitutionalInfo` en `prisma/schema.prisma`
- ✅ **Nuevos campos agregados**:
  - `subtitle` - Subtítulo para hero section
  - Redes sociales: `instagramUrl`, `linkedinUrl`, `youtubeUrl`, `spotifyUrl`
  - Características: `feature1Title`, `feature1Text`, `feature2Title`, `feature2Text`
  - `overlayColor` - Color del overlay para hero section

### 2. API Endpoints
- ✅ **Archivo**: `/app/api/institutional/route.ts`
- ✅ **Métodos**: GET (público), POST, PUT (admin)
- ✅ **Autenticación**: Admin requerido para POST/PUT
- ✅ **Validación**: Campos requeridos validados

### 3. Hook Personalizado
- ✅ **Archivo**: `/hooks/useInstitutionalInfo.ts`
- ✅ **Funcionalidad**: Obtiene datos, maneja loading/error
- ✅ **Cache**: Hook de React para evitar llamadas innecesarias

### 4. Página Principal Dinamizada
- ✅ **HeroSection**: `/app/Home/HeroSection.tsx` - Usa datos dinámicos
- ✅ **FeatureInit**: `/app/Home/FeatureInit.tsx` - Usa datos dinámicos
- ✅ **Fallbacks**: Datos por defecto si no hay información en DB
- ✅ **Generadores**: `generateHeroSectionData()` y `generateFeatureInitData()`

### 5. Panel de Administración
- ✅ **Página**: `/app/admin/content/institutional/page.tsx`
- ✅ **Modal**: Formulario completo para editar todos los campos
- ✅ **Secciones**: Información básica, redes sociales, características, configuración visual
- ✅ **Uploads**: Soporte para logo e imagen principal

## Datos Iniciales Creados

```javascript
{
  name: 'CIIMED | Centro de Investigación e Innovación Médica',
  description: 'Un referente en investigación y desarrollo en salud en Panamá',
  subtitle: 'Un referente en investigación y desarrollo en salud en Panamá',
  mission: 'Promover la investigación e innovación médica...',
  vision: 'Ser el centro de referencia en investigación médica...',
  values: ['Excelencia', 'Integridad', 'Innovación', 'Colaboración', 'Compromiso Social'],
  
  // Redes sociales
  instagramUrl: 'https://www.instagram.com/ciimedpanama/',
  linkedinUrl: 'https://www.linkedin.com/company/ciimed/posts/?feedView=all',
  youtubeUrl: 'https://www.youtube.com/channel/UCw525jjoG_HssaCxp4XJRow',
  spotifyUrl: 'https://open.spotify.com/show/6rPGtfqkc8iOK80k6KtyHD',
  
  // Características principales
  feature1Title: 'Investigación Avanzada',
  feature1Text: 'El centro está enfocado en el estudio de nuevas tecnologías...',
  feature2Title: 'Colaboraciones Estratégicas',
  feature2Text: 'Trabaja de manera conjunta con instituciones como SENACYT...',
  
  overlayColor: '#ffffff',
  status: 'ACTIVE'
}
```

## Guía para Configuraciones Futuras

### 1. Después de cambios en el esquema Prisma:
```bash
# Aplicar cambios a la base de datos
npx prisma db push

# O crear migración
npx prisma migrate dev --name descripcion_cambio

# Regenerar cliente
npx prisma generate
```

### 2. Si hay problemas con prepared statements:
```bash
# Limpiar y regenerar cliente
rm -rf lib/generated/prisma
npx prisma generate

# Si persiste, resetear DB (SOLO EN DESARROLLO)
npx prisma migrate reset --force
npx prisma db push
```

### 3. Crear datos iniciales:
```bash
# Usar el script de seed personalizado
node seed-institutional.js
```

### 4. Acceso al panel de administración:
- URL: `/admin/content/institutional`
- Requiere autenticación admin
- Permite crear/editar información institucional

### 5. Estructura de fallbacks:
- Si no hay datos en DB, usa valores por defecto
- Los componentes no fallan si la API no responde
- Loading states implementados

## Archivos Clave Modificados

1. **Schema**: `prisma/schema.prisma`
2. **API**: `app/api/institutional/route.ts`
3. **Hook**: `hooks/useInstitutionalInfo.ts`
4. **Componentes**: 
   - `app/Home/HeroSection.tsx`
   - `app/Home/FeatureInit.tsx`
   - `app/Home/data.tsx`
5. **Admin**: 
   - `app/admin/content/institutional/page.tsx`
   - `app/admin/content/institutional/components/EditInstitutionalModal.tsx`
   - `app/admin/content/institutional/components/types.ts`

## Estado Actual
- ✅ Base de datos resetada y sincronizada
- ✅ Datos iniciales creados
- ✅ Schema actualizado con todos los campos necesarios
- ✅ API endpoints funcionando
- ✅ Panel de administración completo
- ✅ Fallbacks implementados

## Próximos Pasos Recomendados
1. Verificar funcionamiento en navegador
2. Probar creación/edición desde panel admin
3. Validar que la página principal use datos dinámicos
4. Configurar backups regulares de datos institucionales