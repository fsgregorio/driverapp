/**
 * Script para criar usuários de teste no Supabase
 * Execute com: node docs/create_users.js
 * 
 * Este script cria apenas os usuários de autenticação
 * Depois execute o insert_mock_data.sql para inserir os dados
 */

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://odmwardaafuvbusmrseq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

if (supabaseServiceKey === 'YOUR_SERVICE_ROLE_KEY') {
  console.error('❌ Por favor, configure SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
  console.error('   Você pode encontrar a Service Role Key em:');
  console.error('   Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

// Criar cliente com service role key (tem permissões administrativas)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Lista de usuários para criar
const usersToCreate = [
  // Instrutores
  { email: 'carlos.silva@teste.com', password: 'senha123', name: 'Carlos Silva', type: 'instructor' },
  { email: 'ana.santos@teste.com', password: 'senha123', name: 'Ana Paula Santos', type: 'instructor' },
  { email: 'roberto.oliveira@teste.com', password: 'senha123', name: 'Roberto Oliveira', type: 'instructor' },
  { email: 'mariana.costa@teste.com', password: 'senha123', name: 'Mariana Costa', type: 'instructor' },
  { email: 'joao.lima@teste.com', password: 'senha123', name: 'João Pedro Lima', type: 'instructor' },
  { email: 'patricia.mendes@teste.com', password: 'senha123', name: 'Patricia Mendes', type: 'instructor' },
  { email: 'fernando.alves@teste.com', password: 'senha123', name: 'Fernando Alves', type: 'instructor' },
  // Aluno
  { email: 'aluno@teste.com', password: 'senha123', name: 'Francisco Gregório', type: 'student' }
];

async function createUsers() {
  console.log('🚀 Iniciando criação de usuários...\n');

  const createdUsers = [];
  const skippedUsers = [];
  const errors = [];

  for (const userData of usersToCreate) {
    try {
      console.log(`📝 Criando usuário: ${userData.email}...`);

      // Verificar se o usuário já existe
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === userData.email);

      if (existingUser) {
        console.log(`⏭️  Usuário ${userData.email} já existe, pulando...`);
        skippedUsers.push({ ...userData, id: existingUser.id });
        continue;
      }

      // Criar usuário com delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay de 500ms entre requisições

      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          type: userData.type
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`⏭️  Usuário ${userData.email} já existe, pulando...`);
          skippedUsers.push(userData);
        } else {
          throw error;
        }
      } else {
        console.log(`✅ ${userData.name} criado com sucesso! (ID: ${data.user.id})`);
        createdUsers.push({ ...userData, id: data.user.id });
      }

    } catch (error) {
      console.error(`❌ Erro ao criar ${userData.email}:`, error.message);
      errors.push({ ...userData, error: error.message });
      
      // Se for erro de rate limit, aguardar mais tempo
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        console.log('⏳ Rate limit detectado, aguardando 5 segundos...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  console.log('\n📊 Resumo:');
  console.log(`✅ Criados: ${createdUsers.length}`);
  console.log(`⏭️  Já existiam: ${skippedUsers.length}`);
  console.log(`❌ Erros: ${errors.length}`);

  if (createdUsers.length > 0) {
    console.log('\n✅ Usuários criados com sucesso:');
    createdUsers.forEach(u => {
      console.log(`   - ${u.name} (${u.email})`);
    });
  }

  if (skippedUsers.length > 0) {
    console.log('\n⏭️  Usuários que já existiam:');
    skippedUsers.forEach(u => {
      console.log(`   - ${u.name} (${u.email})`);
    });
  }

  if (errors.length > 0) {
    console.log('\n❌ Erros encontrados:');
    errors.forEach(u => {
      console.log(`   - ${u.email}: ${u.error}`);
    });
    console.log('\n💡 Dica: Tente executar o script novamente para os usuários que falharam');
  }

  console.log('\n📋 Próximos passos:');
  console.log('1. Execute o script SQL: docs/insert_mock_data.sql');
  console.log('2. Ou execute: node docs/insert_mock_data.js (cria tudo automaticamente)');
}

// Executar
if (require.main === module) {
  createUsers().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { createUsers };
