-- Adicionar colunas de avaliação à tabela classes
-- Esta migração adiciona as colunas rating e review para armazenar avaliações dos alunos

-- Adicionar coluna rating (número de 1 a 5)
ALTER TABLE classes
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);

-- Adicionar coluna review (texto opcional com comentário)
ALTER TABLE classes
ADD COLUMN IF NOT EXISTS review TEXT;

-- Adicionar comentários nas colunas para documentação
COMMENT ON COLUMN classes.rating IS 'Avaliação da aula pelo aluno (1 a 5 estrelas)';
COMMENT ON COLUMN classes.review IS 'Comentário opcional do aluno sobre a aula';

-- Criar índice para melhorar performance em consultas de avaliações
CREATE INDEX IF NOT EXISTS idx_classes_rating ON classes(rating) WHERE rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_classes_status_rating ON classes(status, rating) WHERE status = 'concluida' AND rating IS NOT NULL;
