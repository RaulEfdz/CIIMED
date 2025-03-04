-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Enable the uuid extension for generating UUIDs
create extension if not exists "uuid-ossp";

-- Create a table to store your documents with UUID as primary key
create table documents (
  id uuid default uuid_generate_v4() primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(1536) -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to search for documents
create function match_documents (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id uuid,
  content text,
  metadata jsonb,
  embedding jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    (embedding::text)::jsonb as embedding,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Grant public access for read and write
alter table documents enable row level security;
drop policy if exists public_access on documents;

create policy public_access
on documents
for all
using (true)
with check (true);

grant all privileges on table documents to public;
grant usage, select on all sequences in schema public to public;
