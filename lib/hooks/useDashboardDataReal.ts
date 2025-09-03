'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Filters } from '@/types'

export interface DashboardData {
  demograficos: {
    total_pacientes: number
    composicao_familiar: Array<{ label: string; count: number; percentage: number }>
    distribuicao_sexo: Array<{ label: string; count: number; percentage: number }>
    distribuicao_etaria: Array<{ label: string; count: number; percentage: number }>
  }
  cobertura: {
    vidas_elegiveis: number
    vidas_vinculadas: number
    nao_vinculados: number
    taxa_vinculacao: number
    controlado_total: number
    controle_inadequado_total: number
    inadequado_total: number
    consultas_mes_atual: number
    incremento_mes: number
    meta_cobertura: number
  }
}

async function fetchDashboardOverview(filters: Filters): Promise<DashboardData> {
  // 1. Buscar total de pacientes
  const { data: pacientes, error: pacientesError } = await supabase
    .from('pacientes')
    .select('id, sexo, data_nascimento, status_vinculacao, titularidade')
  
  if (pacientesError) throw pacientesError

  const totalPacientes = pacientes?.length || 0
  
  // 2. Calcular composição familiar
  const titulares = pacientes?.filter(p => p.titularidade === 'titular').length || 0
  const dependentes = totalPacientes - titulares
  
  const composicaoFamiliar = [
    { 
      label: 'Titulares', 
      count: titulares, 
      percentage: Math.round((titulares / totalPacientes) * 100) 
    },
    { 
      label: 'Dependentes', 
      count: dependentes, 
      percentage: Math.round((dependentes / totalPacientes) * 100) 
    }
  ]

  // 3. Calcular distribuição por sexo
  const masculino = pacientes?.filter(p => p.sexo === 'masculino').length || 0
  const feminino = totalPacientes - masculino
  
  const distribuicaoSexo = [
    { 
      label: 'Feminino', 
      count: feminino, 
      percentage: Math.round((feminino / totalPacientes) * 100) 
    },
    { 
      label: 'Masculino', 
      count: masculino, 
      percentage: Math.round((masculino / totalPacientes) * 100) 
    }
  ]

  // 4. Calcular distribuição etária
  const hoje = new Date()
  const faixasEtarias = {
    '0-17': 0,
    '18-39': 0,
    '40-59': 0,
    '60+': 0
  }

  pacientes?.forEach(paciente => {
    if (!paciente.data_nascimento) return
    
    const nascimento = new Date(paciente.data_nascimento)
    const idade = hoje.getFullYear() - nascimento.getFullYear()
    
    if (idade <= 17) faixasEtarias['0-17']++
    else if (idade <= 39) faixasEtarias['18-39']++
    else if (idade <= 59) faixasEtarias['40-59']++
    else faixasEtarias['60+']++
  })

  const distribuicaoEtaria = Object.entries(faixasEtarias).map(([faixa, count]) => ({
    label: faixa,
    count,
    percentage: Math.round((count / totalPacientes) * 100)
  }))

  // 5. Buscar dados de cobertura
  const vinculados = pacientes?.filter(p => p.status_vinculacao === 'vinculado').length || 0
  const naoVinculados = totalPacientes - vinculados
  const taxaVinculacao = Math.round((vinculados / totalPacientes) * 100)

  // Simular dados de controle (seria calculado com base em exames/linhas de cuidado)
  const controlado = Math.round(vinculados * 0.52) // ~52% controlados
  const controleInadequado = Math.round(vinculados * 0.25) // ~25% controle inadequado
  const inadequado = vinculados - controlado - controleInadequado

  // 6. Buscar atendimentos do mês atual
  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const { data: atendimentos } = await supabase
    .from('atendimentos')
    .select('id')
    .gte('data_atendimento', inicioMes.toISOString().split('T')[0])

  const consultasMes = atendimentos?.length || 0

  return {
    demograficos: {
      total_pacientes: totalPacientes,
      composicao_familiar: composicaoFamiliar,
      distribuicao_sexo: distribuicaoSexo,
      distribuicao_etaria: distribuicaoEtaria
    },
    cobertura: {
      vidas_elegiveis: totalPacientes,
      vidas_vinculadas: vinculados,
      nao_vinculados: naoVinculados,
      taxa_vinculacao: taxaVinculacao,
      controlado_total: controlado,
      controle_inadequado_total: controleInadequado,
      inadequado_total: inadequado,
      consultas_mes_atual: consultasMes,
      incremento_mes: 54, // Valor fixo do protótipo
      meta_cobertura: 90
    }
  }
}

export function useDashboardOverview(filters: Filters) {
  return useQuery({
    queryKey: ['dashboard-overview', filters],
    queryFn: () => fetchDashboardOverview(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false
  })
}

// Hook para dados de atendimentos
export function useAtendimentosData(filters: Filters) {
  return useQuery({
    queryKey: ['atendimentos-data', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('atendimentos')
        .select(`
          id,
          data_atendimento,
          tipo_atendimento,
          cid_principal,
          motivo_consulta,
          profissional_responsavel,
          especialidade
        `)
        .order('data_atendimento', { ascending: false })
        .limit(1000)

      if (error) throw error
      return data || []
    },
    staleTime: 5 * 60 * 1000
  })
}

// Hook para dados de exames
export function useExamesData(filters: Filters) {
  return useQuery({
    queryKey: ['exames-data', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exames_laboratoriais')
        .select(`
          id,
          data_exame,
          tipo_exame,
          resultado_glicemia,
          resultado_hba1c,
          pressao_sistolica,
          pressao_diastolica,
          peso,
          altura,
          imc
        `)
        .order('data_exame', { ascending: false })
        .limit(1000)

      if (error) throw error
      return data || []
    },
    staleTime: 5 * 60 * 1000
  })
}

// Hook para dados de rastreios  
export function useRastreiosData(filters: Filters) {
  return useQuery({
    queryKey: ['rastreios-data', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rastreios')
        .select(`
          id,
          tipo_rastreio,
          data_solicitacao,
          data_realizacao,
          data_vencimento,
          status,
          resultado
        `)
        .order('data_solicitacao', { ascending: false })
        .limit(1000)

      if (error) throw error
      return data || []
    },
    staleTime: 5 * 60 * 1000
  })
}