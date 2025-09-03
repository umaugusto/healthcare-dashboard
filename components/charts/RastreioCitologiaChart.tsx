// Arquivo: components/charts/RastreioCitologiaChart.tsx
// Componente: Dashboard de rastreamento citológico com filtros interativos
// Contexto: Dashboard APS - Análise detalhada do rastreio de câncer de colo do útero
// Padrão: Baseado em MamografiaChart com dados específicos de citologia

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
  Heart
} from 'lucide-react';

interface RastreioCitologiaChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

// Dados mockados específicos para citologia
const dadosCitologia = {
  elegiveis: 4850,
  coberturaAtual: 68.2,
  metaTrienal: 80,
  taxaReconvocacao: 4.2,
  
  funilRastreamento: [
    { etapa: 'Elegíveis ao rastreio', valor: 4850, percentual: 100 },
    { etapa: 'Exames solicitados', valor: 3680, percentual: 75.9 },
    { etapa: 'Exames realizados', valor: 3310, percentual: 68.2 },
    { etapa: 'Com alteração', valor: 165, percentual: 5.0 },
    { etapa: 'Em acompanhamento', valor: 156, percentual: 94.5 }
  ],
  
  classificacaoNIC: [
    { categoria: 'Normal', quantidade: 2890, percentual: 87.3, descricao: 'Dentro dos limites da normalidade' },
    { categoria: 'ASC-US', quantidade: 165, percentual: 5.0, descricao: 'Atipias de significado indeterminado' },
    { categoria: 'ASC-H', quantidade: 89, percentual: 2.7, descricao: 'Atipias não excluindo lesão de alto grau' },
    { categoria: 'LSIL', quantidade: 98, percentual: 3.0, descricao: 'Lesão intraepitelial de baixo grau' },
    { categoria: 'HSIL', quantidade: 45, percentual: 1.4, descricao: 'Lesão intraepitelial de alto grau' },
    { categoria: 'AGC', quantidade: 23, percentual: 0.7, descricao: 'Células glandulares atípicas' }
  ],
  
  agingExames: [
    { periodo: 'Nunca coletaram', pacientes: 890, percentual: 18.4 },
    { periodo: '3-5 anos', pacientes: 645, percentual: 13.3 },
    { periodo: '2-3 anos', pacientes: 420, percentual: 8.7 },
    { periodo: '1-2 anos', pacientes: 785, percentual: 16.2 },
    { periodo: '< 1 ano', pacientes: 2110, percentual: 43.5 }
  ],
  
  evolucaoTemporal: [
    { mes: 'Jan', cobertura: 64.2, realizados: 285, meta: 80 },
    { mes: 'Fev', cobertura: 65.1, realizados: 298, meta: 80 },
    { mes: 'Mar', cobertura: 66.8, realizados: 312, meta: 80 },
    { mes: 'Abr', cobertura: 67.2, realizados: 289, meta: 80 },
    { mes: 'Mai', cobertura: 67.9, realizados: 305, meta: 80 },
    { mes: 'Jun', cobertura: 68.5, realizados: 318, meta: 80 },
    { mes: 'Jul', cobertura: 69.1, realizados: 295, meta: 80 },
    { mes: 'Ago', cobertura: 68.8, realizados: 278, meta: 80 },
    { mes: 'Set', cobertura: 68.4, realizados: 290, meta: 80 },
    { mes: 'Out', cobertura: 68.7, realizados: 302, meta: 80 },
    { mes: 'Nov', cobertura: 68.2, realizados: 288, meta: 80 },
    { mes: 'Dez', cobertura: 68.2, realizados: 275, meta: 80 }
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
            onClick={() => onNavigateToTable && onNavigateToTable('funil-rastreamento-citologico')}
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
                <p><strong>Elegíveis ao rastreio:</strong> Mulheres 25-64 anos sem contraindicações</p>
                <p><strong>Exames solicitados:</strong> Citologias requisitadas pelo médico</p>
                <p><strong>Exames realizados:</strong> Coletas efetivamente executadas</p>
                <p><strong>Com alteração:</strong> Resultados ASC-H, LSIL ou HSIL</p>
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

// Componente de Gráfico Donut para Classificação NIC
const NICDonutChart = ({
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
  
  const coresNIC = {
    'Normal': '#22c55e',
    'ASC-US': '#fbbf24', 
    'ASC-H': '#f59e0b',
    'LSIL': '#fb923c',
    'HSIL': '#ef4444',
    'AGC': '#dc2626'
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
      color: coresNIC[item.categoria] || '#6b7280'
    };
  });

  return (
    <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Microscope className="w-4 h-4 text-gray-600" />
        <h3 
          className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onNavigateToTable && onNavigateToTable('distribuicao-resultados-nic')}
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
              <span className="text-xs font-medium text-gray-700">Acompanhar</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium text-gray-700">Investigar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RastreioCitologiaChart({ filters, onNavigateToTable }: RastreioCitologiaChartProps) {
  return (
    <TooltipProvider>
      <RastreioCitologiaChartContent filters={filters} onNavigateToTable={onNavigateToTable} />
    </TooltipProvider>
  );
}

function RastreioCitologiaChartContent({ filters, onNavigateToTable }: RastreioCitologiaChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{
    tipo: string;
    valor: string;
    label: string;
  } | null>(null);
  const [cardsClicados, setCardsClicados] = useState<Set<string>>(new Set());

  // Aplicar filtro local nos dados
  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosCitologia;
    
    // Simular impacto do filtro nos dados
    const fator = Math.random() * 0.3 + 0.7; // Variação de 70-100%
    
    return {
      ...dadosCitologia,
      funilRastreamento: dadosCitologia.funilRastreamento.map(item => ({
        ...item,
        valor: Math.round(item.valor * fator)
      })),
      classificacaoNIC: dadosCitologia.classificacaoNIC.map(item => ({
        ...item,
        quantidade: Math.round(item.quantidade * fator)
      })),
      agingExames: dadosCitologia.agingExames.map(item => ({
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
  const taxaNuncaColetou = (dados.agingExames[0].pacientes / dados.elegiveis * 100).toFixed(1);
  const examesVencidos = dados.agingExames[1].pacientes + dados.agingExames[2].pacientes;
  const alteracoesCitologicas = dados.classificacaoNIC.slice(1).reduce((acc, item) => acc + item.quantidade, 0);

  // Top 5 fatores de risco para citologia
  const top5FatoresRisco = [
    { fator: 'Múltiplos parceiros', pacientes: 235, percentual: 12.8, cor: '#dc2626' },
    { fator: 'Tabagismo ativo', pacientes: 198, percentual: 10.7, cor: '#ef4444' },
    { fator: 'Idade > 50 anos', pacientes: 285, percentual: 15.6, cor: '#f59e0b' },
    { fator: 'HPV positivo', pacientes: 89, percentual: 4.9, cor: '#fbbf24' },
    { fator: 'Baixa escolaridade', pacientes: 156, percentual: 8.5, cor: '#fb923c' }
  ];

  // Estratificação por faixa etária
  const estratificacao5Faixas = [
    { faixa: '25-29 anos', realizados: 485, total: 690, cobertura: 70.3, cor: '#fbbf24' },
    { faixa: '30-34 anos', realizados: 625, total: 820, cobertura: 76.2, cor: '#86efac' },
    { faixa: '35-39 anos', realizados: 720, total: 890, cobertura: 80.9, cor: '#86efac' },
    { faixa: '40-49 anos', realizados: 865, total: 1150, cobertura: 75.2, cor: '#86efac' },
    { faixa: '50-64 anos', realizados: 615, total: 900, cobertura: 68.3, cor: '#fbbf24' }
  ];

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-purple-50 rounded">
              <Heart className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <span>Rastreio CA Colo de Útero</span>
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
                  <p>População-alvo: Mulheres 25-64 anos</p>
                  <p>Periodicidade: Trienal (a cada 3 anos)</p>
                  <p>Meta de cobertura: 80% da população elegível</p>
                  <div className="mt-3">
                    <span className="font-medium">Classificação Citológica:</span>
                    <ul className="ml-3 mt-1 space-y-0.5">
                      <li>• Normal: Dentro dos limites</li>
                      <li>• ASC-US/ASC-H: Atipias celulares</li>
                      <li>• LSIL: Lesão baixo grau</li>
                      <li>• HSIL: Lesão alto grau</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {filtroInterativo && (
          <div className="absolute top-1 right-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            Filtrado: {filtroInterativo.label}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5 px-6">
        {/* Cards de Métricas - 3 cards superiores */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-purple-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Pendentes</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-purple-600">
                {dados.agingExames[0].pacientes}
              </p>
              <p className="text-[11px] text-gray-500">
                {taxaNuncaColetou}%
              </p>
            </div>
            <div className="absolute -top-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 max-w-[200px]">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Mulheres 25-64 anos que nunca realizaram citologia ou há mais de 3 anos</div>
              <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Com alteração</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-yellow-600">
                {alteracoesCitologicas}
              </p>
              <p className="text-[11px] text-gray-500">
                {(alteracoesCitologicas / dados.funilRastreamento[2].valor * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Exames com resultado ASC-US, ASC-H, LSIL ou HSIL</div>
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
              <div>Última citologia realizada há mais de 3 anos (periodicidade trienal recomendada)</div>
              <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
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
                  onClick={() => onNavigateToTable && onNavigateToTable('cobertura-faixa-etaria-citologia')}
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
                    <p className="font-semibold">Cobertura por Faixa Etária</p>
                    <div className="text-xs space-y-1 text-white">
                      <p><strong>Cálculo:</strong> (Exames realizados / Total elegíveis) × 100</p>
                      <p><strong>Período:</strong> Últimos 3 anos (trienal)</p>
                      <p><strong>Meta:</strong> 80% de cobertura por faixa</p>
                      <p><strong>Cores:</strong></p>
                      <p className="ml-2">Verde: ≥ 75% | Amarelo: 65-74% | Vermelho: {'<'} 65%</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="space-y-3">
              {estratificacao5Faixas.map((faixa, index) => {
                const corBarra = faixa.cobertura >= 75 ? '#86efac' : faixa.cobertura >= 65 ? '#fbbf24' : '#f87171';
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{faixa.faixa}</span>
                      <span className="text-gray-600">
                        {faixa.realizados} ({faixa.cobertura}%)
                      </span>
                    </div>
                    <div 
                      className="relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={(e) => handleFiltroInterativo('faixa', faixa.faixa, `Faixa: ${faixa.faixa}`, e)}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg transition-all duration-300"
                        style={{ 
                          width: `${faixa.cobertura}%`,
                          backgroundColor: corBarra,
                          opacity: filtroInterativo && filtroInterativo.tipo !== 'faixa' || (filtroInterativo?.tipo === 'faixa' && filtroInterativo?.valor !== faixa.faixa) ? 0.4 : 1,
                          transform: filtroInterativo?.tipo === 'faixa' && filtroInterativo?.valor === faixa.faixa ? 'scaleY(1.2)' : 'scaleY(1)',
                          border: filtroInterativo?.tipo === 'faixa' && filtroInterativo?.valor === faixa.faixa ? '2px solid #db2777' : 'none'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
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
                onClick={() => onNavigateToTable && onNavigateToTable('fatores-risco-citologia')}
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
                  <p className="font-semibold">Fatores de Risco para Câncer de Colo de Útero</p>
                  <div className="text-xs space-y-1 text-white">
                    <p><strong>Base:</strong> Mulheres elegíveis com fatores identificados</p>
                    <p><strong>Cálculo:</strong> (Mulheres com fator / Total elegíveis) × 100</p>
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

        {/* Classificação Citológica - Layout Horizontal */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onNavigateToTable && onNavigateToTable('classificacao-citologica')}
                title="Ir para tabela detalhada"
              >
                Classificação Citológica
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
                  <p className="font-semibold">Sistema de Bethesda</p>
                  <div className="text-xs space-y-1 text-white">
                    <p><strong>Normal:</strong> Dentro dos limites da normalidade</p>
                    <p><strong>ASC-US:</strong> Atipias de significado indeterminado</p>
                    <p><strong>ASC-H:</strong> Atipias não excluindo lesão de alto grau</p>
                    <p><strong>LSIL:</strong> Lesão intraepitelial de baixo grau</p>
                    <p><strong>HSIL:</strong> Lesão intraepitelial de alto grau</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {dados.classificacaoNIC.map((nic, index) => {
              const cores = ['#22c55e', '#fbbf24', '#f59e0b', '#fb923c', '#ef4444', '#dc2626'];
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-3 border cursor-pointer hover:shadow-md transition-all duration-200 group relative"
                  onClick={(e) => handleFiltroInterativo('nic', nic.categoria, `NIC: ${nic.categoria}`, e)}
                  style={{
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'nic' || (filtroInterativo?.tipo === 'nic' && filtroInterativo?.valor !== nic.categoria) ? 0.4 : 1,
                    transform: filtroInterativo?.tipo === 'nic' && filtroInterativo?.valor === nic.categoria ? 'scale(1.02)' : 'scale(1)',
                    borderColor: filtroInterativo?.tipo === 'nic' && filtroInterativo?.valor === nic.categoria ? '#db2777' : '#e5e7eb',
                    borderWidth: filtroInterativo?.tipo === 'nic' && filtroInterativo?.valor === nic.categoria ? '2px' : '1px'
                  }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {nic.descricao}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="text-xs font-bold text-gray-700">
                      {nic.categoria}
                    </div>
                    
                    <div className="text-xl font-bold" style={{ color: cores[index] }}>
                      {nic.quantidade}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="relative w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="absolute inset-0 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${nic.percentual}%`,
                            backgroundColor: cores[index]
                          }} 
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-gray-600">
                        {nic.percentual}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tempo Desde Última Coleta + Distribuição de Resultados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tempo Desde Última Coleta */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onNavigateToTable && onNavigateToTable('tempo-ultima-coleta')}
                title="Ir para tabela detalhada"
              >
                Tempo Desde Última Coleta
              </h3>
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

          {/* Distribuição de Resultados */}
          <NICDonutChart 
            data={dados.classificacaoNIC}
            title="Distribuição de Resultados"
            onItemClick={handleFiltroInterativo}
            tipoFiltro="nic-donut"
            filtroAtivo={filtroInterativo}
            onNavigateToTable={onNavigateToTable}
          />
        </div>

        {/* Follow-up de Casos com Alteração */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 
              className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onNavigateToTable && onNavigateToTable('follow-up-casos-alteracao-citologia')}
              title="Ir para tabela detalhada"
            >
              Follow-up Casos com Alteração
            </h3>
            <span className="text-xs text-gray-500">{alteracoesCitologicas} casos</span>
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
              <p className="text-lg font-bold text-orange-500">52</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'colposcopia', 'Follow-up: Colposcopia', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'colposcopia') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'colposcopia' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Colposcopia</p>
              <p className="text-lg font-bold text-blue-500">28</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'biopsia', 'Follow-up: Biopsia', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'biopsia') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'biopsia' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Biopsia</p>
              <p className="text-lg font-bold text-purple-500">15</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'tratamento', 'Follow-up: Em tratamento', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'tratamento') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'tratamento' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Em tratamento</p>
              <p className="text-lg font-bold text-red-500">8</p>
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
              <p className="text-lg font-bold text-gray-500">12</p>
            </div>
          </div>
        </div>

        {/* Evolução do Rastreio (12 meses) */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <h3 
              className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onNavigateToTable && onNavigateToTable('evolucao-rastreio-citologia')}
              title="Ir para tabela detalhada"
            >
              Evolução do Rastreio (12 meses)
            </h3>
          </div>
          
          <div className="grid grid-cols-12 gap-1 mb-4">
            {dados.evolucaoTemporal.map((item, index) => {
              const distanciaMeta = item.meta - item.cobertura;
              let backgroundColor;
              if (distanciaMeta > 15) backgroundColor = '#dc2626';
              else if (distanciaMeta > 12) backgroundColor = '#ef4444';
              else if (distanciaMeta > 8) backgroundColor = '#f59e0b';
              else if (distanciaMeta > 5) backgroundColor = '#fbbf24';
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
                      <div>Realizados: {item.realizados}</div>
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