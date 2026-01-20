# Diagnóstico - Valores de Aulas Incorretos

## Passo 1: Verificar o Banco de Dados

Execute este script no Supabase SQL Editor:

```sql
SELECT 
  p.name,
  i.total_classes as valor_atual,
  CASE p.name
    WHEN 'Roberto Oliveira' THEN 42
    WHEN 'Mariana Costa' THEN 26
    WHEN 'Carlos Silva' THEN 37
    WHEN 'Fernando Alves' THEN 18
    WHEN 'Ana Paula Santos' THEN 6
    WHEN 'João Pedro Lima' THEN 0
    WHEN 'Patricia Mendes' THEN 32
  END as valor_esperado,
  CASE 
    WHEN i.total_classes = CASE p.name
      WHEN 'Roberto Oliveira' THEN 42
      WHEN 'Mariana Costa' THEN 26
      WHEN 'Carlos Silva' THEN 37
      WHEN 'Fernando Alves' THEN 18
      WHEN 'Ana Paula Santos' THEN 6
      WHEN 'João Pedro Lima' THEN 0
      WHEN 'Patricia Mendes' THEN 32
    END THEN '✅'
    ELSE '❌'
  END as status
FROM profiles p
JOIN instructors i ON p.id = i.id
WHERE p.user_type = 'instructor'
ORDER BY p.name;
```

**Se algum valor mostrar ❌:**
- Execute novamente o script `adjust_instructor_classes.sql`
- Aguarde alguns segundos
- Execute a query de verificação novamente

## Passo 2: Verificar o Console do Navegador

1. Abra a aplicação no navegador
2. Abra o Console do Desenvolvedor (F12)
3. Vá para a aba "Console"
4. Recarregue a página (Ctrl+F5)
5. Procure por estas mensagens:

### Mensagens Importantes:

- `📊 Total classes dos instrutores (do banco RAW):` - Mostra os valores RAW do banco
- `✅ [Nome]: [valor] (correto no banco)` - Confirma que o valor está correto no banco
- `❌ VALOR INCORRETO NO BANCO:` - Indica que o valor no banco está errado
- `📋 Instrutor [Nome]: totalClasses = [valor]` - Mostra o valor após transformação
- `🎨 Renderizando [Nome]: totalClasses = [valor]` - Mostra o valor sendo renderizado

## Passo 3: Interpretar os Logs

### Cenário A: Valores corretos no banco, mas errados na API
**Sintomas:**
- `✅ [Nome]: [valor] (correto no banco)` aparece
- Mas `📋 Instrutor [Nome]: totalClasses = [valor diferente]`

**Solução:**
- Cache do Supabase - aguarde 1-2 minutos e recarregue
- Ou limpe o cache do navegador completamente

### Cenário B: Valores corretos na API, mas errados na interface
**Sintomas:**
- `📋 Instrutor [Nome]: totalClasses = [valor correto]`
- Mas a interface mostra valor diferente

**Solução:**
- Cache do React/Estado - faça hard refresh (Ctrl+F5)
- Ou limpe o cache do navegador

### Cenário C: Valores incorretos no banco
**Sintomas:**
- `❌ VALOR INCORRETO NO BANCO:` aparece

**Solução:**
- Execute o script `adjust_instructor_classes.sql` novamente
- Verifique se não há erro na execução
- Execute a query de verificação novamente

## Passo 4: Solução Rápida (Tentar Primeiro)

1. **Limpar cache do navegador:**
   - Ctrl+Shift+Delete (Windows) ou Cmd+Shift+Delete (Mac)
   - Selecione "Imagens e arquivos em cache"
   - Clique em "Limpar dados"

2. **Hard Refresh:**
   - Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)

3. **Aguardar 2-3 minutos:**
   - O Supabase pode ter cache que expira em alguns minutos

4. **Recarregar a página**

## Passo 5: Verificação Final

Após seguir os passos acima, execute este código no console do navegador:

```javascript
// Verificar valores exibidos na interface
const checkDisplayedValues = () => {
  const cards = document.querySelectorAll('[class*="aulas dadas"]');
  console.log('🔍 Valores exibidos na interface:');
  cards.forEach((el, index) => {
    const text = el.textContent;
    const match = text.match(/(\d+)\s*aulas dadas/);
    if (match) {
      console.log(`  Card ${index + 1}: ${match[1]} aulas dadas`);
    }
  });
};

checkDisplayedValues();
```

Compare os valores exibidos com os esperados:
- Roberto Oliveira: 42
- Mariana Costa: 26
- Carlos Silva: 37
- Fernando Alves: 18
- Ana Paula Santos: 6
- João Pedro Lima: 0
- Patricia Mendes: 32

## Se Nada Funcionar

1. **Verifique se o script SQL foi executado corretamente:**
   - Execute `verificar_valores_banco.sql` no Supabase
   - Todos devem mostrar ✅

2. **Verifique se há erros no console:**
   - Procure por mensagens em vermelho
   - Anote os erros e verifique

3. **Tente em outro navegador:**
   - Para descartar problemas específicos do navegador

4. **Verifique a rede:**
   - Abra a aba "Network" no DevTools
   - Recarregue a página
   - Verifique se a requisição para `instructors` está retornando os valores corretos

## Mudanças Implementadas

As seguintes melhorias foram adicionadas ao código:

1. ✅ Verificação automática de valores esperados
2. ✅ Logs detalhados em cada etapa
3. ✅ Forçar uso do valor do banco diretamente
4. ✅ Headers para evitar cache HTTP
5. ✅ Verificação de tipos de dados

Essas mudanças devem ajudar a identificar onde está o problema.
