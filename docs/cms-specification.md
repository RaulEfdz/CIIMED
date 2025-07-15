# Especificaciones del CMS CIIMED

## 1. Estructura de Datos

### 1.1 Noticia
```typescript
interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  imagen?: string; // URL de la imagen
  publicado: boolean;
  createdAt: Date;
}
```

### 1.2 Equipo de Trabajo
```typescript
interface EquipoDeTrabajo {
  id: number;
  nombre: string;
  puesto: string;
  bio?: string;
  imagenUrl?: string; // URL de la imagen
  categoria?: string;
  linkedinUrl?: string; // URL de LinkedIn
  personalWebsite?: string; // URL del sitio web personal
  activo: boolean;
  createdAt: Date;
}
```

### 1.3 Sucursal
```typescript
interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono?: string;
  horario?: string;
  mapaUrl?: string; // URL del mapa
  activo: boolean;
  createdAt: Date;
}
```

### 1.4 Banner
```typescript
interface Banner {
  id: number;
  titulo?: string;
  imagen: string; // URL de la imagen
  link?: string; // URL del link
  activo: boolean;
  createdAt: Date;
}
```

## 2. API Endpoints

### 2.1 Staff Management
```
GET /api/admin/staff - Lista todos los miembros del equipo
POST /api/admin/staff - Crea nuevo miembro
PUT /api/admin/staff/:id - Actualiza miembro
DELETE /api/admin/staff/:id - Elimina miembro
```

### 2.2 News Management
```
GET /api/news - Lista todas las noticias publicadas
POST /api/news - Crea nueva noticia
PUT /api/news/:id - Actualiza noticia
DELETE /api/news/:id - Elimina noticia
```

### 2.3 Branches Management
```
GET /api/branches - Lista todas las sucursales activas
POST /api/branches - Crea nueva sucursal
PUT /api/branches/:id - Actualiza sucursal
DELETE /api/branches/:id - Elimina sucursal
```

### 2.4 Banners Management
```
GET /api/banners - Lista todos los banners activos
POST /api/banners - Crea nuevo banner
PUT /api/banners/:id - Actualiza banner
DELETE /api/banners/:id - Elimina banner
```

## 3. Componentes Frontend

### 3.1 Teams Component
```typescript
interface TeamsProps {
  staff: EquipoDeTrabajo[];
}
```

### 3.2 News Component
```typescript
interface NewsProps {
  news: Noticia[];
}
```

### 3.3 Events Component
```typescript
interface EventsProps {
  events: Sucursal[];
}
```

### 3.4 HeroSection Component
```typescript
interface HeroSectionProps {
  banners: Banner[];
}
```

## 4. Requisitos de Implementación

### 4.1 Validaciones
- Todos los campos requeridos deben ser proporcionados
- Los campos opcionales pueden ser null/undefined
- Las URLs deben ser válidas
- Los tipos de datos deben coincidir con el esquema

### 4.2 Manejo de Errores
- Manejo de errores de API
- Manejo de estados de carga
- Mensajes de error claros
- Validación de tokens de autenticación

### 4.3 Estado de Componentes
```typescript
interface TeamState {
  staff: EquipoDeTrabajo[];
  loading: boolean;
  error: string | null;
}
```

## 5. Flujo de Datos

### 5.1 Obtención de Datos
1. API → Prisma Client → Base de datos
2. Base de datos → Prisma Client → API
3. API → Frontend Components

### 5.2 Actualización de Datos
1. Frontend → API
2. API → Prisma Client
3. Prisma Client → Base de datos

## 6. Consideraciones de Diseño

### 6.1 Responsive Design
- Diseño adaptable para móviles y desktop
- Grids flexibles
- Imágenes responsivas

### 6.2 Performance
- Carga diferida de imágenes
- Optimización de rutas
- Caching de datos

### 6.3 Seguridad
- Validación de tokens
- Protección contra XSS
- Protección contra inyecciones SQL
- Validación de datos en el backend

## 7. Mejoras Futuras

1. Sistema de categorías para noticias
2. Sistema de etiquetas
3. Sistema de comentarios
4. Sistema de galerías
5. Sistema de eventos programados
6. Sistema de suscripciones
7. Dashboard de estadísticas
