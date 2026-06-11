-- Create admin_emails table
CREATE TABLE IF NOT EXISTS public.admin_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  password TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Anyone can check if an email is admin (needed for signup/login forms)
CREATE POLICY "Anyone can check admin emails"
  ON public.admin_emails FOR SELECT
  USING (true);

-- Only admins can manage admin emails
CREATE POLICY "Admins can manage admin emails"
  ON public.admin_emails FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed admin emails
INSERT INTO public.admin_emails (email, name, password,username) VALUES
  ('mysarjo306@gmail.com', 'Miassar', 'mjfsh231','miassar'),
  ('omarazam138@gmail.com', 'Omar', 'omarpassword','omar'),
  ('taleenbayatneh0320@gmail.com', 'Taleen', 'taleenpassword','taleen')
ON CONFLICT (email) DO NOTHING;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
