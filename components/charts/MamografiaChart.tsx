// Arquivo: components/charts/MamografiaChart.tsx
// Componente: Dashboard de rastreamento mamográfico com filtros interativos
// Contexto: Dashboard APS - Análise detalhada do rastreio de câncer de mama
// Padrão: Segue estrutura de HipertensaoChart com visualizações otimizadas

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
  Microscope
} from 'lucide-react';
import { dadosMamografia, projectColors } from '../../data/chartsData';

interface MamografiaChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

// Componente de Funil Visual Vertical (cores mais intuitivas)
const FunnelChart = ({ data, title, icon: Icon, onItemClick, tipoFiltro, filtroAtivo, onNavigateToTable }: {
  data: any[],
  title: string,
  icon: React.ElementType,
  onItemClick?: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro?: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null,
  onNavigateToTable?: (type: string) => void
}) => {
  // Cores mais intuitivas: verde → amarelo → vermelho conforme afunila
  const coresIntuitivas = ['#86efac', '#a7f3d0', '#fde047', '#fb923c', '#ef4444'];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <h3 
            className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => onNavigateToTable && onNavigateToTable('funil-rastreamento-mamografico')}
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
                <p><strong>Elegíveis ao rastreio:</strong> Mulheres 50-69 anos sem contraindicações</p>
                <p><strong>Exames solicitados:</strong> Mamografias requisitadas pelo médico</p>
                <p><strong>Exames realizados:</strong> Mamografias efetivamente executadas</p>
                <p><strong>Com alteração:</strong> Resultados BI-RADS 4 ou 5</p>
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
          // Texto branco para cores saturadas/escuras
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

