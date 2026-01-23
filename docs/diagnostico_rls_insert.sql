-- Script de diagnóstico para verificar políticas RLS de INSERT
-- Execute este script no SQL Editor do Supabase para diagnosticar o problema

-- ============================================
-- PARTE 1: Verificar se RLS está habilitado
-- ============================================
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'instructors')
ORDER BY tablename;

-- ============================================
-- PARTE 2: Listar TODAS as políticas RLS (SELECT, INSERT, UPDATE, DELETE)
-- ============================================
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
AND tablename IN ('profiles', 'instructors')
ORDER BY tablename, cmd, policyname;

-- ============================================
-- PARTE 3: Verificar especificamente políticas INSERT
-- ============================================
SELECT 
    tablename,
    policyname,
    cmd,
    roles,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'instructors')
AND cmd = 'INSERT'
ORDER BY tablename;

-- ============================================
-- PARTE 4: Verificar se há políticas conflitantes ou muito restritivas
-- ============================================
-- Se esta query retornar vazio, significa que NÃO há políticas INSERT
-- Se retornar algo, verifique se o with_check está correto
SELECT 
    tablename,
    policyname,
    with_check,
    CASE 
        WHEN with_check LIKE '%auth.uid()%' THEN 'OK - Usa auth.uid()'
        WHEN with_check IS NULL THEN 'ATENÇÃO - Sem restrição'
        ELSE 'VERIFICAR - Pode estar incorreto'
    END as status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles'
AND cmd = 'INSERT';
