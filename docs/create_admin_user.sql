-- Script para criar usuário admin no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar o usuário na tabela auth.users (via Supabase Auth)
-- Nota: Você precisa criar o usuário através da interface do Supabase Auth ou API
-- Email: admin@drivetopass.com
-- Senha: 123456
-- 
-- Para criar via SQL (requer permissões de service_role):
-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   raw_app_meta_data,
--   raw_user_meta_data,
--   is_super_admin,
--   confirmation_token,
--   recovery_token
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'admin@drivetopass.com',
--   crypt('123456', gen_salt('bf')),
--   now(),
--   now(),
--   now(),
--   '{"provider":"email","providers":["email"]}',
--   '{}',
--   false,
--   '',
--   ''
-- );

-- 2. Após criar o usuário via Auth, atualizar o perfil na tabela profiles
-- Primeiro, obtenha o ID do usuário criado:
-- SELECT id FROM auth.users WHERE email = 'admin@drivetopass.com';

-- Depois, insira ou atualize o perfil (substitua USER_ID pelo ID obtido acima):
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
WHERE au.email = 'admin@drivetopass.com'
ON CONFLICT (id) 
DO UPDATE SET
  user_type = 'admin',
  name = COALESCE(profiles.name, 'Administrador'),
  updated_at = now();

-- 3. Verificar se o usuário foi criado corretamente
SELECT 
  au.id,
  au.email,
  p.user_type,
  p.name
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'admin@drivetopass.com';
