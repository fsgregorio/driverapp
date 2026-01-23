-- Adicionar coluna email na tabela profiles e sincronizar com auth.users
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar coluna email na tabela profiles (se não existir)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Criar função para sincronizar email do auth.users para profiles
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atualizar o email no perfil quando o email do usuário mudar
  UPDATE public.profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- 3. Criar trigger para sincronizar automaticamente
DROP TRIGGER IF EXISTS sync_email_on_user_update ON auth.users;
CREATE TRIGGER sync_email_on_user_update
AFTER INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_email();

-- 4. Sincronizar emails existentes do auth.users para profiles
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id
AND (p.email IS NULL OR p.email != au.email);

-- 5. Verificar se os emails foram sincronizados
SELECT 
  p.id,
  p.name,
  p.email as email_profile,
  au.email as email_auth,
  CASE 
    WHEN p.email = au.email THEN 'Sincronizado'
    WHEN p.email IS NULL THEN 'Falta sincronizar'
    ELSE 'Diferente'
  END as status
FROM public.profiles p
JOIN auth.users au ON au.id = p.id
LIMIT 10;
