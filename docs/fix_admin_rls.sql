-- Script para garantir que o usuário admin possa ler seu próprio perfil
-- Execute este script no SQL Editor do Supabase

-- Verificar políticas RLS existentes na tabela profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Se não houver política que permita usuários lerem seu próprio perfil,
-- criar uma (ajuste conforme suas políticas existentes):

-- Exemplo de política que permite usuário ler seu próprio perfil:
-- (Ajuste se você já tem políticas diferentes)

-- DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
-- CREATE POLICY "Users can read own profile"
--   ON profiles
--   FOR SELECT
--   USING (auth.uid() = id);

-- Verificar se o perfil do admin existe e está correto:
SELECT 
  p.id,
  p.user_type,
  p.name,
  au.email
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE au.email = 'admin@idrive.com';

-- Se o perfil não existir ou user_type não for 'admin', execute:
-- (Ajuste o email se necessário)
INSERT INTO profiles (
  id,
  user_type,
  name,
  phone,
  photo_url,
  profile_complete,
  created_at,
  updated_at
)
SELECT 
  au.id,
  'admin',
  'Administrador',
  '',
  '/imgs/users/image.png',
  true,
  now(),
  now()
FROM auth.users au
WHERE au.email = 'admin@idrive.com'
ON CONFLICT (id) 
DO UPDATE SET
  user_type = 'admin',
  name = COALESCE(profiles.name, 'Administrador'),
  updated_at = now();
