-- Criar tabela de sugestões
-- Esta migração cria a tabela para armazenar sugestões dos usuários

CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_type TEXT CHECK (user_type IN ('student', 'instructor', 'admin')),
  suggestion TEXT NOT NULL,
  source TEXT DEFAULT 'coupon_modal',
  page TEXT,
  section TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhorar performance em consultas
CREATE INDEX IF NOT EXISTS idx_suggestions_user_id ON suggestions(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_suggestions_created_at ON suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_user_type ON suggestions(user_type) WHERE user_type IS NOT NULL;

-- Adicionar comentários nas colunas para documentação
COMMENT ON TABLE suggestions IS 'Tabela para armazenar sugestões e feedback dos usuários';
COMMENT ON COLUMN suggestions.user_id IS 'ID do usuário que enviou a sugestão (pode ser NULL para sugestões anônimas)';
COMMENT ON COLUMN suggestions.user_type IS 'Tipo de usuário: student, instructor ou admin';
COMMENT ON COLUMN suggestions.suggestion IS 'Texto da sugestão do usuário';
COMMENT ON COLUMN suggestions.source IS 'Origem da sugestão (ex: coupon_modal, feedback_form)';
COMMENT ON COLUMN suggestions.page IS 'Página onde a sugestão foi enviada';
COMMENT ON COLUMN suggestions.section IS 'Seção da página onde a sugestão foi enviada';

-- Habilitar RLS (Row Level Security)
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Política RLS: Usuários podem inserir suas próprias sugestões
CREATE POLICY "Users can insert their own suggestions"
  ON suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Política RLS: Usuários podem ver suas próprias sugestões
CREATE POLICY "Users can view their own suggestions"
  ON suggestions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Política RLS: Admins podem ver todas as sugestões
CREATE POLICY "Admins can view all suggestions"
  ON suggestions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Política RLS: Permitir inserção anônima (para usuários não logados)
CREATE POLICY "Allow anonymous suggestions"
  ON suggestions
  FOR INSERT
  TO anon
  WITH CHECK (true);
