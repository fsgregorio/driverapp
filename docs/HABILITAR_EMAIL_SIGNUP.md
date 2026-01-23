# Habilitar Cadastros por Email no Supabase

## Problema
Erro: **"Email signups are disabled"** ao tentar criar uma conta.

## Causa
O provider de Email está desabilitado nas configurações do Supabase, mesmo que "Allow new users to sign up" esteja habilitado.

## Solução

### Passo 1: Habilitar Provider de Email

1. No Dashboard do Supabase, vá em **Authentication** > **Sign In / Providers** (ou **Providers**)
2. Na seção **"Auth Providers"**, encontre **"Email"**
3. Clique no provider **"Email"** (ou no ícone `>` ao lado)
4. **Habilite** o toggle **"Enable Email provider"** (ou similar)
5. **Salve** as alterações

### Passo 2: Verificar Configurações

Certifique-se de que estas configurações estão corretas:

- ✅ **"Allow new users to sign up"** - Deve estar **habilitado**
- ✅ **"Email" provider** - Deve estar **habilitado**
- ⚙️ **"Confirm email"** - Pode estar habilitado ou desabilitado (sua escolha)

### Passo 3: Testar

1. Tente criar uma nova conta no frontend
2. Se ainda houver erro, verifique o console do navegador

## Configuração Recomendada para Desenvolvimento

Para desenvolvimento/testes, recomendo:

- ✅ **"Allow new users to sign up"** - Habilitado
- ✅ **"Email" provider** - Habilitado  
- ❌ **"Confirm email"** - Desabilitado (para login imediato)

## Configuração para Produção

Para produção:

- ✅ **"Allow new users to sign up"** - Habilitado
- ✅ **"Email" provider** - Habilitado
- ✅ **"Confirm email"** - Habilitado (segurança)
- ✅ **SMTP customizado** - Configurado (não usar o serviço padrão)
