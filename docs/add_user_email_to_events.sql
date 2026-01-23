-- Adicionar coluna user_email à tabela events
-- Esta coluna armazenará o email do usuário quando disponível

-- Verificar se a coluna já existe antes de adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'events' 
        AND column_name = 'user_email'
    ) THEN
        ALTER TABLE public.events 
        ADD COLUMN user_email TEXT;
        
        RAISE NOTICE 'Coluna user_email adicionada à tabela events';
    ELSE
        RAISE NOTICE 'Coluna user_email já existe na tabela events';
    END IF;
END $$;

-- Criar índice para melhorar performance de buscas por email
CREATE INDEX IF NOT EXISTS idx_events_user_email ON public.events(user_email);

-- Comentário na coluna
COMMENT ON COLUMN public.events.user_email IS 'Email do usuário associado ao evento (quando disponível)';

-- Atualizar eventos existentes que têm user_id mas não têm user_email
-- Buscar email do auth.users ou profiles
UPDATE public.events e
SET user_email = COALESCE(
    (SELECT email FROM auth.users WHERE id = e.user_id),
    (SELECT email FROM public.profiles WHERE id = e.user_id)
)
WHERE e.user_id IS NOT NULL 
  AND e.user_email IS NULL
  AND (
    EXISTS (SELECT 1 FROM auth.users WHERE id = e.user_id)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = e.user_id)
  );

-- Mostrar quantos eventos foram atualizados
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO updated_count
    FROM public.events
    WHERE user_id IS NOT NULL AND user_email IS NOT NULL;
    
    RAISE NOTICE 'Total de eventos com email: %', updated_count;
END $$;
