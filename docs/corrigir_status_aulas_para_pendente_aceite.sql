-- Script para corrigir o status das aulas que foram criadas incorretamente
-- IMPORTANTE: Execute este script no SQL Editor do Supabase
-- Este script atualiza aulas que foram criadas com status 'agendada' mas deveriam estar 'pendente_aceite'

-- ============================================
-- PARTE 1: Verificar aulas que precisam ser corrigidas
-- ============================================

-- Ver aulas que estão com status 'agendada' mas têm payment_status 'pendente'
-- Essas aulas deveriam estar 'pendente_aceite' porque ainda não foram pagas
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
WHERE status = 'agendada'
AND payment_status = 'pendente'
ORDER BY created_at DESC;

-- Contar quantas aulas precisam ser corrigidas
SELECT COUNT(*) as total_a_corrigir
FROM classes
WHERE status = 'agendada'
AND payment_status = 'pendente';

-- ============================================
-- PARTE 2: Corrigir o status das aulas
-- ============================================

-- ATENÇÃO: Descomente a linha abaixo para executar a correção
-- Esta query atualiza todas as aulas que estão 'agendada' mas têm payment_status 'pendente'
-- para o status correto 'pendente_aceite'

UPDATE classes
SET 
    status = 'pendente_aceite',
    updated_at = NOW()
WHERE status = 'agendada'
AND payment_status = 'pendente';

-- ============================================
-- PARTE 3: Verificar o resultado
-- ============================================

-- Verificar a distribuição de status após a correção
SELECT 
    status,
    COUNT(*) as quantidade
FROM classes
GROUP BY status
ORDER BY quantidade DESC;

-- Verificar se ainda há aulas com status incorreto
SELECT 
    id,
    status,
    payment_status,
    created_at
FROM classes
WHERE status = 'agendada'
AND payment_status = 'pendente';

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Execute a PARTE 1 para ver quantas aulas precisam ser corrigidas
-- 2. Se estiver tudo certo, descomente a linha UPDATE na PARTE 2 e execute
-- 3. Execute a PARTE 3 para verificar se a correção funcionou
-- 4. Teste criando uma nova aula e verifique se ela aparece em "Pendentes de Aceite"
