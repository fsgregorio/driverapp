-- SOLUÇÃO ALTERNATIVA: Criar função que permite inserir perfil mesmo sem autenticação completa
-- Esta solução cria uma função que pode ser chamada pelo usuário recém-criado
-- Execute este script APÓS executar o script fix_rls_insert_policies.sql

-- ============================================
-- OPÇÃO 1: Política mais permissiva (permite inserir se o ID corresponde)
-- ============================================

-- Remover política anterior se existir
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Criar política que permite inserir perfil mesmo sem confirmação de email
-- Esta política verifica apenas se o ID do perfil corresponde ao ID do usuário criado
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Se ainda não funcionar, tente esta versão mais permissiva (CUIDADO: menos seguro)
-- Descomente apenas se a política acima não funcionar:
/*
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
WITH CHECK (true); -- PERMISSIVA DEMAIS - use apenas para testes
*/

-- ============================================
-- OPÇÃO 2: Usar função do banco de dados (RECOMENDADO)
-- ============================================

-- Criar função que insere o perfil usando SECURITY DEFINER
-- Isso permite que a função execute com privilégios elevados
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, name, phone, photo_url, profile_complete)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    '',
    '',
    NULL,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger que executa automaticamente quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- ============================================
-- OPÇÃO 3: Modificar código para usar service_role (NÃO RECOMENDADO para produção)
-- ============================================
-- Esta opção requer mudanças no código e não é segura
-- Não implementar a menos que seja absolutamente necessário

-- ============================================
-- Verificar se a função foi criada
-- ============================================
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user_profile';

-- Verificar se o trigger foi criado
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
AND trigger_name = 'on_auth_user_created';
