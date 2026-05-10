CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.programs_documents_openai (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536)
);

CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5,
  filter JSONB DEFAULT '{}'
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    programs_documents_openai.id,
    programs_documents_openai.content,
    programs_documents_openai.metadata,
    1 - (programs_documents_openai.embedding <=> query_embedding) AS similarity
  FROM public.programs_documents_openai
  WHERE programs_documents_openai.metadata @> filter
  ORDER BY programs_documents_openai.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- مهم حتى Supabase يحدّث الكاش
NOTIFY pgrst, 'reload schema';