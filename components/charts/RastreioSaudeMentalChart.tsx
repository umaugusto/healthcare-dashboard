// Arquivo: components/charts/RastreioSaudeMentalChart.tsx
// Componente: Dashboard de rastreamento de saúde mental com filtros interativos
// Contexto: Dashboard APS - Análise detalhada do rastreio PHQ-9, GAD-7 e AUDIT
// Padrão: Baseado em MamografiaChart com dados específicos de saúde mental

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Info, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Calendar, 
  Clock, 
  FileText, 
  Target, 
  BarChart3, 
  ChevronDown,
  Microscope,
  Brain,
  Heart,
  Wine
} from 'lucide-react';

interface RastreioSaudeMentalChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

// Componente StackedBar com interatividade (copiado do RastreioColonChart)
const StackedBar = ({ segments, onSegmentClick, tipoFiltro, filtroAtivo }: {
  segments: any[],
  onSegmentClick?: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro?: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const validSegments = segments.filter(segment => Number(segment.percentage) > 0);

  return (
    <div className="relative w-full bg-gray-200 rounded-lg h-12 overflow-hidden">
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
            className={`absolute top-0 h-full flex items-center justify-center transition-all ${
              onSegmentClick ? 'cursor-pointer hover:brightness-110' : ''
            }`}
            style={{
              left: `${previousWidth}%`,
              width: `${Number(segment.percentage)}%`,
              backgroundColor: segment.color,
              borderRadius,
              opacity: filtroAtivo && !isActive ? 0.4 : 1,
              transform: isActive ? 'scaleY(1.1)' : 'scaleY(1)',
              borderTop: isActive ? '2px solid #db2777' : 'none',
              borderBottom: isActive ? '2px solid #db2777' : 'none',
              zIndex: isActive ? 20 : 10
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={onSegmentClick ? (e) => {
              e.stopPropagation();
              onSegmentClick(tipoFiltro || 'segmento', segment.label, `${tipoFiltro}: ${segment.label}`, e);
            } : undefined}
            title={onSegmentClick ? `Filtrar por ${segment.label}` : undefined}
          >
            {showLabel && (
              <span className="text-xs font-semibold text-white bg-black/20 rounded px-1">
                {Number(segment.percentage).toFixed(1)}%
              </span>
            )}

            {hoveredIndex === index && !showLabel && (
              <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-30 pointer-events-none">
                {segment.label}: {Number(segment.percentage).toFixed(1)}%
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Dados mockados específicos para saúde mental
const dadosSaudeMental = {
  elegiveis: 8450,
  coberturaAtual: 72.3,
  metaAnual: 85,
  
  funilRastreamento: [
    { etapa: 'Adultos ≥18 anos', valor: 8450, percentual: 100 },
    { etapa: 'Com indicação rastreio', valor: 7890, percentual: 93.4 },
    { etapa: 'Questionários aplicados', valor: 6110, percentual: 72.3 },
    { etapa: 'Com alteração detectada', valor: 1285, percentual: 21.0 },
    { etapa: 'Encaminhados p/ follow-up', valor: 998, percentual: 77.7 },
    { etapa: 'Em acompanhamento', valor: 756, percentual: 75.8 }
  ],
  
  // Distribuição de risco PHQ-9 no formato StackedBar
  distribuicaoDepressao: {
    segments: [
      { label: 'Mínimo', percentage: 69.6, color: '#86efac' },
      { label: 'Leve', percentage: 18.1, color: '#fbbf24' },
      { label: 'Moderado', percentage: 7.9, color: '#f59e0b' },
      { label: 'Severo', percentage: 4.4, color: '#ef4444' }
    ]
  },
  
  // Distribuição de risco GAD-7 no formato StackedBar
  distribuicaoAnsiedade: {
    segments: [
      { label: 'Mínimo', percentage: 68.4, color: '#86efac' },
      { label: 'Leve', percentage: 19.1, color: '#fbbf24' },
      { label: 'Moderado', percentage: 8.6, color: '#f59e0b' },
      { label: 'Severo', percentage: 3.9, color: '#ef4444' }
    ]
  },
  
  // AUDIT para gráfico Donut
  auditResultados: [
    { categoria: 'Baixo Risco', quantidade: 2145, percentual: 74.2, descricao: '0-7 pontos' },
    { categoria: 'Risco Moderado', quantidade: 520, percentual: 18.0, descricao: '8-15 pontos' },
    { categoria: 'Alto Risco', quantidade: 225, percentual: 7.8, descricao: '16+ pontos' }
  ],
  
  // Comorbidades
  comorbidades: [
    { tipo: 'Depressão isolada', quantidade: 285, percentual: 22.2, cor: '#3b82f6' },
    { tipo: 'Ansiedade isolada', quantidade: 320, percentual: 24.9, cor: '#10b981' },
    { tipo: 'Depressão + Ansiedade', quantidade: 415, percentual: 32.3, cor: '#f59e0b' },
    { tipo: 'Álcool isolado', quantidade: 98, percentual: 7.6, cor: '#8b5cf6' },
    { tipo: 'Comorbidade tripla', quantidade: 167, percentual: 13.0, cor: '#ef4444' }
  ],
  
  agingRastreios: [
    { periodo: 'Nunca responderam', pacientes: 2340, percentual: 27.7 },
    { periodo: '> 12 meses', pacientes: 1580, percentual: 18.7 },
    { periodo: '6-12 meses', pacientes: 1420, percentual: 16.8 },
    { periodo: '3-6 meses', pacientes: 1950, percentual: 23.1 },
    { periodo: '< 3 meses', pacientes: 1160, percentual: 13.7 }
  ],
  
  evolucaoTemporal: [
    { mes: 'Jan', cobertura: 68.5, aplicados: 485, meta: 85 },
    { mes: 'Fev', cobertura: 69.2, aplicados: 520, meta: 85 },
    { mes: 'Mar', cobertura: 70.1, aplicados: 565, meta: 85 },
    { mes: 'Abr', cobertura: 70.8, aplicados: 590, meta: 85 },
    { mes: 'Mai', cobertura: 71.5, aplicados: 615, meta: 85 },
    { mes: 'Jun', cobertura: 72.0, aplicados: 635, meta: 85 },
    { mes: 'Jul', cobertura: 72.8, aplicados: 650, meta: 85 },
    { mes: 'Ago', cobertura: 72.6, aplicados: 625, meta: 85 },
    { mes: 'Set', cobertura: 72.1, aplicados: 610, meta: 85 },
    { mes: 'Out', cobertura: 72.4, aplicados: 640, meta: 85 },
    { mes: 'Nov', cobertura: 72.3, aplicados: 660, meta: 85 },
    { mes: 'Dez', cobertura: 72.3, aplicados: 645, meta: 85 }
  ]
};

// Componente de Funil Visual Vertical
const FunnelChart = ({ data, title, icon: Icon, onItemClick, tipoFiltro, filtroAtivo, onNavigateToTable }: {
  data: any[],
  title: string,
  icon: React.ElementType,
  onItemClick?: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro?: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null,
  onNavigateToTable?: (type: string) => void
}) => {
  // Cores intuitivas: verde → amarelo → vermelho
  const coresIntuitivas = ['#86efac', '#a7f3d0', '#fde047', '#fb923c', '#ef4444', '#dc2626'];

  return (
    <div className="bg-gray-50 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-gray-600" />
        <h3 
          className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onNavigateToTable && onNavigateToTable('funil-rastreamento-saude-mental')}
          title="Ir para tabela detalhada"
        >
          {title}
        </h3>
      </div>

      <div className="space-y-1">
        {data.map((item, index) => {
          const isActive = filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === item.etapa;
          const backgroundColor = coresIntuitivas[index] || item.cor;
          const textColor = ['#fb923c', '#ef4444', '#dc2626'].includes(backgroundColor) ? 'white' : '#1f2937';
          
          return (
            <React.Fragment key={index}>
              <div
                className={`relative rounded-md p-2 transition-all duration-300 ${
                  onItemClick ? 'cursor-pointer hover:shadow-md' : ''
                }`}
                style={{ 
                  backgroundColor: backgroundColor,
                  opacity: filtroAtivo && !isActive ? 0.4 : 1,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  border: isActive ? '2px solid #db2777' : 'none'
                }}
                onClick={onItemClick ? (e) => onItemClick(tipoFiltro || 'funil', item.etapa, `${title}: ${item.etapa}`, e) : undefined}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: textColor }}>
                    {item.etapa}
                  </span>
                  <span className="text-xs font-bold" style={{ color: textColor }}>
                    {item.valor.toLocaleString()}
                    {item.percentual && (
                      <span className="ml-1 font-normal" style={{ color: textColor, opacity: 0.8 }}>
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
          );
        })}
      </div>
    </div>
  );
};

// Componente de Gráfico Donut para AUDIT
const AuditDonutChart = ({
  data,
  title,
  onItemClick,
  tipoFiltro,
  filtroAtivo,
  onNavigateToTable
}: {
  data: any[],
  title: string,
  onItemClick: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null,
  onNavigateToTable?: (type: string) => void
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  const coresAudit = {
    'Baixo Risco': '#22c55e',
    'Risco Moderado': '#fbbf24',
    'Alto Risco': '#ef4444'
  };

  const total = data.reduce((acc, item) => acc + item.quantidade, 0);
  let cumulativePercentage = 0;

  const segments = data.map((item, index) => {
    const startAngle = (cumulativePercentage * 360) / 100;
    const endAngle = ((cumulativePercentage + item.percentual) * 360) / 100;
    const midAngle = (startAngle + endAngle) / 2;
    cumulativePercentage += item.percentual;
    
    return {
      ...item,
      startAngle,
      endAngle,
      midAngle,
      color: coresAudit[item.categoria] || '#6b7280'
    };
  });

  return (
    <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Wine className="w-4 h-4 text-gray-600" />
        <h3 
          className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onNavigateToTable && onNavigateToTable('audit-rastreio')}
          title="Ir para tabela detalhada"
        >
          {title}
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {segments.map((segment, index) => {
              const isActive = filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === segment.categoria;
              const radius = 80;
              const innerRadius = 50;
              const centerX = 100;
              const centerY = 100;
              
              const startAngleRad = (segment.startAngle * Math.PI) / 180;
              const endAngleRad = (segment.endAngle * Math.PI) / 180;
              
              const x1 = centerX + radius * Math.cos(startAngleRad);
              const y1 = centerY + radius * Math.sin(startAngleRad);
              const x2 = centerX + radius * Math.cos(endAngleRad);
              const y2 = centerY + radius * Math.sin(endAngleRad);
              
              const x3 = centerX + innerRadius * Math.cos(startAngleRad);
              const y3 = centerY + innerRadius * Math.sin(startAngleRad);
              const x4 = centerX + innerRadius * Math.cos(endAngleRad);
              const y4 = centerY + innerRadius * Math.sin(endAngleRad);
              
              const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `L ${x4} ${y4}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x3} ${y3}`,
                'Z'
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={segment.color}
                  className="cursor-pointer transition-all duration-200 hover:brightness-110"
                  style={{
                    opacity: filtroAtivo && !isActive ? 0.4 : 1,
                    stroke: isActive ? '#db2777' : 'none',
                    strokeWidth: isActive ? 2 : 0
                  }}
                  onClick={(e) => onItemClick(tipoFiltro, segment.categoria, `${title}: ${segment.categoria}`, e)}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              );
            })}
          </svg>
          
          {/* Percentuais sobre o gráfico */}
          <svg width="200" height="200" className="absolute inset-0 pointer-events-none">
            {segments.map((segment, index) => {
              const midAngleRad = (segment.midAngle * Math.PI) / 180 - Math.PI / 2;
              const labelRadius = 65;
              const labelX = 100 + labelRadius * Math.cos(midAngleRad);
              const labelY = 100 + labelRadius * Math.sin(midAngleRad);
              
              // Mostrar label sempre para AUDIT (poucos segmentos)
              return (
                <g key={`label-${index}`}>
                  <rect
                    x={labelX - 15}
                    y={labelY - 8}
                    width="30"
                    height="16"
                    fill="white"
                    rx="2"
                    opacity="0.9"
                  />
                  <text
                    x={labelX}
                    y={labelY + 3}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-gray-700"
                  >
                    {segment.percentual}%
                  </text>
                </g>
              );
            })}
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center transform rotate-0">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-xs text-gray-600">avaliados</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 w-full max-w-sm">
          {data.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: coresAudit[item.categoria] }}></div>
                <span className="text-xs font-medium text-gray-700">{item.categoria.replace('Risco ', '').replace('Baixo ', '')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function RastreioSaudeMentalChart({ filters, onNavigateToTable }: RastreioSaudeMentalChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{
    tipo: string;
    valor: string;
    label: string;
  } | null>(null);
  const [cardsClicados, setCardsClicados] = useState<Set<string>>(new Set());

  // Aplicar filtro local nos dados
  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosSaudeMental;
    
    // Simular impacto do filtro nos dados
    const fator = Math.random() * 0.3 + 0.7; // Variação de 70-100%
    
    return {
      ...dadosSaudeMental,
      funilRastreamento: dadosSaudeMental.funilRastreamento.map(item => ({
        ...item,
        valor: Math.round(item.valor * fator)
      })),
      auditResultados: dadosSaudeMental.auditResultados.map(item => ({
        ...item,
        quantidade: Math.round(item.quantidade * fator)
      })),
      comorbidades: dadosSaudeMental.comorbidades.map(item => ({
        ...item,
        quantidade: Math.round(item.quantidade * fator)
      }))
    };
  }, [filtroInterativo]);

  const handleFiltroInterativo = (tipo: string, valor: string, label: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (filtroInterativo?.tipo === tipo && filtroInterativo?.valor === valor) {
      setFiltroInterativo(null);
    } else {
      setFiltroInterativo({ tipo, valor, label });
    }
  };

  const handleCardClick = (cardId: string) => {
    const newSet = new Set(cardsClicados);
    if (newSet.has(cardId)) {
      newSet.delete(cardId);
    } else {
      newSet.add(cardId);
    }
    setCardsClicados(newSet);
  };

  // Cálculos derivados
  const taxaNuncaRespondeu = (dados.agingRastreios[0].pacientes / dados.elegiveis * 100).toFixed(1);
  const rastreiosVencidos = dados.agingRastreios[1].pacientes + dados.agingRastreios[2].pacientes;
  const alteracoesDetectadas = dados.funilRastreamento[3].valor;
  
  // Depressão e ansiedade moderada/severa
  const depressaoModeradaSevera = Math.round(6110 * (7.9 + 4.4) / 100);
  const ansiedadeModeradaSevera = Math.round(6110 * (8.6 + 3.9) / 100);

  // Top 5 fatores de risco para saúde mental
  const top5FatoresRisco = [
    { fator: 'Histórico familiar', pacientes: 485, percentual: 17.8, cor: '#dc2626' },
    { fator: 'Desemprego/instabil.', pacientes: 325, percentual: 11.9, cor: '#ef4444' },
    { fator: 'Doenças crônicas', pacientes: 650, percentual: 23.8, cor: '#f59e0b' },
    { fator: 'Isolamento social', pacientes: 280, percentual: 10.3, cor: '#fbbf24' },
    { fator: 'Trauma/violência', pacientes: 195, percentual: 7.1, cor: '#fb923c' }
  ];

  // Estratificação por faixa etária com dados por sexo
  const estratificacaoFaixaSexo = [
    { 
      faixa: '18-29 anos', 
      masculino: 680, 
      feminino: 740, 
      totalM: 920, 
      totalF: 930,
      coberturaM: 73.9,
      coberturaF: 79.6
    },
    { 
      faixa: '30-39 anos', 
      masculino: 795, 
      feminino: 885, 
      totalM: 1070, 
      totalF: 1080,
      coberturaM: 74.3,
      coberturaF: 82.0
    },
    { 
      faixa: '40-49 anos', 
      masculino: 725, 
      feminino: 855, 
      totalM: 1100, 
      totalF: 1100,
      coberturaM: 65.9,
      coberturaF: 77.7
    },
    { 
      faixa: '50-59 anos', 
      masculino: 450, 
      feminino: 535, 
      totalM: 725, 
      totalF: 725,
      coberturaM: 62.1,
      coberturaF: 73.8
    },
    { 
      faixa: '60+ anos', 
      masculino: 195, 
      feminino: 250, 
      totalM: 400, 
      totalF: 400,
      coberturaM: 48.8,
      coberturaF: 62.5
    }
  ];

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-indigo-50 rounded">
              <Brain className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <span>Rastreio Saúde Mental</span>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">PHQ-9, GAD-7, AUDIT</p>
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
                <h4 className="font-semibold mb-2 text-sm">Protocolo de Rastreamento MS</h4>
                <div className="space-y-2">
                  <p>População-alvo: Adultos ≥18 anos</p>
                  <p>Periodicidade: Anual</p>
                  <p>Meta de cobertura: 85% da população elegível</p>
                  <div className="mt-3">
                    <span className="font-medium">Instrumentos:</span>
                    <ul className="ml-3 mt-1 space-y-0.5">
                      <li>• PHQ-9: Depressão (0-27 pts)</li>
                      <li>• GAD-7: Ansiedade (0-21 pts)</li>
                      <li>• AUDIT: Álcool (0-40 pts)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {filtroInterativo && (
          <div className="absolute top-1 right-1 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
            Filtrado: {filtroInterativo.label}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5 px-6">
        {/* Cards de Métricas - 6 cards com click para inverter */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            className="bg-indigo-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('nunca-responderam')}
          >
            <p className="text-xs font-medium text-gray-600">Nunca Responderam</p>
            {cardsClicados.has('nunca-responderam') ? (
              <>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {taxaNuncaRespondeu}%
                </p>
                <p className="text-[11px] text-gray-500">
                  {dados.agingRastreios[0].pacientes} pessoas
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {dados.agingRastreios[0].pacientes}
                </p>
                <p className="text-[11px] text-gray-500">
                  {taxaNuncaRespondeu}% do total
                </p>
              </>
            )}
          </div>
          
          <div 
            className="bg-yellow-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('rastreio-vencido')}
          >
            <p className="text-xs font-medium text-gray-600">Rastreio Vencido</p>
            {cardsClicados.has('rastreio-vencido') ? (
              <>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {((rastreiosVencidos) / dados.elegiveis * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-gray-500">
                  {rastreiosVencidos} pessoas
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {rastreiosVencidos}
                </p>
                <p className="text-[11px] text-gray-500">
                  &gt; 6 meses
                </p>
              </>
            )}
          </div>
          
          <div 
            className="bg-red-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('com-alteracao')}
          >
            <p className="text-xs font-medium text-gray-600">Com Alteração</p>
            {cardsClicados.has('com-alteracao') ? (
              <>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {(alteracoesDetectadas / dados.funilRastreamento[2].valor * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-gray-500">
                  {alteracoesDetectadas} casos
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {alteracoesDetectadas}
                </p>
                <p className="text-[11px] text-gray-500">
                  Positivo rastreio
                </p>
              </>
            )}
          </div>

          <div 
            className="bg-teal-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('cobertura-atual')}
          >
            <p className="text-xs font-medium text-gray-600">Cobertura Atual</p>
            {cardsClicados.has('cobertura-atual') ? (
              <>
                <p className="text-2xl font-bold text-teal-600 mt-1">
                  {dados.funilRastreamento[2].valor}
                </p>
                <p className="text-[11px] text-gray-500">
                  {dados.coberturaAtual}% da meta
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-teal-600 mt-1">
                  {dados.coberturaAtual}%
                </p>
                <p className="text-[11px] text-gray-500">
                  Meta: {dados.metaAnual}%
                </p>
              </>
            )}
          </div>
          
          <div 
            className="bg-orange-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('depressao-severa')}
          >
            <p className="text-xs font-medium text-gray-600">Depressão Mod/Sev</p>
            {cardsClicados.has('depressao-severa') ? (
              <>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {(depressaoModeradaSevera / dados.funilRastreamento[2].valor * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-gray-500">
                  {depressaoModeradaSevera} casos
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {depressaoModeradaSevera}
                </p>
                <p className="text-[11px] text-gray-500">
                  PHQ-9 ≥10
                </p>
              </>
            )}
          </div>
          
          <div 
            className="bg-green-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('ansiedade-severa')}
          >
            <p className="text-xs font-medium text-gray-600">Ansiedade Mod/Sev</p>
            {cardsClicados.has('ansiedade-severa') ? (
              <>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {(ansiedadeModeradaSevera / dados.funilRastreamento[2].valor * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-gray-500">
                  {ansiedadeModeradaSevera} casos
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {ansiedadeModeradaSevera}
                </p>
                <p className="text-[11px] text-gray-500">
                  GAD-7 ≥10
                </p>
              </>
            )}
          </div>
        </div>

        {/* NOVOS GRÁFICOS: Distribuição PHQ-9 e GAD-7 em formato StackedBar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onNavigateToTable && onNavigateToTable('rastreio-depressao')}
                  title="Ir para tabela detalhada"
                >
                  Rastreio Depressão
                </h3>
              </div>
            </div>
            
            <div className="mb-4 px-2">
              <StackedBar 
                segments={dados.distribuicaoDepressao.segments} 
                onSegmentClick={handleFiltroInterativo}
                tipoFiltro="phq9-distribuicao"
                filtroAtivo={filtroInterativo}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 px-3">
              {dados.distribuicaoDepressao.segments.filter(s => s.percentage > 0).map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 text-[11px]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onNavigateToTable && onNavigateToTable('rastreio-ansiedade')}
                  title="Ir para tabela detalhada"
                >
                  Rastreio Ansiedade
                </h3>
              </div>
            </div>
            
            <div className="mb-4 px-2">
              <StackedBar 
                segments={dados.distribuicaoAnsiedade.segments} 
                onSegmentClick={handleFiltroInterativo}
                tipoFiltro="gad7-distribuicao"
                filtroAtivo={filtroInterativo}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 px-3">
              {dados.distribuicaoAnsiedade.segments.filter(s => s.percentage > 0).map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 text-[11px]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funil de Rastreamento + Cobertura por Faixa Etária */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FunnelChart 
            data={dados.funilRastreamento}
            title="Funil de Rastreamento"
            icon={Users}
            onItemClick={handleFiltroInterativo}
            tipoFiltro="funil"
            filtroAtivo={filtroInterativo}
            onNavigateToTable={onNavigateToTable}
          />

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onNavigateToTable && onNavigateToTable('cobertura-faixa-etaria-saude-mental')}
                title="Ir para tabela detalhada"
              >
                Cobertura por Faixa Etária
              </h3>
            </div>
            
            <div className="space-y-3">
              {estratificacaoFaixaSexo.map((faixa, index) => {
                const totalRealizado = faixa.masculino + faixa.feminino;
                const totalElegivel = faixa.totalM + faixa.totalF;
                const coberturaTotal = ((totalRealizado / totalElegivel) * 100);
                const percentualM = (faixa.masculino / totalRealizado) * 100;
                const percentualF = (faixa.feminino / totalRealizado) * 100;
                
                return (
                  <div key={index} className="space-y-1">
                    {/* Título com total acima */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{faixa.faixa}</span>
                      <span className="text-gray-600">
                        {totalRealizado} ({coberturaTotal.toFixed(1)}%)
                      </span>
                    </div>
                    
                    {/* Barra empilhada horizontal - maior */}
                    <div 
                      className="relative w-full bg-gray-200 rounded-lg h-7 cursor-pointer hover:shadow-md transition-all duration-200 overflow-hidden"
                      onClick={(e) => handleFiltroInterativo('faixa', faixa.faixa, `Faixa: ${faixa.faixa}`, e)}
                      style={{
                        opacity: filtroInterativo && filtroInterativo.tipo !== 'faixa' || (filtroInterativo?.tipo === 'faixa' && filtroInterativo?.valor !== faixa.faixa) ? 0.4 : 1,
                        transform: filtroInterativo?.tipo === 'faixa' && filtroInterativo?.valor === faixa.faixa ? 'scaleY(1.1)' : 'scaleY(1)',
                        border: filtroInterativo?.tipo === 'faixa' && filtroInterativo?.valor === faixa.faixa ? '2px solid #db2777' : 'none'
                      }}
                    >
                      {/* Segmento Masculino */}
                      <div 
                        className="absolute top-0 left-0 h-full flex items-center justify-center transition-all duration-300"
                        style={{
                          width: `${percentualM}%`,
                          backgroundColor: '#3b82f6', // Azul para masculino
                          borderRadius: percentualF > 0 ? '6px 0 0 6px' : '6px'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFiltroInterativo('sexo-faixa', `${faixa.faixa}-M`, `${faixa.faixa} - Masculino`, e);
                        }}
                      >
                        <span className="text-sm font-semibold text-white">
                          {faixa.masculino}
                        </span>
                      </div>
                      
                      {/* Segmento Feminino */}
                      <div 
                        className="absolute top-0 h-full flex items-center justify-center transition-all duration-300"
                        style={{
                          left: `${percentualM}%`,
                          width: `${percentualF}%`,
                          backgroundColor: '#ec4899', // Rosa para feminino
                          borderRadius: percentualM > 0 ? '0 6px 6px 0' : '6px'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFiltroInterativo('sexo-faixa', `${faixa.faixa}-F`, `${faixa.faixa} - Feminino`, e);
                        }}
                      >
                        <span className="text-sm font-semibold text-white">
                          {faixa.feminino}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legenda */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded bg-blue-500"></div>
                <span className="text-xs text-gray-600 font-medium">Masculino</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded bg-pink-500"></div>
                <span className="text-xs text-gray-600 font-medium">Feminino</span>
              </div>
            </div>
          </div>
        </div>

        {/* Principais Comorbidades - Formato Horizontal */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-gray-600" />
            <h3 
              className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onNavigateToTable && onNavigateToTable('principais-comorbidades')}
              title="Ir para tabela detalhada"
            >
              Principais Comorbidades
            </h3>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {dados.comorbidades.map((comorb, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-3 border cursor-pointer hover:shadow-md transition-all duration-200 group relative"
                onClick={(e) => handleFiltroInterativo('comorbidade', comorb.tipo, `Comorbidade: ${comorb.tipo}`, e)}
                style={{
                  opacity: filtroInterativo && filtroInterativo.tipo !== 'comorbidade' || (filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor !== comorb.tipo) ? 0.4 : 1,
                  transform: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.tipo ? 'scale(1.02)' : 'scale(1)',
                  borderColor: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.tipo ? '#db2777' : '#e5e7eb',
                  borderWidth: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.tipo ? '2px' : '1px'
                }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {comorb.tipo}
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-xs font-semibold text-gray-700 truncate">
                    {comorb.tipo}
                  </div>
                  
                  <div className="text-xl font-bold" style={{ color: comorb.cor }}>
                    {comorb.quantidade}
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

        {/* Top 5 Fatores de Risco - Formato Horizontal */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-gray-600" />
            <h3 
              className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onNavigateToTable && onNavigateToTable('fatores-risco-saude-mental')}
              title="Ir para tabela detalhada"
            >
              Top 5 - Fatores de Risco
            </h3>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {top5FatoresRisco.map((fator, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-3 border cursor-pointer hover:shadow-md transition-all duration-200 group relative"
                onClick={(e) => handleFiltroInterativo('fator-risco', fator.fator, `Fator: ${fator.fator}`, e)}
                style={{
                  opacity: filtroInterativo && filtroInterativo.tipo !== 'fator-risco' || (filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor !== fator.fator) ? 0.4 : 1,
                  transform: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? 'scale(1.02)' : 'scale(1)',
                  borderColor: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? '#db2777' : '#e5e7eb',
                  borderWidth: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? '2px' : '1px'
                }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {fator.fator}
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-xs font-semibold text-gray-700 truncate">
                    {fator.fator}
                  </div>
                  
                  <div className="text-xl font-bold" style={{ color: fator.cor }}>
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

        {/* AUDIT Donut + Tempo Desde Último Rastreio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AuditDonutChart 
            data={dados.auditResultados}
            title="AUDIT"
            onItemClick={handleFiltroInterativo}
            tipoFiltro="audit-donut"
            filtroAtivo={filtroInterativo}
            onNavigateToTable={onNavigateToTable}
          />

          {/* Tempo Desde Último Rastreio */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onNavigateToTable && onNavigateToTable('tempo-ultimo-rastreio-saude-mental')}
                title="Ir para tabela detalhada"
              >
                Tempo Desde Último Rastreio
              </h3>
            </div>
            
            <div className="space-y-3">
              {dados.agingRastreios.map((item, index) => {
                const cores = ['#ef4444', '#f59e0b', '#fbbf24', '#86efac', '#22c55e'];
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.periodo}</span>
                      <span className="text-gray-600">
                        {item.pacientes} ({item.percentual}%)
                      </span>
                    </div>
                    <div 
                      className="relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={(e) => handleFiltroInterativo('aging', item.periodo, `Tempo: ${item.periodo}`, e)}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg transition-all duration-300"
                        style={{ 
                          width: `${item.percentual}%`,
                          backgroundColor: cores[index],
                          opacity: filtroInterativo && filtroInterativo.tipo !== 'aging' || (filtroInterativo?.tipo === 'aging' && filtroInterativo?.valor !== item.periodo) ? 0.4 : 1,
                          transform: filtroInterativo?.tipo === 'aging' && filtroInterativo?.valor === item.periodo ? 'scaleY(1.2)' : 'scaleY(1)',
                          border: filtroInterativo?.tipo === 'aging' && filtroInterativo?.valor === item.periodo ? '2px solid #db2777' : 'none'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Follow-up de Casos com Alteração (PADRÃO COLONOSCOPIA) */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 
              className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onNavigateToTable && onNavigateToTable('follow-up-rastreios-positivos')}
              title="Ir para tabela detalhada"
            >
              Follow-up Rastreios Positivos
            </h3>
            <span className="text-xs text-gray-500">{alteracoesDetectadas} casos</span>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
              onClick={(e) => handleFiltroInterativo('followup', 'acolhimento', 'Follow-up: Acolhimento APS', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'acolhimento') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'acolhimento' ? '2px solid #db2777' : '1px solid #e5e7eb',
                minHeight: '80px'
              }}
            >
              <p className="text-xs text-gray-600 mb-1">Acolhimento<br/>APS</p>
              <p className="text-lg font-bold text-blue-500 mt-auto">425</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
              onClick={(e) => handleFiltroInterativo('followup', 'caps', 'Follow-up: CAPS', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'caps') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'caps' ? '2px solid #db2777' : '1px solid #e5e7eb',
                minHeight: '80px'
              }}
            >
              <p className="text-xs text-gray-600 mb-1">CAPS</p>
              <p className="text-lg font-bold text-purple-500 mt-auto">185</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
              onClick={(e) => handleFiltroInterativo('followup', 'psicologia', 'Follow-up: Psicologia', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'psicologia') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'psicologia' ? '2px solid #db2777' : '1px solid #e5e7eb',
                minHeight: '80px'
              }}
            >
              <p className="text-xs text-gray-600 mb-1">Psicologia</p>
              <p className="text-lg font-bold text-green-500 mt-auto">298</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
              onClick={(e) => handleFiltroInterativo('followup', 'psiquiatria', 'Follow-up: Psiquiatria', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'psiquiatria') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'psiquiatria' ? '2px solid #db2777' : '1px solid #e5e7eb',
                minHeight: '80px'
              }}
            >
              <p className="text-xs text-gray-600 mb-1">Psiquiatria</p>
              <p className="text-lg font-bold text-red-500 mt-auto">125</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
              onClick={(e) => handleFiltroInterativo('followup', 'perda', 'Follow-up: Perda follow-up', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'perda') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'perda' ? '2px solid #db2777' : '1px solid #e5e7eb',
                minHeight: '80px'
              }}
            >
              <p className="text-xs text-gray-600 mb-1">Perda<br/>follow-up</p>
              <p className="text-lg font-bold text-gray-500 mt-auto">98</p>
            </div>
          </div>
        </div>

        {/* Evolução do Rastreio (12 meses) */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <h3 
              className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onNavigateToTable && onNavigateToTable('evolucao-rastreio-saude-mental')}
              title="Ir para tabela detalhada"
            >
              Evolução do Rastreio (12 meses)
            </h3>
          </div>
          
          <div className="grid grid-cols-12 gap-1 mb-4">
            {dados.evolucaoTemporal.map((item, index) => {
              const distanciaMeta = item.meta - item.cobertura;
              let backgroundColor;
              if (distanciaMeta > 18) backgroundColor = '#dc2626';
              else if (distanciaMeta > 15) backgroundColor = '#ef4444';
              else if (distanciaMeta > 12) backgroundColor = '#f59e0b';
              else if (distanciaMeta > 8) backgroundColor = '#fbbf24';
              else backgroundColor = '#10b981';
              
              return (
                <div key={index} className="relative group">
                  <div 
                    className="aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      <div className="font-semibold">{item.mes}</div>
                      <div>Cobertura: {item.cobertura}%</div>
                      <div>Aplicados: {item.aplicados}</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-gray-600 mt-1">{item.mes}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-gray-600">Crítico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-gray-600">Atenção</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-gray-600">Adequado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}