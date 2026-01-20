-- ============================================
-- Script para VERIFICAR quantidade de aulas no banco
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- para verificar se a quantidade de aulas está correta

-- Substitua 'USER_ID_AQUI' pelo ID do usuário que você quer verificar
-- Você pode encontrar o ID do usuário na tabela auth.users ou profiles

-- Verificar total de aulas por aluno
SELECT 
  p.name as aluno_nome,
  p.id as aluno_id,
  COUNT(c.id) as total_aulas_banco,
  COUNT(CASE WHEN c.status = 'agendada' THEN 1 END) as agendadas,
  COUNT(CASE WHEN c.status = 'confirmada' THEN 1 END) as confirmadas,
  COUNT(CASE WHEN c.status = 'pendente_aceite' THEN 1 END) as pendentes_aceite,
  COUNT(CASE WHEN c.status = 'pendente_pagamento' THEN 1 END) as pendentes_pagamento,
  COUNT(CASE WHEN c.status = 'concluida' THEN 1 END) as concluidas,
  COUNT(CASE WHEN c.status = 'cancelada' THEN 1 END) as canceladas,
  COUNT(CASE WHEN c.status = 'pendente_avaliacao' THEN 1 END) as pendentes_avaliacao
FROM profiles p
LEFT JOIN classes c ON c.student_id = p.id
WHERE p.user_type = 'student'
GROUP BY p.id, p.name
ORDER BY total_aulas_banco DESC;

-- Verificar todas as aulas de um aluno específico (substitua o ID)
-- SELECT 
--   c.id,
--   c.status,
--   c.date,
--   c.time,
--   c.created_at,
--   p.name as aluno_nome,
--   i.name as instrutor_nome
-- FROM classes c
-- JOIN profiles p ON c.student_id = p.id
-- LEFT JOIN profiles i ON c.instructor_id = i.id
-- WHERE c.student_id = 'USER_ID_AQUI'  -- Substitua pelo ID do aluno
-- ORDER BY c.date DESC, c.time DESC;

-- Verificar se há aulas com status inválido ou NULL
SELECT 
  status,
  COUNT(*) as quantidade
FROM classes
GROUP BY status
ORDER BY quantidade DESC;

-- Verificar se há aulas sem student_id (problema de integridade)
SELECT COUNT(*) as aulas_sem_aluno
FROM classes
WHERE student_id IS NULL;

-- Verificar se há aulas duplicadas (mesmo aluno, instrutor, data e hora)
SELECT 
  student_id,
  instructor_id,
  date,
  time,
  COUNT(*) as duplicatas
FROM classes
GROUP BY student_id, instructor_id, date, time
HAVING COUNT(*) > 1;
