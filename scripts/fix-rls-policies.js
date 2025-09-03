const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://bgivemisrbkdtmbxojlu.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkyODQ0MiwiZXhwIjoyMDcyNTA0NDQyfQ.ZAVpzi6Qe8zuzTfIvsGCfjORY4EBi5iJqrFYe7YMZgA'

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createRLSPolicies() {
  console.log('🔒 Criando políticas RLS para acesso público aos dados...\n')

  const tables = ['pacientes', 'atendimentos', 'exames_laboratoriais', 'rastreios', 'linhas_cuidado']

  for (const table of tables) {
    console.log(`📋 Configurando RLS para tabela: ${table}`)

    try {
      // Desabilitar RLS temporariamente para testes
      const { error: disableRLSError } = await supabase.rpc('sql', {
        query: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`
      })

      if (disableRLSError) {
        console.log(`❌ Erro ao desabilitar RLS em ${table}:`, disableRLSError.message)
      } else {
        console.log(`✅ RLS desabilitado em ${table}`)
      }

      // Alternativamente, criar política que permite leitura para todos
      const { error: policyError } = await supabase.rpc('sql', {
        query: `
          DROP POLICY IF EXISTS "Allow public read access" ON ${table};
          
          CREATE POLICY "Allow public read access" ON ${table}
          FOR SELECT
          TO anon, authenticated
          USING (true);
        `
      })

      if (policyError) {
        console.log(`❌ Erro ao criar política em ${table}:`, policyError.message)
      } else {
        console.log(`✅ Política de leitura pública criada em ${table}`)
      }

    } catch (error) {
      console.log(`💥 Erro geral em ${table}:`, error.message)
    }
  }

  console.log('\n🎉 Configuração de RLS concluída!')
  console.log('✅ Agora o dashboard deve conseguir acessar os dados')
}

createRLSPolicies()