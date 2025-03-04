-- supabase/migrations/20240301000000_create_documents_table.sql

-- Habilitar la extensión pgvector si aún no está activada
create extension if not exists vector;

-- Crear la tabla documents
create table documents (
  id uuid default gen_random_uuid() primary key,  -- Identificador único
  content text not null,  -- Contenido del documento
  metadata jsonb,  -- Metadatos opcionales
  embedding vector(1536)  -- Campo para almacenar los embeddings de OpenAI
);

-- Crear un índice para optimizar la búsqueda de similitud
create index on documents using ivfflat (embedding vector_cosine_ops);

-- Eliminar la función match_documents si ya existe
DROP FUNCTION IF EXISTS match_documents;

-- Crear la función match_documents con los parámetros esperados por LangChain
CREATE FUNCTION match_documents (
  query_embedding vector(1536),
  match_count int DEFAULT 10,
  filter jsonb DEFAULT '{}'
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity double precision
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE (filter = '{}'::jsonb OR metadata @> filter)
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
$$;


-- =====================================================
-- PASOS PARA CONFIGURAR SUPABASE CLI Y APLICAR MIGRACIÓN
-- =====================================================

-- 1. Instalar Supabase CLI si aún no lo tienes:
--    npm install -g supabase

-- 2. Inicializar Supabase en tu proyecto si aún no lo has hecho:
--    supabase init

-- 3. Iniciar sesión con tu cuenta de Supabase:
--    supabase login

-- 4. Vincular tu proyecto local con tu proyecto en Supabase:
--    supabase link --project-ref TU_REFERENCIA_DE_PROYECTO
--    (Puedes encontrar tu referencia de proyecto en la URL del dashboard de Supabase)

-- 5. Aplicar la migración usando uno de estos métodos:
--    - Aplicar todas las migraciones: supabase db push
--    - Aplicar solo esta migración: supabase migration up
--    - Con Docker local: npx supabase db reset
--    - Alternativa: npx supabase db migration apply

-- 6. Verificar que la migración se aplicó correctamente:
--    supabase db lint

-- NOTA: Si tienes problemas con la CLI, puedes copiar y pegar este SQL 
-- directamente en el Editor SQL del dashboard de Supabase.