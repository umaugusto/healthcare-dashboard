'use client'

import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

export interface ExportData {
  sheets: Array<{
    name: string
    data: any[]
    headers?: string[]
  }>
}

// Função para exportar dados para Excel
export async function exportToExcel(data: ExportData, filename: string) {
  try {
    console.log('📊 Iniciando export para Excel...')
    
    const workbook = XLSX.utils.book_new()
    
    data.sheets.forEach(sheet => {
      console.log(`📋 Adicionando aba: ${sheet.name} (${sheet.data.length} registros)`)
      
      // Converter dados para worksheet
      const worksheet = XLSX.utils.json_to_sheet(sheet.data)
      
      // Adicionar headers personalizados se fornecidos
      if (sheet.headers) {
        XLSX.utils.sheet_add_aoa(worksheet, [sheet.headers], { origin: 'A1' })
      }
      
      // Ajustar largura das colunas
      const colWidths = sheet.headers?.map(() => ({ width: 20 })) || 
                      Object.keys(sheet.data[0] || {}).map(() => ({ width: 20 }))
      worksheet['!cols'] = colWidths
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name)
    })
    
    // Gerar arquivo
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      cellStyles: true 
    })
    
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    saveAs(blob, `${filename}_${formatDate(new Date())}.xlsx`)
    
    console.log('✅ Export Excel concluído!')
    return true
    
  } catch (error) {
    console.error('❌ Erro no export Excel:', error)
    throw new Error('Falha ao exportar dados para Excel')
  }
}

// Função para exportar dados para CSV
export async function exportToCSV(data: any[], filename: string, headers?: string[]) {
  try {
    console.log('📊 Iniciando export para CSV...')
    
    if (!data.length) {
      throw new Error('Nenhum dado disponível para export')
    }
    
    // Gerar CSV
    const worksheet = XLSX.utils.json_to_sheet(data)
    
    if (headers) {
      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' })
    }
    
    const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ';' }) // Usar ; como separador
    
    const blob = new Blob(['\uFEFF' + csv], { // BOM para UTF-8
      type: 'text/csv;charset=utf-8'
    })
    
    saveAs(blob, `${filename}_${formatDate(new Date())}.csv`)
    
    console.log('✅ Export CSV concluído!')
    return true
    
  } catch (error) {
    console.error('❌ Erro no export CSV:', error)
    throw new Error('Falha ao exportar dados para CSV')
  }
}

