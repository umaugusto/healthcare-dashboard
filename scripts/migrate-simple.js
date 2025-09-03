const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://bgivemisrbkdtmbxojlu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkyODQ0MiwiZXhwIjoyMDcyNTA0NDQyfQ.ZAVpzi6Qe8zuzTfIvsGCfjORY4EBi5iJqrFYe7YMZgA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQL(query) {
  try {
    console.log(`⏳ Executando: ${query.substring(0, 50)}...`)
    
    const { data, error } = await supabase.rpc('exec_sql', { query })
    
    if (error) {
      console.log(`❌ Erro: ${error.message}`)
      return false
    } else {
      console.log(`✅ Sucesso`)
      return true
    }
  } catch (err) {
    console.log(`❌ Erro: ${err.message}`)
    return false
  }
}

async function testConnection() {
  console.log('🔗 Testando conexão com Supabase...')
  
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .limit(1)
  
  if (error) {
    console.log(`❌ Erro de conexão: ${error.message}`)
    return false
  } else {
    console.log(`✅ Conexão estabelecida com sucesso!`)
    return true
  }
}

async function main() {
  console.log('🚀 Iniciando migração direta...')
  
  const connected = await testConnection()
  if (!connected) {
    console.log('❌ Não foi possível conectar ao Supabase')
    return
  }
  
  console.log('📋 Status: Conexão OK, mas as tabelas precisam ser criadas via Dashboard Web')
  console.log('📌 Recomendação: Use a FORMA 1 (Dashboard Web) mencionada anteriormente')
  console.log('🌐 Vá para: https://supabase.com/dashboard/project/bgivemisrbkdtmbxojlu')
}

main()