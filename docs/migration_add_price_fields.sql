-- Migração para adicionar campos de preço novos nas tabelas
-- Execute este script no SQL Editor do Supabase se os campos não existirem

-- ============================================
-- PARTE 1: Adicionar campos na tabela instructors
-- ============================================

-- Adicionar campo price_own_vehicle (preço quando aluno usa próprio veículo)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'instructors' 
        AND column_name = 'price_own_vehicle'
    ) THEN
        ALTER TABLE instructors ADD COLUMN price_own_vehicle NUMERIC(10, 2);
        RAISE NOTICE 'Campo price_own_vehicle adicionado à tabela instructors';
    ELSE
        RAISE NOTICE 'Campo price_own_vehicle já existe na tabela instructors';
    END IF;
END $$;

-- Adicionar campo home_service_price (preço adicional para busca em casa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'instructors' 
        AND column_name = 'home_service_price'
    ) THEN
        ALTER TABLE instructors ADD COLUMN home_service_price NUMERIC(10, 2);
        RAISE NOTICE 'Campo home_service_price adicionado à tabela instructors';
    ELSE
        RAISE NOTICE 'Campo home_service_price já existe na tabela instructors';
    END IF;
END $$;

-- ============================================
-- PARTE 2: Adicionar campo na tabela profiles
-- ============================================

-- Adicionar campo women_only (badge de aulas somente para mulheres)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'women_only'
    ) THEN
        ALTER TABLE profiles ADD COLUMN women_only BOOLEAN DEFAULT false;
        RAISE NOTICE 'Campo women_only adicionado à tabela profiles';
    ELSE
        RAISE NOTICE 'Campo women_only já existe na tabela profiles';
    END IF;
END $$;

-- ============================================
-- FIM DA MIGRAÇÃO
-- ============================================

-- Verificar se os campos foram criados corretamente
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'instructors' 
AND column_name IN ('price_own_vehicle', 'home_service_price')
UNION ALL
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND column_name = 'women_only';
