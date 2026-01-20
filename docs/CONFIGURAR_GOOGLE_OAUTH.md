# Como Configurar o Login com Google no Supabase

O erro `"Unsupported provider: provider is not enabled"` ocorre porque o provedor Google OAuth não está habilitado no seu projeto Supabase. Siga os passos abaixo para configurar:

## Passo 1: Criar Credenciais OAuth no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um projeto existente
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth client ID**
5. Se solicitado, configure a tela de consentimento OAuth:
   - Escolha **External** (para desenvolvimento)
   - Preencha as informações necessárias
   - Adicione seu email como usuário de teste
6. Configure o OAuth client:
   - **Application type**: Web application
   - **Name**: DriveToPass (ou outro nome de sua escolha)
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (para desenvolvimento)
     - `https://seu-dominio.com.br` (para produção)
   - **Authorized redirect URIs**:
     - `https://odmwardaafuvbusmrseq.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (se necessário)
7. Clique em **Create**
8. Copie o **Client ID** e **Client Secret** gerados

## Passo 2: Habilitar o Google Provider no Supabase

1. Acesse o [Painel do Supabase](https://app.supabase.com/)
2. Selecione seu projeto (`odmwardaafuvbusmrseq`)
3. Vá em **Authentication** > **Providers** no menu lateral
4. Encontre o provedor **Google** na lista
5. Clique para habilitar o Google provider
6. Cole o **Client ID** e **Client Secret** obtidos no Google Cloud Console
7. Clique em **Save**

## Passo 3: Configurar URLs de Redirecionamento

No painel do Supabase, em **Authentication** > **URL Configuration**:

1. Adicione as URLs de redirecionamento permitidas:
   - `http://localhost:3000/dashboard/aluno`
   - `http://localhost:3000/dashboard/instrutor`
   - `https://seu-dominio.com.br/dashboard/aluno` (produção)
   - `https://seu-dominio.com.br/dashboard/instrutor` (produção)

## Passo 4: Verificar Configuração

Após configurar, teste o login com Google:

1. Reinicie o servidor de desenvolvimento (se estiver rodando)
2. Acesse a página de login
3. Clique em "Continuar com Google"
4. Você deve ser redirecionado para a página de autenticação do Google

## Troubleshooting

### Erro: "redirect_uri_mismatch"
- Verifique se a URL de callback no Supabase está correta
- Certifique-se de que a URL autorizada no Google Cloud Console corresponde

### Erro: "invalid_client"
- Verifique se o Client ID e Client Secret estão corretos
- Certifique-se de que copiou os valores corretos do Google Cloud Console

### O login funciona mas o usuário não é criado
- Verifique se as políticas RLS (Row Level Security) estão configuradas corretamente
- Verifique se há triggers ou funções que criam o perfil automaticamente após o login

## Referências

- [Documentação Supabase - Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Dashboard](https://app.supabase.com/)
