# 🛡️ Sistema de Fallback - Guía Rápida

## ¿Qué es esto?

Sistema que mantiene CIIMED funcionando cuando la base de datos (Supabase) no está disponible.

## 🚨 Problema Resuelto

**Antes:** Base de datos offline → Sitio roto, cambios perdidos  
**Ahora:** Base de datos offline → Sitio sigue funcionando, cambios se guardan temporalmente

## 📁 Archivos Importantes

- `temp-institutional-data.json` - Cambios temporales
- `docs/SISTEMA_FALLBACK_DATABASE.md` - Documentación completa
- `scripts/manage-fallback-system.js` - Herramientas de gestión

## 🔧 Comandos Útiles

```bash
# Verificar estado del sistema
node scripts/manage-fallback-system.js check

# Ver cambios temporales guardados
node scripts/manage-fallback-system.js show-temp

# Probar conexión a base de datos
node scripts/manage-fallback-system.js test-db

# Limpiar datos temporales (cuando DB vuelva)
node scripts/manage-fallback-system.js clear-temp
```

## 🎯 Para Usuarios Admin

1. **Cambios normales:** Funciona igual que siempre
2. **DB offline:** Los cambios se guardan temporalmente
3. **Refrescar página:** Los cambios se mantienen
4. **DB vuelve:** Aplicar cambios permanentemente desde el panel

## 🔄 Flujo Típico

1. Subir imagen → Se guarda en `/uploads/`
2. DB offline → URL se guarda en archivo temporal
3. Imagen visible inmediatamente
4. Refrescar → Imagen sigue ahí
5. DB vuelve → Migrar cambios del temporal

## ⚠️ Importante

- **NO borrar** `temp-institutional-data.json` sin migrar cambios
- **Verificar DB** antes de hacer cambios importantes
- **Hacer backup** de datos temporales importantes

---

📖 **Documentación completa:** `docs/SISTEMA_FALLBACK_DATABASE.md`