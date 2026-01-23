# Solução Definitiva para Erro RLS na Criação de Conta

## Problema Identificado
O erro `new row violates row-level security policy for table "profiles"` (código 42501, HTTP 401) indica que:
1. O usuário está sendo criado com sucesso ✅
2. Mas a inserção do perfil está sendo bloqueada por RLS ❌

## Diagnóstico Passo a Passo

### Passo 1: Verificar se as políticas foram criadas

Execute este comando no SQL Editor:

```sql
SELECT 
    tablename,
    policyname,
    cmd,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles'
AND cmd = 'INSERT';
```

**Resultado esperado:** Deve retornar pelo menos uma política chamada "Users can insert own profile"

**Se não retornar nada:** As políticas não foram criadas. Execute novamente o script `fix_rls_insert_policies.sql`

### Passo 2: Verificar se RLS está habilitado

```sql
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'profiles';
```

**Resultado esperado:** `rls_enabled` deve ser `true`

### Passo 3: Verificar se o problema é confirmação de email

O erro HTTP 401 pode indicar que o usuário não está autenticado quando tenta inserir o perfil.

**Solução Recomendada:** Usar um trigger do banco de dados que cria o perfil automaticamente quando o usuário é criado.

## Solução: Trigger Automático (RECOMENDADO)

Esta solução cria o perfil automaticamente quando um usuário é criado, evitando problemas de RLS.

### Execute este script no SQL Editor:

```sql
-- Criar função que insere o perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, name, phone, photo_url, profile_complete)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    '',
    '',
    NULL,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger que executa quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();
```

### Vantagens desta solução:
- ✅ Funciona mesmo com confirmação de email habilitada
- ✅ Não depende de políticas RLS para INSERT
- ✅ Cria o perfil automaticamente
- ✅ Mais seguro e confiável

### Depois de executar o trigger, modifique o código:

Como o perfil será criado automaticamente pelo trigger, você precisa modificar o código para não tentar criar o perfil manualmente, ou verificar se já existe antes de criar.

## Solução Alternativa: Modificar Política RLS

Se preferir manter a criação manual do perfil, tente esta política mais permissiva:

```sql
-- Remover política anterior
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Criar política que permite inserir mesmo sem confirmação completa
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Se ainda não funcionar, verifique se o usuário está realmente autenticado
-- O problema pode ser que signUp não autentica o usuário se confirmação de email estiver habilitada
```

## Verificar se funcionou

Após executar a solução escolhida:

1. Tente criar uma nova conta
2. Verifique o console do navegador
3. Se ainda houver erro, verifique:
   - Se o trigger foi criado: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`
   - Se a função foi criada: `SELECT * FROM information_schema.routines WHERE routine_name = 'handle_new_user_profile';`

## Próximos Passos

1. **Execute o script de diagnóstico** (`diagnostico_rls_insert.sql`) para entender o estado atual
2. **Escolha uma solução:**
   - **Opção A (Recomendada):** Usar trigger automático
   - **Opção B:** Ajustar políticas RLS
3. **Teste criando uma nova conta**
4. **Se ainda não funcionar:** Compartilhe os resultados do diagnóstico
