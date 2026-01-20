# Diagnóstico: Quantidade de Aulas na Interface vs Banco

## Problema
A quantidade de aulas mostradas na interface não corresponde à quantidade no banco de dados.

## Soluções Implementadas

### 1. Logs de Debug Adicionados
Adicionei logs detalhados em vários pontos do código para rastrear a quantidade de aulas:

#### No `api.js`:
- **`getClasses()`**: Loga o total de aulas encontradas no banco, quantidade por status, e IDs das aulas
- **`getIndicators()`**: Loga o total de aulas usadas para calcular indicadores

#### No `DashboardAluno.jsx`:
- Loga quando as aulas são carregadas
- Mostra quantidade por status após carregamento
- Recarrega automaticamente quando a página ganha foco

#### No `ClassControl.jsx`:
- Loga a quantidade total de aulas e quantidade por tab (agendadas, pendentes, etc.)
- Mostra IDs e status de todas as aulas

#### No `HomeSection.jsx`:
- Loga a quantidade de aulas recebidas e os indicadores calculados

### 2. Recarregamento Automático
- As aulas são recarregadas automaticamente quando a página ganha foco (quando você volta para a aba)
- Isso ajuda a atualizar os dados se houver mudanças no banco

### 3. Cache Buster
- Adicionei timestamps nas queries para evitar cache do Supabase
- Isso força uma busca sempre atualizada do banco

## Como Verificar o Problema

### Passo 1: Verificar no Console do Navegador
1. Abra o Console do Desenvolvedor (F12)
2. Vá para a aba "Console"
3. Procure por mensagens como:
   - `📚 Buscando aulas do aluno: [ID]`
   - `✅ Total de aulas encontradas no banco: [NÚMERO]`
   - `📊 Aulas por status: {...}`
   - `📊 ClassControl - Quantidade de aulas: {...}`
   - `📊 HomeSection - Quantidade de aulas: {...}`

### Passo 2: Verificar no Banco de Dados
Execute o script `verificar_quantidade_aulas.sql` no Supabase SQL Editor:

```sql
-- Ver total de aulas por aluno
SELECT 
  p.name as aluno_nome,
  p.id as aluno_id,
  COUNT(c.id) as total_aulas_banco,
  COUNT(CASE WHEN c.status = 'agendada' THEN 1 END) as agendadas,
  COUNT(CASE WHEN c.status = 'confirmada' THEN 1 END) as confirmadas,
  COUNT(CASE WHEN c.status = 'pendente_aceite' THEN 1 END) as pendentes_aceite,
  COUNT(CASE WHEN c.status = 'pendente_pagamento' THEN 1 END) as pendentes_pagamento,
  COUNT(CASE WHEN c.status = 'concluida' THEN 1 END) as concluidas,
  COUNT(CASE WHEN c.status = 'cancelada' THEN 1 END) as canceladas
FROM profiles p
LEFT JOIN classes c ON c.student_id = p.id
WHERE p.user_type = 'student'
GROUP BY p.id, p.name
ORDER BY total_aulas_banco DESC;
```

### Passo 3: Comparar Valores
Compare:
1. **Total no banco** (do script SQL) vs **Total no console** (`✅ Total de aulas encontradas no banco`)
2. **Quantidade por status no banco** vs **Quantidade por status no console** (`📊 Aulas por status`)
3. **Quantidade exibida na interface** vs **Quantidade no console** (`📊 ClassControl - Quantidade de aulas`)

## Possíveis Causas

### 1. Cache do Navegador
**Solução**: 
- Faça um hard refresh: `Ctrl + F5` (Windows) ou `Cmd + Shift + R` (Mac)
- Ou limpe o cache do navegador

### 2. Cache do Supabase
**Solução**: 
- Os logs agora incluem cache busters, mas se o problema persistir:
- Aguarde 1-5 minutos após mudanças no banco
- O cache do Supabase geralmente expira rapidamente

### 3. Problemas de RLS (Row Level Security)
**Sintoma**: O console mostra menos aulas do que o banco
**Solução**: Verifique as políticas RLS na tabela `classes` no Supabase

### 4. Aulas com Status Inválido
**Sintoma**: Aulas existem no banco mas não aparecem na interface
**Solução**: Execute o script SQL para verificar se há aulas com status NULL ou inválido

### 5. Problema de Sincronização
**Sintoma**: Aulas aparecem no banco mas não são carregadas
**Solução**: 
- Verifique os logs do console para erros
- Verifique se o `student_id` está correto
- Verifique se há problemas de conexão com o Supabase

## Próximos Passos

1. **Execute o script SQL** para verificar a quantidade no banco
2. **Abra o console do navegador** e verifique os logs
3. **Compare os valores** entre banco, console e interface
4. **Identifique onde está a discrepância**:
   - Se o banco tem mais aulas → problema de RLS ou query
   - Se o console mostra menos → problema de transformação dos dados
   - Se a interface mostra menos → problema de renderização ou filtros

## Logs Esperados

Quando tudo está funcionando corretamente, você deve ver logs como:

```
📚 Buscando aulas do aluno: abc123...
🔄 Cache buster: 1234567890
✅ Total de aulas encontradas no banco: 10
📊 Aulas por status: {agendada: 3, confirmada: 2, pendente_aceite: 2, concluida: 3}
📋 IDs das aulas: [{id: 1, status: 'agendada', date: '2024-01-15'}, ...]
✅ Total de aulas transformadas: 10
✅ Aulas carregadas no DashboardAluno: 10
📊 ClassControl - Quantidade de aulas: {total: 10, agendadas: 5, ...}
📊 HomeSection - Quantidade de aulas: {total_recebidas: 10, ...}
```

Se algum desses números não corresponder, os logs ajudarão a identificar onde está o problema.
