# Configuração de Deployment no Vercel

## Problemas Resolvidos

### 1. Configuração do Vercel para SPA
Foi criado o arquivo `vercel.json` para configurar corretamente o projeto como Single Page Application (SPA), garantindo que o React Router funcione corretamente.

### 2. Especificação da Versão do Node.js
- Adicionado `engines` no `package.json` especificando Node.js >= 18.0.0
- Criado arquivo `.nvmrc` com a versão 18

## Configurações Necessárias no Vercel

### Variáveis de Ambiente
Configure as seguintes variáveis de ambiente no painel do Vercel (Settings > Environment Variables):

1. **REACT_APP_SUPABASE_URL** (opcional)
   - URL do seu projeto Supabase
   - Se não configurada, será usado o valor padrão

2. **REACT_APP_SUPABASE_ANON_KEY** (opcional)
   - Chave anônima do Supabase
   - Se não configurada, será usado o valor padrão

3. **REACT_APP_SITE_URL** (opcional)
   - URL do site em produção (ex: https://drivetopass.com.br)
   - Se não configurada, será detectada automaticamente

4. **REACT_APP_ENABLE_TRACKING** (opcional)
   - "true" para habilitar tracking em produção
   - Padrão: desabilitado em desenvolvimento, habilitado em produção

### Configuração do Build
O Vercel deve detectar automaticamente:
- **Framework**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Verificação
Após configurar as variáveis de ambiente, faça um novo deploy. O build deve completar com sucesso.

## Arquivos Criados/Modificados

1. `vercel.json` - Configuração do Vercel para SPA
2. `.nvmrc` - Especificação da versão do Node.js
3. `package.json` - Adicionado campo `engines` para especificar versão do Node.js

## Troubleshooting

Se o build ainda falhar:

1. **Verifique os logs do build** no painel do Vercel para identificar erros específicos
2. **Verifique se todas as variáveis de ambiente estão configuradas** corretamente
3. **Limpe o cache do build** no Vercel (Settings > General > Clear Build Cache)
4. **Verifique se o Node.js 18 está sendo usado** (deve aparecer nos logs do build)
