-- Política RLS para permitir que admins vejam TODOS os perfis
-- Execute este script no SQL Editor do Supabase
-- IMPORTANTE: Esta versão evita recursão infinita usando uma função SECURITY DEFINER

-- Primeiro, criar uma função que verifica se o usuário é admin sem causar recursão
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_type_val TEXT;
BEGIN
  -- Buscar user_type diretamente sem passar por RLS (SECURITY DEFINER)
  SELECT p.user_type INTO user_type_val
  FROM public.profiles p
  WHERE p.id = auth.uid()
  LIMIT 1;
  
  RETURN user_type_val = 'admin';
END;
$$;

-- Remover política existente se houver
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Criar política que permite admins verem todos os perfis usando a função
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Usar a função que não causa recursão
  public.is_admin_user()
);

-- Verificar se a política foi criada
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
AND policyname = 'Admins can view all profiles';
