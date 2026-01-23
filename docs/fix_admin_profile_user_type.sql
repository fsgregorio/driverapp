-- Script para garantir que o perfil do admin tenha user_type = 'admin'
-- Execute este script no SQL Editor do Supabase

-- Atualizar o perfil do admin para ter user_type = 'admin'
-- Substitua 'admin@idrive.com' pelo email do seu usuário admin
UPDATE public.profiles
SET user_type = 'admin'
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'admin@idrive.com'
);

-- Verificar se foi atualizado corretamente
SELECT 
  p.id,
  p.name,
  p.user_type,
  u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'admin@idrive.com';

-- Se o perfil não existir, criar um perfil admin básico
-- (Execute apenas se o UPDATE acima não atualizou nenhuma linha)
INSERT INTO public.profiles (id, name, user_type, profile_complete)
SELECT 
  id,
  'Admin',
  'admin',
  true
FROM auth.users
WHERE email = 'admin@idrive.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.users.id
)
ON CONFLICT (id) DO UPDATE
SET user_type = 'admin';