// Componente de Gráfico Donut Simples com percentuais sobre o gráfico
const BiRadsDonutSimple = ({
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
  
  // Cores específicas para cada categoria BI-RADS
  const coresBiRads = {
    'BI-RADS 0': '#9ca3af', // Cinza - inconclusivo
    'BI-RADS 1': '#86efac', // Verde claro - negativo
    'BI-RADS 2': '#22c55e', // Verde - benigno
    'BI-RADS 3': '#fbbf24', // Amarelo - provavelmente benigno
    'BI-RADS 4': '#f59e0b', // Laranja - suspeito
    'BI-RADS 5': '#dc2626'  // Vermelho - altamente suspeito
  };

  const total = data.reduce((acc, item) => acc + item.quantidade, 0);
  let cumulativePercentage = 0;

  // Criar segmentos do donut
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
      color: coresBiRads[item.categoria] || '#6b7280'
    };
  });

  return (
    <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Microscope className="w-4 h-4 text-gray-600" />
          <h3 
            className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => onNavigateToTable && onNavigateToTable('distribuicao-resultados-bi-rads')}
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
              <p className="font-semibold">Distribuição de Resultados</p>
              <div className="text-xs space-y-1 text-white">
              <p><strong>Normal (1-2):</strong> Rotina bienal</p>
                <p><strong>Acompanhar (3):</strong> Controle em 6 meses</p>
                <p><strong>Investigar (4-5):</strong> Biópsia indicada</p>
                <p><strong>Cálculo:</strong> Percentual sobre total de exames realizados</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Container do gráfico centralizado */}
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {segments.map((segment, index) => {
              const isActive = filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === segment.categoria;
              const radius = 80;
              const innerRadius = 50;
              const centerX = 100;
              const centerY = 100;
              
              // Calcular pontos do arco
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
                <g key={index}>
                  <path
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
                </g>
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
          
          {/* Texto central */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-xs text-gray-600">exames</div>
            </div>
          </div>
        </div>

        {/* Legenda sem percentuais */}
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

export default function MamografiaChart({ filters, onNavigateToTable }: MamografiaChartProps) {
  return (
    <TooltipProvider>
      <MamografiaChartContent filters={filters} onNavigateToTable={onNavigateToTable} />
    </TooltipProvider>
  );
}

function MamografiaChartContent({ filters, onNavigateToTable }: MamografiaChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [filtroInterativo, setFiltroInterativo] = useState<{
    tipo: string;
    valor: string;
    label: string;
  } | null>(null);
  const [cardsClicados, setCardsClicados] = useState<Set<string>>(new Set());

  // Por enquanto não temos correlações para mamografia, então usamos dados fixos
  const dados = useMemo(() => {
    return dadosMamografia;
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
  const examesnecessarios = Math.ceil((dados.elegiveis * dados.metaBienal / 100) - dados.funilRastreamento[2].valor);

  // Preparar dados dos 5 principais fatores de risco
  const top5FatoresRisco = [
    { fator: 'História familiar', pacientes: 178, percentual: 8.7, cor: '#dc2626' },
    { fator: 'Densidade mamária D', pacientes: 315, percentual: 15.4, cor: '#ef4444' },
    { fator: 'Idade > 65 anos', pacientes: 420, percentual: 20.5, cor: '#f59e0b' },
    { fator: 'Radioterapia prévia', pacientes: 23, percentual: 1.1, cor: '#fbbf24' },
    { fator: 'Mutação BRCA', pacientes: 12, percentual: 0.6, cor: '#fb923c' }
  ];

  // Expandir estratificação para 5 faixas etárias
  const estratificacao5Faixas = [
    { 
      faixa: '45-49 anos', 
      realizados: 195,
      total: 280,
      cobertura: 69.6,
      cor: '#fbbf24'
    },
    { 
      faixa: '50-54 anos', 
      realizados: 425,
      total: 580,
      cobertura: 73.3,
      cor: '#86efac'
    },
    { 
      faixa: '55-59 anos', 
      realizados: 478,
      total: 620,
      cobertura: 77.1,
      cor: '#86efac'
    },
    { 
      faixa: '60-64 anos', 
      realizados: 415,
      total: 540,
      cobertura: 76.9,
      cor: '#86efac'
    },
    { 
      faixa: '65-69 anos', 
      realizados: 270,
      total: 360,
      cobertura: 75.0,
      cor: '#86efac'
    }
  ];

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-pink-50 rounded">
              <Users className="w-4 h-4 text-pink-500" />
            </div>
            <div>
              <span>Rastreio CA Mama</span>
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
                <h4 className="font-semibold mb-2 text-sm">Rastreio CA Mama - Informações</h4>
                <div className="space-y-2">
                  <p className="text-yellow-200">População elegível: Mulheres 50-69 anos</p>
                  <p>População-alvo: Mulheres 50-69 anos</p>
                  <p>Periodicidade: Bienal (a cada 2 anos)</p>
                  <p>Meta de cobertura: 80% da população elegível</p>
                  <div className="mt-3">
                    <span className="font-medium">Classificação BI-RADS:</span>
                    <ul className="ml-3 mt-1 space-y-0.5">
                      <li>• 0: Inconclusivo</li>
                      <li>• 1-2: Negativo/Benigno</li>
                      <li>• 3: Provavelmente benigno</li>
                      <li>• 4-5: Suspeito/Altamente suspeito</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {filtroInterativo && (
          <div className="absolute top-1 right-1 bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
            Filtrado: {filtroInterativo.label}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5 px-6">
        {/* Cards de Métricas - 3 cards superiores */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-pink-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Pendentes</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-pink-600">
                {dados.agingExames[0].pacientes}
              </p>
              <p className="text-[11px] text-gray-500">
                {taxaNuncaRealizou}%
              </p>
            </div>
            <div className="absolute -top-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 max-w-[200px]">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Mulheres 50-69 anos que nunca realizaram mamografia ou há mais de 3 anos</div>
              <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Com alteração</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-yellow-600">
                {dados.funilRastreamento[3].valor}
              </p>
              <p className="text-[11px] text-gray-500">
                {(dados.funilRastreamento[3].valor / dados.funilRastreamento[2].valor * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Exames com resultado BI-RADS 3, 4 ou 5</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Acompanhamento inadequado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-red-600">
                {dados.agingExames[2].pacientes + dados.agingExames[3].pacientes}
              </p>
              <p className="text-[11px] text-gray-500">
                {((dados.agingExames[2].pacientes + dados.agingExames[3].pacientes) / dados.elegiveis * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 max-w-[220px]">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Última mamografia realizada há mais de 2 anos (periodicidade bienal recomendada)</div>
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
                  onClick={() => onNavigateToTable && onNavigateToTable('cobertura-faixa-etaria-mamografia')}
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
                    <p className="font-semibold">Regra de Cálculo - Cobertura por Faixa Etária</p>
                    <div className="text-xs space-y-1 text-white">
                      <p><strong>Cálculo:</strong> (Exames realizados na faixa / Total de mulheres na faixa) × 100</p>
                      <p><strong>Período:</strong> Últimos 2 anos (bienal)</p>
                      <p><strong>Meta:</strong> 75% de cobertura por faixa</p>
                      <p><strong>Cores:</strong></p>
                      <p className="ml-2">Verde: ≥ 75% | Amarelo: 60-74% | Vermelho: {'<'} 60%</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="space-y-3">
              {estratificacao5Faixas.map((faixa, index) => {
                const corBarra = faixa.cobertura >= 75 ? '#86efac' : faixa.cobertura >= 60 ? '#fbbf24' : '#f87171';
                
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
                onClick={() => onNavigateToTable && onNavigateToTable('fatores-risco-mamografia')}
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
                  <p className="font-semibold">Regra de Cálculo - Fatores de Risco</p>
                  <div className="text-xs space-y-1 text-white">
                  <p><strong>Base:</strong> Mulheres elegíveis com fatores identificados</p>
                    <p><strong>Cálculo:</strong> (Pacientes com fator / Total elegíveis) × 100</p>
                    <p><strong>Fonte:</strong> Questionário de saúde e histórico médico</p>
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
                {/* Tooltip com título completo */}
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

        {/* Classificação BI-RADS - Layout Horizontal */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onNavigateToTable && onNavigateToTable('classificacao-bi-rads')}
                title="Ir para tabela detalhada"
              >
                Classificação BI-RADS
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
                  <p className="font-semibold">Sistema BI-RADS</p>
                  <div className="text-xs space-y-1 text-white">
                    <p><strong>0:</strong> Inconclusivo - necessita exame adicional</p>
                    <p><strong>1:</strong> Negativo - sem achados</p>
                    <p><strong>2:</strong> Achados benignos</p>
                    <p><strong>3:</strong> Provavelmente benigno (acompanhar 6 meses)</p>
                    <p><strong>4:</strong> Suspeito (biópsia recomendada)</p>
                    <p><strong>5:</strong> Altamente suspeito de malignidade</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {dados.classificacaoBiRads.map((birads, index) => {
              const cores = ['#9ca3af', '#86efac', '#22c55e', '#fbbf24', '#f59e0b', '#dc2626'];
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-3 border cursor-pointer hover:shadow-md transition-all duration-200 group relative"
                  onClick={(e) => handleFiltroInterativo('birads', birads.categoria, `BI-RADS: ${birads.categoria}`, e)}
                  style={{
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'birads' || (filtroInterativo?.tipo === 'birads' && filtroInterativo?.valor !== birads.categoria) ? 0.4 : 1,
                    transform: filtroInterativo?.tipo === 'birads' && filtroInterativo?.valor === birads.categoria ? 'scale(1.02)' : 'scale(1)',
                    borderColor: filtroInterativo?.tipo === 'birads' && filtroInterativo?.valor === birads.categoria ? '#db2777' : '#e5e7eb',
                    borderWidth: filtroInterativo?.tipo === 'birads' && filtroInterativo?.valor === birads.categoria ? '2px' : '1px'
                  }}
                >
                  <div className="text-center space-y-2">
                    <div className="text-xs font-bold text-gray-700">
                      {birads.categoria}
                    </div>
                    
                    <div className="text-xl font-bold" style={{ color: cores[index] }}>
                      {birads.quantidade}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="relative w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="absolute inset-0 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${birads.percentual}%`,
                            backgroundColor: cores[index]
                          }} 
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-gray-600">
                        {birads.percentual}%
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
          {/* Tempo Desde Último Exame */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onNavigateToTable && onNavigateToTable('tempo-ultimo-exame-mamografia')}
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
                      <p><strong>Nunca realizou:</strong> Prioridade máxima</p>
                      <p><strong>&gt; 3 anos:</strong> Muito vencido (prioridade alta)</p>
                      <p><strong>2-3 anos:</strong> Vencido (prioridade média)</p>
                      <p><strong>1-2 anos:</strong> Dentro do prazo bienal</p>
                      <p><strong>&lt; 1 ano:</strong> Recente</p>
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

          {/* Distribuição de Resultados */}
          <BiRadsDonutSimple 
            data={dados.classificacaoBiRads}
            title="Distribuição de Resultados"
            onItemClick={handleFiltroInterativo}
            tipoFiltro="birads-donut"
            filtroAtivo={filtroInterativo}
            onNavigateToTable={onNavigateToTable}
          />
        </div>

        {/* Follow-up de Casos Suspeitos - Formato original + 1 novo */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onNavigateToTable && onNavigateToTable('follow-up-casos-bi-rads-4-5')}
                title="Ir para tabela detalhada"
              >
                Follow-up Casos BI-RADS 4-5
              </h3>
              <span className="text-xs text-gray-500">{dados.classificacaoBiRads[4].quantidade + dados.classificacaoBiRads[5].quantidade} casos</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Info className="w-3 h-3 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3 bg-gray-900 text-white">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Acompanhamento de Casos Suspeitos</p>
                  <div className="text-xs space-y-1 text-white">
                    <p><strong>Base:</strong> Todos os casos BI-RADS 4 e 5</p>
                    <p><strong>Em investigação:</strong> Aguardando biópsia/exames</p>
                    <p><strong>Confirmados CA:</strong> Diagnóstico de câncer confirmado</p>
                    <p><strong>Descartados:</strong> Resultado benigno após investigação</p>
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
              <p className="text-lg font-bold text-orange-500">35</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'confirmado', 'Follow-up: Confirmados CA', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'confirmado') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'confirmado' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Confirmados CA</p>
              <p className="text-lg font-bold text-red-500">5</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'descartado', 'Follow-up: Descartados', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'descartado') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'descartado' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Descartados</p>
              <p className="text-lg font-bold text-green-500">4</p>
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
              <p className="text-lg font-bold text-gray-500">3</p>
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
              <p className="text-lg font-bold text-blue-500">8</p>
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
                onClick={() => onNavigateToTable && onNavigateToTable('evolucao-rastreio-mamografia')}
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
                    <p><strong>Meta:</strong> 80% de cobertura</p>
                    <p><strong>Cores:</strong></p>
                    <p className="ml-2">Vermelho: {'>'} 10% abaixo da meta</p>
                    <p className="ml-2">Amarelo: 5-10% abaixo da meta</p>
                    <p className="ml-2">Verde: {'<'} 5% da meta</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="grid grid-cols-12 gap-1 mb-4">
            {dados.evolucaoTemporal.map((item, index) => {
              const distanciaMeta = item.meta - item.cobertura;
              let backgroundColor;
              if (distanciaMeta > 10) backgroundColor = '#dc2626';
              else if (distanciaMeta > 7) backgroundColor = '#ef4444';
              else if (distanciaMeta > 5) backgroundColor = '#f59e0b';
              else if (distanciaMeta > 3) backgroundColor = '#fbbf24';
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