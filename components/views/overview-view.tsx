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
    <div className="space-y-8">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total de Pacientes"
          value={demograficos?.total_pacientes || 0}
          subtitle="Pacientes cadastrados"
          icon={Users}
          color="primary"
          isLoading={isLoading}
          onClick={() => onNavigateToTable?.('pacientes-geral')}
        />
        
        <KPICard
          title="Taxa de Vinculação"
          value={`${cobertura?.taxa_vinculacao || 0}%`}
          subtitle={`${cobertura?.vidas_vinculadas || 0} vinculados`}
          icon={Heart}
          color="success"
          trend={{
            value: 2.3,
            isPositive: true,
            label: 'vs mês anterior'
          }}
          isLoading={isLoading}
          onClick={() => onNavigateToTable?.('pacientes-vinculados')}
        />
        
        <KPICard
          title="Atendimentos APS"
          value={cobertura?.consultas_mes_atual || 0}
          subtitle="Consultas no mês atual"
          icon={Activity}
          color="info"
          trend={{
            value: cobertura?.incremento_mes || 0,
            isPositive: true,
            label: 'vs mês anterior'
          }}
          isLoading={isLoading}
          onClick={() => onNavigateToTable?.('atendimentos-mes')}
        />
        
        <KPICard
          title="Meta de Cobertura"
          value={`${cobertura?.meta_cobertura || 90}%`}
          subtitle="Objetivo de vinculação"
          icon={TrendingUp}
          color={cobertura && cobertura.taxa_vinculacao >= cobertura.meta_cobertura ? 'success' : 'warning'}
          isLoading={isLoading}
        />
      </div>

      {/* Gráficos Demográficos */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Perfil Demográfico
        </h3>
        
        {demograficos ? (
          <DemographicCharts
            data={{
              composicaoFamiliar: demograficos.composicao_familiar || [],
              distribuicaoSexo: demograficos.distribuicao_sexo || [],
              distribuicaoEtaria: demograficos.distribuicao_etaria || [],
              tempoPrograma: demograficos.tempo_programa || []
            }}
            totalPacientes={demograficos.total_pacientes || 0}
            isLoading={isLoading}
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg border p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="w-64 h-64 bg-gray-200 rounded-full mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Carregando dados demográficos...
          </div>
        )}
      </div>

      {/* Cobertura Populacional */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Cobertura Populacional
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Status de Vinculação */}
          <DonutChart
            title="Status de Vinculação"
            data={[
              {
                label: 'Vinculados',
                value: cobertura?.vidas_vinculadas || 0,
                percentage: cobertura ? Math.round((cobertura.vidas_vinculadas / cobertura.vidas_elegiveis) * 100) : 0,
                color: '#10b981'
              },
              {
                label: 'Não Vinculados',
                value: cobertura?.nao_vinculados || 0,
                percentage: cobertura ? Math.round((cobertura.nao_vinculados / cobertura.vidas_elegiveis) * 100) : 0,
                color: '#ef4444'
              }
            ]}
            centerValue={{
              label: 'Total',
              value: cobertura?.vidas_elegiveis || 0
            }}
            size="lg"
            isLoading={isLoading}
            onSegmentClick={(segment) => {
              const filter = segment.label === 'Vinculados' ? 'vinculados' : 'nao_vinculados'
              onNavigateToTable?.('pacientes-status', { filters: { status_vinculacao: filter } })
            }}
          />

          {/* Gráfico de Controle */}
          <DonutChart
            title="Controle da População Vinculada"
            data={[
              {
                label: 'Controlado',
                value: cobertura?.controlado_total || 0,
                percentage: cobertura ? Math.round((cobertura.controlado_total / cobertura.vidas_vinculadas) * 100) : 0,
                color: '#10b981'
              },
              {
                label: 'Controle Inadequado',
                value: cobertura?.controle_inadequado_total || 0,
                percentage: cobertura ? Math.round((cobertura.controle_inadequado_total / cobertura.vidas_vinculadas) * 100) : 0,
                color: '#f59e0b'
              },
              {
                label: 'Inadequado',
                value: cobertura?.inadequado_total || 0,
                percentage: cobertura ? Math.round((cobertura.inadequado_total / cobertura.vidas_vinculadas) * 100) : 0,
                color: '#ef4444'
              }
            ]}
            centerValue={{
              label: 'Vinculados',
              value: cobertura?.vidas_vinculadas || 0
            }}
            size="lg"
            isLoading={isLoading}
            onSegmentClick={(segment) => {
              onNavigateToTable?.('pacientes-controle', { filters: { controle: segment.label.toLowerCase() } })
            }}
          />
        </div>
      </div>

      {/* Utilização APS */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Utilização da Atenção Primária à Saúde
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Total de Atendimentos"
            value={data?.utilizacao_aps?.total_atendimentos || 0}
            subtitle="Atendimentos registrados"
            icon={Activity}
            color="info"
            isLoading={isLoading}
          />
          
          <KPICard
            title="Pacientes Únicos"
            value={data?.utilizacao_aps?.pacientes_unicos || 0}
            subtitle="Pacientes diferentes"
            icon={Users}
            color="success"
            isLoading={isLoading}
          />
          
          <KPICard
            title="Taxa de Recorrência"
            value={`${data?.utilizacao_aps?.taxa_recorrencia || 0}`}
            subtitle="Atendimentos por paciente"
            icon={TrendingUp}
            color="warning"
            isLoading={isLoading}
          />
          
          <KPICard
            title="Taxa de Encaminhamento"
            value={`${data?.utilizacao_aps?.taxa_encaminhamento || 0}%`}
            subtitle="Encaminhamentos externos"
            icon={Activity}
            color="primary"
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Distribuição de Risco */}
          <DonutChart
            title="Distribuição por Nível de Risco"
            data={data?.utilizacao_aps?.distribuicao_risco?.map((item, index) => ({
              label: item.nivel,
              value: item.quantidade,
              percentage: item.percentual,
              color: ['#22c55e', '#facc15', '#ef4444'][index] || '#3b82f6' // Verde, amarelo, vermelho - cores exatas do protótipo
            })) || []}
            centerValue={{
              label: 'Total',
              value: data?.utilizacao_aps?.total_atendimentos || 0
            }}
            size="lg"
            isLoading={isLoading}
          />

          {/* Top CIDs */}
          <div className="bg-white rounded-lg border p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Motivos de Consulta</h4>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {data?.utilizacao_aps?.top_motivos?.map((motivo, index) => (
                  <div key={motivo.cid} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {motivo.cid}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {motivo.descricao}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${motivo.percentual}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 min-w-[3rem] text-right">
                          {motivo.percentual}%
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {motivo.atendimentos.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        atendimentos
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PA Virtual */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Pronto Atendimento Virtual
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <KPICard
            title="Atendimentos PA Virtual"
            value={data?.utilizacao_pa_virtual?.total_atendimentos || 0}
            subtitle="Teleconsultas realizadas"
            icon={Activity}
            color="primary"
            isLoading={isLoading}
          />
          
          <KPICard
            title="Pacientes Únicos"
            value={data?.utilizacao_pa_virtual?.pacientes_unicos || 0}
            subtitle="Diferentes usuários"
            icon={Users}
            color="success"
            isLoading={isLoading}
          />
          
          <KPICard
            title="Taxa de Resolução"
            value={`${data?.utilizacao_pa_virtual?.taxa_resolucao || 0}%`}
            subtitle="Casos resolvidos remotamente"
            icon={TrendingUp}
            color="info"
            isLoading={isLoading}
          />
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Desfechos</h4>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data?.utilizacao_pa_virtual?.distribuicao_desfecho?.map((desfecho, index) => (
                <div key={desfecho.desfecho} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {desfecho.quantidade.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {desfecho.desfecho}
                  </div>
                  <div className="text-xs text-gray-500">
                    {desfecho.percentual}% do total
                  </div>
                  <div className="mt-2 bg-white rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${desfecho.percentual}%`,
                        backgroundColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#f59e0b' // Cores exatas do protótipo
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}