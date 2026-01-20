-- ============================================
-- Script para ajustar a quantidade de aulas dos instrutores
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- 
-- Este script atualiza o campo total_classes na tabela instructors
-- com base nos emails dos instrutores

-- ============================================
-- PARTE 1: Criar função auxiliar para buscar UUID por email
-- ============================================
CREATE OR REPLACE FUNCTION get_instructor_id_by_email(instructor_email TEXT) RETURNS UUID AS $$
DECLARE
  instructor_uuid UUID;
BEGIN
  SELECT id INTO instructor_uuid
  FROM auth.users
  WHERE email = instructor_email
  LIMIT 1;
  
  IF instructor_uuid IS NULL THEN
    RAISE EXCEPTION 'Usuário com email % não encontrado. Crie o usuário primeiro em Authentication > Users', instructor_email;
  END IF;
  
  RETURN instructor_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PARTE 2: Atualizar total_classes para cada instrutor
-- ============================================

-- Roberto Oliveira: 42 aulas
DO $$
DECLARE
  instructor_id UUID;
BEGIN
  instructor_id := get_instructor_id_by_email('roberto.oliveira@teste.com');
  UPDATE instructors SET total_classes = 42 WHERE id = instructor_id;
  RAISE NOTICE 'Roberto Oliveira atualizado: % aulas (ID: %)', 42, instructor_id;
END $$;

-- Mariana Costa: 26 aulas
DO $$
DECLARE
  instructor_id UUID;
BEGIN
  instructor_id := get_instructor_id_by_email('mariana.costa@teste.com');
  UPDATE instructors SET total_classes = 26 WHERE id = instructor_id;
  RAISE NOTICE 'Mariana Costa atualizada: % aulas (ID: %)', 26, instructor_id;
END $$;

-- Carlos Silva: 37 aulas
DO $$
DECLARE
  instructor_id UUID;
BEGIN
  instructor_id := get_instructor_id_by_email('carlos.silva@teste.com');
  UPDATE instructors SET total_classes = 37 WHERE id = instructor_id;
  RAISE NOTICE 'Carlos Silva atualizado: % aulas (ID: %)', 37, instructor_id;
END $$;

-- Fernando Alves: 18 aulas
DO $$
DECLARE
  instructor_id UUID;
BEGIN
  instructor_id := get_instructor_id_by_email('fernando.alves@teste.com');
  UPDATE instructors SET total_classes = 18 WHERE id = instructor_id;
  RAISE NOTICE 'Fernando Alves atualizado: % aulas (ID: %)', 18, instructor_id;
END $$;

-- Ana Paula Santos: 6 aulas
DO $$
DECLARE
  instructor_id UUID;
BEGIN
  instructor_id := get_instructor_id_by_email('ana.santos@teste.com');
  UPDATE instructors SET total_classes = 6 WHERE id = instructor_id;
  RAISE NOTICE 'Ana Paula Santos atualizada: % aulas (ID: %)', 6, instructor_id;
END $$;

-- João Pedro Lima: 0 aulas
DO $$
DECLARE
  instructor_id UUID;
BEGIN
  instructor_id := get_instructor_id_by_email('joao.lima@teste.com');
  UPDATE instructors SET total_classes = 0 WHERE id = instructor_id;
  RAISE NOTICE 'João Pedro Lima atualizado: % aulas (ID: %)', 0, instructor_id;
END $$;

-- Patricia Mendes: 32 aulas
DO $$
DECLARE
  instructor_id UUID;
BEGIN
  instructor_id := get_instructor_id_by_email('patricia.mendes@teste.com');
  UPDATE instructors SET total_classes = 32 WHERE id = instructor_id;
  RAISE NOTICE 'Patricia Mendes atualizada: % aulas (ID: %)', 32, instructor_id;
END $$;

-- ============================================
-- VERIFICAÇÃO: Verificar os valores atualizados
-- ============================================
-- Execute esta query para verificar se os dados foram atualizados corretamente:
SELECT 
  p.name,
  p.id,
  i.total_classes,
  i.rating
FROM profiles p
JOIN instructors i ON p.id = i.id
WHERE p.user_type = 'instructor'
ORDER BY p.name;

-- Resultado esperado:
-- name                | total_classes | rating
-- --------------------|---------------|--------
-- Ana Paula Santos    | 6             | 4.8
-- Carlos Silva        | 37            | 4.8
-- Fernando Alves     | 18            | 4.6
-- João Pedro Lima     | 0             | 0.0
-- Mariana Costa       | 26            | 4.5
-- Patricia Mendes     | 32            | 4.1
-- Roberto Oliveira    | 42            | 5.0

-- ============================================
-- IMPORTANTE: Após executar o script
-- ============================================
-- 1. Verifique se a query acima mostra os valores corretos
-- 2. Se os valores estão corretos no banco mas ainda aparecem errados no frontend:
--    - Limpe o cache do navegador (Ctrl+Shift+Delete ou Cmd+Shift+Delete)
--    - Ou faça um hard refresh (Ctrl+F5 ou Cmd+Shift+R)
--    - Ou abra em uma janela anônima/privada
-- 3. Se os valores ainda estão errados no banco, verifique:
--    - Se os emails dos instrutores estão corretos
--    - Se os usuários existem na tabela auth.users
--    - Execute a query abaixo para verificar os emails:
--
-- SELECT 
--   u.email,
--   p.name,
--   i.total_classes
-- FROM auth.users u
-- LEFT JOIN profiles p ON u.id = p.id
-- LEFT JOIN instructors i ON u.id = i.id
-- WHERE u.email LIKE '%@teste.com'
-- ORDER BY p.name;

-- ============================================
-- FIM DO SCRIPT
-- ============================================
