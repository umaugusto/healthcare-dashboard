const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://bgivemisrbkdtmbxojlu.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTE4NTE5MywiZXhwIjoyMDUwNzYxMTkzfQ.wZk10TXzQPHXjH3eoZLG5EBLwGBzRY7XGi5RbVB_W_s'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function applyFullSchema() {
  try {
    console.log('🔄 Lendo arquivo FULL_SCHEMA.sql...')
    
    const schemaPath = path.join(__dirname, '..', 'database', 'FULL_SCHEMA.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📊 Aplicando schema completo no Supabase...')
    console.log(`Schema size: ${Math.round(schema.length / 1024)}KB`)
    
    // Executar o schema completo de uma vez
    console.log('📝 Executando schema completo...')
    
    try {
      const { data, error } = await supabase
        .from('sql_executor')
        .select('*')
        .eq('sql', schema)
        .single()
        
      if (error) {
        console.log('❌ Tentando método alternativo via query direta...')
        
        // Método alternativo: executar diretamente via PostgrestClient
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          },
          body: JSON.stringify({ sql: schema })
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        console.log('✅ Schema aplicado com sucesso!')
        console.log('Resultado:', result)
        
      } else {
        console.log('✅ Schema aplicado com sucesso!')
      }
      
    } catch (err) {
      console.log('❌ Erro ao executar via RPC. Tentando método manual...')
      
      // Executar comandos individualmente
      const commands = schema
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
      
      console.log(`📝 Executando ${commands.length} comandos individuais...`)
      
      let successCount = 0
      let errorCount = 0
      
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i]
        
        if (command.length === 0) continue
        
        try {
          // Executar comando direto via fetch
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            },
            body: JSON.stringify({ sql: command })
          })
          
          if (response.ok) {
            successCount++
            if ((i + 1) % 5 === 0) {
              console.log(`✅ Processados ${i + 1}/${commands.length} comandos`)
            }
          } else {
            console.log(`❌ Erro no comando ${i + 1}: ${response.statusText}`)
            errorCount++
          }
          
        } catch (cmdErr) {
          console.log(`❌ Exceção no comando ${i + 1}:`, cmdErr.message)
          errorCount++
        }
      }
      
      console.log('\n📊 RESUMO DA APLICAÇÃO DO SCHEMA:')
      console.log(`✅ Sucessos: ${successCount}`)
      console.log(`❌ Erros: ${errorCount}`)
      console.log(`📝 Total: ${commands.length}`)
    }
    
  } catch (error) {
    console.error('💥 Erro fatal ao aplicar schema:', error)
  }
}

applyFullSchema()