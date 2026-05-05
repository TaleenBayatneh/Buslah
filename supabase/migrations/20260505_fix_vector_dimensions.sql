-- Fix vector dimensions to match Google Gemini (768 dimensions)
-- Previous: 3072 dimensions (mismatched with embedding model)
-- New: 768 dimensions (matches Google Gemini embedding model)

-- Create or replace the match_programs function with correct dimensions
CREATE OR REPLACE FUNCTION public.match_programs(
  query_embedding vector(768),
  match_count int default 5,
  filter jsonb default '{}'
)
RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    programs_documents.id,
    programs_documents.content,
    programs_documents.metadata,
    1 - (programs_documents.embedding <=> query_embedding) as similarity
  FROM public.programs_documents
  WHERE programs_documents.metadata @> filter
  ORDER BY programs_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create or replace the match_documents function with correct dimensions
CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding vector(768),
  match_count int default 5,
  filter jsonb default '{}'
)
RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    programs_documents.id,
    programs_documents.content,
    programs_documents.metadata,
    1 - (programs_documents.embedding <=> query_embedding) as similarity
  FROM public.programs_documents
  WHERE programs_documents.metadata @> filter
  ORDER BY programs_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
