# Como Configurar o Envio de E-mails no Supabase

O Supabase já possui um sistema integrado de envio de e-mails para recuperação de senha, mas precisa ser configurado corretamente. Siga os passos abaixo:

## 📋 Resumo: O que é Obrigatório vs Opcional

### ✅ OBRIGATÓRIO (para funcionar):
- **Passo 1**: Configurar Templates de E-mail
- **Passo 3**: Configurar URLs de Redirecionamento

### ⚠️ OPCIONAL (melhora a experiência):
- **Passo 2**: Configurar SMTP (melhora deliverability, reduz spam)
- **Passo 2.5**: Informações sobre Vercel (não precisa fazer nada)

### 🧪 TESTE:
- **Passo 4**: Verificar se está funcionando

## Passo 1: Configurar Templates de E-mail no Supabase

1. Acesse o [Painel do Supabase](https://app.supabase.com/)
2. Selecione seu projeto
3. Vá em **Authentication** > **Email Templates** no menu lateral
4. Encontre o template **Reset Password** (ou "Recuperação de Senha")
5. Configure o template com:
   - **Subject**: "Redefinir sua senha - iDrive"
   - **Body HTML**: Use o template padrão ou customize com sua marca

### Template HTML Sugerido:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2463EB; font-size: 28px; margin-bottom: 10px;">Olá! 👋</h1>
  </div>
  
  <p style="font-size: 16px; line-height: 1.6; color: #555;">
    Recebemos uma solicitação para redefinir a senha da sua conta na <strong>iDrive</strong>.
  </p>
  
  <p style="font-size: 16px; line-height: 1.6; color: #555;">
    Não se preocupe! Estamos aqui para ajudar você a recuperar o acesso à sua conta de forma rápida e segura.
  </p>
  
  <div style="text-align: center; margin: 40px 0;">
    <a href="{{ .ConfirmationURL }}" style="background-color: #2463EB; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(36, 99, 235, 0.3);">
      🔐 Redefinir Minha Senha
    </a>
  </div>
  
  <p style="font-size: 14px; line-height: 1.6; color: #777; margin-top: 30px;">
    <strong>Não consegue clicar no botão?</strong><br>
    Copie e cole o link abaixo no seu navegador:
  </p>
  
  <p style="font-size: 12px; color: #2463EB; word-break: break-all; background-color: #f5f7fe; padding: 12px; border-radius: 6px; margin: 15px 0;">
    {{ .ConfirmationURL }}
  </p>
  
  <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
    <p style="font-size: 14px; color: #856404; margin: 0;">
      <strong>⏰ Importante:</strong> Este link é válido por <strong>1 hora</strong>. Após esse período, você precisará solicitar um novo link.
    </p>
  </div>
  
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 30px;">
    <p style="font-size: 13px; color: #666; margin: 0;">
      <strong>🔒 Segurança:</strong> Se você não solicitou esta redefinição de senha, pode ignorar este e-mail com segurança. Sua conta permanecerá protegida.
    </p>
  </div>
  
  <p style="font-size: 14px; line-height: 1.6; color: #555; margin-top: 30px;">
    Precisa de ajuda? Estamos sempre prontos para ajudar! Entre em contato conosco através do nosso suporte.
  </p>
  
  <p style="font-size: 14px; line-height: 1.6; color: #555; margin-top: 20px;">
    Um abraço,<br>
    <strong style="color: #2463EB;">Equipe iDrive</strong><br>
    <span style="color: #999; font-size: 12px;">A forma moderna de aprender e ensinar direção</span>
  </p>
</div>
```

## Passo 2: Configurar SMTP (Opcional - Para Produção)

**⚠️ Importante:** Não é obrigatório configurar SMTP para produção! O Supabase já envia e-mails automaticamente. Porém, configurar SMTP próprio melhora a entrega e reduz o risco de e-mails irem para spam.

### Quando configurar SMTP?

- ✅ **Recomendado para produção** se você quer melhor deliverability
- ✅ **Obrigatório** se você quer usar um domínio próprio (ex: noreply@seu-dominio.com.br)
- ❌ **Não necessário** para desenvolvimento/testes

### Como Configurar Gmail SMTP (Passo a Passo)

#### 1. Gerar Senha de App no Google

1. Acesse sua [Conta do Google](https://myaccount.google.com/)
2. Vá em **Segurança** no menu lateral
3. Ative a **Verificação em duas etapas** (obrigatório para senhas de app)
4. Role até **Senhas de app** (pode estar em "Como fazer login no Google")
5. Selecione **App**: "Email"
6. Selecione **Dispositivo**: "Outro (nome personalizado)"
7. Digite: "Supabase iDrive"
8. Clique em **Gerar**
9. **Copie a senha gerada** (16 caracteres, sem espaços) - você não verá ela novamente!

#### 2. Configurar no Supabase

1. Acesse o [Painel do Supabase](https://app.supabase.com/)
2. Selecione seu projeto
3. Vá em **Project Settings** (ícone de engrenagem) > **Auth**
4. Role até a seção **SMTP Settings**
5. Ative o toggle **Enable Custom SMTP**
6. Preencha os campos:

   ```
   Host: smtp.gmail.com
   Port: 587 (ou 465 para SSL)
   Username: seu-email@gmail.com (o e-mail completo)
   Password: [cole a senha de app gerada no passo 1]
   Sender email: seu-email@gmail.com (o mesmo e-mail do username)
   Sender name: iDrive
   ```

   **⚠️ Importante sobre as portas:**
   - **Porta 587**: Usa STARTTLS (recomendado)
   - **Porta 465**: Usa SSL/TLS direto (também funciona)
   - Ambas funcionam com Gmail, escolha a que preferir

7. **Preencha TODOS os campos** - O Supabase exige que todos estejam preenchidos:
   - ✅ Host (ex: smtp.gmail.com)
   - ✅ Port (587 ou 465)
   - ✅ Username (seu e-mail completo)
   - ✅ Password (senha de app)
   - ✅ Sender email (mesmo do username)
   - ✅ Sender name (ex: iDrive)

8. Clique em **Save**

**💡 Dica:** Se aparecer o alerta "⚠️ All fields must be filled", verifique se preencheu TODOS os campos acima, especialmente o **Host** e **Sender email**.

#### 3. Testar a Configuração

1. No mesmo painel, role até **SMTP Settings**
2. Clique em **Send test email**
3. Digite um e-mail de teste
4. Verifique se recebeu o e-mail

### ⚠️ Limitações do Gmail SMTP

- **Limite de 500 e-mails/dia** para contas pessoais
- **Limite de 2.000 e-mails/dia** para Google Workspace
- Pode ir para spam se enviar muitos e-mails
- Não permite usar domínio próprio (ex: noreply@seu-dominio.com.br)

### Alternativas Recomendadas para Produção

Se você espera enviar muitos e-mails ou quer usar domínio próprio:

#### **Resend** (Recomendado - Mais Fácil)
- ✅ Gratuito até 3.000 e-mails/mês
- ✅ Fácil de configurar
- ✅ Suporta domínio próprio
- ✅ Excelente deliverability
- 📝 [Como configurar Resend](#configurar-resend-opcional)

#### **SendGrid**
- ✅ Gratuito até 100 e-mails/dia
- ✅ Boa reputação
- ✅ Suporta domínio próprio

#### **Amazon SES**
- ✅ Muito barato ($0.10 por 1.000 e-mails)
- ✅ Escalável
- ⚠️ Requer configuração mais complexa

### Configurar Resend (Opcional - Recomendado)

1. Crie uma conta em [Resend.com](https://resend.com/)
2. Vá em **API Keys** e crie uma nova chave
3. Adicione seu domínio (se quiser usar domínio próprio)
4. No Supabase, configure:
   ```
   Host: smtp.resend.com
   Port: 587
   Username: resend
   Password: [sua API key do Resend]
   Sender email: noreply@seu-dominio.com.br (ou onboarding@resend.dev para teste)
   Sender name: iDrive
   ```

## Passo 2.5: Configuração no Vercel

**✅ Boa notícia:** Não precisa configurar nada especial no Vercel!

O envio de e-mails é feito pelo **Supabase**, não pelo Vercel. Você só precisa:

1. ✅ Configurar o template de e-mail no Supabase (Passo 1)
2. ✅ Configurar as URLs de redirecionamento no Supabase (Passo 3)
3. ⚠️ Configurar SMTP (opcional, apenas se quiser melhor deliverability)

**O Vercel apenas hospeda seu frontend React.** O Supabase cuida de toda a parte de autenticação e envio de e-mails.

### URLs para Configurar no Supabase

Quando fizer deploy no Vercel, você receberá uma URL como: `https://seu-app.vercel.app`

Configure no Supabase:
- **Site URL**: `https://seu-app.vercel.app`
- **Redirect URLs**: `https://seu-app.vercel.app/reset-password`

## Passo 3: Configurar URLs de Redirecionamento ⚠️ OBRIGATÓRIO

**⚠️ Este passo é ESSENCIAL!** Sem configurar as URLs de redirecionamento, o link do e-mail redirecionará para a landing page em vez da página de redefinição de senha.

**✅ Boa notícia:** A página `/reset-password` já está criada no código! Você só precisa configurar a URL no Supabase.

### Como Configurar:

1. No painel do Supabase, vá em **Authentication** > **URL Configuration**
2. Configure as URLs permitidas:

   **Site URL** (URL principal do seu app):
   - Para desenvolvimento: `http://localhost:3000`
   - Para produção: `https://seu-app.vercel.app` (ou seu domínio personalizado)
   
   **Redirect URLs** (onde o usuário será redirecionado após clicar no link):
   - Clique em **"Add URL"** ou use o campo de texto
   - Adicione **TODAS** as URLs onde você quer redirecionar:
     - `http://localhost:3000/reset-password` (desenvolvimento)
     - `https://seu-app.vercel.app/reset-password` (produção - URL do Vercel)
     - `https://seu-dominio.com.br/reset-password` (produção - se tiver domínio próprio)

3. **Salve as alterações**

### ⚠️ Problema Comum: Redirecionando para Landing Page

Se ao clicar no link do e-mail você é redirecionado para a landing page (`/`) em vez de `/reset-password`, significa que:

1. ❌ A URL `/reset-password` não está na lista de **Redirect URLs** do Supabase
2. ✅ **Solução:** Adicione `https://seu-app.vercel.app/reset-password` (ou sua URL) na lista de Redirect URLs

### Verificar se Está Configurado Corretamente:

Após configurar, teste novamente:
1. Solicite um novo e-mail de recuperação
2. Clique no link recebido
3. Você deve ser redirecionado para `/reset-password` (não para `/`)

## Passo 4: Verificar Configuração

Para testar se está funcionando:

1. Acesse a página `/forgot-password` no seu app
2. Digite um e-mail válido cadastrado no sistema
3. Clique em "Enviar instruções"
4. Verifique a caixa de entrada do e-mail (e spam)
5. Clique no link recebido
6. Você deve ser redirecionado para `/reset-password`

## Troubleshooting

### E-mail não está sendo enviado

1. **Verifique se todos os campos SMTP estão preenchidos**:
   - Se aparecer "⚠️ All fields must be filled", você precisa preencher:
     - Host (ex: smtp.gmail.com)
     - Port (587 ou 465)
     - Username (seu e-mail completo)
     - Password (senha de app)
     - Sender email (mesmo do username)
     - Sender name (ex: iDrive)

2. **Verifique os logs do Supabase**:
   - Vá em **Logs** > **Auth Logs**
   - Procure por erros relacionados ao envio de e-mail

3. **Verifique se o e-mail está cadastrado**:
   - O e-mail precisa existir na tabela `auth.users`
   - Verifique no painel: **Authentication** > **Users**

4. **Verifique limites de rate limiting**:
   - O Supabase tem limites de envio de e-mail
   - Verifique se não excedeu o limite

5. **Teste a conexão SMTP**:
   - Use o botão "Send test email" no painel SMTP Settings
   - Se falhar, verifique se a senha de app está correta

### Link de recuperação não funciona

1. **Verifique a URL de redirecionamento**:
   - Deve estar configurada corretamente no Supabase
   - Deve corresponder exatamente à URL do seu app

2. **Verifique se o link expirou**:
   - Links de recuperação expiram em 1 hora por padrão
   - Solicite um novo link

3. **Verifique o console do navegador**:
   - Abra o DevTools (F12)
   - Veja se há erros no console ao clicar no link

### E-mails indo para spam

1. **Configure SPF/DKIM** (para produção):
   - Adicione registros DNS no seu domínio
   - Configure autenticação de e-mail

2. **Use um provedor SMTP confiável**:
   - SendGrid, Resend ou Amazon SES têm melhor reputação

3. **Personalize o remetente**:
   - Use um e-mail do seu domínio (noreply@seu-dominio.com.br)

## Configuração para Desenvolvimento Local

Para desenvolvimento, você pode usar o serviço padrão do Supabase sem configurar SMTP. Os e-mails serão enviados normalmente, mas podem ir para spam.

## Configuração para Produção

Para produção, é altamente recomendado:

1. Configurar SMTP próprio
2. Verificar domínio (SPF/DKIM)
3. Usar um provedor confiável (SendGrid, Resend, etc.)
4. Monitorar logs de envio
5. Configurar alertas para falhas

## Referências

- [Documentação Supabase - Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Documentação Supabase - SMTP Settings](https://supabase.com/docs/guides/auth/auth-smtp)
- [SendGrid](https://sendgrid.com/)
- [Resend](https://resend.com/)
- [Amazon SES](https://aws.amazon.com/ses/)
