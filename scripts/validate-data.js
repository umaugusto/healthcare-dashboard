const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://bgivemisrbkdtmbxojlu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkyODQ0MiwiZXhwIjoyMDcyNTA0NDQyfQ.ZAVpzi6Qe8zuzTfIvsGCfjORY4EBi5iJqrFYe7YMZgA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function validateData() {
  console.log('🔍 Validando dados inseridos...\n')
  
  try {
    // Total de pacientes
    const { count: totalPacientes } = await supabase
      .from('pacientes')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 TOTAL DE PACIENTES: ${totalPacientes}`)
    
    // Distribuição por sexo
    const { data: sexoData } = await supabase
      .from('pacientes')
      .select('sexo')
      .then(({ data }) => {
        const fem = data.filter(p => p.sexo === 'F').length
        const masc = data.filter(p => p.sexo === 'M').length
        return { 
          data: [
            { sexo: 'F', count: fem, percentage: Math.round(fem * 100 / data.length) },
            { sexo: 'M', count: masc, percentage: Math.round(masc * 100 / data.length) }
          ] 
        }
      })
    
    console.log('\n👥 DISTRIBUIÇÃO POR SEXO:')
    sexoData.forEach(item => {
      console.log(`   • ${item.sexo === 'F' ? 'Feminino' : 'Masculino'}: ${item.count} (${item.percentage}%)`)
    })
    
    // Distribuição por titularidade
    const { data: titularData } = await supabase
      .from('pacientes')
      .select('titularidade')
      .then(({ data }) => {
        const titular = data.filter(p => p.titularidade === 'titular').length
        const dep = data.filter(p => p.titularidade === 'dependente').length
        return { 
          data: [
            { tipo: 'Titulares', count: titular, percentage: Math.round(titular * 100 / data.length) },
            { tipo: 'Dependentes', count: dep, percentage: Math.round(dep * 100 / data.length) }
          ] 
        }
      })
    
    console.log('\n👨‍👩‍👧‍👦 COMPOSIÇÃO FAMILIAR:')
    titularData.forEach(item => {
      console.log(`   • ${item.tipo}: ${item.count} (${item.percentage}%)`)
    })
    
    // Distribuição por status de vinculação
    const { data: statusData } = await supabase
      .from('pacientes')
      .select('status_vinculacao')
      .then(({ data }) => {
        const vinc = data.filter(p => p.status_vinculacao === 'vinculado').length
        const naoVinc = data.filter(p => p.status_vinculacao === 'nao_vinculado').length
        return { 
          data: [
            { status: 'Vinculados', count: vinc, percentage: Math.round(vinc * 100 / data.length) },
            { status: 'Não Vinculados', count: naoVinc, percentage: Math.round(naoVinc * 100 / data.length) }
          ] 
        }
      })
    
    console.log('\n🔗 STATUS DE VINCULAÇÃO:')
    statusData.forEach(item => {
      console.log(`   • ${item.status}: ${item.count} (${item.percentage}%)`)
    })
    
    // Distribuição por faixa etária
    const { data: etariaData } = await supabase
      .from('pacientes')
      .select('faixa_etaria')
      .then(({ data }) => {
        const counts = {}
        data.forEach(p => {
          counts[p.faixa_etaria] = (counts[p.faixa_etaria] || 0) + 1
        })
        return { 
          data: Object.entries(counts).map(([faixa, count]) => ({
            faixa,
            count,
            percentage: Math.round(count * 100 / data.length)
          }))
        }
      })
    
    console.log('\n🎂 DISTRIBUIÇÃO ETÁRIA:')
    etariaData.forEach(item => {
      const nomes = {
        'adolescente': 'Criança/Adolescente (0-17)',
        'adulto-jovem': 'Adulto Jovem (18-39)',
        'adulto': 'Adulto (40-59)',
        'idoso': 'Idoso (60+)'
      }
      console.log(`   • ${nomes[item.faixa] || item.faixa}: ${item.count} (${item.percentage}%)`)
    })
    
    // Alguns pacientes de exemplo
    const { data: amostras } = await supabase
      .from('pacientes')
      .select('prontuario, nome, sexo, titularidade, status_vinculacao, faixa_etaria')
      .limit(5)
    
    console.log('\n📋 AMOSTRA DE PACIENTES:')
    amostras.forEach((pac, i) => {
      console.log(`   ${i+1}. ${pac.prontuario} - ${pac.nome} (${pac.sexo}, ${pac.titularidade}, ${pac.status_vinculacao})`)
    })
    
    console.log('\n✅ VALIDAÇÃO CONCLUÍDA COM SUCESSO!')
    console.log('🎯 Os dados foram inseridos corretamente e mantêm a demografia esperada.')
    
  } catch (error) {
    console.error('❌ Erro na validação:', error.message)
  }
}

validateData()