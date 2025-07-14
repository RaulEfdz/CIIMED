# 🛠️ Refactorización WYSIWYG y UX PRO en Administración

## Objetivo

Unificar la experiencia visual entre la vista pública y la administración, usando los mismos componentes de tarjeta y añadiendo controles administrativos (editar/eliminar) superpuestos, formularios modernos, validación visual, notificaciones (toasts) y estadísticas rápidas.

---

## Pasos realizados

### 1. Extracción del componente visual público

- Se identificó el bloque de JSX que renderizaba la tarjeta de miembro en la página pública (`components/customs/Features/Teams.tsx`).
- Se extrajo ese bloque a un componente reutilizable:  
  `components/customs/Cards/TeamMemberCard.tsx`
- Este componente acepta props para todos los campos relevantes:  
  `name`, `role`, `imageUrl`, `linkedinUrl`, `personalWebsite`, `bio`, etc.

### 2. Refactorización de la página de administración

- En `/admin/staff/page.tsx` se eliminó el renderizado antiguo de miembros (lista o tabla simple).
- Cada miembro ahora se renderiza usando `<TeamMemberCard {...props} />`, igual que en la vista pública.
- Cada tarjeta está envuelta en un `<li className="relative">`.
- Sobre cada tarjeta, en la esquina superior derecha, se superponen los controles de administración:
  - **Botón de Editar** (abre un modal con el formulario de edición).
  - **Botón de Eliminar** (confirma y elimina el miembro).

### 3. Modal de edición y formulario de alta

- El botón "Agregar nuevo miembro" abre un modal con el formulario.
- El formulario incluye todos los campos necesarios.
- Se añadió un botón **"Autorrellenar"** que llena el formulario con datos válidos aleatorios (ideal para pruebas).
- El modal de edición permite modificar todos los campos y actualiza la vista automáticamente.

### 4. Manejo de imágenes externas

- Para usar imágenes de `randomuser.me` (útil en pruebas), se agregó el dominio a la configuración de Next.js en `next.config.js`:

```js
const nextConfig = {
  images: {
    domains: ['randomuser.me'],
  },
};
module.exports = nextConfig;
```

### 5. Actualización automática

- Tras crear, editar o eliminar un miembro, la lista de tarjetas se refresca automáticamente, sin recargar la página.

---

## Mejoras de UX y patrón avanzado

### a) Formulario de alta/edición en modal

- El formulario de alta y edición se encuentra dentro de un modal (Dialog de Shadcn).
- El botón principal “Agregar nuevo miembro” abre el modal.
- El botón “Autorrellenar” sigue disponible dentro del modal para pruebas rápidas.

### b) Inputs obligatorios y validación visual

- Los campos requeridos (nombre, puesto, foto) muestran un asterisco rojo.
- Si intentas guardar sin completar los campos obligatorios, se marcan en rojo y aparece un mensaje de error.

### c) Notificaciones (toasts)

- Se creó un sistema de toasts simple y reutilizable (`components/ui/toast.tsx`).
- Cada vez que agregas, editas o eliminas, se muestra un toast de éxito o error según el resultado.

### d) Estadísticas rápidas

- Sobre la cuadrícula de tarjetas, se muestran tarjetas con:
  - Total de miembros
  - Total de activos
  - Total de inactivos

### e) Mejoras de Responsividad

- **Tarjeta de Miembro Responsiva**: Se modificó `TeamMemberCard.tsx` para que en pantallas pequeñas, la imagen y el texto se apilen verticalmente, mejorando la legibilidad.
- **Grid Adaptable**: En la página de administración de staff, se ajustó el grid para mostrar 2 columnas en pantallas grandes (`lg:grid-cols-2`) en lugar de 3. Esto hace que las tarjetas sean más anchas y fáciles de leer.

---

## ¿Cómo replicar este patrón en otras secciones?

1. **Extrae el componente visual público** que quieras reutilizar (por ejemplo, una tarjeta de proyecto, noticia, evento, etc.) a un archivo en `components/customs/Cards/`.
2. **Asegúrate de que reciba todos los datos por props** y no tenga lógica específica de contexto.
3. **Haz el componente de tarjeta responsivo**, ajustando su layout para pantallas pequeñas si es necesario.
4. **En la sección de administración**, usa ese componente para renderizar cada ítem.
5. **Usa un grid responsivo** para mostrar las tarjetas. Ajusta el número de columnas (`sm:grid-cols-2`, `lg:grid-cols-2`, etc.) para que las tarjetas tengan un tamaño adecuado en todas las pantallas.
6. **Envuelve cada tarjeta en un `<li className="relative">`** y superpone los controles de administración (editar/eliminar) usando `<div className="absolute top-2 right-2 flex gap-2 z-10">`.
7. **Implementa el modal de edición** reutilizando el mismo formulario para alta y edición.
8. **Agrega el botón "Autorrellenar"** si quieres facilitar las pruebas.
9. **Si usas imágenes externas nuevas, agrégalas en `next.config.js`**.
10. **Asegura que la vista se refresque automáticamente** tras cada acción.
11. **Incluye estadísticas rápidas** arriba de la lista/cuadrícula si aplica.
12. **Usa el provider y hook de toasts** para notificaciones en cada acción relevante.

---

## Beneficios

- **Consistencia visual absoluta** entre público y admin.
- **Mantenimiento centralizado** de estilos y lógica visual.
- **UX moderna** y gestión intuitiva para el administrador.
- **Fácil de extender** a any otra sección del admin.

---

## Ejemplo de estructura para otra sección

```tsx
<ToastProvider>
  {/* Estadísticas */}
  <div className="flex gap-4 mb-6">
    {/* ... */}
  </div>
  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
    <DialogTrigger asChild>
      <Button onClick={() => setModalOpen(true)}>Agregar nuevo item</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agregar nuevo item</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Campos con validación */}
        <DialogFooter>
          <Button type="submit">Guardar</Button>
          <Button type="button" onClick={autorrellenar}>Autorrellenar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  {/* Lista/cuadrícula de ítems */}
</ToastProvider>
```

---

¿Dudas o necesitas plantilla específica para otra entidad?  
¡Solo pídelo y te la armo!
