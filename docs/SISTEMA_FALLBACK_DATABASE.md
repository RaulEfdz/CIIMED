# Sistema de Fallback para Base de Datos

## Descripción del Problema

Cuando la base de datos (Supabase) no está disponible, el sistema necesita seguir funcionando mostrando datos de respaldo y permitiendo cambios temporales que se mantengan hasta que la conexión se restablezca.

## Solución Implementada

### 1. Componentes del Sistema

#### A. Datos de Fallback (`/lib/fallback-data.ts`)
- Contiene datos por defecto para cuando la DB no esté disponible
- Incluye información institucional completa con valores seguros
- **NO modificar estos datos** - son solo para emergencias

#### B. Almacenamiento Temporal (`/lib/temp-storage.ts`)
- Sistema de persistencia local usando archivos JSON
- Guarda cambios realizados cuando la DB no está disponible
- Se merge automáticamente con los datos de fallback

#### C. Wrapper Seguro (`/lib/prisma-wrapper.ts`)
- Envuelve todas las llamadas a Prisma con manejo de errores
- Funciones principales:
  - `getInstitutionalInfoSafe()` - Obtiene datos con fallback
  - `updateInstitutionalInfoSafe()` - Actualiza con sistema temporal
  - `getSiteConfigSafe()` - Configuración del sitio

#### D. Componente SafeImage (`/components/admin/SafeImage.tsx`)
- Maneja imágenes que fallan al cargar (UploadThing/Supabase)
- Muestra placeholders informativos cuando hay errores
- Detecta URLs de servicios externos automáticamente

### 2. Flujo de Funcionamiento

```
1. Usuario hace cambio → API intenta guardar en DB
                     ↓
2. DB no disponible → Guardar en temp-storage.json
                     ↓
3. Mostrar cambios → Merge fallback + temp data
                     ↓
4. DB vuelve → Migrar cambios temporales a DB real
```

### 3. Archivos Importantes

```
/lib/
├── fallback-data.ts          # Datos de emergencia (NO TOCAR)
├── temp-storage.ts           # Sistema de almacenamiento temporal
├── prisma-wrapper.ts         # Wrappers seguros para DB
└── prisma.ts                # Cliente Prisma original

/components/admin/
├── SafeImage.tsx            # Componente seguro para imágenes
└── DatabaseStatus.tsx       # Monitor de estado (desactivado)

/temp-institutional-data.json  # Archivo temporal de cambios
```

### 4. Cómo Usar el Sistema

#### Para Desarrolladores:

**✅ USAR SIEMPRE:**
```typescript
// En lugar de prisma.institutionalInfo.findFirst()
const { institutionalInfo, error, usingFallback } = await getInstitutionalInfoSafe()

// En lugar de prisma.institutionalInfo.update()
const { institutionalInfo, error, usingFallback } = await updateInstitutionalInfoSafe(data)
```

**❌ NUNCA USAR DIRECTAMENTE:**
```typescript
// NO hacer esto
const info = await prisma.institutionalInfo.findFirst()
```

#### Para Administradores:

1. **Cambios durante DB offline** se guardan automáticamente
2. **Refrescar la página** mantiene los cambios
3. **Archivo temporal** se encuentra en: `temp-institutional-data.json`
4. **Cuando DB vuelva** - los cambios se migrarán automáticamente

### 5. Ubicaciones Actualizadas

#### APIs que usan sistema seguro:
- `/api/institutional/route.ts` - ✅ Actualizado
- `/api/news/route.ts` - ✅ Actualizado
- `/api/events/route.ts` - ✅ Actualizado
- `/api/team/route.ts` - ✅ Actualizado
- `/api/site-config/route.ts` - ⚠️ Pendiente actualizar

#### Componentes con SafeImage:
- ✅ `/app/admin/content/institutional/page.tsx`
- ✅ `/components/admin/SimpleImageUploader.tsx`
- ✅ `/app/admin/content/institutional/components/AboutMultimediaPreview.tsx`
- ✅ `/components/customs/Features/HeroImage.tsx`
- ✅ `/components/customs/Features/HistoryHero.tsx`
- ✅ `/app/about/AboutUsMissionVision.tsx`

### 6. Mantenimiento

#### Limpiar datos temporales (cuando DB vuelva):
```bash
# Eliminar archivo temporal después de migrar
rm temp-institutional-data.json
```

#### Verificar estado del sistema:
```bash
# Probar conexión a DB
node scripts/test-db-connection.js

# Ver datos temporales guardados
cat temp-institutional-data.json
```

#### Migrar cambios temporales a DB:
1. Verificar que DB esté disponible
2. Copiar contenido de `temp-institutional-data.json`
3. Aplicar cambios manualmente en panel admin
4. Eliminar archivo temporal

### 7. Logs y Debugging

#### Identificar problemas:
```typescript
// Los logs muestran:
console.warn('Database connection failed, using fallback data with temp changes')
console.log('Temporary institutional data saved')
```

#### Headers de respuesta:
- `X-Using-Fallback: true` - Indica que se usan datos temporales
- Status `503` - DB no disponible pero cambios aplicados localmente

### 8. Casos de Uso Reales

#### Scenario 1: Subir imagen cuando DB offline
1. Usuario sube imagen → Se guarda en `/uploads/`
2. Intenta guardar URL en DB → Falla
3. URL se guarda en `temp-institutional-data.json`
4. Usuario ve imagen inmediatamente
5. Al refrescar, imagen sigue visible

#### Scenario 2: DB vuelve online
1. Sistema detecta DB disponible
2. Cambios temporales se pueden migrar
3. Archivo temporal se puede eliminar
4. Sistema vuelve a modo normal

### 9. Troubleshooting

#### Problema: "Imágenes no aparecen después de subirlas"
**Solución:**
1. Verificar que exista: `temp-institutional-data.json`
2. Comprobar archivos en `/public/uploads/`
3. Revisar logs de consola del navegador

#### Problema: "Error interno del servidor al guardar"
**Solución:**
1. Verificar que se use `updateInstitutionalInfoSafe()` 
2. Revisar estructura de datos enviada
3. Comprobar permisos de escritura en directorio del proyecto

#### Problema: "Cambios se pierden al refrescar"
**Solución:**
1. Verificar que existe `temp-institutional-data.json`
2. Comprobar que `getInstitutionalInfoSafe()` se use en lugar de Prisma directo
3. Revisar merge de datos en el wrapper

### 10. Prevención

#### Para evitar este problema en el futuro:

1. **Monitorear Supabase**: Configurar alertas de disponibilidad
2. **Usar siempre wrappers seguros**: No llamar Prisma directamente
3. **Backup automático**: Implementar copias de seguridad regulares
4. **Testing de resiliencia**: Probar sistema sin DB periódicamente

#### Checklist antes de deploy:
- [ ] Todos los endpoints usan wrappers seguros
- [ ] Componentes de imagen usan SafeImage
- [ ] Archivos de fallback están actualizados
- [ ] Sistema de almacenamiento temporal funciona
- [ ] Logs y headers informativos están activos

## Resumen

Este sistema garantiza que CIIMED siga funcionando incluso cuando Supabase esté offline, manteniendo una experiencia de usuario fluida y preservando los cambios realizados durante interrupciones de servicio.