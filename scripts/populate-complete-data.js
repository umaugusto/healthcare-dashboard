const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://bgivemisrbkdtmbxojlu.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkyODQ0MiwiZXhwIjoyMDcyNTA0NDQyfQ.ZAVpzi6Qe8zuzTfIvsGCfjORY4EBi5iJqrFYe7YMZgA'

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Dados base do chartsData.ts
const LINHAS_CUIDADO = [
  { nome: 'Hipertensão Arterial', descricao: 'Controle de pressão arterial', cor: '#ef4444' },
  { nome: 'Diabetes Mellitus', descricao: 'Controle glicêmico', cor: '#3b82f6' },
  { nome: 'Obesidade', descricao: 'Controle de peso', cor: '#f59e0b' },
  { nome: 'Saúde Mental - Ansiedade', descricao: 'Acompanhamento ansiedade', cor: '#8b5cf6' },
  { nome: 'Saúde Mental - Depressão', descricao: 'Acompanhamento depressão', cor: '#6366f1' },
  { nome: 'DORT/LER', descricao: 'Distúrbios osteomusculares', cor: '#10b981' },
  { nome: 'Pré-natal', descricao: 'Acompanhamento gestacional', cor: '#ec4899' },
  { nome: 'Puericultura', descricao: 'Acompanhamento infantil', cor: '#06b6d4' },
  { nome: 'Idoso', descricao: 'Cuidados geriátricos', cor: '#84cc16' },
  { nome: 'Planejamento Familiar', descricao: 'Orientação contraceptiva', cor: '#f97316' }
]

const TIPOS_RASTREIO = [
  'mamografia',
  'citologia',
  'colonoscopia',
  'densitometria',
  'ecocardiograma',
  'eletrocardiograma',
  'oftalmologia',
  'dermatologia'
]

const CIDS_PRINCIPAIS = [
  'Z00', 'Z01', 'I10', 'E78', 'E11', 'E66', 'M54', 'F41', 'F32', 'R06',
  'R50', 'K59', 'N39', 'L30', 'H57', 'J44', 'I25', 'F43', 'M79', 'R10'
]

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

