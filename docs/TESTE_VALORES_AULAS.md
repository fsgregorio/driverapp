# Script de Teste - Verificar Valores de Aulas

## Como Usar

1. Abra a aplicação no navegador
2. Abra o Console do Desenvolvedor (F12)
3. Vá para a aba "Console"
4. Cole e execute o script abaixo

## Script de Teste

```javascript
// Script para verificar valores de total_classes diretamente da API
(async () => {
  console.log('🔍 Testando valores de total_classes...\n');
  
  try {
    // Importar a API (ajuste o caminho se necessário)
    const { studentsAPI } = await import('/src/services/api.js');
    
    // Buscar instrutores
    const instructors = await studentsAPI.getInstructors();
    
    console.log('📊 Instrutores encontrados:', instructors.length);
    console.log('\n📋 Valores de totalClasses por instrutor:\n');
    
    const expectedValues = {
      'Roberto Oliveira': 42,
      'Mariana Costa': 26,
      'Carlos Silva': 37,
      'Fernando Alves': 18,
      'Ana Paula Santos': 6,
      'João Pedro Lima': 0,
      'Patricia Mendes': 32
    };
    
    instructors.forEach(instructor => {
      const expected = expectedValues[instructor.name];
      const actual = instructor.totalClasses || 0;
      const status = expected !== undefined && actual === expected ? '✅' : '❌';
      
      console.log(`${status} ${instructor.name}:`);
      console.log(`   Esperado: ${expected !== undefined ? expected : 'N/A'}`);
      console.log(`   Atual: ${actual}`);
      if (expected !== undefined && actual !== expected) {
        console.log(`   ⚠️ DIFERENÇA ENCONTRADA!`);
      }
      console.log('');
    });
    
    // Verificar diretamente do Supabase
    console.log('🔍 Verificando diretamente do Supabase...\n');
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || window.location.origin;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    if (supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: directData, error } = await supabase
        .from('instructors')
        .select('id, total_classes')
        .eq('available', true);
      
      if (error) {
        console.error('❌ Erro ao buscar diretamente:', error);
      } else {
        console.log('📊 Valores diretos do banco:');
        directData.forEach(instructor => {
          const apiInstructor = instructors.find(i => i.id === instructor.id);
          if (apiInstructor) {
            console.log(`   ${apiInstructor.name}: banco=${instructor.total_classes}, API=${apiInstructor.totalClasses}`);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar teste:', error);
  }
})();
```

## Versão Simplificada (se a anterior não funcionar)

```javascript
// Versão simplificada - apenas verifica os valores exibidos
const instructors = document.querySelectorAll('[class*="aulas dadas"]');
console.log('🔍 Verificando valores exibidos na interface...\n');

instructors.forEach((el, index) => {
  const text = el.textContent;
  const match = text.match(/(\d+)\s*aulas dadas/);
  if (match) {
    console.log(`Instrutor ${index + 1}: ${match[1]} aulas dadas`);
  }
});
```

## O que Verificar

1. **Valores no Console**: Os logs devem mostrar os valores corretos
2. **Valores na Interface**: Compare com o que está sendo exibido
3. **Discrepâncias**: Se houver diferença entre o banco e a interface, o problema é cache

## Próximos Passos

Se os valores no console estiverem corretos mas a interface mostrar valores errados:

1. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
2. **Faça um hard refresh** (Ctrl+F5)
3. **Recarregue a página** após alguns segundos
4. **Verifique se há erros** no console

Se os valores no console também estiverem errados:

1. **Verifique o banco de dados** diretamente no Supabase
2. **Aguarde alguns minutos** (cache do Supabase pode levar tempo)
3. **Execute o script SQL novamente** se necessário
