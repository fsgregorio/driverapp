-- Script para garantir que novos alunos não recebam foto padrão
-- Este script remove qualquer DEFAULT na coluna photo_url e garante que o trigger não defina foto padrão

-- ============================================
-- PARTE 1: Verificar se há DEFAULT na coluna photo_url
-- ============================================
SELECT 
    column_name,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
AND column_name = 'photo_url';

-- ============================================
-- PARTE 2: Remover DEFAULT se existir
-- ============================================
ALTER TABLE public.profiles 
ALTER COLUMN photo_url DROP DEFAULT;

-- ============================================
-- PARTE 3: Verificar e atualizar o trigger para garantir que não defina foto padrão
-- ============================================

-- Verificar se o trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
AND trigger_name = 'on_auth_user_created';

-- Recriar a função do trigger garantindo que photo_url seja NULL para alunos
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, name, phone, photo_url, profile_complete)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    '',
    '',
    NULL, -- SEMPRE NULL para novos usuários (sem foto padrão)
    false
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- ============================================
-- PARTE 4: Corrigir perfis existentes de alunos que tenham foto padrão
-- ============================================

-- Verificar quantos alunos têm foto padrão ou string vazia
SELECT 
    user_type,
    COUNT(*) as total,
    COUNT(CASE WHEN photo_url = '/imgs/users/image.png' THEN 1 END) as com_foto_padrao,
    COUNT(CASE WHEN photo_url = '' THEN 1 END) as com_string_vazia,
    COUNT(CASE WHEN photo_url IS NULL THEN 1 END) as sem_foto
FROM public.profiles
WHERE user_type = 'student'
GROUP BY user_type;

-- Remover foto padrão de alunos existentes (definir como NULL)
-- Também corrigir strings vazias
UPDATE public.profiles
SET photo_url = NULL
WHERE user_type = 'student'
AND (photo_url = '/imgs/users/image.png' OR photo_url = '' OR photo_url IS NULL);

-- ============================================
-- PARTE 5: Verificar se a correção funcionou
-- ============================================

-- Verificar se ainda há alunos com foto padrão ou string vazia
SELECT 
    id,
    user_type,
    name,
    photo_url
FROM public.profiles
WHERE user_type = 'student'
AND (photo_url = '/imgs/users/image.png' OR photo_url = '');

-- Se retornar 0 linhas, a correção foi bem-sucedida!

-- Verificar o DEFAULT da coluna novamente
SELECT 
    column_name,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
AND column_name = 'photo_url';

-- Resultado esperado:
-- column_default deve ser NULL (sem DEFAULT)
-- is_nullable deve ser true
