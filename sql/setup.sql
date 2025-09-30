-- EJECUTAR EN SUPABASE SQL EDITOR

-- 1) Función de búsqueda vectorial
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  match_count int DEFAULT 5,
  version_filter text DEFAULT NULL
)
RETURNS TABLE (
  chunk_id text,
  content text,
  title text,
  url text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    dc.id::text as chunk_id,
    dc.content,
    d.title,
    d.url,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) as similarity
  FROM document_chunks dc
  JOIN documents d ON d.id = dc."documentId"
  WHERE (version_filter IS NULL OR d.metadata->>'version' = version_filter)
    AND dc.embedding IS NOT NULL
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 2) Función para estadísticas admin
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS jsonb
LANGUAGE sql STABLE
AS $$
  SELECT jsonb_build_object(
    'total_documents', (SELECT count(*) FROM documents),
    'total_chunks', (SELECT count(*) FROM document_chunks),
    'total_embeddings', (SELECT count(*) FROM document_chunks WHERE embedding IS NOT NULL),
    'last_updated', (SELECT max("updatedAt") FROM documents)
  );
$$;