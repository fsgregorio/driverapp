-- Criar uma view para permitir que admins vejam emails dos usuários
-- Execute este script no SQL Editor do Supabase

-- Criar view que retorna id e email dos usuários
-- Isso permite que admins acessem emails através de RLS
CREATE OR REPLACE VIEW public.user_emails AS
SELECT 
  id,
  email
FROM auth.users;

-- Criar política RLS para a view (permitir apenas admins)
DROP POLICY IF EXISTS "Admins can view user emails" ON public.user_emails;

-- Nota: Views não suportam RLS diretamente, então vamos criar uma função ao invés
DROP VIEW IF EXISTS public.user_emails;

-- Criar função que retorna emails (mais seguro com RLS)
-- IMPORTANTE: Retornar TEXT ao invés de VARCHAR para evitar erro de tipo
CREATE OR REPLACE FUNCTION public.get_user_emails(user_ids UUID[])
RETURNS TABLE(id UUID, email TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin usando a função is_admin_user
  -- (que não causa recursão)
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Acesso negado. Apenas admins podem ver emails.';
  END IF;
  
  RETURN QUERY
  SELECT 
    au.id::UUID,
    au.email::TEXT
  FROM auth.users au
  WHERE au.id = ANY(user_ids);
END;
$$;

-- Testar a função (substitua os IDs pelos IDs reais dos alunos)
-- SELECT * FROM public.get_user_emails(ARRAY['user-id-1'::UUID, 'user-id-2'::UUID]);