// Função para exportar dashboard completo
export async function exportDashboardData(dashboardData: any) {
  try {
    console.log('📊 Preparando export completo do dashboard...')
    
    const exportData: ExportData = {
      sheets: []
    }
    
    // Aba de Resumo Executivo
    if (dashboardData.demograficos && dashboardData.cobertura) {
      exportData.sheets.push({
        name: 'Resumo Executivo',
        headers: ['Métrica', 'Valor', 'Descrição'],
        data: [
          {
            Métrica: 'Total de Pacientes',
            Valor: dashboardData.demograficos.total_pacientes,
            Descrição: 'Número total de pacientes cadastrados'
          },
          {
            Métrica: 'Taxa de Vinculação',
            Valor: `${dashboardData.cobertura.taxa_vinculacao}%`,
            Descrição: 'Percentual de pacientes vinculados ao programa'
          },
          {
            Métrica: 'Vidas Vinculadas',
            Valor: dashboardData.cobertura.vidas_vinculadas,
            Descrição: 'Número de pacientes ativamente vinculados'
          },
          {
            Métrica: 'Consultas do Mês',
            Valor: dashboardData.cobertura.consultas_mes_atual,
            Descrição: 'Atendimentos realizados no mês atual'
          },
          {
            Métrica: 'Meta de Cobertura',
            Valor: `${dashboardData.cobertura.meta_cobertura}%`,
            Descrição: 'Meta estabelecida para taxa de vinculação'
          }
        ]
      })
    }
    
    // Aba de Demografia
    if (dashboardData.demograficos) {
      const demo = dashboardData.demograficos
      
      const dadosDemograficos = [
        ...demo.composicao_familiar?.map((item: any) => ({
          Categoria: 'Composição Familiar',
          Tipo: item.label,
          Quantidade: item.count,
          Percentual: `${item.percentage}%`
        })) || [],
        ...demo.distribuicao_sexo?.map((item: any) => ({
          Categoria: 'Distribuição por Sexo',
          Tipo: item.label,
          Quantidade: item.count,
          Percentual: `${item.percentage}%`
        })) || [],
        ...demo.distribuicao_etaria?.map((item: any) => ({
          Categoria: 'Distribuição Etária',
          Tipo: item.label,
          Quantidade: item.count,
          Percentual: `${item.percentage}%`
        })) || []
      ]
      
      exportData.sheets.push({
        name: 'Demografia',
        headers: ['Categoria', 'Tipo', 'Quantidade', 'Percentual'],
        data: dadosDemograficos
      })
    }
    
    // Aba de Atendimentos
    if (dashboardData.utilizacao_aps) {
      const aps = dashboardData.utilizacao_aps
      
      const dadosAtendimentos = [
        {
          Métrica: 'Total de Atendimentos',
          Valor: aps.total_atendimentos,
          Tipo: 'Geral'
        },
        {
          Métrica: 'Pacientes Únicos',
          Valor: aps.pacientes_unicos,
          Tipo: 'Geral'
        },
        {
          Métrica: 'Taxa de Recorrência',
          Valor: aps.taxa_recorrencia,
          Tipo: 'Geral'
        },
        {
          Métrica: 'Taxa de Encaminhamento',
          Valor: `${aps.taxa_encaminhamento}%`,
          Tipo: 'Geral'
        },
        ...aps.top_motivos?.map((motivo: any) => ({
          Métrica: 'Top CID',
          Valor: `${motivo.cid} - ${motivo.descricao}`,
          Tipo: `${motivo.atendimentos} atendimentos (${motivo.percentual}%)`
        })) || [],
        ...aps.distribuicao_risco?.map((risco: any) => ({
          Métrica: 'Distribuição de Risco',
          Valor: risco.nivel,
          Tipo: `${risco.quantidade} pacientes (${risco.percentual}%)`
        })) || []
      ]
      
      exportData.sheets.push({
        name: 'Atendimentos APS',
        headers: ['Métrica', 'Valor', 'Tipo'],
        data: dadosAtendimentos
      })
    }
    
    // Aba de PA Virtual
    if (dashboardData.utilizacao_pa_virtual) {
      const pav = dashboardData.utilizacao_pa_virtual
      
      const dadosPAVirtual = [
        {
          Métrica: 'Total PA Virtual',
          Valor: pav.total_atendimentos,
          Detalhe: 'Teleconsultas realizadas'
        },
        {
          Métrica: 'Pacientes Únicos',
          Valor: pav.pacientes_unicos,
          Detalhe: 'Diferentes usuários atendidos'
        },
        {
          Métrica: 'Taxa de Resolução',
          Valor: `${pav.taxa_resolucao}%`,
          Detalhe: 'Casos resolvidos remotamente'
        },
        ...pav.distribuicao_desfecho?.map((desfecho: any) => ({
          Métrica: 'Desfecho',
          Valor: desfecho.desfecho,
          Detalhe: `${desfecho.quantidade} casos (${desfecho.percentual}%)`
        })) || []
      ]
      
      exportData.sheets.push({
        name: 'PA Virtual',
        headers: ['Métrica', 'Valor', 'Detalhe'],
        data: dadosPAVirtual
      })
    }
    
    await exportToExcel(exportData, 'Dashboard_APS_Completo')
    
  } catch (error) {
    console.error('❌ Erro no export do dashboard:', error)
    throw error
  }
}

// Função para gerar relatório de pacientes
export async function exportPacientesData(pacientes: any[]) {
  try {
    const dadosProcessados = pacientes.map(paciente => ({
      'ID': paciente.id,
      'Prontuário': paciente.prontuario || 'N/A',
      'Nome': paciente.nome,
      'CPF': paciente.cpf || 'N/A',
      'Data de Nascimento': formatDate(new Date(paciente.data_nascimento)),
      'Sexo': paciente.sexo === 'M' ? 'Masculino' : 'Feminino',
      'Faixa Etária': paciente.faixa_etaria || calcularFaixaEtaria(paciente.data_nascimento),
      'Titularidade': paciente.titularidade === 'titular' ? 'Titular' : 'Dependente',
      'Status': paciente.status_vinculacao === 'vinculado' ? 'Vinculado' : 'Não Vinculado',
      'Cliente': paciente.clientes?.nome || 'N/A',
      'Unidade': paciente.unidades?.nome || 'N/A',
      'Produto': paciente.produtos?.nome || 'N/A'
    }))
    
    await exportToExcel(
      {
        sheets: [{
          name: 'Pacientes',
          data: dadosProcessados
        }]
      },
      'Lista_Pacientes'
    )
    
  } catch (error) {
    console.error('❌ Erro no export de pacientes:', error)
    throw error
  }
}

// Funções auxiliares
function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  })
}

function calcularFaixaEtaria(dataNascimento: string): string {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  const idade = hoje.getFullYear() - nascimento.getFullYear()
  
  if (idade <= 12) return 'Criança'
  if (idade <= 17) return 'Adolescente'
  if (idade <= 39) return 'Adulto Jovem'
  if (idade <= 59) return 'Adulto'
  return 'Idoso'
}

// Função para gerar timestamp para nomes de arquivo
function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
}