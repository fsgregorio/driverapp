-- ============================================
-- Script para ajustar as aulas do student_id específico
-- ============================================
-- Student ID: 39e4eb10-c577-48f4-9f7b-81b1338191ed
-- 
-- INSTRUÇÕES:
-- 1. Execute este script no SQL Editor do Supabase Dashboard
-- 2. Certifique-se de que existem instrutores no banco (execute insert_mock_data.sql primeiro se necessário)
-- 3. O script irá:
--    - Remover todas as aulas existentes deste student_id
--    - Inserir exatamente:
--      * 2 aulas agendadas (status = 'agendada')
--      * 2 pendentes de aceite (status = 'pendente_aceite')
--      * 1 pendente de pagamento (status = 'pendente_pagamento')
--      * 1 pendente de avaliação (status = 'pendente_avaliacao')
--      * 3 no histórico: 2 realizadas (status = 'concluida') e 1 cancelada (status = 'cancelada')
-- 
-- IMPORTANTE: Se os instrutores não existirem, o script tentará usar qualquer instrutor existente.
-- Se não houver instrutores, você precisará criar alguns primeiro ou ajustar os instructor_ids manualmente.

-- ============================================
-- PARTE 1: Remover todas as aulas existentes deste student_id
-- ============================================
DELETE FROM classes 
WHERE student_id = '39e4eb10-c577-48f4-9f7b-81b1338191ed';

-- ============================================
-- PARTE 2: Buscar instructor_ids válidos
-- ============================================
-- Vamos usar os instrutores existentes. Se não existirem, você precisará ajustar os UUIDs
-- ou criar os instrutores primeiro usando o script insert_mock_data.sql

-- Função auxiliar para buscar instructor_id por email (caso necessário)
CREATE OR REPLACE FUNCTION get_instructor_id_by_email(instructor_email TEXT) RETURNS UUID AS $$
DECLARE
  instructor_uuid UUID;
BEGIN
  SELECT id INTO instructor_uuid
  FROM auth.users
  WHERE email = instructor_email
  LIMIT 1;
  
  IF instructor_uuid IS NULL THEN
    -- Se não encontrar, busca qualquer instrutor existente como fallback
    SELECT i.id INTO instructor_uuid
    FROM instructors i
    LIMIT 1;
    
    -- Se ainda não encontrar, retorna NULL (causará erro, mas é melhor que UUID inválido)
    IF instructor_uuid IS NULL THEN
      RAISE EXCEPTION 'Nenhum instrutor encontrado. Execute primeiro o script insert_mock_data.sql ou ajuste os instructor_ids manualmente.';
    END IF;
  END IF;
  
  RETURN instructor_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PARTE 3: Inserir as aulas conforme especificado
-- ============================================
-- Os dados das aulas serão buscados automaticamente dos instrutores
-- (preço, veículo, localização, tipos de aula)

INSERT INTO classes (
  student_id, 
  instructor_id, 
  date, 
  time, 
  duration, 
  status, 
  price, 
  class_types, 
  car, 
  location, 
  pickup_type, 
  payment_status, 
  created_at
)
SELECT
  '39e4eb10-c577-48f4-9f7b-81b1338191ed'::UUID as student_id,
  cs.instructor_id,
  cs.class_date as date,
  cs.class_time as time,
  60 as duration,
  cs.class_status as status,
  COALESCE(i.price_per_class, 0) as price,
  COALESCE(p.class_types, ARRAY[]::TEXT[]) as class_types,
  COALESCE(p.vehicle, '') as car,
  -- Location simplificado: apenas bairro e cidade
  jsonb_build_object(
    'neighborhood', COALESCE(i.location->>'neighborhood', ''),
    'city', COALESCE(i.location->>'city', ''),
    'state', COALESCE(i.location->>'state', '')
  ) as location,
  cs.pickup_type_val as pickup_type,
  cs.payment_status_val as payment_status,
  cs.created_at_val as created_at
