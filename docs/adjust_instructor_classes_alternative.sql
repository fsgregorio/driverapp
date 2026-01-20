-- ============================================
-- Script ALTERNATIVO para ajustar a quantidade de aulas dos instrutores
-- ============================================
-- Use este script se o script principal não funcionar
-- Execute este script no SQL Editor do Supabase Dashboard
-- 
-- Este script atualiza o campo total_classes diretamente usando JOIN

-- ============================================
-- ATUALIZAÇÕES DIRETAS COM JOIN
-- ============================================

-- Roberto Oliveira: 42 aulas
UPDATE instructors
SET total_classes = 42
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE instructors.id = u.id
  AND u.email = 'roberto.oliveira@teste.com'
  AND p.name = 'Roberto Oliveira';

-- Mariana Costa: 26 aulas
UPDATE instructors
SET total_classes = 26
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE instructors.id = u.id
  AND u.email = 'mariana.costa@teste.com'
  AND p.name = 'Mariana Costa';

-- Carlos Silva: 37 aulas
UPDATE instructors
SET total_classes = 37
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE instructors.id = u.id
  AND u.email = 'carlos.silva@teste.com'
  AND p.name = 'Carlos Silva';

-- Fernando Alves: 18 aulas
UPDATE instructors
SET total_classes = 18
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE instructors.id = u.id
  AND u.email = 'fernando.alves@teste.com'
  AND p.name = 'Fernando Alves';

-- Ana Paula Santos: 6 aulas
UPDATE instructors
SET total_classes = 6
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE instructors.id = u.id
  AND u.email = 'ana.santos@teste.com'
  AND p.name = 'Ana Paula Santos';

-- João Pedro Lima: 0 aulas
UPDATE instructors
SET total_classes = 0
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE instructors.id = u.id
  AND u.email = 'joao.lima@teste.com'
  AND p.name = 'João Pedro Lima';

-- Patricia Mendes: 32 aulas
UPDATE instructors
SET total_classes = 32
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE instructors.id = u.id
  AND u.email = 'patricia.mendes@teste.com'
  AND p.name = 'Patricia Mendes';

-- ============================================
-- VERIFICAÇÃO: Verificar os valores atualizados
-- ============================================
SELECT 
  p.name,
  u.email,
  i.total_classes,
  i.rating
FROM profiles p
JOIN instructors i ON p.id = i.id
JOIN auth.users u ON p.id = u.id
WHERE p.user_type = 'instructor'
ORDER BY p.name;

-- ============================================
-- DIAGNÓSTICO: Se ainda não funcionar
-- ============================================
-- Execute esta query para ver todos os instrutores e seus emails:
-- 
-- SELECT 
--   u.email,
--   p.name,
--   i.id,
--   i.total_classes,
--   i.rating
-- FROM auth.users u
-- LEFT JOIN profiles p ON u.id = p.id
-- LEFT JOIN instructors i ON u.id = i.id
-- WHERE u.email LIKE '%@teste.com'
-- ORDER BY p.name NULLS LAST;
--
-- Depois, você pode atualizar manualmente usando o ID diretamente:
-- UPDATE instructors SET total_classes = 42 WHERE id = 'UUID_DO_INSTRUTOR';

-- ============================================
-- FIM DO SCRIPT
-- ============================================
