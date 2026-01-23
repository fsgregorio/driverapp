-- Script para confirmar manualmente um usuário no Supabase
-- Execute este script no SQL Editor para confirmar um usuário específico

-- Substitua 'email@exemplo.com' pelo email do usuário que você quer confirmar
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'email@exemplo.com';

-- Verificar se foi confirmado
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users
WHERE email = 'email@exemplo.com';

-- Para confirmar TODOS os usuários pendentes (CUIDADO: use apenas em desenvolvimento)
-- Descomente a linha abaixo apenas se quiser confirmar todos:
-- UPDATE auth.users SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()) WHERE email_confirmed_at IS NULL;