FROM (
  -- 2 AULAS AGENDADAS (status = 'agendada')
  SELECT 
    get_instructor_id_by_email('carlos.silva@teste.com') as instructor_id,
    (CURRENT_DATE + INTERVAL '3 days')::DATE as class_date,
    '10:00'::TIME as class_time,
    'agendada' as class_status,
    'vai_local' as pickup_type_val,
    'pago' as payment_status_val,
    NOW() - INTERVAL '2 days' as created_at_val
  UNION ALL
  SELECT 
    get_instructor_id_by_email('ana.santos@teste.com') as instructor_id,
    (CURRENT_DATE + INTERVAL '5 days')::DATE as class_date,
    '14:00'::TIME as class_time,
    'agendada' as class_status,
    'busca_casa' as pickup_type_val,
    'pago' as payment_status_val,
    NOW() - INTERVAL '1 day' as created_at_val
  
  UNION ALL
  -- 2 AULAS PENDENTES DE ACEITE (status = 'pendente_aceite')
  SELECT 
    get_instructor_id_by_email('roberto.oliveira@teste.com') as instructor_id,
    (CURRENT_DATE + INTERVAL '7 days')::DATE as class_date,
    '09:00'::TIME as class_time,
    'pendente_aceite' as class_status,
    'vai_local' as pickup_type_val,
    'pendente' as payment_status_val,
    NOW() - INTERVAL '3 hours' as created_at_val
  UNION ALL
  SELECT 
    get_instructor_id_by_email('mariana.costa@teste.com') as instructor_id,
    (CURRENT_DATE + INTERVAL '10 days')::DATE as class_date,
    '16:00'::TIME as class_time,
    'pendente_aceite' as class_status,
    'busca_casa' as pickup_type_val,
    'pendente' as payment_status_val,
    NOW() - INTERVAL '2 hours' as created_at_val
  
  UNION ALL
  -- 1 AULA PENDENTE DE PAGAMENTO (status = 'pendente_pagamento')
  SELECT 
    get_instructor_id_by_email('carlos.silva@teste.com') as instructor_id,
    (CURRENT_DATE + INTERVAL '4 days')::DATE as class_date,
    '15:00'::TIME as class_time,
    'pendente_pagamento' as class_status,
    'vai_local' as pickup_type_val,
    'pendente' as payment_status_val,
    NOW() - INTERVAL '1 day' as created_at_val
  
  UNION ALL
  -- 1 AULA PENDENTE DE AVALIAÇÃO (status = 'pendente_avaliacao')
  SELECT 
    get_instructor_id_by_email('roberto.oliveira@teste.com') as instructor_id,
    (CURRENT_DATE - INTERVAL '1 day')::DATE as class_date,
    '09:00'::TIME as class_time,
    'pendente_avaliacao' as class_status,
    'vai_local' as pickup_type_val,
    'pago' as payment_status_val,
    NOW() - INTERVAL '5 days' as created_at_val
  
  UNION ALL
  -- 2 AULAS REALIZADAS NO HISTÓRICO (status = 'concluida')
  SELECT 
    get_instructor_id_by_email('carlos.silva@teste.com') as instructor_id,
    (CURRENT_DATE - INTERVAL '7 days')::DATE as class_date,
    '16:00'::TIME as class_time,
    'concluida' as class_status,
    'vai_local' as pickup_type_val,
    'pago' as payment_status_val,
    NOW() - INTERVAL '10 days' as created_at_val
  UNION ALL
  SELECT 
    get_instructor_id_by_email('roberto.oliveira@teste.com') as instructor_id,
    (CURRENT_DATE - INTERVAL '10 days')::DATE as class_date,
    '09:00'::TIME as class_time,
    'concluida' as class_status,
    'vai_local' as pickup_type_val,
    'pago' as payment_status_val,
    NOW() - INTERVAL '13 days' as created_at_val
  
  UNION ALL
  -- 1 AULA CANCELADA NO HISTÓRICO (status = 'cancelada')
  SELECT 
    get_instructor_id_by_email('mariana.costa@teste.com') as instructor_id,
    (CURRENT_DATE - INTERVAL '5 days')::DATE as class_date,
    '10:00'::TIME as class_time,
    'cancelada' as class_status,
    'busca_casa' as pickup_type_val,
    'reembolsado' as payment_status_val,
    NOW() - INTERVAL '8 days' as created_at_val
) cs
LEFT JOIN instructors i ON cs.instructor_id = i.id
LEFT JOIN profiles p ON cs.instructor_id = p.id;

-- ============================================
-- VERIFICAÇÃO: Contar aulas por status
-- ============================================
-- Execute esta query para verificar se os dados foram inseridos corretamente:
-- 
-- SELECT 
--   status,
--   COUNT(*) as quantidade
-- FROM classes
-- WHERE student_id = '39e4eb10-c577-48f4-9f7b-81b1338191ed'
-- GROUP BY status
-- ORDER BY 
--   CASE status
--     WHEN 'agendada' THEN 1
--     WHEN 'pendente_aceite' THEN 2
--     WHEN 'pendente_pagamento' THEN 3
--     WHEN 'pendente_avaliacao' THEN 4
--     WHEN 'concluida' THEN 5
--     WHEN 'cancelada' THEN 6
--     ELSE 7
--   END;
--
-- Resultado esperado:
-- status              | quantidade
-- --------------------|------------
-- agendada            | 2
-- pendente_aceite     | 2
-- pendente_pagamento  | 1
-- pendente_avaliacao  | 1
-- concluida           | 2
-- cancelada           | 1

-- ============================================
-- FIM DO SCRIPT
-- ============================================
