const { createClient } = require('@supabase/supabase-js')
const { faker } = require('@faker-js/faker')

// Configuração do Supabase
const supabaseUrl = 'https://bgivemisrbkdtmbxojlu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkyODQ0MiwiZXhwIjoyMDcyNTA0NDQyfQ.ZAVpzi6Qe8zuzTfIvsGCfjORY4EBi5iJqrFYe7YMZgA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Dados demográficos baseados no projeto original
const DEMOGRAFIA = {
  total_pacientes: 8950,
  composicao_familiar: [
    { label: 'Dependentes', count: 3759, percentage: 42 },
    { label: 'Titulares', count: 5191, percentage: 58 }
  ],
  distribuicao_sexo: [
    { label: 'Feminino', count: 4744, percentage: 53 },
    { label: 'Masculino', count: 4206, percentage: 47 }
  ],
  distribuicao_etaria: [
    { label: '0-17', count: 1611, percentage: 18 },
    { label: '18-39', count: 4028, percentage: 45 },
    { label: '40-59', count: 2506, percentage: 28 },
    { label: '60+', count: 805, percentage: 9 }
  ],
  tempo_programa: [
    { label: '<6 meses', count: 1158, percentage: 15 },
    { label: '6-12 meses', count: 1544, percentage: 20 },
    { label: '1-2 anos', count: 2316, percentage: 30 },
    { label: '>2 anos', count: 2702, percentage: 35 }
  ],
  cobertura: {
    vidas_elegiveis: 8950,
    vidas_vinculadas: 7720,
    nao_vinculados: 1230
  }
}

// Faixas etárias mapeadas
const FAIXAS_ETARIAS = {
  '0-17': 'adolescente',
  '18-39': 'adulto-jovem',
  '40-59': 'adulto',
  '60+': 'idoso'
}

// Função para gerar CPF fictício
function generateCPF() {
  const n = () => Math.floor(Math.random() * 9)
  return `${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}`
}

// Função para gerar idade baseada na faixa
function generateAgeFromRange(faixa) {
  switch(faixa) {
    case '0-17': return faker.number.int({ min: 0, max: 17 })
    case '18-39': return faker.number.int({ min: 18, max: 39 })
    case '40-59': return faker.number.int({ min: 40, max: 59 })
    case '60+': return faker.number.int({ min: 60, max: 85 })
    default: return faker.number.int({ min: 18, max: 65 })
  }
}

// Função para gerar tempo no programa
function generateTempoPrograma(categoria) {
  switch(categoria) {
    case '<6 meses': return faker.number.int({ min: 1, max: 5 })
    case '6-12 meses': return faker.number.int({ min: 6, max: 12 })
    case '1-2 anos': return faker.number.int({ min: 13, max: 24 })
    case '>2 anos': return faker.number.int({ min: 25, max: 60 })
    default: return faker.number.int({ min: 1, max: 12 })
  }
}

// Função para gerar data de nascimento baseada na idade
function generateBirthDate(age) {
  const today = new Date()
  const birthYear = today.getFullYear() - age
  return faker.date.between({ 
    from: new Date(birthYear, 0, 1), 
    to: new Date(birthYear, 11, 31) 
  })
}

// Função para gerar data de vinculação baseada no tempo no programa
function generateVinculationDate(mesesPrograma) {
  const today = new Date()
  const vinculationDate = new Date(today)
  vinculationDate.setMonth(today.getMonth() - mesesPrograma)
  return vinculationDate
}

async function getClientesUnidadesProdutos() {
  console.log('📋 Buscando clientes, unidades e produtos...')
  
  const [clientes, unidades, produtos] = await Promise.all([
    supabase.from('clientes').select('id, nome'),
    supabase.from('unidades').select('id, nome'),
    supabase.from('produtos').select('id, nome')
  ])
  
  if (clientes.error || unidades.error || produtos.error) {
    throw new Error('Erro ao buscar dados básicos')
  }
  
  return {
    clientes: clientes.data,
    unidades: unidades.data,
    produtos: produtos.data
  }
}

