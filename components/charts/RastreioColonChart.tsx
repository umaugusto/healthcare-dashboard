// Arquivo: components/charts/RastreioColonChart.tsx
// Componente: Dashboard de rastreamento de colonoscopia com filtros interativos
// Contexto: Dashboard APS - Análise detalhada do rastreio de câncer colorretal
// Padrão: Baseado em MamografiaChart com dados específicos de colonoscopia

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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
  Stethoscope
} from 'lucide-react';

interface RastreioColonChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

// Componente StackedBar para funis simplificados
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

// Dados mockados específicos para colonoscopia
const dadosColonoscopia = {
  elegiveis: 3200,
  coberturaAtual: 45.8,
  metaDecenio: 70,
  taxaReconvocacao: 8.5,
  
  funilRastreamento: [
    { etapa: 'Elegíveis ao rastreio', valor: 3200, percentual: 100 },
    { etapa: 'Exames solicitados', valor: 1850, percentual: 57.8 },
    { etapa: 'Exames realizados', valor: 1465, percentual: 45.8 },
    { etapa: 'Com alteração', valor: 142, percentual: 9.7 },
    { etapa: 'Em acompanhamento', valor: 132, percentual: 93.0 }
  ],
  
  // Funil simplificado para Sangue Oculto nas Fezes
  funilSangueOculto: {
    segments: [
      { label: 'Elegíveis', percentage: 25, color: '#86efac' },
      { label: 'Indicados', percentage: 35, color: '#a7f3d0' },
      { label: 'Realizados', percentage: 30, color: '#fbbf24' },
      { label: 'Com alteração', percentage: 10, color: '#ef4444' }
    ]
  },
  
  // Funil simplificado para Colonoscopia direta
  funilColonoscopia: {
    segments: [
      { label: 'Elegíveis', percentage: 30, color: '#86efac' },
      { label: 'Indicados', percentage: 25, color: '#a7f3d0' },
      { label: 'Realizados', percentage: 35, color: '#fbbf24' },
      { label: 'Com alteração', percentage: 10, color: '#ef4444' }
    ]
  },
  
  classificacaoEndoscopica: [
    { categoria: 'Normal', quantidade: 785, percentual: 53.6, descricao: 'Mucosa normal' },
    { categoria: 'Pólipos < 1cm', quantidade: 398, percentual: 27.2, descricao: 'Pólipos pequenos' },
    { categoria: 'Pólipos ≥ 1cm', quantidade: 187, percentual: 12.8, descricao: 'Pólipos grandes' },
    { categoria: 'Adenoma baixo grau', quantidade: 58, percentual: 4.0, descricao: 'Displasia leve' },
    { categoria: 'Adenoma alto grau', quantidade: 25, percentual: 1.7, descricao: 'Displasia severa' },
    { categoria: 'Carcinoma', quantidade: 12, percentual: 0.8, descricao: 'Malignidade confirmada' }
  ],
  
  agingExames: [
    { periodo: 'Nunca realizaram', pacientes: 1420, percentual: 44.4 },
    { periodo: '> 10 anos', pacientes: 315, percentual: 9.8 },
    { periodo: '5-10 anos', pacientes: 485, percentual: 15.2 },
    { periodo: '3-5 anos', pacientes: 520, percentual: 16.3 },
    { periodo: '< 3 anos', pacientes: 460, percentual: 14.4 }
  ],
  
  evolucaoTemporal: [
    { mes: 'Jan', cobertura: 42.1, realizados: 98, meta: 70 },
    { mes: 'Fev', cobertura: 48.8, realizados: 105, meta: 70 },
    { mes: 'Mar', cobertura: 52.5, realizados: 112, meta: 70 },
    { mes: 'Abr', cobertura: 58.2, realizados: 118, meta: 70 },
    { mes: 'Mai', cobertura: 61.8, realizados: 125, meta: 70 },
    { mes: 'Jun', cobertura: 65.1, realizados: 108, meta: 70 },
    { mes: 'Jul', cobertura: 67.6, realizados: 132, meta: 70 },
    { mes: 'Ago', cobertura: 69.9, realizados: 128, meta: 70 },
    { mes: 'Set', cobertura: 71.5, realizados: 119, meta: 70 },
    { mes: 'Out', cobertura: 68.7, realizados: 135, meta: 70 },
    { mes: 'Nov', cobertura: 66.8, realizados: 142, meta: 70 },
    { mes: 'Dez', cobertura: 70.2, realizados: 138, meta: 70 }
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
  const coresIntuitivas = ['#86efac', '#a7f3d0', '#fde047', '#fb923c', '#ef4444'];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <h3 
            className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => onNavigateToTable && onNavigateToTable('funil-rastreamento-principal')}
            title="Ir para tabela detalhada"
          >
            {title}
          </h3>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Info className="w-3 h-3 text-gray-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Regra de Cálculo - Funil de Rastreamento</p>
              <div className="text-xs space-y-1 text-white">
                <p><strong>Elegíveis ao rastreio:</strong> Pessoas 50-75 anos sem contraindicações</p>
                <p><strong>Exames solicitados:</strong> Colonoscopias requisitadas pelo médico</p>
                <p><strong>Exames realizados:</strong> Colonoscopias efetivamente executadas</p>
                <p><strong>Com alteração:</strong> Pólipos, adenomas ou carcinomas</p>
                <p><strong>Em acompanhamento:</strong> Casos com follow-up adequado</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
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

// Componente de Gráfico Donut para Classificação Endoscópica
const EndoscopiaDonutChart = ({
  data,
  title,
  onItemClick,
  tipoFiltro,
  filtroAtivo
}: {
  data: any[],
  title: string,
  onItemClick: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  const coresEndoscopia = {
    'Normal': '#22c55e',
    'Pólipos < 1cm': '#86efac', 
    'Pólipos ≥ 1cm': '#fbbf24',
    'Adenoma baixo grau': '#f59e0b',
    'Adenoma alto grau': '#ef4444',
    'Carcinoma': '#991b1b'
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
      color: coresEndoscopia[item.categoria] || '#6b7280'
    };
  });

  return (
    <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Microscope className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Info className="w-3 h-3 text-gray-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Distribuição de Resultados</p>
              <div className="text-xs space-y-1 text-white">
                <p><strong>Normal:</strong> Mucosa sem alterações</p>
                <p><strong>Pólipos:</strong> Lesões benignas ou pré-malignas</p>
                <p><strong>Adenoma+:</strong> Lesões com potencial maligno</p>
                <p><strong>Cálculo:</strong> Percentual sobre total de exames realizados</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
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
              
              // Mostrar label se > 5% ou se hovering
              const showLabel = segment.percentual > 5 || hoveredSegment === index;
              
              if (!showLabel) return null;
              
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
              <div className="text-xs text-gray-600">exames</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 w-full max-w-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-gray-700">Normal</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-xs font-medium text-gray-700">Pólipos</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium text-gray-700">Adenoma+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RastreioColonChart({ filters, onNavigateToTable }: RastreioColonChartProps) {
  return (
    <TooltipProvider>
      <RastreioColonChartContent filters={filters} onNavigateToTable={onNavigateToTable} />
    </TooltipProvider>
  );
}

function RastreioColonChartContent({ filters, onNavigateToTable }: RastreioColonChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{
    tipo: string;
    valor: string;
    label: string;
  } | null>(null);
  const [cardsClicados, setCardsClicados] = useState<Set<string>>(new Set());

  // Aplicar filtro local nos dados
  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosColonoscopia;
    
    // Simular impacto do filtro nos dados
    const fator = Math.random() * 0.3 + 0.7; // Variação de 70-100%
    
    return {
      ...dadosColonoscopia,
      funilRastreamento: dadosColonoscopia.funilRastreamento.map(item => ({
        ...item,
        valor: Math.round(item.valor * fator)
      })),
      // Atualizar funis simplificados com filtro
      funilSangueOculto: {
        segments: dadosColonoscopia.funilSangueOculto.segments.map(segment => ({
          ...segment,
          percentage: segment.percentage * fator
        }))
      },
      funilColonoscopia: {
        segments: dadosColonoscopia.funilColonoscopia.segments.map(segment => ({
          ...segment,
          percentage: segment.percentage * fator
        }))
      },
      classificacaoEndoscopica: dadosColonoscopia.classificacaoEndoscopica.map(item => ({
        ...item,
        quantidade: Math.round(item.quantidade * fator)
      })),
      agingExames: dadosColonoscopia.agingExames.map(item => ({
        ...item,
        pacientes: Math.round(item.pacientes * fator)
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
  const taxaNuncaRealizou = (dados.agingExames[0].pacientes / dados.elegiveis * 100).toFixed(1);
  const examesVencidos = dados.agingExames[1].pacientes + dados.agingExames[2].pacientes;
  const alteracoesSignificativas = dados.classificacaoEndoscopica.slice(3).reduce((acc, item) => acc + item.quantidade, 0);

  // Top 5 fatores de risco para colonoscopia
  const top5FatoresRisco = [
    { fator: 'Histórico familiar CCR', pacientes: 156, percentual: 8.9, cor: '#991b1b' },
    { fator: 'Idade > 60 anos', pacientes: 485, percentual: 27.6, cor: '#ef4444' },
    { fator: 'Tabagismo', pacientes: 298, percentual: 17.0, cor: '#f59e0b' },
    { fator: 'Obesidade (IMC>30)', pacientes: 225, percentual: 12.8, cor: '#fbbf24' },
    { fator: 'Sedentarismo', pacientes: 312, percentual: 17.8, cor: '#fb923c' }
  ];

  // Estratificação por faixa etária com dados por sexo
  const estratificacaoFaixaSexo = [
    { 
      faixa: '50-54 anos', 
      masculino: 140, 
      feminino: 145, 
      totalM: 320, 
      totalF: 330,
      coberturaM: 43.8,
      coberturaF: 43.9
    },
    { 
      faixa: '55-59 anos', 
      masculino: 165, 
      feminino: 155, 
      totalM: 290, 
      totalF: 290,
      coberturaM: 56.9,
      coberturaF: 53.4
    },
    { 
      faixa: '60-64 anos', 
      masculino: 190, 
      feminino: 175, 
      totalM: 360, 
      totalF: 360,
      coberturaM: 52.8,
      coberturaF: 48.6
    },
    { 
      faixa: '65-69 anos', 
      masculino: 155, 
      feminino: 140, 
      totalM: 325, 
      totalF: 325,
      coberturaM: 47.7,
      coberturaF: 43.1
    },
    { 
      faixa: '70-75 anos', 
      masculino: 110, 
      feminino: 90, 
      totalM: 300, 
      totalF: 300,
      coberturaM: 36.7,
      coberturaF: 30.0
    }
  ];

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-blue-50 rounded">
              <Stethoscope className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <span>Rastreio CA Colorretal</span>
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
                  <p>População-alvo: Pessoas 50-75 anos</p>
                  <p>Periodicidade: Decenal (a cada 10 anos)</p>
                  <p>Meta de cobertura: 70% da população elegível</p>
                  <div className="mt-3">
                    <span className="font-medium">Classificação Endoscópica:</span>
                    <ul className="ml-3 mt-1 space-y-0.5">
                      <li>• Normal: Mucosa sem alterações</li>
                      <li>• Pólipos: Lesões polipoides</li>
                      <li>• Adenomas: Displasia leve/severa</li>
                      <li>• Carcinoma: Malignidade</li>
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
        {/* Cards de Métricas - 3 cards superiores */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Pendentes</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-blue-600">
                {dados.agingExames[0].pacientes}
              </p>
              <p className="text-[11px] text-gray-500">
                {taxaNuncaRealizou}%
              </p>
            </div>
            <div className="absolute -top-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 max-w-[200px]">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pessoas 50-75 anos que nunca realizaram colonoscopia ou há mais de 10 anos</div>
              <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Com alteração</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-yellow-600">
                {alteracoesSignificativas}
              </p>
              <p className="text-[11px] text-gray-500">
                {(alteracoesSignificativas / dados.funilRastreamento[2].valor * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Adenomas de baixo/alto grau e carcinomas</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Acompanhamento inadequado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-red-600">
                {examesVencidos}
              </p>
              <p className="text-[11px] text-gray-500">
                {((examesVencidos) / dados.elegiveis * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 max-w-[220px]">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Última colonoscopia realizada há mais de 5 anos (periodicidade decenal recomendada)</div>
              <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
        </div>

        {/* NOVOS GRÁFICOS: Funis Simplificados Sangue Oculto e Colonoscopia */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onNavigateToTable && onNavigateToTable('sangue-oculto')}
                  title="Ir para tabela detalhada"
                >
                  Rastreio Sangue Oculto
                </h3>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <Info className="w-3 h-3 text-gray-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Teste de Sangue Oculto nas Fezes</p>
                    <div className="text-xs space-y-1 text-white">
                      <p><strong>Elegíveis:</strong> Pessoas 50-75 anos sem sintomas</p>
                      <p><strong>Indicados:</strong> Rastreio inicial ou anual</p>
                      <p><strong>Realizados:</strong> Testes efetivamente coletados</p>
                      <p><strong>Com alteração:</strong> Positivos que requerem colonoscopia</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="mb-4 px-2">
              <StackedBar 
                segments={dados.funilSangueOculto.segments} 
                onSegmentClick={handleFiltroInterativo}
                tipoFiltro="sangue-oculto-funil"
                filtroAtivo={filtroInterativo}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 px-3">
              {dados.funilSangueOculto.segments.filter(s => s.percentage > 0).map((item, index) => (
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
                <Stethoscope className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onNavigateToTable && onNavigateToTable('colonoscopia')}
                  title="Ir para tabela detalhada"
                >
                  Rastreio Colonoscopia
                </h3>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <Info className="w-3 h-3 text-gray-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Colonoscopia Direta</p>
                    <div className="text-xs space-y-1 text-white">
                      <p><strong>Elegíveis:</strong> Pessoas 50-75 anos ou risco aumentado</p>
                      <p><strong>Indicados:</strong> Rastreio ou confirmação diagnóstica</p>
                      <p><strong>Realizados:</strong> Exames efetivamente executados</p>
                      <p><strong>Com alteração:</strong> Pólipos, adenomas ou carcinomas</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="mb-4 px-2">
              <StackedBar 
                segments={dados.funilColonoscopia.segments} 
                onSegmentClick={handleFiltroInterativo}
                tipoFiltro="colonoscopia-funil"
                filtroAtivo={filtroInterativo}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 px-3">
              {dados.funilColonoscopia.segments.filter(s => s.percentage > 0).map((item, index) => (
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onNavigateToTable && onNavigateToTable('cobertura-faixa-etaria')}
                  title="Ir para tabela detalhada"
                >
                  Cobertura por Faixa Etária
                </h3>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <Info className="w-3 h-3 text-gray-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Cobertura por Faixa Etária e Sexo</p>
                    <div className="text-xs space-y-1 text-white">
                      <p><strong>Cálculo:</strong> (Exames realizados / Total elegíveis) × 100</p>
                      <p><strong>Período:</strong> Últimos 10 anos (decenal)</p>
                      <p><strong>Meta:</strong> 70% de cobertura por faixa</p>
                      <p><strong>Cores:</strong> Azul (masculino) | Rosa (feminino)</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
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

        {/* Top 5 Fatores de Risco - Ocupando toda extensão */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onNavigateToTable && onNavigateToTable('fatores-risco')}
                title="Ir para tabela detalhada"
              >
                Top 5 - Fatores de Risco
              </h3>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Info className="w-3 h-3 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Fatores de Risco para Câncer Colorretal</p>
                  <div className="text-xs space-y-1 text-white">
                    <p><strong>Base:</strong> Pessoas elegíveis com fatores identificados</p>
                    <p><strong>Cálculo:</strong> (Pessoas com fator / Total elegíveis) × 100</p>
                    <p><strong>Importância:</strong> Fatores de risco indicam necessidade de rastreio mais frequente</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
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

        {/* Classificação Endoscópica - Layout Horizontal */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onNavigateToTable && onNavigateToTable('classificacao-endoscopica')}
                title="Ir para tabela detalhada"
              >
                Classificação Endoscópica
              </h3>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Info className="w-3 h-3 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Classificação dos Achados</p>
                  <div className="text-xs space-y-1 text-white">
                    <p><strong>Normal:</strong> Mucosa sem alterações</p>
                    <p><strong>Pólipos:</strong> Lesões polipoides por tamanho</p>
                    <p><strong>Adenomas:</strong> Displasia de baixo ou alto grau</p>
                    <p><strong>Carcinoma:</strong> Malignidade confirmada</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {dados.classificacaoEndoscopica.map((endo, index) => {
              const cores = ['#22c55e', '#86efac', '#fbbf24', '#f59e0b', '#ef4444', '#991b1b'];
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-3 border cursor-pointer hover:shadow-md transition-all duration-200 group relative"
                  onClick={(e) => handleFiltroInterativo('endoscopia', endo.categoria, `Endoscopia: ${endo.categoria}`, e)}
                  style={{
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'endoscopia' || (filtroInterativo?.tipo === 'endoscopia' && filtroInterativo?.valor !== endo.categoria) ? 0.4 : 1,
                    transform: filtroInterativo?.tipo === 'endoscopia' && filtroInterativo?.valor === endo.categoria ? 'scale(1.02)' : 'scale(1)',
                    borderColor: filtroInterativo?.tipo === 'endoscopia' && filtroInterativo?.valor === endo.categoria ? '#db2777' : '#e5e7eb',
                    borderWidth: filtroInterativo?.tipo === 'endoscopia' && filtroInterativo?.valor === endo.categoria ? '2px' : '1px'
                  }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {endo.descricao}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="text-xs font-bold text-gray-700 truncate">
                      {endo.categoria}
                    </div>
                    
                    <div className="text-xl font-bold" style={{ color: cores[index] }}>
                      {endo.quantidade}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="relative w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="absolute inset-0 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${endo.percentual}%`,
                            backgroundColor: cores[index]
                          }} 
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-gray-600">
                        {endo.percentual}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tempo Desde Último Exame + Distribuição de Resultados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onNavigateToTable && onNavigateToTable('tempo-ultimo-exame')}
                  title="Ir para tabela detalhada"
                >
                  Tempo Desde Último Exame
                </h3>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <Info className="w-3 h-3 text-gray-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Aging dos Exames</p>
                    <div className="text-xs space-y-1 text-white">
                      <p><strong>Nunca realizaram:</strong> Prioridade máxima</p>
                      <p><strong>&gt; 10 anos:</strong> Muito vencido (prioridade alta)</p>
                      <p><strong>5-10 anos:</strong> Vencido (prioridade média)</p>
                      <p><strong>3-5 anos:</strong> Próximo do vencimento</p>
                      <p><strong>&lt; 3 anos:</strong> Recente</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="space-y-3">
              {dados.agingExames.map((item, index) => {
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



          <EndoscopiaDonutChart 
            data={dados.classificacaoEndoscopica}
            title="Distribuição de Resultados"
            onItemClick={handleFiltroInterativo}
            tipoFiltro="endoscopia-donut"
            filtroAtivo={filtroInterativo}
          />
        </div>

        {/* Follow-up de Casos com Alteração */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onNavigateToTable && onNavigateToTable('follow-up-polipos')}
                title="Ir para tabela detalhada"
              >
                Follow-up Pólipos e Adenomas
              </h3>
              <span className="text-xs text-gray-500">{dados.classificacaoEndoscopica.slice(1).reduce((acc, item) => acc + item.quantidade, 0)} casos</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Info className="w-3 h-3 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Acompanhamento de Casos com Alteração</p>
                  <div className="text-xs space-y-1 text-white">
                    <p><strong>Base:</strong> Todos os casos com pólipos ou adenomas</p>
                    <p><strong>Em investigação:</strong> Aguardando biópsia/exames</p>
                    <p><strong>Polipectomia:</strong> Remoção endoscópica</p>
                    <p><strong>Cirurgia:</strong> Ressecção cirúrgica</p>
                    <p><strong>Perda follow-up:</strong> Pacientes que não retornaram</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'investigacao', 'Follow-up: Em investigação', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'investigacao') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'investigacao' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Em investigação</p>
              <p className="text-lg font-bold text-orange-500">89</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'polipectomia', 'Follow-up: Polipectomia', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'polipectomia') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'polipectomia' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Polipectomia</p>
              <p className="text-lg font-bold text-blue-500">156</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'seguimento', 'Follow-up: Seguimento', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'seguimento') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'seguimento' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Seguimento</p>
              <p className="text-lg font-bold text-green-500">98</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'cirurgia', 'Follow-up: Cirurgia', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'cirurgia') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'cirurgia' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Cirurgia</p>
              <p className="text-lg font-bold text-red-500">23</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'perda', 'Follow-up: Perda follow-up', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'perda') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'perda' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Perda follow-up</p>
              <p className="text-lg font-bold text-gray-500">18</p>
            </div>
          </div>
        </div>

        {/* Evolução do Rastreio (12 meses) */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onNavigateToTable && onNavigateToTable('evolucao-rastreio')}
                title="Ir para tabela detalhada"
              >
                Evolução do Rastreio (12 meses)
              </h3>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Info className="w-3 h-3 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Heatmap de Cobertura Mensal</p>
                  <div className="text-xs space-y-1 text-white">
                    <p><strong>Métrica:</strong> Taxa de cobertura mensal</p>
                    <p><strong>Meta:</strong> 70% de cobertura</p>
                    <p><strong>Cores:</strong></p>
                    <p className="ml-2">Verde: Meta atingida</p>
                    <p className="ml-2">Amarelo: Próximo da meta</p>
                    <p className="ml-2">Vermelho: Abaixo da meta</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="grid grid-cols-12 gap-1 mb-4">
            {dados.evolucaoTemporal.map((item, index) => {
              const distanciaMeta = item.meta - item.cobertura;
              let backgroundColor;
              if (item.cobertura >= item.meta) backgroundColor = '#10b981';
              else if (distanciaMeta <= 5) backgroundColor = '#fbbf24';
              else if (distanciaMeta <= 10) backgroundColor = '#f59e0b';
              else if (distanciaMeta <= 15) backgroundColor = '#ef4444';
              else backgroundColor = '#991b1b';
              
              return (
                <div key={index} className="relative group">
                  <div 
                    className="aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      <div className="font-semibold">{item.mes}</div>
                      <div>Cobertura: {item.cobertura}%</div>
                      <div>Realizados: {item.realizados}</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-gray-600 mt-1">{item.mes}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-gray-600">Meta atingida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
              <span className="text-gray-600">Próximo meta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-gray-600">Atenção</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#991b1b' }}></div>
              <span className="text-gray-600">Crítico</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}