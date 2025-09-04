'use client'

import React from 'react'
import { Users, Heart, Activity, TrendingUp } from 'lucide-react'
import { KPICard } from '@/components/ui/kpi-card'
import { DonutChart, DemographicCharts } from '@/components/charts/donut-chart'
import { useDashboardOverview } from '@/lib/hooks/useDashboardData'
import type { Filters } from '@/types'

interface OverviewViewProps {
  filters: Filters
  onNavigateToTable?: (viewType: string, context?: any) => void
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  filters,
  onNavigateToTable
}) => {
  const { data, isLoading, error } = useDashboardOverview(filters)

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Erro ao carregar dados</h3>
          <p className="text-gray-600 text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  const demograficos = data?.demograficos
  const cobertura = data?.cobertura

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Layout em Grid 2 Colunas - EXATO conforme protótipo */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* COLUNA ESQUERDA */}
        <div className="space-y-6">
          
          {/* Cobertura Populacional */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Cobertura Populacional</h3>
            
            {/* KPIs Principais da Cobertura */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {cobertura?.vidas_elegiveis?.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-gray-600">Vidas Elegíveis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {cobertura?.taxa_vinculacao || 0}%
                </div>
                <div className="text-sm text-gray-600">Taxa de Vinculação</div>
              </div>
            </div>
            
            {/* Funnel Chart de Cobertura */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="font-medium text-blue-900">Elegíveis</span>
                <span className="font-bold text-blue-900">{cobertura?.vidas_elegiveis?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded" style={{marginLeft: '20px'}}>
                <span className="font-medium text-green-900">Vinculados</span>
                <span className="font-bold text-green-900">{cobertura?.vidas_vinculadas?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded" style={{marginLeft: '40px'}}>
                <span className="font-medium text-emerald-900">Controlados</span>
                <span className="font-bold text-emerald-900">{cobertura?.controlado_total?.toLocaleString() || '0'}</span>
              </div>
            </div>
            
            {/* Evolução Temporal */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-md font-medium text-gray-700 mb-4">Evolução nos Últimos 6 Meses</h4>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Gráfico de Evolução Temporal</span>
              </div>
            </div>
          </div>
          
          {/* Respondentes do Perfil de Saúde */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Respondentes do Perfil de Saúde</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-xl font-bold text-green-600 mb-1">85%</div>
                <div className="text-xs text-green-700">Taxa de Resposta</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-xl font-bold text-blue-600 mb-1">{(demograficos?.total_pacientes * 0.85)?.toFixed(0) || '0'}</div>
                <div className="text-xs text-blue-700">Respondentes</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <div className="text-xl font-bold text-yellow-600 mb-1">7.2</div>
                <div className="text-xs text-yellow-700">Nota Média</div>
              </div>
            </div>
            
            {/* Barras de Progresso por Categoria */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Hipertensão</span>
                  <span className="text-gray-600">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: '68%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Diabetes</span>
                  <span className="text-gray-600">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Obesidade</span>
                  <span className="text-gray-600">32%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '32%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Saúde Mental</span>
                  <span className="text-gray-600">28%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '28%'}}></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* COLUNA DIREITA */}
        <div className="space-y-6">
          
          {/* Utilização APS */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Utilização da Atenção Primária</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-xl font-bold text-blue-600 mb-1">
                  {data?.utilizacao_aps?.total_atendimentos?.toLocaleString() || '0'}
                </div>
                <div className="text-xs text-blue-700">Total Atendimentos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-xl font-bold text-green-600 mb-1">
                  {data?.utilizacao_aps?.pacientes_unicos?.toLocaleString() || '0'}
                </div>
                <div className="text-xs text-green-700">Pacientes Únicos</div>
              </div>
            </div>
            
            {/* Top 5 Motivos de Consulta */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">Top 5 Motivos de Consulta</h4>
              <div className="space-y-3">
                {data?.utilizacao_aps?.top_motivos?.slice(0, 5).map((motivo, index) => (
                  <div key={motivo.cid} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{motivo.cid}</span>
                        <span className="text-sm text-gray-900">{motivo.descricao}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${motivo.percentual}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm font-semibold">{motivo.atendimentos}</div>
                      <div className="text-xs text-gray-500">{motivo.percentual}%</div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-4">Carregando dados...</div>
                )}
              </div>
            </div>
            
            {/* Distribuição por Risco */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Distribuição por Nível de Risco</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">45%</div>
                  <div className="text-xs text-green-700">Baixo</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded">
                  <div className="text-lg font-bold text-yellow-600">35%</div>
                  <div className="text-xs text-yellow-700">Médio</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <div className="text-lg font-bold text-red-600">20%</div>
                  <div className="text-xs text-red-700">Alto</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Top 5 Especialistas e Sensíveis a APS */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Especialistas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Cardiologia</span>
                  <span className="text-sm text-blue-600 font-semibold">1.2k</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Endocrinologia</span>
                  <span className="text-sm text-blue-600 font-semibold">987</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Neurologia</span>
                  <span className="text-sm text-blue-600 font-semibold">654</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Ortopedia</span>
                  <span className="text-sm text-blue-600 font-semibold">432</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Dermatologia</span>
                  <span className="text-sm text-blue-600 font-semibold">321</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensíveis a APS</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium">Hipertensão</span>
                  <div className="text-right">
                    <span className="text-sm text-green-600 font-semibold">89%</span>
                    <div className="text-xs text-gray-500">2.1k casos</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium">Diabetes Tipo 2</span>
                  <div className="text-right">
                    <span className="text-sm text-green-600 font-semibold">82%</span>
                    <div className="text-xs text-gray-500">1.8k casos</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <span className="text-sm font-medium">DPOC</span>
                  <div className="text-right">
                    <span className="text-sm text-yellow-600 font-semibold">76%</span>
                    <div className="text-xs text-gray-500">543 casos</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <span className="text-sm font-medium">Asma</span>
                  <div className="text-right">
                    <span className="text-sm text-orange-600 font-semibold">71%</span>
                    <div className="text-xs text-gray-500">432 casos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seção adicional de KPIs gerais na parte inferior */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Indicadores Gerais do Programa</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {demograficos?.total_pacientes?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-600">Total de Pacientes</div>
            <div className="text-xs text-green-600 mt-1">↗ +12% vs mês anterior</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {cobertura?.taxa_vinculacao || 0}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Vinculação</div>
            <div className="text-xs text-green-600 mt-1">↗ +2.3% vs mês anterior</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {data?.utilizacao_aps?.total_atendimentos?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-600">Atendimentos APS</div>
            <div className="text-xs text-green-600 mt-1">↗ +8% vs mês anterior</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {data?.utilizacao_pa_virtual?.taxa_resolucao || 0}%
            </div>
            <div className="text-sm text-gray-600">Taxa Resolução PA Virtual</div>
            <div className="text-xs text-green-600 mt-1">↗ +5% vs mês anterior</div>
          </div>
        </div>
      </div>
    </div>
  )
}