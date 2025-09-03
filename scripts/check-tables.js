const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://bgivemisrbkdtmbxojlu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkyODQ0MiwiZXhwIjoyMDcyNTA0NDQyfQ.ZAVpzi6Qe8zuzTfIvsGCfjORY4EBi5iJqrFYe7YMZgA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTables() {
  console.log('🔍 Verificando tabelas existentes no banco...')
  
  try {
    // Tentar listar tabelas existentes
    const { data, error } = await supabase.rpc('sql', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `
    })
    
    if (error) {
      console.log(`❌ Erro ao listar tabelas: ${error.message}`)
      
      // Tentar método alternativo
      console.log('🔄 Tentando método alternativo...')
      const { data: altData, error: altError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
      
      if (altError) {
        console.log(`❌ Erro no método alternativo: ${altError.message}`)
      } else {
        console.log('📋 Tabelas encontradas (método alternativo):')
        altData.forEach(table => console.log(`   • ${table.tablename}`))
      }
    } else {
      console.log('📋 Tabelas encontradas:')
      data.forEach(table => console.log(`   • ${table.table_name}`))
    }
    
    // Testar conexão básica
    console.log('\n🔗 Testando conexão básica...')
    const { data: test, error: testError } = await supabase.auth.getSession()
    
    if (testError) {
      console.log(`❌ Erro de conexão: ${testError.message}`)
    } else {
      console.log('✅ Conexão estabelecida com sucesso')
    }
    
  } catch (err) {
    console.log(`❌ Erro geral: ${err.message}`)
  }
}

checkTables()