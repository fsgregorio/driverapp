-- Política RLS para permitir que admins vejam TODAS as aulas
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos remover políticas existentes que possam estar limitando o acesso de admin
DROP POLICY IF EXISTS "Admins can view all classes" ON public.classes;

-- Criar política que permite admins verem todas as aulas
CREATE POLICY "Admins can view all classes"
ON public.classes
FOR SELECT
TO authenticated
USING (
  -- Verificar se o usuário é admin através do perfil
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
);

-- Política para permitir que admins atualizem qualquer aula
DROP POLICY IF EXISTS "Admins can update all classes" ON public.classes;

CREATE POLICY "Admins can update all classes"
ON public.classes
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
);

-- Verificar se as políticas foram criadas corretamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'classes'
ORDER BY policyname;
