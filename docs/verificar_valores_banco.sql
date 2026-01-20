-- ============================================
-- Script para VERIFICAR valores de total_classes no banco
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- para verificar se os valores estão corretos no banco

-- Verificar valores atuais
SELECT 
  p.name,
  i.id,
  i.total_classes,
  i.total_classes::text as total_classes_text,
  pg_typeof(i.total_classes) as tipo_dado,
  CASE 
    WHEN p.name = 'Roberto Oliveira' AND i.total_classes = 42 THEN '✅ CORRETO'
    WHEN p.name = 'Mariana Costa' AND i.total_classes = 26 THEN '✅ CORRETO'
    WHEN p.name = 'Carlos Silva' AND i.total_classes = 37 THEN '✅ CORRETO'
    WHEN p.name = 'Fernando Alves' AND i.total_classes = 18 THEN '✅ CORRETO'
    WHEN p.name = 'Ana Paula Santos' AND i.total_classes = 6 THEN '✅ CORRETO'
    WHEN p.name = 'João Pedro Lima' AND i.total_classes = 0 THEN '✅ CORRETO'
    WHEN p.name = 'Patricia Mendes' AND i.total_classes = 32 THEN '✅ CORRETO'
    ELSE '❌ INCORRETO'
  END as status
FROM profiles p
JOIN instructors i ON p.id = i.id
WHERE p.user_type = 'instructor'
ORDER BY p.name;

-- Verificar valores esperados vs atuais
SELECT 
  p.name,
  i.total_classes as valor_atual,
  CASE p.name
    WHEN 'Roberto Oliveira' THEN 42
    WHEN 'Mariana Costa' THEN 26
    WHEN 'Carlos Silva' THEN 37
    WHEN 'Fernando Alves' THEN 18
    WHEN 'Ana Paula Santos' THEN 6
    WHEN 'João Pedro Lima' THEN 0
    WHEN 'Patricia Mendes' THEN 32
    ELSE NULL
  END as valor_esperado,
  CASE 
    WHEN i.total_classes = CASE p.name
      WHEN 'Roberto Oliveira' THEN 42
      WHEN 'Mariana Costa' THEN 26
      WHEN 'Carlos Silva' THEN 37
      WHEN 'Fernando Alves' THEN 18
      WHEN 'Ana Paula Santos' THEN 6
      WHEN 'João Pedro Lima' THEN 0
      WHEN 'Patricia Mendes' THEN 32
      ELSE NULL
    END THEN '✅'
    ELSE '❌'
  END as status
FROM profiles p
JOIN instructors i ON p.id = i.id
WHERE p.user_type = 'instructor'
ORDER BY p.name;

-- Se algum valor estiver incorreto, execute o script adjust_instructor_classes.sql novamente
