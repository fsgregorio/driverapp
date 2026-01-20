# Como Resolver Problema de Cache - Aulas dos Instrutores

## Problema
Os valores de `total_classes` estão corretos no banco de dados, mas não aparecem atualizados no aplicativo.

## Soluções Implementadas

### 1. Logs de Debug Adicionados
Adicionei logs no console do navegador para verificar os valores que estão sendo carregados:
- No `api.js`: logs mostram os valores de `total_classes` vindos do banco
- Nos componentes: logs mostram os valores finais de `totalClasses` exibidos

**Como verificar:**
1. Abra o Console do Desenvolvedor (F12)
2. Vá para a aba "Console"
3. Procure por mensagens como:
   - `📊 Total classes dos instrutores:`
   - `📋 Instrutor [nome]: totalClasses = [valor]`

### 2. Recarregamento Automático ao Ganhar Foco
Os componentes agora recarregam os dados quando a página ganha foco novamente.

**Como usar:**
1. Execute o script SQL para atualizar os valores no banco
2. Mude para outra aba do navegador
3. Volte para a aba da aplicação
4. Os dados devem ser recarregados automaticamente

## Soluções Manuais

### Solução 1: Hard Refresh (Mais Simples)
**Windows/Linux:**
- `Ctrl + F5` ou `Ctrl + Shift + R`

**Mac:**
- `Cmd + Shift + R`

### Solução 2: Limpar Cache do Navegador
1. Abra as configurações do navegador
2. Vá em "Privacidade e Segurança" > "Limpar dados de navegação"
3. Selecione "Imagens e arquivos em cache"
4. Selecione "Última hora" ou "Últimas 24 horas"
5. Clique em "Limpar dados"
6. Recarregue a página

### Solução 3: Modo Anônimo/Privado
1. Abra uma janela anônima/privada:
   - Chrome: `Ctrl + Shift + N` (Windows) ou `Cmd + Shift + N` (Mac)
   - Firefox: `Ctrl + Shift + P` (Windows) ou `Cmd + Shift + P` (Mac)
2. Acesse a aplicação
3. Verifique se os valores estão corretos

### Solução 4: Desabilitar Cache no DevTools
1. Abra o DevTools (F12)
2. Vá para a aba "Network" (Rede)
3. Marque a opção "Disable cache"
4. Mantenha o DevTools aberto
5. Recarregue a página (F5)

### Solução 5: Logout e Login
1. Faça logout da aplicação
2. Limpe o cache do navegador (Solução 2)
3. Faça login novamente
4. Os dados devem ser recarregados

## Verificação

### 1. Verificar no Banco de Dados
Execute esta query no Supabase SQL Editor:

```sql
SELECT 
  p.name,
  i.total_classes,
  i.rating
FROM profiles p
JOIN instructors i ON p.id = i.id
WHERE p.user_type = 'instructor'
ORDER BY p.name;
```

**Valores esperados:**
- Roberto Oliveira: 42
- Mariana Costa: 26
- Carlos Silva: 37
- Fernando Alves: 18
- Ana Paula Santos: 6
- João Pedro Lima: 0
- Patricia Mendes: 32

### 2. Verificar no Console do Navegador
1. Abra o Console (F12)
2. Procure pelos logs:
   - `📊 Total classes dos instrutores:`
   - `📋 Instrutor [nome]: totalClasses = [valor]`
3. Compare os valores com os esperados acima

### 3. Verificar na Interface
Os valores devem aparecer ao lado da avaliação (estrelas) de cada instrutor.

## Se Nada Funcionar

Se após tentar todas as soluções os valores ainda estiverem incorretos:

1. **Verifique os logs do console** - Os valores que aparecem nos logs são os que vêm do banco?
2. **Verifique a query do Supabase** - Execute a query de verificação acima
3. **Verifique se há erros** - Procure por erros no console do navegador
4. **Tente em outro navegador** - Para descartar problemas específicos do navegador

## Cache do Supabase

O Supabase pode ter cache em alguns casos. Se o problema persistir:

1. Aguarde alguns minutos após executar o script SQL
2. O cache do Supabase geralmente expira em 1-5 minutos
3. Tente novamente após alguns minutos

## Notas Técnicas

- Os valores são carregados diretamente da tabela `instructors.total_classes`
- Não há cálculo dinâmico no código
- O problema é sempre relacionado a cache (navegador ou Supabase)
- Os logs adicionados ajudam a identificar onde está o problema
