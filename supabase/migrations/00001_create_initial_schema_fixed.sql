-- Create user_role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role public.user_role NOT NULL DEFAULT 'user'::public.user_role,
  created_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  total_posts integer NOT NULL,
  publish_date date NOT NULL,
  last_date date NOT NULL,
  important boolean DEFAULT false,
  apply_link text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create results table
CREATE TABLE public.results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name text NOT NULL,
  organization text NOT NULL,
  result_date date NOT NULL,
  description text NOT NULL,
  result_link text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create admit_cards table
CREATE TABLE public.admit_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name text NOT NULL,
  organization text NOT NULL,
  release_date date NOT NULL,
  exam_date date NOT NULL,
  download_link text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create answer_keys table
CREATE TABLE public.answer_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name text NOT NULL,
  release_date date NOT NULL,
  objection_last_date date NOT NULL,
  pdf_link text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_keys ENABLE ROW LEVEL SECURITY;

-- Create helper function for admin check
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Jobs policies (public read, admin write)
CREATE POLICY "Anyone can view jobs" ON jobs
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert jobs" ON jobs
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update jobs" ON jobs
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete jobs" ON jobs
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Results policies (public read, admin write)
CREATE POLICY "Anyone can view results" ON results
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert results" ON results
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update results" ON results
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete results" ON results
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Admit cards policies (public read, admin write)
CREATE POLICY "Anyone can view admit cards" ON admit_cards
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert admit cards" ON admit_cards
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update admit cards" ON admit_cards
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete admit cards" ON admit_cards
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Answer keys policies (public read, admin write)
CREATE POLICY "Anyone can view answer keys" ON answer_keys
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert answer keys" ON answer_keys
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update answer keys" ON answer_keys
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete answer keys" ON answer_keys
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Create trigger function for new user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for user confirmation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();