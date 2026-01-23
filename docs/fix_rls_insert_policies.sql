-- Script para corrigir políticas RLS (Row Level Security) para permitir INSERT em profiles e instructors
-- Execute este script no SQL Editor do Supabase
-- Este script é necessário para permitir que novos usuários criem seus perfis ao se registrarem

-- ============================================
-- PARTE 1: Verificar políticas RLS existentes
-- ============================================

-- Verificar políticas existentes para INSERT
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
AND cmd = 'INSERT'
ORDER BY tablename, policyname;

-- ============================================
-- PARTE 2: Remover políticas INSERT antigas (se existirem)
-- ============================================

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;

DROP POLICY IF EXISTS "Users can insert own instructor record" ON instructors;
DROP POLICY IF EXISTS "Authenticated users can insert instructors" ON instructors;
DROP POLICY IF EXISTS "Users can create own instructor record" ON instructors;

-- ============================================
-- PARTE 3: Criar políticas RLS para INSERT
-- ============================================

-- Política para profiles: Usuários autenticados podem inserir seu próprio perfil
-- O id do perfil deve corresponder ao auth.uid()
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Política para instructors: Usuários autenticados podem inserir seu próprio registro de instrutor
-- O id do instrutor deve corresponder ao auth.uid()
CREATE POLICY "Users can insert own instructor record"
ON instructors
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================
-- PARTE 4: Verificar políticas criadas
-- ============================================

-- Listar todas as políticas INSERT criadas
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
AND cmd = 'INSERT'
ORDER BY tablename, policyname;

-- ============================================
-- PARTE 5: Verificar se RLS está habilitado
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
-- FIM DO SCRIPT
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Execute este script completo no SQL Editor do Supabase
-- 2. Verifique se as políticas foram criadas corretamente (PARTE 4)
-- 3. Verifique se RLS está habilitado (PARTE 5)
-- 4. Teste criando uma nova conta no frontend
-- 5. Se ainda não funcionar, verifique o console do navegador para erros específicos
