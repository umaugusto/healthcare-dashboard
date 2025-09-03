// VERSAO GEMINI/components/charts/HipertensaoChart.tsx
// Componente: Dashboard de acompanhamento de hipertensos com filtros interativos
// Contexto: Dashboard APS - Análise detalhada de pacientes com hipertensão

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Info, Heart, TrendingUp, AlertTriangle, Activity, Calendar, Clock, FileText, Target, Users, BarChart3, ChevronDown } from 'lucide-react';
import { dadosBaseHipertensao, heatmapTaxaControle, projectColors } from '../../data/chartsData';
import { aplicarCorrelacaoEpidemiologica } from '../../data/correlations';

interface HipertensaoChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
  localFilter?: { tipo: string; valor: string; label: string } | null;
  onLocalFilterChange?: (filter: { tipo: string; valor: string; label: string } | null) => void;
}

// Componente StackedBar com interatividade
const StackedBar = ({ segments, onSegmentClick, tipoFiltro, filtroAtivo }: {
  segments: any[],
  onSegmentClick?: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro?: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const validSegments = segments.filter(segment => Number(segment.percentage) > 0);

  return (
    <div className="relative w-full bg-gray-200 rounded-lg h-12">
      {validSegments.map((segment, index) => {
        const previousWidth = validSegments.slice(0, index).reduce((sum, s) => sum + Number(s.percentage), 0);
        const showLabel = Number(segment.percentage) > 15;
        const isActive = filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === segment.label;

        let borderRadius = '0';
        if (validSegments.length === 1) {
          borderRadius = '8px';
        } else if (index === 0) {
          borderRadius = '8px 0 0 8px';
        } else if (index === validSegments.length - 1) {
          borderRadius = '0 8px 8px 0';
        }

        return (
          <div
            key={`${segment.label}-${index}`}
            className={`absolute top-0 h-full flex items-center justify-center transition-all z-10 ${
              onSegmentClick ? 'cursor-pointer hover:shadow-md' : ''
            }`}
            style={{
              left: `${previousWidth}%`,
              width: `${Number(segment.percentage)}%`,
              backgroundColor: segment.color,
              borderRadius,
              opacity: filtroAtivo && !isActive ? 0.4 : 1,
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
              border: isActive ? '2px solid #1e40af' : 'none'
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={onSegmentClick ? (e) => onSegmentClick(tipoFiltro || 'segmento', segment.label, `${tipoFiltro}: ${segment.label}`, e) : undefined}
            title={onSegmentClick ? `Filtrar por ${segment.label}` : undefined}
          >
            {showLabel && (
              <span className="text-xs font-semibold text-black bg-white/70 rounded px-1">
                {Number(segment.percentage).toFixed(1)}%
              </span>
            )}

            {hoveredIndex === index && !showLabel && (
              <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {segment.label}: {Number(segment.percentage).toFixed(1)}%
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Componente de Funil Visual - LAYOUT VERTICAL AJUSTADO
const FunnelChart = ({ data, title, icon: Icon }: {
  data: any[],
  title: string,
  icon: React.ElementType
}) => {
  const coresOtimizadas = ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee'];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>

      <div className="space-y-1">
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <div
              className="relative rounded-md p-2 transition-all duration-300 hover:shadow-md"
              style={{ backgroundColor: coresOtimizadas[index] || item.cor }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  {item.nivel}
                </span>
                <span className="text-xs font-bold text-white">
                  {item.quantidade.toLocaleString()}
                  {item.percentual && (
                    <span className="ml-1 font-normal text-white/80">
                      ({item.percentual}%)
                    </span>
                  )}
                </span>
              </div>
            </div>

            {index < data.length - 1 && (
              <div className="flex justify-center">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};


// Componente de Funil para Estágio Motivacional
const FunnelChartClickable = ({
  data,
  title,
  icon: Icon,
  onItemClick,
  tipoFiltro,
  filtroAtivo
}: {
  data: any[],
  title: string,
  icon: React.ElementType,
  onItemClick: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>

      <div className="relative">
        {data.map((item, index) => {
          const widthPercentage = 100 - (index * 15);
          const marginPercentage = (100 - widthPercentage) / 2;
          const isActive = filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === item.estagio;

          return (
            <div
              key={index}
              className="relative mb-0.5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              style={{
                marginLeft: `${marginPercentage}%`,
                marginRight: `${marginPercentage}%`,
                opacity: filtroAtivo && !isActive ? 0.4 : 1,
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
              onClick={(e) => onItemClick(tipoFiltro, item.estagio, `${title}: ${item.estagio}`, e)}
            >
              <div
                className="relative rounded-lg overflow-hidden"
                style={{
                  backgroundColor: item.cor || item.color,
                  minHeight: '28px',
                  border: isActive ? '2px solid #1e40af' : 'none'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-between px-3 py-1">
                  <span className="text-xs font-medium text-white">
                    {item.estagio}
                  </span>
                  <span className="text-xs text-white/90">
                    {item.quantidade} ({item.percentual}%)
                  </span>
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"
                />
              </div>

              {index < data.length - 1 && (
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-px h-1 bg-gray-300"
                  style={{
                    bottom: '-2px',
                    zIndex: 5
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function HipertensaoChart({ filters, onNavigateToTable, localFilter, onLocalFilterChange }: HipertensaoChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{
    tipo: string;
    valor: string;
    label: string;
  } | null>(localFilter || null);

  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosBaseHipertensao;
    return aplicarCorrelacaoEpidemiologica(dadosBaseHipertensao, filtroInterativo);
  }, [filtroInterativo]);

  // Função para navegar para tabela com contexto específico
  const handleCardClick = (chartType: string, title: string) => {
    if (onNavigateToTable) {
      onNavigateToTable('chronic-diseases');
    }
  };

  const handleFiltroInterativo = (tipo: string, valor: string, label: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const novoFiltro = (filtroInterativo?.tipo === tipo && filtroInterativo?.valor === valor) 
      ? null 
      : { tipo, valor, label };
    
    setFiltroInterativo(novoFiltro);
    
    // Propagar mudança para componente pai
    if (onLocalFilterChange) {
      onLocalFilterChange(novoFiltro);
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-rose-50 rounded">
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <span>Análise de Hipertensão</span>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">Acompanhamento e controle de hipertensos</p>
            </div>
          </CardTitle>

          <div
            className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            {showTooltip && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl z-50">
                <h4 className="font-semibold mb-2 text-sm">Sistema de Filtros Interativos</h4>
                <div className="space-y-2">
                  <p>Clique em qualquer barra, segmento ou gráfico para filtrar todos os dados.</p>
                  <p>Os valores são recalculados usando correlações epidemiológicas reais.</p>
                  <div className="mt-3">
                    <span className="font-medium">Controle da PA:</span>
                    <ul className="ml-3 mt-1 space-y-0.5">
                      <li>• Controlado: PA &lt;140/90 mmHg</li>
                      <li>• Não controlado: PA ≥140/90 mmHg</li>
                      <li>• Sem medida: Sem aferição nos últimos 12 meses</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {filtroInterativo && (
          <div className="absolute top-1 right-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            Filtrado: {filtroInterativo.label}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5 px-6">
        {/* Cards de Métricas - 6 cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* Linha 1 */}
          <div className="bg-blue-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Total LC</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-blue-600">{dados.totalLC}</p>
              <p className="text-[11px] text-gray-500">{dados.percentualLC}%</p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Total de pacientes com CID I10 em linha de cuidado</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">HAS Não Controlado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-yellow-600">
                {dados.pacientesAltaPA}
              </p>
              <p className="text-[11px] text-gray-500">
                {((dados.pacientesAltaPA / dados.totalLC) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pacientes com PA ≥140/90 mmHg na última medida</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Risco Cardiovascular Alto</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(dados.totalLC * 0.147)}
              </p>
              <p className="text-[11px] text-gray-500">
                {(14.7).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pacientes com escore de Framingham {'>'} 20%</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>

          {/* Linha 2 */}
          <div className="bg-rose-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Total Acompanhamento Inadequado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-rose-600">
                {dadosBaseHipertensao.totalSemSeguimento.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500">
                {((dadosBaseHipertensao.totalSemSeguimento / (dadosBaseHipertensao.totalSemSeguimento + dadosBaseHipertensao.totalLC)) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 max-w-[200px]">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pacientes com HAS sem medida de PA nos últimos 12 meses</div>
              <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Medidas Pendentes</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-orange-600">{dados.medidasVencidas}</p>
              <p className="text-[11px] text-gray-500">
                {((dados.medidasVencidas / dados.totalLC) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Total de exames de acompanhamento fora do prazo</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Medidas A Vencer</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-red-600">
                {Math.round(dados.totalLC * 0.12)}
              </p>
              <p className="text-[11px] text-gray-500">
                {(12).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Medidas de PA que passarão para acima de 12 meses nos próximos 90 dias</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
        </div>

        {/* Classificação da Hipertensão + Classificação de Risco */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('classificacao-hipertensao', 'Classificação da Hipertensão')}>Classificação da Hipertensão</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Classificação da Hipertensão:</div>
                  <div className="space-y-1">
                    <div>• <strong>Hipertensão Leve (estágio 1):</strong></div>
                    <div className="ml-2">PAS 140-159 ou PAD 90-99 mmHg</div>
                    <div>• <strong>Hipertensão Moderada (estágio 2):</strong></div>
                    <div className="ml-2">PAS 160-179 ou PAD 100-109 mmHg</div>
                    <div>• <strong>Hipertensão Grave (estágio 3):</strong></div>
                    <div className="ml-2">PAS ≥180 ou PAD ≥110 mmHg</div>
                  </div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <StackedBar 
                segments={dados.distribuicaoEstagio.segments.map(seg => {
                  let newLabel = seg.label;
                  if (seg.label === 'Estágio 1') newLabel = 'Leve';
                  else if (seg.label === 'Estágio 2') newLabel = 'Moderado';
                  else if (seg.label === 'Estágio 3') newLabel = 'Grave';
                  return {
                    ...seg,
                    label: newLabel
                  };
                })} 
                onSegmentClick={handleFiltroInterativo}
                tipoFiltro="nivel-hipertensao"
                filtroAtivo={filtroInterativo}
              />
            </div>
            
            <div className="flex items-center justify-center gap-4">
              {dados.distribuicaoEstagio.segments.filter(s => s.percentage > 0).map((item, index) => {
                let label = item.label;
                if (item.label === 'Estágio 1') label = 'Leve';
                else if (item.label === 'Estágio 2') label = 'Moderado';
                else if (item.label === 'Estágio 3') label = 'Grave';
                return (
                  <div key={index} className="flex items-center gap-1 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Classificação de Risco */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('distribuicao-risco', 'Classificação de Risco')}>Classificação de Risco</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Classificação de Risco Cardiovascular:</div>
                  <div>Habitual: Risco baixo para população</div>
                  <div>Crescente: Risco moderado</div>
                  <div>Alto Risco: Risco elevado, prioritário</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <StackedBar 
                segments={[
                  { label: 'Habitual', value: dados.estratificacaoFramingham.segments[0].value, percentage: dados.estratificacaoFramingham.segments[0].percentage, color: dados.estratificacaoFramingham.segments[0].color },
                  { label: 'Crescente', value: dados.estratificacaoFramingham.segments[1].value, percentage: dados.estratificacaoFramingham.segments[1].percentage, color: dados.estratificacaoFramingham.segments[1].color },
                  { label: 'Alto Risco', value: dados.estratificacaoFramingham.segments[2].value, percentage: dados.estratificacaoFramingham.segments[2].percentage, color: dados.estratificacaoFramingham.segments[2].color }
                ]} 
                onSegmentClick={handleFiltroInterativo}
                tipoFiltro="risco-cardiovascular"
                filtroAtivo={filtroInterativo}
              />
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: dados.estratificacaoFramingham.segments[0].color }} />
                <span className="text-gray-600">Habitual</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: dados.estratificacaoFramingham.segments[1].color }} />
                <span className="text-gray-600">Crescente</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: dados.estratificacaoFramingham.segments[2].color }} />
                <span className="text-gray-600">Alto Risco</span>
              </div>
            </div>
          </div>
        </div>

        {/* Funil Epidemiológico (Visual) + Exames de Acompanhamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('funil-epidemiologico', 'Funil Epidemiológico')}>Funil Epidemiológico</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Progressão desde população elegível até pacientes em linha de cuidado</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              {dados.funilEpidemiologico.map((item, index) => (
                <React.Fragment key={index}>
                  <div
                    className="relative rounded-md p-2 transition-all duration-300 hover:shadow-md"
                    style={{ backgroundColor: ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee'][index] || item.cor }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {item.nivel}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {item.quantidade.toLocaleString()}
                        {item.percentual && (
                          <span className="ml-1 font-normal text-white/80">
                            ({item.percentual}%)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {index < dados.funilEpidemiologico.length - 1 && (
                    <div className="flex justify-center">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('exames-acompanhamento', 'Exames de Acompanhamento')}>Exames de Acompanhamento</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Percentual de exames em dia conforme protocolo de acompanhamento</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {dados.examesAcompanhamento.map((exame, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{exame.exame}</span>
                    <span className="text-gray-600">
                      {exame.emDia} ({exame.percentual}%)
                    </span>
                  </div>
                  <div 
                    className={`relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200`}
                    onClick={(e) => handleFiltroInterativo('exame', exame.exame, `Exame: ${exame.exame}`, e)}
                  >
                    <div 
                      className="absolute inset-0 rounded-lg transition-all duration-300"
                      style={{ 
                        width: `${exame.percentual}%`,
                        backgroundColor: exame.cor,
                        opacity: filtroInterativo && filtroInterativo.tipo !== 'exame' || (filtroInterativo?.tipo === 'exame' && filtroInterativo?.valor !== exame.exame) ? 0.4 : 1,
                        transform: filtroInterativo?.tipo === 'exame' && filtroInterativo?.valor === exame.exame ? 'scaleY(1.2)' : 'scaleY(1)',
                        border: filtroInterativo?.tipo === 'exame' && filtroInterativo?.valor === exame.exame ? '2px solid #1e40af' : 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controle da PA + Última Medida */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('controle-pa', 'Controle da PA')}>Controle da PA</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Controlado: PA {'<'}140/90 mmHg</div>
                  <div>Não controlado: PA ≥140/90 mmHg</div>
                  <div>Sem medida: Sem aferição nos últimos 12 meses</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Mostra os 3 níveis: Controlado, Não controlado e Sem medida */}
              {dados.controlesPA.map((item, index) => {
                let nivelDisplay = item.nivel;
                if (item.nivel === 'Bom controle') nivelDisplay = 'Controlado';
                else if (item.nivel === 'Controle inadequado') nivelDisplay = 'Não controlado';
                else if (item.nivel === 'Sem medida recente') nivelDisplay = 'Sem medida';
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{nivelDisplay}</span>
                      <span className="text-gray-600">
                        {item.quantidade} ({item.percentual}%)
                      </span>
                    </div>
                    <div 
                      className={`relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200 z-10`}
                      onClick={(e) => handleFiltroInterativo('controle', item.nivel, `Controle: ${nivelDisplay}`, e)}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg transition-all duration-300"
                        style={{ 
                          width: `${item.percentual}%`,
                          backgroundColor: item.cor,
                          opacity: filtroInterativo && filtroInterativo.tipo !== 'controle' || (filtroInterativo?.tipo === 'controle' && filtroInterativo?.valor !== item.nivel) ? 0.4 : 1,
                          transform: filtroInterativo?.tipo === 'controle' && filtroInterativo?.valor === item.nivel ? 'scaleY(1.2)' : 'scaleY(1)',
                          border: filtroInterativo?.tipo === 'controle' && filtroInterativo?.valor === item.nivel ? '2px solid #1e40af' : 'none'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('ultima-medida-pa', 'Última Medida de PA')}>Última Medida de PA</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Distribuição temporal das últimas medições de PA realizadas</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {dados.distribuicaoTemporalMedidas.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.periodo}</span>
                    <span className="text-gray-600">
                      {item.quantidade} ({item.percentual}%)
                    </span>
                  </div>
                  <div 
                    className={`relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200 z-10`}
                    onClick={(e) => handleFiltroInterativo('tempo-medida', item.periodo, `Tempo: ${item.periodo}`, e)}
                  >
                    <div 
                      className="absolute inset-0 rounded-lg transition-all duration-300"
                      style={{ 
                        width: `${item.percentual}%`,
                        backgroundColor: item.cor,
                        opacity: filtroInterativo && filtroInterativo.tipo !== 'tempo-medida' || (filtroInterativo?.tipo === 'tempo-medida' && filtroInterativo?.valor !== item.periodo) ? 0.4 : 1,
                        transform: filtroInterativo?.tipo === 'tempo-medida' && filtroInterativo?.valor === item.periodo ? 'scaleY(1.2)' : 'scaleY(1)',
                        border: filtroInterativo?.tipo === 'tempo-medida' && filtroInterativo?.valor === item.periodo ? '2px solid #1e40af' : 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estágio Motivacional em Funil - ocupando largura total */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('estagio-motivacional', 'Estágio Motivacional para Mudança')}>Estágio Motivacional para Mudança</h3>
            </div>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="font-semibold mb-1">Regra de Cálculo:</div>
                <div>Classificação baseada no modelo transteórico</div>
                <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            </div>
          </div>
          <div className="relative">
            {dados.estagioMotivacional.map((item, index) => {
              const widthPercentage = 100 - (index * 15);
              const marginPercentage = (100 - widthPercentage) / 2;
              const isActive = filtroInterativo?.tipo === 'estagio' && filtroInterativo?.valor === item.estagio;

              return (
                <div
                  key={index}
                  className="relative mb-0.5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  style={{
                    marginLeft: `${marginPercentage}%`,
                    marginRight: `${marginPercentage}%`,
                    opacity: filtroInterativo && !isActive ? 0.4 : 1,
                    transform: isActive ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onClick={(e) => handleFiltroInterativo('estagio', item.estagio, `Estágio Motivacional para Mudança: ${item.estagio}`, e)}
                >
                  <div
                    className="relative rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: item.cor || item.color,
                      minHeight: '28px',
                      border: isActive ? '2px solid #1e40af' : 'none'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-3 py-1">
                      <span className="text-xs font-medium text-white">{item.estagio}</span>
                      <span className="text-xs text-white/90">{item.quantidade} ({item.percentual}%)</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                  </div>

                  {index < dados.estagioMotivacional.length - 1 && (
                    <div
                      className="absolute left-1/2 transform -translate-x-1/2 w-px h-1 bg-gray-300"
                      style={{
                        bottom: '-2px',
                        zIndex: 5
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fatores de Risco e Comorbidades - Full Width */}
        <div className="space-y-4">
          {/* Fatores de Risco - Full Width */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('fatores-risco', 'Fatores de Risco Modificáveis')}>Fatores de Risco Modificáveis</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Fatores de risco cardiovascular passíveis de intervenção</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {dados.fatoresRisco.map((fator, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={(e) => handleFiltroInterativo('fator-risco', fator.fator, `Fator: ${fator.fator}`, e)}
                  style={{
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'fator-risco' || (filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor !== fator.fator) ? 0.4 : 1,
                    transform: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? 'scale(1.02)' : 'scale(1)',
                    borderColor: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? '#1e40af' : '#e5e7eb',
                    borderWidth: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? '2px' : '1px'
                  }}
                >
                  <div className="text-center space-y-2">
                    <div className="text-xs font-semibold text-gray-700 truncate group relative">
                      {fator.fator}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-48 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        <div className="font-semibold text-center">{fator.fator}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                      </div>
                    </div>
                    
                    <div className="text-2xl font-bold" style={{ color: fator.cor }}>
                      {fator.pacientes}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="relative w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="absolute inset-0 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${fator.percentual}%`,
                            backgroundColor: fator.cor
                          }}
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-gray-600">
                        {fator.percentual}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('comorbidades', 'Top 5 - Comorbidades')}>Top 5 - Comorbidades</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Principais comorbidades associadas à hipertensão arterial</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {dados.topComorbidades.map((comorb, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200 group relative"
                  onClick={(e) => handleFiltroInterativo('comorbidade', comorb.cid, `Comorbidade: ${comorb.cid}`, e)}
                  style={{
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'comorbidade' || (filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor !== comorb.cid) ? 0.4 : 1,
                    transform: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.cid ? 'scale(1.02)' : 'scale(1)',
                    borderColor: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.cid ? '#1e40af' : '#e5e7eb',
                    borderWidth: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.cid ? '2px' : '1px'
                  }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {comorb.descricao}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="text-xs font-semibold text-gray-700">{comorb.cid}</div>
                    
                    <div className="text-2xl font-bold" style={{ color: comorb.cor }}>
                      {comorb.pacientes}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="relative w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="absolute inset-0 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${comorb.percentual}%`,
                            backgroundColor: comorb.cor
                          }}
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-gray-600">
                        {comorb.percentual}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Taxa de Acompanhamento - Últimos 12 Meses */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('taxa-acompanhamento-mensal', 'Taxa de Acompanhamento - Últimos 12 Meses')}>Taxa de Acompanhamento - Últimos 12 Meses</h3>
            </div>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="font-semibold mb-1">Regra de Cálculo:</div>
                <div>Percentual de pacientes com acompanhamento adequado (consulta nos últimos 6 meses) em cada mês</div>
                <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-1 mb-4">
            {heatmapTaxaControle.map((item, index) => {
              let backgroundColor;
              if (item.valor >= 75) backgroundColor = '#10b981'; // Verde
              else if (item.valor >= 50) backgroundColor = '#fbbf24'; // Amarelo
              else backgroundColor = '#ef4444'; // Vermelho
              
              return (
                <div key={index} className="relative group">
                  <div 
                    className="aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      <div className="font-semibold">{item.mes}</div>
                      <div>{item.valor}% com acompanhamento adequado</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-gray-600 mt-1">{item.mes}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-gray-600">&ge;75%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
              <span className="text-gray-600">50-74%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-gray-600">&lt;50%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}