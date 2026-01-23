-- Script para verificar e corrigir o status das aulas no banco de dados
-- Execute este script no SQL Editor do Supabase

-- ============================================
-- PARTE 1: Verificar status atual das aulas
-- ============================================

-- Ver todas as aulas e seus status
SELECT 
    id,
    student_id,
    instructor_id,
    date,
    time,
    status,
    payment_status,
    created_at,
    updated_at
FROM classes
ORDER BY created_at DESC
LIMIT 20;

-- Contar aulas por status
SELECT 
    status,
    COUNT(*) as quantidade
FROM classes
GROUP BY status
ORDER BY quantidade DESC;

-- ============================================
-- PARTE 2: Verificar se há trigger ou constraint alterando o status
-- ============================================

-- Verificar triggers na tabela classes
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'classes';

-- Verificar constraints na coluna status
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'classes'::regclass
AND conname LIKE '%status%';

-- Verificar se há DEFAULT na coluna status
SELECT 
    column_name,
    column_default,
    data_type
FROM information_schema.columns
WHERE table_name = 'classes'
AND column_name = 'status';

-- ============================================
-- PARTE 3: Corrigir aulas que foram criadas incorretamente
-- ============================================

-- IMPORTANTE: Apenas execute esta parte se você tiver certeza de que quer alterar os dados
-- Descomente as linhas abaixo para executar

-- Atualizar aulas que foram criadas recentemente (últimas 24 horas) e estão com status 'agendada'
-- mas deveriam estar 'pendente_aceite' (aulas que ainda não foram pagas)
-- UPDATE classes
-- SET status = 'pendente_aceite',
--     updated_at = NOW()
-- WHERE status = 'agendada'
-- AND payment_status = 'pendente'
-- AND created_at > NOW() - INTERVAL '24 hours';

-- Verificar o resultado da atualização
-- SELECT 
--     status,
--     COUNT(*) as quantidade
-- FROM classes
-- GROUP BY status
-- ORDER BY quantidade DESC;

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Execute a PARTE 1 para ver o status atual das aulas
-- 2. Execute a PARTE 2 para verificar se há triggers/constraints alterando o status
-- 3. Se necessário, execute a PARTE 3 para corrigir aulas incorretas
-- 4. Verifique os logs no console do navegador ao criar uma nova aula
