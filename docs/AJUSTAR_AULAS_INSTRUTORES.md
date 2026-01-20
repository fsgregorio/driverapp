# Como Ajustar a Quantidade de Aulas dos Instrutores

## Problema
Após executar o script SQL, os valores ainda aparecem incorretos no frontend.

## Solução Passo a Passo

### 1. Verificar se o Script Foi Executado Corretamente

Execute esta query no Supabase SQL Editor para verificar os valores no banco:

```sql
SELECT 
  p.name,
  u.email,
  i.total_classes,
  i.rating
FROM profiles p
JOIN instructors i ON p.id = i.id
JOIN auth.users u ON p.id = u.id
WHERE p.user_type = 'instructor'
ORDER BY p.name;
```

**Valores esperados:**
- Roberto Oliveira: 42 aulas
- Mariana Costa: 26 aulas
- Carlos Silva: 37 aulas
- Fernando Alves: 18 aulas
- Ana Paula Santos: 6 aulas
- João Pedro Lima: 0 aulas
- Patricia Mendes: 32 aulas

### 2. Se os Valores Estão Corretos no Banco

Se a query acima mostra os valores corretos, o problema é **cache do navegador**. Siga estes passos:

#### Opção A: Hard Refresh (Recomendado)
- **Windows/Linux**: `Ctrl + F5` ou `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

#### Opção B: Limpar Cache do Navegador
1. Abra as configurações do navegador
2. Vá em "Privacidade e Segurança" > "Limpar dados de navegação"
3. Selecione "Imagens e arquivos em cache"
4. Clique em "Limpar dados"

#### Opção C: Modo Anônimo/Privado
- Abra uma janela anônima/privada (`Ctrl + Shift + N` no Chrome, `Ctrl + Shift + P` no Firefox)
- Acesse a aplicação e verifique se os valores estão corretos

### 3. Se os Valores Estão Incorretos no Banco

Se a query de verificação mostra valores incorretos, execute um dos scripts:

#### Script Principal
```bash
docs/adjust_instructor_classes.sql
```

#### Script Alternativo (se o principal não funcionar)
```bash
docs/adjust_instructor_classes_alternative.sql
```

### 4. Verificar se os Emails Estão Corretos

Execute esta query para ver todos os emails dos instrutores:

```sql
SELECT 
  u.email,
  p.name,
  i.total_classes
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN instructors i ON u.id = i.id
WHERE u.email LIKE '%@teste.com'
ORDER BY p.name NULLS LAST;
```

### 5. Atualização Manual (Último Recurso)

Se nada funcionar, você pode atualizar manualmente usando o ID do instrutor:

1. Primeiro, encontre o ID:
```sql
SELECT id, email FROM auth.users WHERE email = 'roberto.oliveira@teste.com';
```

2. Depois, atualize usando o ID:
```sql
UPDATE instructors 
SET total_classes = 42 
WHERE id = 'UUID_DO_INSTRUTOR';
```

## Troubleshooting

### Erro: "Usuário com email não encontrado"
- Verifique se o usuário existe em Authentication > Users no Supabase Dashboard
- Verifique se o email está correto (com ou sem maiúsculas)

### Erro: "Permission denied"
- Verifique se você está usando o SQL Editor do Supabase Dashboard
- Certifique-se de que tem permissões de administrador no projeto

### Valores não atualizam mesmo após hard refresh
- Verifique se há algum cache no nível da API (verifique o código em `src/services/api.js`)
- Verifique se há algum middleware ou proxy que está cacheando as respostas
- Tente fazer logout e login novamente na aplicação

## Verificação Final

Após seguir todos os passos, execute esta query para confirmar:

```sql
SELECT 
  p.name,
  i.total_classes,
  CASE 
    WHEN p.name = 'Roberto Oliveira' AND i.total_classes = 42 THEN '✅'
    WHEN p.name = 'Mariana Costa' AND i.total_classes = 26 THEN '✅'
    WHEN p.name = 'Carlos Silva' AND i.total_classes = 37 THEN '✅'
    WHEN p.name = 'Fernando Alves' AND i.total_classes = 18 THEN '✅'
    WHEN p.name = 'Ana Paula Santos' AND i.total_classes = 6 THEN '✅'
    WHEN p.name = 'João Pedro Lima' AND i.total_classes = 0 THEN '✅'
    WHEN p.name = 'Patricia Mendes' AND i.total_classes = 32 THEN '✅'
    ELSE '❌'
  END as status
FROM profiles p
JOIN instructors i ON p.id = i.id
WHERE p.user_type = 'instructor'
ORDER BY p.name;
```

Todos devem mostrar ✅ se estiverem corretos.
