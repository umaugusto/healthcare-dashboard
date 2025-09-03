const fs = require('fs')
const path = require('path')

// Ler o schema completo
const schemaPath = path.join(__dirname, '..', 'database', 'FULL_SCHEMA.sql')
const schema = fs.readFileSync(schemaPath, 'utf8')

// Dividir em comandos individuais
const commands = schema
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

console.log('📋 COMANDOS SQL PARA EXECUÇÃO MANUAL NO SUPABASE DASHBOARD:')
console.log('===========================================================')
console.log('')
console.log('Acesse: https://bgivemisrbkdtmbxojlu.supabase.co/project/bgivemisrbkdtmbxojlu/sql/new')
console.log('')
console.log('Execute os comandos abaixo um por um:')
console.log('')

let batchCommands = []
let batchSize = 5 // Agrupar 5 comandos por vez para facilitar execução

for (let i = 0; i < commands.length; i++) {
  batchCommands.push(commands[i])
  
  if (batchCommands.length === batchSize || i === commands.length - 1) {
    const batchNumber = Math.ceil((i + 1) / batchSize)
    console.log(`-- BATCH ${batchNumber} (${batchCommands.length} comandos)`)
    console.log('-- ============================================')
    
    batchCommands.forEach(cmd => {
      console.log(cmd + ';')
    })
    
    console.log('')
    console.log('-- Aguarde a execução antes de continuar...')
    console.log('')
    
    batchCommands = []
  }
}

console.log('📊 RESUMO:')
console.log(`Total de comandos: ${commands.length}`)
console.log(`Total de batches: ${Math.ceil(commands.length / batchSize)}`)
console.log('')
console.log('✅ Após executar todos os batches, todas as 32 tabelas estarão criadas!')

// Criar também um arquivo com todos os comandos
const outputPath = path.join(__dirname, '..', 'database', 'SCHEMA_COMMANDS.sql')
const allCommands = commands.join(';\n\n') + ';'
fs.writeFileSync(outputPath, allCommands)

console.log(`💾 Arquivo completo salvo em: database/SCHEMA_COMMANDS.sql`)