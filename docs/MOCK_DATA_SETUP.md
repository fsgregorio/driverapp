# Guia de Inserção de Dados Mock no Supabase

Este guia explica como inserir os dados mock (instrutores, classes, etc.) no banco de dados Supabase.

## Opção 1: Usando Script Node.js para Criar Usuários (Recomendado)

### Passos:

1. **Criar usuários via script (evita problemas de rate limiting)**
   ```bash
   node docs/create_users.js
   ```
   
   Este script cria todos os usuários automaticamente com delay entre requisições para evitar rate limiting.

2. **Execute a migração de campos (se necessário)**
   - Acesse: https://supabase.com/dashboard/project/odmwardaafuvbusmrseq
   - Vá em **SQL Editor**
   - Cole o conteúdo de `docs/migration_add_price_fields.sql`
   - Execute (este script adiciona os campos novos se não existirem)

3. **Execute o script SQL de dados mock**
   - Ainda no **SQL Editor**
   - Cole o conteúdo de `docs/insert_mock_data.sql`
   - Execute

4. **Execute o script para corrigir políticas RLS (IMPORTANTE)**
   - Ainda no **SQL Editor**
   - Cole o conteúdo de `docs/fix_rls_policies.sql`
   - Execute (este script permite acesso público aos instrutores)

## Opção 1B: Criar Usuários Manualmente (se o script falhar)

### Passos:

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/odmwardaafuvbusmrseq
   - Vá em **Authentication** > **Users** > **Add User**

2. **Criar usuários um por vez com intervalo**
   - Se aparecer erro "Failed to fetch", aguarde 10-30 segundos entre cada criação
   - Crie os seguintes usuários:

   **Instrutores:**
   - Email: `carlos.silva@teste.com` | Senha: `senha123`
   - Email: `ana.santos@teste.com` | Senha: `senha123`
   - Email: `roberto.oliveira@teste.com` | Senha: `senha123`
   - Email: `mariana.costa@teste.com` | Senha: `senha123`
   - Email: `joao.lima@teste.com` | Senha: `senha123`
   - Email: `patricia.mendes@teste.com` | Senha: `senha123`
   - Email: `fernando.alves@teste.com` | Senha: `senha123`

   **Aluno:**
   - Email: `aluno@teste.com` | Senha: `senha123`

3. **Execute a migração de campos (se necessário)**
   - Vá em **SQL Editor**
   - Cole o conteúdo de `docs/migration_add_price_fields.sql`
   - Execute (este script adiciona os campos novos se não existirem)

4. **Execute o script SQL de dados mock**
   - Ainda no **SQL Editor**
   - Cole o conteúdo de `docs/insert_mock_data.sql`
   - Execute

5. **Execute o script para corrigir políticas RLS (IMPORTANTE)**
   - Ainda no **SQL Editor**
   - Cole o conteúdo de `docs/fix_rls_policies.sql`
   - Execute (este script permite acesso público aos instrutores)

## Opção 2: Usando Script Node.js (Automático)

### Pré-requisitos:

1. Ter Node.js instalado
2. Ter `@supabase/supabase-js` instalado no projeto
3. Obter a **Service Role Key** do Supabase:
   - Dashboard > Settings > API > service_role key (secret)

### Passos:

1. **Configurar variável de ambiente**
   - Crie ou edite o arquivo `.env` na raiz do projeto
   - Adicione:
     ```
     SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
     ```

2. **Executar a migração de campos (se necessário)**
   - Acesse o Supabase Dashboard > SQL Editor
   - Cole o conteúdo de `docs/migration_add_price_fields.sql`
   - Execute (este script adiciona os campos novos se não existirem)

3. **Executar o script**
   ```bash
   node docs/insert_mock_data.js
   ```

   O script irá:
   - Criar automaticamente todos os usuários de autenticação
   - Criar os perfis (profiles)
   - Criar os registros de instrutores (instructors)
   - Criar a disponibilidade (instructor_availability)
   - Criar classes de exemplo (classes)

4. **Execute o script para corrigir políticas RLS (IMPORTANTE)**
   - Acesse o Supabase Dashboard > SQL Editor
   - Cole o conteúdo de `docs/fix_rls_policies.sql`
   - Execute (este script permite acesso público aos instrutores)

## Dados Inseridos

