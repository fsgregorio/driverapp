# Corrigir Foto Padrão para Novos Alunos

## Problema
Novos alunos estão aparecendo com uma foto padrão (`/imgs/users/image.png`) quando deveriam aparecer sem foto.

## Causa
O problema pode estar em três lugares:
1. Um DEFAULT na coluna `photo_url` da tabela `profiles`
2. O trigger definindo uma foto padrão
3. Código do frontend usando string vazia `''` em vez de `null`, o que faz com que a verificação `if (photo)` seja verdadeira mesmo sem foto

## Solução

### Passo 1: Execute o script SQL

Execute o arquivo `fix_default_student_photo.sql` no SQL Editor do Supabase:

```sql
-- O script irá:
-- 1. Verificar e remover DEFAULT da coluna photo_url
-- 2. Atualizar o trigger para garantir que photo_url seja NULL
-- 3. Corrigir perfis existentes de alunos que tenham foto padrão ou string vazia
```

### Passo 1.5: Verificar código corrigido

O código do frontend foi corrigido para:
- `AuthContext.jsx`: Garantir que strings vazias e caminhos de foto padrão sejam convertidos para `null`
- `ProfileSettings.jsx`: Usar `null` em vez de string vazia e verificar se a foto é válida antes de renderizar
- `DashboardNavbar.jsx`: Verificar se a foto é válida (não vazia) antes de renderizar

### Passo 2: Verificar se funcionou

Após executar o script, crie uma nova conta de aluno e verifique se:
- O perfil é criado sem foto (photo_url = NULL)
- Na interface, aparece o ícone padrão (não uma foto)

### Passo 3: Testar

1. Crie uma nova conta de aluno
2. Verifique no banco de dados se `photo_url` é `NULL`
3. Verifique na interface se aparece o ícone padrão (não uma foto)

## Verificação Manual

Se quiser verificar manualmente:

```sql
-- Verificar se há DEFAULT na coluna
SELECT 
    column_name,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
AND column_name = 'photo_url';

-- Verificar alunos com foto padrão
SELECT 
    id,
    user_type,
    name,
    photo_url
FROM public.profiles
WHERE user_type = 'student'
AND photo_url = '/imgs/users/image.png';

-- Verificar o trigger
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
AND trigger_name = 'on_auth_user_created';
```

## Resultado Esperado

Após a correção:
- Novos alunos devem ter `photo_url = NULL`
- A interface deve mostrar o ícone padrão (SVG) quando não há foto
- Alunos existentes com foto padrão devem ter `photo_url = NULL`
