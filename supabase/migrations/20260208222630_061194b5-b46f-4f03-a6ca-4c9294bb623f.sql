-- Add email column to profiles
ALTER TABLE public.profiles ADD COLUMN email text;

-- Update trigger to store email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile with email
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  );
  
  -- Create progress record
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id);
  
  -- Create role if specified in metadata
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::app_role);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create a view for public profile info (email visible for identification)
CREATE VIEW public.public_profiles
WITH (security_invoker = on) AS
SELECT 
  user_id,
  first_name,
  last_name,
  email,
  avatar_url
FROM public.profiles;

-- Allow everyone to read public profiles (for challenge creator identification)
CREATE POLICY "Everyone can view public profiles"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;