async function populateCompleteData() {
  console.log('🚀 Iniciando população completa dos dados...\n')

  try {
    // 1. Buscar pacientes existentes
    console.log('📋 1. Buscando pacientes existentes...')
    const { data: pacientes, error: pacientesError } = await supabase
      .from('pacientes')
      .select('id, data_nascimento, sexo')
      .limit(8000)

    if (pacientesError) {
      console.error('❌ Erro ao buscar pacientes:', pacientesError)
      return
    }

    console.log(`✅ Encontrados ${pacientes.length} pacientes`)

    // 2. Popular Linhas de Cuidado
    console.log('\n📋 2. Inserindo linhas de cuidado...')
    const { error: linhasError } = await supabase
      .from('linhas_cuidado')
      .upsert(LINHAS_CUIDADO, { onConflict: 'nome' })

    if (linhasError) {
      console.error('❌ Erro ao inserir linhas de cuidado:', linhasError)
    } else {
      console.log(`✅ ${LINHAS_CUIDADO.length} linhas de cuidado inseridas`)
    }

    // Buscar IDs das linhas de cuidado
    const { data: linhasCuidado } = await supabase
      .from('linhas_cuidado')
      .select('id, nome')

    // 3. Popular Atendimentos
    console.log('\n📋 3. Gerando atendimentos (4.825 registros)...')
    const atendimentos = []
    const totalAtendimentos = 4825

    for (let i = 0; i < totalAtendimentos; i++) {
      const paciente = pacientes[Math.floor(Math.random() * pacientes.length)]
      const dataAtendimento = getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31))
      
      atendimentos.push({
        paciente_id: paciente.id,
        data_atendimento: dataAtendimento.toISOString().split('T')[0],
        tipo_atendimento: Math.random() < 0.7 ? 'aps' : 'pa_virtual',
        cid_principal: CIDS_PRINCIPAIS[Math.floor(Math.random() * CIDS_PRINCIPAIS.length)],
        motivo_consulta: [
          'Consulta de rotina', 'Renovação de receita', 'Controle de pressão',
          'Dor nas costas', 'Cefaleia', 'Sintomas gripais', 'Controle diabetes',
          'Ansiedade', 'Insônia', 'Dor abdominal'
        ][Math.floor(Math.random() * 10)],
        profissional_responsavel: [
          'Dr. João Silva', 'Dra. Maria Santos', 'Dr. Pedro Costa',
          'Dra. Ana Oliveira', 'Dr. Carlos Ferreira'
        ][Math.floor(Math.random() * 5)],
        especialidade: Math.random() < 0.8 ? 'Medicina de Família' : 'Clínica Geral',
        status: 'realizado'
      })

      if ((i + 1) % 1000 === 0) {
        console.log(`   Preparados ${i + 1}/${totalAtendimentos} atendimentos...`)
      }
    }

    // Inserir atendimentos em lotes
    const batchSize = 1000
    let atendimentosInseridos = 0

    for (let i = 0; i < atendimentos.length; i += batchSize) {
      const batch = atendimentos.slice(i, i + batchSize)
      const { error: atendimentosError } = await supabase
        .from('atendimentos')
        .insert(batch)

      if (atendimentosError) {
        console.error(`❌ Erro no lote ${Math.floor(i/batchSize) + 1}:`, atendimentosError.message)
      } else {
        atendimentosInseridos += batch.length
        console.log(`✅ Inseridos ${atendimentosInseridos}/${totalAtendimentos} atendimentos`)
      }
    }

    // 4. Popular Exames Laboratoriais
    console.log('\n📋 4. Gerando exames laboratoriais (3.500 registros)...')
    const exames = []
    const totalExames = 3500

    for (let i = 0; i < totalExames; i++) {
      const paciente = pacientes[Math.floor(Math.random() * pacientes.length)]
      const dataExame = getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31))
      
      const tipoExame = [
        'hemograma_completo', 'glicemia_jejum', 'hba1c', 'perfil_lipidico',
        'funcao_renal', 'funcao_hepatica', 'eas', 'tsh'
      ][Math.floor(Math.random() * 8)]

      const exame = {
        paciente_id: paciente.id,
        data_exame: dataExame.toISOString().split('T')[0],
        tipo_exame: tipoExame
      }

      // Adicionar resultados baseados no tipo
      if (['glicemia_jejum', 'hba1c'].includes(tipoExame)) {
        exame.resultado_glicemia = getRandomInt(80, 250)
        exame.resultado_hba1c = getRandomFloat(5.0, 12.0)
      }

      if (tipoExame === 'perfil_lipidico') {
        exame.colesterol_total = getRandomInt(150, 300)
        exame.colesterol_hdl = getRandomInt(30, 80)
        exame.colesterol_ldl = getRandomInt(80, 200)
        exame.triglicerides = getRandomInt(80, 400)
      }

      // Sempre incluir dados vitais básicos
      exame.pressao_sistolica = getRandomInt(90, 180)
      exame.pressao_diastolica = getRandomInt(60, 110)
      exame.peso = getRandomFloat(45.0, 120.0)
      exame.altura = getRandomFloat(1.50, 1.95)
      exame.imc = parseFloat((exame.peso / (exame.altura * exame.altura)).toFixed(1))

      exames.push(exame)

      if ((i + 1) % 500 === 0) {
        console.log(`   Preparados ${i + 1}/${totalExames} exames...`)
      }
    }

    // Inserir exames em lotes
    let examesInseridos = 0
    for (let i = 0; i < exames.length; i += batchSize) {
      const batch = exames.slice(i, i + batchSize)
      const { error: examesError } = await supabase
        .from('exames_laboratoriais')
        .insert(batch)

      if (examesError) {
        console.error(`❌ Erro no lote de exames:`, examesError.message)
      } else {
        examesInseridos += batch.length
        console.log(`✅ Inseridos ${examesInseridos}/${totalExames} exames`)
      }
    }

    // 5. Popular Rastreios
    console.log('\n📋 5. Gerando rastreios (2.500 registros)...')
    const rastreios = []
    const totalRastreios = 2500

    for (let i = 0; i < totalRastreios; i++) {
      const paciente = pacientes[Math.floor(Math.random() * pacientes.length)]
      const tipoRastreio = TIPOS_RASTREIO[Math.floor(Math.random() * TIPOS_RASTREIO.length)]
      const dataSolicitacao = getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31))
      const dataVencimento = new Date(dataSolicitacao.getTime() + (365 * 24 * 60 * 60 * 1000)) // 1 ano

      const rastreio = {
        paciente_id: paciente.id,
        tipo_rastreio: tipoRastreio,
        data_solicitacao: dataSolicitacao.toISOString().split('T')[0],
        data_vencimento: dataVencimento.toISOString().split('T')[0],
        status: ['pendente', 'realizado', 'vencido'][Math.floor(Math.random() * 3)]
      }

      if (rastreio.status === 'realizado') {
        const dataRealizacao = getRandomDate(dataSolicitacao, new Date())
        rastreio.data_realizacao = dataRealizacao.toISOString().split('T')[0]
        rastreio.resultado = ['normal', 'alterado', 'inconclusivo'][Math.floor(Math.random() * 3)]
      }

      rastreios.push(rastreio)

      if ((i + 1) % 500 === 0) {
        console.log(`   Preparados ${i + 1}/${totalRastreios} rastreios...`)
      }
    }

    // Inserir rastreios em lotes
    let rastreiosInseridos = 0
    for (let i = 0; i < rastreios.length; i += batchSize) {
      const batch = rastreios.slice(i, i + batchSize)
      const { error: rastreiosError } = await supabase
        .from('rastreios')
        .insert(batch)

      if (rastreiosError) {
        console.error(`❌ Erro no lote de rastreios:`, rastreiosError.message)
      } else {
        rastreiosInseridos += batch.length
        console.log(`✅ Inseridos ${rastreiosInseridos}/${totalRastreios} rastreios`)
      }
    }

    // 6. Popular Pacientes-Linhas de Cuidado
    console.log('\n📋 6. Vinculando pacientes às linhas de cuidado...')
    const pacientesLinhas = []

    // Hipertensão: 1.847 pacientes
    for (let i = 0; i < 1847; i++) {
      const paciente = pacientes[Math.floor(Math.random() * pacientes.length)]
      const linhaHipertensao = linhasCuidado.find(l => l.nome === 'Hipertensão Arterial')
      
      pacientesLinhas.push({
        paciente_id: paciente.id,
        linha_cuidado_id: linhaHipertensao.id,
        data_inclusao: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)).toISOString().split('T')[0],
        status: 'ativo'
      })
    }

    // Diabetes: 926 pacientes  
    for (let i = 0; i < 926; i++) {
      const paciente = pacientes[Math.floor(Math.random() * pacientes.length)]
      const linhaDiabetes = linhasCuidado.find(l => l.nome === 'Diabetes Mellitus')
      
      pacientesLinhas.push({
        paciente_id: paciente.id,
        linha_cuidado_id: linhaDiabetes.id,
        data_inclusao: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)).toISOString().split('T')[0],
        status: 'ativo'
      })
    }

    // Obesidade: 1.544 pacientes
    for (let i = 0; i < 1544; i++) {
      const paciente = pacientes[Math.floor(Math.random() * pacientes.length)]
      const linhaObesidade = linhasCuidado.find(l => l.nome === 'Obesidade')
      
      pacientesLinhas.push({
        paciente_id: paciente.id,
        linha_cuidado_id: linhaObesidade.id,
        data_inclusao: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)).toISOString().split('T')[0],
        status: 'ativo'
      })
    }

    // Inserir vinculações em lotes
    let vinculacoesInseridas = 0
    for (let i = 0; i < pacientesLinhas.length; i += batchSize) {
      const batch = pacientesLinhas.slice(i, i + batchSize)
      const { error: vinculacoesError } = await supabase
        .from('pacientes_linhas_cuidado')
        .upsert(batch, { onConflict: 'paciente_id,linha_cuidado_id' })

      if (vinculacoesError) {
        console.error(`❌ Erro nas vinculações:`, vinculacoesError.message)
      } else {
        vinculacoesInseridas += batch.length
        console.log(`✅ Vinculações inseridas: ${vinculacoesInseridas}/${pacientesLinhas.length}`)
      }
    }

    console.log('\n🎉 POPULAÇÃO DE DADOS CONCLUÍDA!')
    console.log('=====================================')
    console.log(`✅ Atendimentos: ${atendimentosInseridos}`)
    console.log(`✅ Exames: ${examesInseridos}`)
    console.log(`✅ Rastreios: ${rastreiosInseridos}`)
    console.log(`✅ Vinculações: ${vinculacoesInseridas}`)
    console.log(`✅ Linhas de Cuidado: ${LINHAS_CUIDADO.length}`)

  } catch (error) {
    console.error('💥 Erro fatal na população de dados:', error)
  }
}

populateCompleteData()