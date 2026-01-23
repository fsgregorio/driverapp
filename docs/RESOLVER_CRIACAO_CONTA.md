# Resolver Problema de Criação de Conta

## Problema
O botão de criar conta não está criando uma nova conta no banco de dados.

## Possíveis Causas

### 1. Políticas RLS (Row Level Security) bloqueando INSERT
O problema mais comum é que as políticas RLS estão configuradas apenas para SELECT (leitura), mas não para INSERT (inserção). Quando um usuário tenta criar uma conta, o código tenta inserir um registro na tabela `profiles` e possivelmente na tabela `instructors`, mas essas operações são bloqueadas pelas políticas RLS.

### 2. Confirmação de Email Habilitada
Se a confirmação de email estiver habilitada no Supabase, o usuário pode ser criado no `auth.users`, mas não estará autenticado até confirmar o email. Nesse caso, as políticas RLS que exigem `authenticated` não permitirão a inserção do perfil.

### 3. Erros não sendo exibidos corretamente
Os erros podem estar ocorrendo, mas não estão sendo exibidos ao usuário de forma clara.

## Solução

### Passo 1: Executar Script SQL para Políticas RLS

Execute o script `docs/fix_rls_insert_policies.sql` no SQL Editor do Supabase. Este script:

1. Remove políticas INSERT antigas (se existirem)
2. Cria políticas RLS que permitem que usuários autenticados insiram seus próprios perfis
3. Verifica se as políticas foram criadas corretamente

**IMPORTANTE**: Execute este script antes de testar a criação de contas.

### Passo 2: Verificar Configuração de Confirmação de Email

1. Acesse o Dashboard do Supabase
2. Vá em **Authentication** > **Settings**
3. Verifique a configuração **"Enable email confirmations"**
4. Se estiver habilitada, você tem duas opções:
   - **Opção A**: Desabilitar temporariamente para testes (não recomendado para produção)
   - **Opção B**: Manter habilitada e garantir que o código lide com usuários não confirmados

### Passo 3: Verificar Logs no Console

Com as melhorias feitas no código, agora você verá logs detalhados no console do navegador:

- `[Register] Starting registration for...` - Início do registro
- `[Register] Step 1: Calling signUp...` - Chamada ao Supabase
- `[Register] Step 2: User created successfully...` - Usuário criado
- `[Register] Step 3: Inserting profile...` - Tentativa de inserir perfil
- `[Register] Error inserting profile...` - Erro ao inserir perfil (se houver)

Se houver erros, eles serão exibidos no console com detalhes.

### Passo 4: Verificar Mensagens de Erro

As mensagens de erro agora são mais específicas e incluem:
- Mensagens detalhadas do Supabase
- Indicação de qual etapa falhou
- Códigos de erro específicos (como `23505` para violação de unicidade)

## Teste

1. Abra o console do navegador (F12)
2. Tente criar uma nova conta
3. Verifique os logs no console
4. Se houver erro, verifique:
   - Se o script SQL foi executado
   - Se as políticas RLS foram criadas corretamente
   - Se a confirmação de email está configurada corretamente

## Scripts Relacionados

- `docs/fix_rls_insert_policies.sql` - Adiciona políticas RLS para INSERT
- `docs/fix_rls_policies.sql` - Corrige políticas RLS para SELECT (já existente)

## Próximos Passos

Se o problema persistir após executar o script SQL:

1. Verifique os logs no console do navegador
2. Verifique as políticas RLS no Supabase (SQL Editor > Execute: `SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'instructors')`)
3. Verifique se o usuário está sendo criado em `auth.users` mas não em `profiles`
4. Entre em contato com o suporte se necessário
