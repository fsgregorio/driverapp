# Como criar o usuário admin

Para o dashboard de admin funcionar, você precisa criar um usuário admin no Supabase.

## Opção 1: Via Interface do Supabase (Recomendado)

1. Acesse o **Supabase Dashboard** → **Authentication** → **Users**
2. Clique em **"Add user"** ou **"Invite user"**
3. Preencha:
   - **Email**: `admin@drivetopass.com`
   - **Senha**: `123456`
   - **Auto Confirm User**: ✅ (marcar para não precisar confirmar email)
4. Clique em **"Create user"**

5. Depois, execute este SQL no **SQL Editor** do Supabase:

```sql
-- Atualizar o perfil do usuário admin
INSERT INTO profiles (
  id,
  user_type,
  name,
  phone,
  photo_url,
  profile_complete,
  created_at,
  updated_at
)
SELECT 
  au.id,
  'admin',
  'Administrador',
  '',
  '/imgs/users/image.png',
  true,
  now(),
  now()
FROM auth.users au
WHERE au.email = 'admin@drivetopass.com'
ON CONFLICT (id) 
DO UPDATE SET
  user_type = 'admin',
  name = COALESCE(profiles.name, 'Administrador'),
  updated_at = now();
```

## Opção 2: Via API (se preferir)

Você pode criar o usuário programaticamente usando a API do Supabase, mas a forma mais simples é via interface.

## Verificação

Após criar o usuário, você pode verificar se está correto executando:

```sql
SELECT 
  au.id,
  au.email,
  p.user_type,
  p.name
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'admin@drivetopass.com';
```

O resultado deve mostrar:
- `email`: `admin@drivetopass.com`
- `user_type`: `admin`
- `name`: `Administrador`

## Login no Dashboard Admin

Após criar o usuário, você pode acessar `/dashboard/admin` e fazer login com:
- **Login**: `admin`
- **Senha**: `123456`

O sistema internamente usará `admin@drivetopass.com` para autenticar no Supabase.