async function generatePatients() {
  console.log('👥 Gerando pacientes baseado na demografia real...')
  
  const { clientes, unidades, produtos } = await getClientesUnidadesProdutos()
  
  if (!clientes.length || !unidades.length || !produtos.length) {
    throw new Error('Clientes, unidades ou produtos não encontrados. Execute primeiro o setup das tabelas básicas.')
  }
  
  const patients = []
  let prontuarioCounter = 100000
  
  // Gerar pacientes por distribuição etária
  for (const faixaData of DEMOGRAFIA.distribuicao_etaria) {
    const faixa = faixaData.label
    const count = faixaData.count
    
    console.log(`👶 Gerando ${count} pacientes da faixa ${faixa}...`)
    
    for (let i = 0; i < count; i++) {
      const idade = generateAgeFromRange(faixa)
      const sexo = Math.random() < 0.53 ? 'F' : 'M' // 53% feminino
      const titularidade = Math.random() < 0.58 ? 'titular' : 'dependente' // 58% titulares
      
      // Determinar tempo no programa com distribuição realista
      let tempoCategoria
      const randTempo = Math.random()
      if (randTempo < 0.15) tempoCategoria = '<6 meses'
      else if (randTempo < 0.35) tempoCategoria = '6-12 meses'
      else if (randTempo < 0.65) tempoCategoria = '1-2 anos'
      else tempoCategoria = '>2 anos'
      
      const tempoPrograma = generateTempoPrograma(tempoCategoria)
      const statusVinculacao = Math.random() < 0.862 ? 'vinculado' : 'nao_vinculado' // 86.2% vinculados
      
      const patient = {
        prontuario: (prontuarioCounter++).toString(),
        cpf: generateCPF(),
        nome: faker.person.fullName({ sex: sexo === 'M' ? 'male' : 'female' }).slice(0, 255),
        data_nascimento: generateBirthDate(idade),
        sexo,
        email: Math.random() < 0.7 ? faker.internet.email().slice(0, 255) : null,
        telefone: Math.random() < 0.8 ? faker.phone.number().slice(0, 20) : null,
        endereco: Math.random() < 0.6 ? faker.location.streetAddress().slice(0, 500) : null,
        cep: Math.random() < 0.6 ? faker.location.zipCode('########').replace(/\D/g, '').slice(0, 8) : null,
        titularidade,
        faixa_etaria: FAIXAS_ETARIAS[faixa],
        data_vinculacao: statusVinculacao === 'vinculado' ? generateVinculationDate(tempoPrograma) : null,
        status_vinculacao: statusVinculacao,
        tempo_programa_meses: statusVinculacao === 'vinculado' ? tempoPrograma : null,
        cliente_id: faker.helpers.arrayElement(clientes).id,
        unidade_id: faker.helpers.arrayElement(unidades).id,
        produto_id: faker.helpers.arrayElement(produtos).id
      }
      
      patients.push(patient)
    }
  }
  
  return patients
}

async function insertPatientsInBatches(patients) {
  console.log(`📊 Inserindo ${patients.length} pacientes em lotes...`)
  
  const batchSize = 100 // Inserir em lotes de 100
  let insertedCount = 0
  let errorCount = 0
  
  for (let i = 0; i < patients.length; i += batchSize) {
    const batch = patients.slice(i, i + batchSize)
    
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .insert(batch)
        .select('id')
      
      if (error) {
        console.log(`❌ Erro no lote ${Math.floor(i/batchSize) + 1}: ${error.message}`)
        errorCount += batch.length
      } else {
        insertedCount += batch.length
        console.log(`✅ Lote ${Math.floor(i/batchSize) + 1}: ${batch.length} pacientes inseridos (Total: ${insertedCount})`)
      }
      
      // Pequena pausa para não sobrecarregar o banco
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (err) {
      console.log(`❌ Erro crítico no lote ${Math.floor(i/batchSize) + 1}: ${err.message}`)
      errorCount += batch.length
    }
  }
  
  return { insertedCount, errorCount }
}

async function main() {
  try {
    console.log('🚀 Iniciando população do banco com 8.950 pacientes...')
    console.log('📈 Baseado na demografia real do projeto original')
    
    // Tentar inserir um paciente de teste para verificar se as tabelas existem
    console.log('🔍 Verificando se as tabelas existem...')
    
    try {
      const { data: testClientes } = await supabase.from('clientes').select('id').limit(1)
      if (!testClientes?.length) {
        console.log('❌ Não há clientes cadastrados. Execute primeiro o DATABASE_SCHEMA_FIXED.sql')
        return
      }
      console.log('✅ Tabelas básicas encontradas, prosseguindo...')
    } catch (err) {
      console.log('❌ Erro ao acessar tabelas. Verifique se o schema foi executado corretamente.')
      return
    }
    
    const patients = await generatePatients()
    const { insertedCount, errorCount } = await insertPatientsInBatches(patients)
    
    console.log('\n📊 RESUMO DA POPULAÇÃO:')
    console.log(`✅ Pacientes inseridos: ${insertedCount}`)
    console.log(`❌ Erros: ${errorCount}`)
    console.log(`📋 Total esperado: ${DEMOGRAFIA.total_pacientes}`)
    
    if (insertedCount === DEMOGRAFIA.total_pacientes) {
      console.log('🎉 SUCESSO! Todos os pacientes foram inseridos!')
      console.log('📈 Demografia final:')
      console.log(`   • Vinculados: ~${Math.round(insertedCount * 0.862)} (86.2%)`)
      console.log(`   • Não vinculados: ~${Math.round(insertedCount * 0.138)} (13.8%)`)
      console.log(`   • Titulares: ~${Math.round(insertedCount * 0.58)} (58%)`)
      console.log(`   • Dependentes: ~${Math.round(insertedCount * 0.42)} (42%)`)
    }
    
  } catch (error) {
    console.error('❌ Erro na população:', error.message)
    process.exit(1)
  }
}

main()