### 7 Instrutores:
1. **Carlos Silva** - R$ 120/aula - Premium
2. **Ana Paula Santos** - R$ 150/aula - Premium
3. **Roberto Oliveira** - R$ 100/aula
4. **Mariana Costa** - R$ 180/aula - Premium
5. **João Pedro Lima** - R$ 110/aula
6. **Patricia Mendes** - R$ 130/aula
7. **Fernando Alves** - R$ 140/aula - Premium

### 1 Aluno de Teste:
- **Francisco Gregório** - aluno@teste.com

### Classes de Exemplo:
- Várias classes com diferentes status (agendada, confirmada, pendente_aceite, etc.)

## Verificar Dados Inseridos

Execute no SQL Editor:

```sql
-- Ver todos os instrutores
SELECT p.name, i.price_per_class, i.rating, i.total_classes 
FROM profiles p
JOIN instructors i ON p.id = i.id
WHERE p.user_type = 'instructor';

-- Ver todas as classes
SELECT c.id, c.date, c.time, c.status, c.price,
       p_student.name as student_name,
       p_instructor.name as instructor_name
FROM classes c
JOIN profiles p_student ON c.student_id = p_student.id
JOIN profiles p_instructor ON c.instructor_id = p_instructor.id;

-- Ver disponibilidade dos instrutores
SELECT p.name, ia.day_of_week, ia.start_time, ia.end_time
FROM instructor_availability ia
JOIN profiles p ON ia.instructor_id = p.id
ORDER BY p.name, ia.day_of_week;
```

## Notas Importantes

- ⚠️ **Senhas padrão**: Todos os usuários de teste usam a senha `senha123`
- ⚠️ **Emails**: Use os emails fornecidos acima para login
- ⚠️ **UUIDs**: O script SQL usa UUIDs determinísticos baseados em números inteiros
- ⚠️ **Datas**: As classes de exemplo usam datas em 2026 - ajuste conforme necessário
- ⚠️ **Service Role Key**: Mantenha a Service Role Key segura e nunca a exponha no código do cliente

## Troubleshooting

### Erro: "Failed to fetch" ao criar usuários no dashboard
- **Causa**: Rate limiting ou problema temporário de conexão
- **Solução 1**: Aguarde 30-60 segundos e tente novamente
- **Solução 2**: Use o script `create_users.js` que tem delay automático entre requisições
- **Solução 3**: Crie os usuários em lotes menores (2-3 por vez) com intervalo entre lotes

### Erro: "duplicate key value violates unique constraint"
- Os dados já foram inseridos anteriormente
- Use `ON CONFLICT DO UPDATE` ou delete os dados existentes primeiro

### Erro: "foreign key constraint" ou "Key (id)=... is not present in table users"
- Certifique-se de criar os usuários auth.users ANTES de executar o script SQL
- O script SQL busca os usuários pelos emails, então eles precisam existir primeiro
- Verifique se todos os emails foram criados corretamente

### Erro: "permission denied" ou instrutores não aparecem na interface
- **Causa**: Políticas RLS (Row Level Security) bloqueando acesso
- **Solução**: Execute o script `docs/fix_rls_policies.sql` no SQL Editor do Supabase
- Este script cria políticas que permitem acesso público aos instrutores disponíveis
- Verifique o console do navegador (F12) para ver mensagens de erro específicas

### Instrutores existem no banco mas não aparecem na interface
- **Causa**: Políticas RLS bloqueando acesso ou campos faltando
- **Solução 1**: Execute `docs/fix_rls_policies.sql` para corrigir políticas RLS
- **Solução 2**: Execute `docs/migration_add_price_fields.sql` se os campos novos não existirem
- **Solução 3**: Verifique o console do navegador (F12) para logs detalhados
- **Solução 4**: Verifique se os instrutores estão marcados como `available = true`

### Erro: "Usuário com email X não encontrado"
- O usuário não foi criado ainda
- Crie o usuário primeiro em Authentication > Users
- Ou use o script `create_users.js` para criar todos de uma vez

## Limpar Dados Mock

Para remover todos os dados mock:

```sql
-- CUIDADO: Isso deletará todos os dados!
DELETE FROM classes;
DELETE FROM instructor_availability;
DELETE FROM instructors;
DELETE FROM profiles WHERE user_type IN ('instructor', 'student');
-- Depois delete os usuários em Authentication > Users no dashboard
```
