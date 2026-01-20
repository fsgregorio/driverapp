-- Script para corrigir políticas RLS (Row Level Security) para permitir acesso aos instrutores
-- Execute este script no SQL Editor do Supabase

-- ============================================
-- PARTE 1: Verificar se RLS está habilitado
-- ============================================

-- Verificar status do RLS nas tabelas
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('instructors', 'profiles', 'instructor_availability')
ORDER BY tablename;

-- ============================================
-- PARTE 2: Habilitar RLS nas tabelas (se necessário)
-- ============================================

ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_availability ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PARTE 3: Remover políticas antigas (se existirem)
-- ============================================

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Instructors are viewable by everyone" ON instructors;
DROP POLICY IF EXISTS "Instructors are viewable by authenticated users" ON instructors;
DROP POLICY IF EXISTS "Public can view available instructors" ON instructors;
DROP POLICY IF EXISTS "Anyone can view available instructors" ON instructors;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Instructor profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Public can view instructor profiles" ON profiles;

DROP POLICY IF EXISTS "Availability is viewable by everyone" ON instructor_availability;
DROP POLICY IF EXISTS "Public can view instructor availability" ON instructor_availability;

-- ============================================
-- PARTE 4: Criar políticas RLS permissivas
-- ============================================

-- Política para instructors: Qualquer pessoa pode ver instrutores disponíveis
CREATE POLICY "Public can view available instructors"
ON instructors
FOR SELECT
USING (available = true);

-- Política para profiles: Qualquer pessoa pode ver perfis de instrutores
CREATE POLICY "Public can view instructor profiles"
ON profiles
FOR SELECT
USING (user_type = 'instructor');

-- Política para instructor_availability: Qualquer pessoa pode ver disponibilidade
CREATE POLICY "Public can view instructor availability"
ON instructor_availability
FOR SELECT
USING (true);

-- ============================================
-- PARTE 5: Verificar políticas criadas
-- ============================================

-- Listar todas as políticas criadas
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
WHERE schemaname = 'public'
AND tablename IN ('instructors', 'profiles', 'instructor_availability')
ORDER BY tablename, policyname;

-- ============================================
-- PARTE 6: Teste de acesso (opcional)
-- ============================================

-- Testar se consegue ver instrutores (deve retornar os 7 instrutores)
SELECT 
    i.id,
    i.available,
    i.price_per_class,
    p.name,
    p.user_type
FROM instructors i
LEFT JOIN profiles p ON i.id = p.id
WHERE i.available = true
LIMIT 10;

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Execute este script completo no SQL Editor
-- 2. Verifique se as políticas foram criadas corretamente
-- 3. Teste acessando a página de instrutores no frontend
-- 4. Se ainda não funcionar, verifique o console do navegador para erros
