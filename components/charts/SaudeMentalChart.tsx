// VERSAO GEMINI/components/charts/SaudeMentalChart.tsx
// Componente: Dashboard de acompanhamento de saúde mental, refatorado com o novo padrão interativo.
// Contexto: Dashboard APS - Análise detalhada de pacientes com transtornos mentais.

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Info, Brain, Activity, Calendar, FileText, Target, Users, BarChart3, ChevronDown, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Matriz de correlação epidemiológica específica para Saúde Mental
const CORRELACAO_EPIDEMIOLOGICA_SAUDE_MENTAL = {
    'Em acompanhamento regular': { 'Consulta Psiquiátrica': { emDia: 0.95 }, 'F32.9': 0.40, 'F41.1': 0.50, 'Ação': 0.60, 'Sem Risco': 0.70, '0-3 meses': 0.85 },
    'Acompanhamento irregular': { 'Consulta Psiquiátrica': { emDia: 0.60 }, 'F32.9': 0.55, 'F41.1': 0.60, 'Contemplação': 0.45, 'Risco Moderado': 0.50, '3-6 meses': 0.45 },
    'Sem acompanhamento': { 'Consulta Psiquiátrica': { emDia: 0.20 }, 'F32.9': 0.75, 'F41.1': 0.80, 'Pré-contemplação': 0.65, 'Risco Grave': 0.45, '6-12 meses': 0.60 },
    'Ansiedade': { 'F41.1': 0.90, 'F32.9': 0.30, 'Insônia': 0.75, 'Grave (GAD-7)': 0.25 },
    'Depressão': { 'F32.9': 0.85, 'F41.1': 0.40, 'X60-X84': 0.25, 'Grave (PHQ-9)': 0.30 },
    'Risco Grave': { 'F32.9': 0.90, 'X60-X84': 0.80, 'Sem acompanhamento': 0.45, 'Grave (PHQ-9)': 0.75 },
};

// Dados completos para Saúde Mental
const dadosBaseSaudeMental = {
  totalSemAcompanhamento: 290,
  totalLC: 966,
  percentualLC: 78.1,
  taxaMelhora: 64.3,
  pacientesAltaGravidade: 193,
  pacientesRiscoSuicidio: 77,
  rastreiosPendentes: 290,
  populacaoFiltrada: 'Todos os pacientes',
  
  funilEpidemiologico: [
    { nivel: 'Elegíveis', quantidade: 6008, percentual: 100.0, cor: '#93c5fd' },
    { nivel: 'Vinculados', quantidade: 5500, percentual: 91.5, cor: '#d8b4fe' },
    { nivel: 'Com CID', quantidade: 1237, percentual: 22.5, cor: '#c084fc' },
    { nivel: 'Em linha de cuidado', quantidade: 966, percentual: 78.1, cor: '#a855f7' }
  ],
  
  distribuicaoTratamento: [
    { nivel: 'Em acompanhamento regular', quantidade: 664, percentual: 68.7, cor: '#86efac' },
    { nivel: 'Acompanhamento irregular', quantidade: 193, percentual: 20.0, cor: '#fde047' },
    { nivel: 'Sem acompanhamento', quantidade: 109, percentual: 11.3, cor: '#fca5a5' }
  ],
  
  distribuicaoTemporalMedidas: [
    { periodo: '0-3 meses', quantidade: 676, percentual: 70.0, cor: '#86efac' },
    { periodo: '3-6 meses', quantidade: 145, percentual: 15.0, cor: '#fde047' },
    { periodo: '6-12 meses', quantidade: 145, percentual: 15.0, cor: '#fca5a5' }
  ],
  
  examesAcompanhamento: [
    { exame: 'Consulta Psiquiátrica', emDia: 675, total: 966, percentual: 70, cor: '#ddd6fe' },
    { exame: 'Consulta Psicológica', emDia: 580, total: 966, percentual: 60, cor: '#c7d2fe' },
    { exame: 'Revisão de Medicação', emDia: 483, total: 966, percentual: 50, cor: '#a78bfa' },
    { exame: 'Grupo Terapêutico', emDia: 290, total: 966, percentual: 30, cor: '#8b5cf6' }
  ],
  
  topComorbidades: [
    { cid: 'F32.9', descricao: 'Episódio depressivo', pacientes: 435, percentual: 45.0, cor: '#fca5a5' },
    { cid: 'F41.1', descricao: 'Ansiedade generalizada', pacientes: 386, percentual: 40.0, cor: '#93c5fd' },
    { cid: 'F10.2', descricao: 'Transtorno por álcool', pacientes: 193, percentual: 20.0, cor: '#fde047' },
    { cid: 'F43.1', descricao: 'Estresse pós-traumático', pacientes: 97, percentual: 10.0, cor: '#d8b4fe' },
    { cid: 'X60-X84', descricao: 'Lesão autoprovocada', pacientes: 58, percentual: 6.0, cor: '#dc2626' }
  ],
  
  fatoresRisco: [
    { fator: 'Estresse Crônico', pacientes: 715, percentual: 74, cor: '#c084fc' },
    { fator: 'Sedentarismo', pacientes: 676, percentual: 70, cor: '#fbbf24' },
    { fator: 'Insônia', pacientes: 580, percentual: 60, cor: '#f87171' },
    { fator: 'Isolamento Social', pacientes: 483, percentual: 50, cor: '#fb923c' },
    { fator: 'Uso de Álcool/Substâncias', pacientes: 290, percentual: 30, cor: '#a3a3a3' }
  ],
  
  estagioMotivacional: [
    { estagio: 'Pré-contemplação', quantidade: 290, percentual: 30.0, cor: '#ef4444' },
    { estagio: 'Contemplação', quantidade: 338, percentual: 35.0, cor: '#f59e0b' },
    { estagio: 'Preparação', quantidade: 193, percentual: 20.0, cor: '#eab308' },
    { estagio: 'Ação', quantidade: 97, percentual: 10.0, cor: '#22c55e' },
    { estagio: 'Manutenção', quantidade: 48, percentual: 5.0, cor: '#16a34a' }
  ],
  
  distribuicaoDiagnostico: {
    segments: [
      { label: 'Ansiedade', value: 386, percentage: 40.0, color: '#ddd6fe' },
      { label: 'Depressão', value: 290, percentage: 30.0, color: '#c084fc' },
      { label: 'Comorbidade Ansioso-Depressiva', value: 193, percentage: 20.0, color: '#a78bfa' },
      { label: 'Outros', value: 97, percentage: 10.0, color: '#e5e7eb' }
    ]
  },
  
  gravidadeDepressao: {
    segments: [
      { label: 'Leve', value: 290, percentage: 30.0, color: '#86efac' },
      { label: 'Moderada', value: 338, percentage: 35.0, color: '#fde047' },
      { label: 'Moderadamente Grave', value: 193, percentage: 20.0, color: '#fb923c' },
      { label: 'Grave', value: 145, percentage: 15.0, color: '#fca5a5' }
    ]
  },
  
  gravidadeAnsiedade: {
    segments: [
      { label: 'Leve', value: 386, percentage: 40.0, color: '#86efac' },
      { label: 'Moderada', value: 338, percentage: 35.0, color: '#fde047' },
      { label: 'Grave', value: 242, percentage: 25.0, color: '#fca5a5' }
    ]
  },
  
  riscoSuicidio: {
    segments: [
      { label: 'Sem Risco', value: 676, percentage: 70.0, color: '#86efac' },
      { label: 'Risco Moderado', value: 193, percentage: 20.0, color: '#fde047' },
      { label: 'Risco Grave', value: 97, percentage: 10.0, color: '#dc2626' }
    ]
  },
  
  auditData: {
    segments: [
      { label: 'Baixo risco', value: 580, percentage: 60.0, color: '#86efac' },
      { label: 'Uso de risco', value: 193, percentage: 20.0, color: '#fde047' },
      { label: 'Uso nocivo', value: 97, percentage: 10.0, color: '#fb923c' },
      { label: 'Provável dependência', value: 96, percentage: 10.0, color: '#fca5a5' }
    ]
  }
};

const heatmapTaxaAcompanhamento = [
  { mes: 'Jan', valor: 65 }, { mes: 'Fev', valor: 66 }, { mes: 'Mar', valor: 68 },
  { mes: 'Abr', valor: 67 }, { mes: 'Mai', valor: 69 }, { mes: 'Jun', valor: 70 },
  { mes: 'Jul', valor: 71 }, { mes: 'Ago', valor: 70 }, { mes: 'Set', valor: 72 },
  { mes: 'Out', valor: 71 }, { mes: 'Nov', valor: 73 }, { mes: 'Dez', valor: 74 }
];

// Componente StackedBar
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
        if (validSegments.length === 1) borderRadius = '8px';
        else if (index === 0) borderRadius = '8px 0 0 8px';
        else if (index === validSegments.length - 1) borderRadius = '0 8px 8px 0';
        return (
          <div key={`${segment.label}-${index}`} className={`absolute top-0 h-full flex items-center justify-center transition-all z-10 ${onSegmentClick ? 'cursor-pointer hover:shadow-md' : ''}`} style={{ left: `${previousWidth}%`, width: `${Number(segment.percentage)}%`, backgroundColor: segment.color, borderRadius, opacity: filtroAtivo && !isActive ? 0.4 : 1, transform: isActive ? 'scale(1.02)' : 'scale(1)', border: isActive ? '2px solid #1e40af' : 'none' }} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onClick={onSegmentClick ? (e) => onSegmentClick(tipoFiltro || 'segmento', segment.label, `${tipoFiltro}: ${segment.label}`, e) : undefined} title={onSegmentClick ? `Filtrar por ${segment.label}` : undefined}>
            {showLabel && <span className="text-xs font-semibold text-black bg-white/70 rounded px-1">{Number(segment.percentage).toFixed(1)}%</span>}
            {hoveredIndex === index && !showLabel && (<div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">{segment.label}: {Number(segment.percentage).toFixed(1)}%</div>)}
          </div>
        );
      })}
    </div>
  );
};

// Componente VennDiagram removido - substituído por layout de barras horizontais

// Componente StackedColumnsChart
const StackedColumnsChart = ({ phqData, gadData, auditData, onSegmentClick, filtroAtivo }: { 
  phqData: any[], gadData: any[], auditData: any[], 
  onSegmentClick: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  filtroAtivo: { tipo: string; valor: string; label: string } | null
}) => {
  const maxValue = Math.max(...phqData.map(d => d.value), ...gadData.map(d => d.value), ...auditData.map(d => d.value));
  const ColumnBar = ({ data, type, title }: { data: any[], type: string, title: string }) => (
    <div className="flex-1 flex flex-col">
      <h4 className="text-[11px] font-medium text-gray-600 mb-3 text-center truncate">{title}</h4>
      <div className="flex-1 flex flex-col-reverse gap-1 min-h-0">
        {data.map((segment, index) => {
          const height = maxValue > 0 ? (segment.value / maxValue) * 100 : 0;
          const isActive = filtroAtivo?.tipo === type && filtroAtivo?.valor === segment.label;
          const showPercentage = segment.percentage >= 10; // Mostra percentual se >= 10%
          return (
            <div key={index} className="relative group cursor-pointer" style={{ height: `${height}%`, minHeight: data.length > 3 ? '20px' : '24px' }} onClick={(e) => onSegmentClick(type, segment.label, `${type === 'audit' ? 'AUDIT' : title}: ${segment.label}`, e)}>
              <div className="absolute inset-0 transition-all duration-200 rounded-sm flex items-center justify-center" style={{ backgroundColor: segment.color, opacity: filtroAtivo && !isActive ? 0.4 : 1, border: isActive ? '2px solid #1e40af' : 'none' }}>
                {showPercentage && (
                  <span className="text-[9px] font-semibold text-black bg-white/90 rounded px-1">
                    {segment.percentage.toFixed(0)}%
                  </span>
                )}
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ zIndex: 20 }}>
                <div className="font-semibold">{segment.label}</div>
                <div>{segment.value} ({segment.percentage.toFixed(0)}%)</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 flex-1 min-h-0 pb-4">
        <ColumnBar data={phqData} type="gravidade-phq9" title="PHQ-9" />
        <ColumnBar data={gadData} type="gravidade-gad7" title="GAD-7" />
        <ColumnBar data={auditData} type="audit" title="AUDIT" />
      </div>
      <div className="flex gap-4 mt-2 px-4">
        <div className="flex-1">
          <div className="font-medium text-gray-600 mb-1 text-[11px]">PHQ-9</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#86efac' }} />
              <span className="text-[10px] text-gray-500">Leve</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#fde047' }} />
              <span className="text-[10px] text-gray-500">Moderada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#fb923c' }} />
              <span className="text-[10px] text-gray-500">Moderadamente Grave</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#fca5a5' }} />
              <span className="text-[10px] text-gray-500">Grave</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-600 mb-1 text-[11px]">GAD-7</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#86efac' }} />
              <span className="text-[10px] text-gray-500">Leve</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#fde047' }} />
              <span className="text-[10px] text-gray-500">Moderada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#fca5a5' }} />
              <span className="text-[10px] text-gray-500">Grave</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-600 mb-1 text-[11px]">AUDIT</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#86efac' }} />
              <span className="text-[10px] text-gray-500">Baixo risco</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#fde047' }} />
              <span className="text-[10px] text-gray-500">Uso de risco</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#fb923c' }} />
              <span className="text-[10px] text-gray-500">Uso nocivo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#fca5a5' }} />
              <span className="text-[10px] text-gray-500">Provável dependência</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Funil Vertical
const FunnelChart = ({ data, title, icon: Icon }: { 
  data: any[], 
  title: string,
  icon: React.ElementType
}) => {
  const coresOtimizadas = ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee'];
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4"><Icon className="w-4 h-4 text-gray-600" /><h3 className="text-sm font-semibold text-gray-700">{title}</h3></div>
      <div className="space-y-1">
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <div className="relative rounded-md p-2 transition-all duration-300 hover:shadow-md" style={{ backgroundColor: coresOtimizadas[index] || item.cor }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{item.nivel}</span>
                <span className="text-xs font-bold text-white">{item.quantidade.toLocaleString()}{item.percentual && (<span className="ml-1 font-normal text-white/80">({item.percentual}%)</span>)}</span>
              </div>
            </div>
            {index < data.length - 1 && (<div className="flex justify-center"><ChevronDown className="w-4 h-4 text-gray-400" /></div>)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Componente de Funil Motivacional
const FunnelChartClickable = ({ data, title, icon: Icon, onItemClick, tipoFiltro, filtroAtivo }: { 
  data: any[], 
  title: string,
  icon: React.ElementType,
  onItemClick: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-3"><Icon className="w-4 h-4 text-gray-600" /><h3 className="text-sm font-semibold text-gray-700">{title}</h3></div>
      <div className="relative">
        {data.map((item, index) => {
          const widthPercentage = 100 - (index * 15);
          const marginPercentage = (100 - widthPercentage) / 2;
          const isActive = filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === item.estagio;
          return (
            <div key={index} className="relative mb-0.5 transition-all duration-300 hover:scale-[1.02] cursor-pointer" style={{ marginLeft: `${marginPercentage}%`, marginRight: `${marginPercentage}%`, opacity: filtroAtivo && !isActive ? 0.4 : 1, transform: isActive ? 'scale(1.05)' : 'scale(1)' }} onClick={(e) => onItemClick(tipoFiltro, item.estagio, `${title}: ${item.estagio}`, e)}>
              <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: item.cor || item.color, minHeight: '28px', border: isActive ? '2px solid #1e40af' : 'none' }}>
                <div className="absolute inset-0 flex items-center justify-between px-3 py-1"><span className="text-xs font-medium text-white">{item.estagio}</span><span className="text-xs text-white/90">{item.quantidade} ({item.percentual}%)</span></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
              </div>
              {index < data.length - 1 && (<div className="absolute left-1/2 transform -translate-x-1/2 w-px h-1 bg-gray-300" style={{ bottom: '-2px', zIndex: 5 }} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function SaudeMentalChart({ filters, onNavigateToTable, localFilter, onLocalFilterChange }: { 
  filters?: any; 
  onNavigateToTable?: (type: string) => void;
  localFilter?: { tipo: string; valor: string; label: string } | null;
  onLocalFilterChange?: (filter: { tipo: string; valor: string; label: string } | null) => void;
}) {
  const [filtroInterativo, setFiltroInterativo] = useState<{ tipo: string; valor: string; label: string; } | null>(localFilter || null);

  // Aplicar filtros aos dados
  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosBaseSaudeMental;
    
    // Copiar dados base
    let dadosFiltrados = JSON.parse(JSON.stringify(dadosBaseSaudeMental));
    
    // Aplicar correlações baseadas no filtro
    const { tipo, valor } = filtroInterativo;
    const correlacoes = CORRELACAO_EPIDEMIOLOGICA_SAUDE_MENTAL[valor] || {};
    
    // Ajustar distribuições baseado em correlações
    if (tipo === 'diagnostico-principal') {
      // Ajustar outros gráficos baseado no diagnóstico selecionado
      if (valor === 'Depressão') {
        dadosFiltrados.gravidadeDepressao.segments[2].value = 500; // Mais casos graves
        dadosFiltrados.topComorbidades[0].pacientes = 580; // Mais F32.9
      } else if (valor === 'Ansiedade') {
        dadosFiltrados.gravidadeAnsiedade.segments[2].value = 400; // Mais casos graves  
        dadosFiltrados.topComorbidades[1].pacientes = 520; // Mais F41.1
      }
    } else if (tipo === 'gravidade-phq9' || tipo === 'gravidade-gad7') {
      // Ajustar outras métricas baseado na gravidade
      if (valor.includes('Grave')) {
        dadosFiltrados.riscoSuicidio.segments[2].value = 180; // Mais risco grave
        dadosFiltrados.distribuicaoTratamento[0].quantidade = 450; // Menos em acompanhamento regular
      }
    } else if (tipo === 'estagio') {
      // Ajustar distribuição baseado no estágio motivacional
      if (valor === 'Ação' || valor === 'Manutenção') {
        dadosFiltrados.distribuicaoTratamento[0].quantidade = 800; // Mais em acompanhamento regular
        dadosFiltrados.taxaMelhora = 78.5; // Taxa de melhora maior
      }
    }
    
    return dadosFiltrados;
  }, [filtroInterativo]);

  const handleFiltroInterativo = (tipo: string, valor: string, label: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    const novoFiltro = (filtroInterativo?.tipo === tipo && filtroInterativo?.valor === valor) 
      ? null 
      : { tipo, valor, label };
    
    setFiltroInterativo(novoFiltro);
    
    // Propagar mudança para componente pai se houver handler
    if (onLocalFilterChange) {
      onLocalFilterChange(novoFiltro);
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-violet-50 rounded"><Brain className="w-4 h-4 text-violet-500" /></div>
            <div>
              <span>Análise de Saúde Mental</span>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">Acompanhamento psicológico e psiquiátrico</p>
            </div>
          </CardTitle>
          <div className="relative group">
            <div className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </div>
            <div className="absolute top-full right-0 mt-2 w-96 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              <h4 className="font-semibold mb-2 text-sm">Sobre os Indicadores</h4>
              <p>Este painel consolida dados de rastreios (PHQ-9, GAD-7, AUDIT) e acompanhamento de pacientes em saúde mental.</p>
              <div className="mt-2 space-y-1">
                <p>• PHQ-9: Avalia depressão (0-27 pontos)</p>
                <p>• GAD-7: Avalia ansiedade (0-21 pontos)</p>
                <p>• AUDIT: Avalia uso de álcool (0-40 pontos)</p>
              </div>
            </div>
          </div>
        </div>
        {filtroInterativo && (<div className="absolute top-1 right-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Filtrado: {filtroInterativo.label}</div>)}
      </CardHeader>
      
      <CardContent className="space-y-5 px-6">
        {/* KPIs */}
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
              <div>Total de pacientes com CID F00-F99 em linha de cuidado</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Grave (PHQ-9)</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-yellow-600">
                {dados.gravidadeDepressao.segments[3].value}
              </p>
              <p className="text-[11px] text-gray-500">
                {dados.gravidadeDepressao.segments[3].percentage.toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap" style={{ zIndex: 100 }}>
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pacientes com PHQ-9 ≥20 pontos (depressão grave)</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Grave (GAD-7)</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-red-600">
                {dados.gravidadeAnsiedade.segments[2].value}
              </p>
              <p className="text-[11px] text-gray-500">
                {dados.gravidadeAnsiedade.segments[2].percentage.toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pacientes com GAD-7 ≥15 pontos (ansiedade grave)</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>

          {/* Linha 2 */}
          <div className="bg-rose-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Total Acompanhamento Inadequado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-rose-600">
                {dados.totalSemAcompanhamento.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500">
                {((dados.totalSemAcompanhamento / (dados.totalSemAcompanhamento + dados.totalLC)) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 max-w-[200px]" style={{ zIndex: 100 }}>
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pacientes com transtorno mental sem consulta nos últimos 6 meses</div>
              <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">CID/CIAP Suicídio</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-purple-600">
                {dados.pacientesRiscoSuicidio}
              </p>
              <p className="text-[11px] text-gray-500">
                {((dados.pacientesRiscoSuicidio / dados.totalLC) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Notificações de ideação ou tentativa de suicídio</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Rastreios Pendentes</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-orange-600">{dados.rastreiosPendentes}</p>
              <p className="text-[11px] text-gray-500">
                {((dados.rastreiosPendentes / dados.totalLC) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 w-64" style={{ zIndex: 100 }}>
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>PHQ-9 + GAD-7 pendentes quando rastreio inicial indicou necessidade</div>
              <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
        </div>

        {/* Rastreios PHQ-9, GAD-7 e AUDIT - em linha */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* PHQ-9 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">PHQ-9</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Rastreio de depressão (0-27 pontos)</div>
                  <div className="mt-2">
                    <div>Leve: 5-9 pontos</div>
                    <div>Moderada: 10-14 pontos</div>
                    <div>Moderadamente Grave: 15-19 pontos</div>
                    <div>Grave: 20-27 pontos</div>
                  </div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <StackedBar segments={dados.gravidadeDepressao.segments} onSegmentClick={handleFiltroInterativo} tipoFiltro="gravidade-phq9" filtroAtivo={filtroInterativo} />
            </div>
            <div className="flex flex-col gap-1">
              {dados.gravidadeDepressao.segments.filter((s: any) => s.percentage > 0).map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GAD-7 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">GAD-7</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Rastreio de ansiedade (0-21 pontos)</div>
                  <div className="mt-2">
                    <div>Leve: 5-9 pontos</div>
                    <div>Moderada: 10-14 pontos</div>
                    <div>Grave: 15-21 pontos</div>
                  </div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <StackedBar segments={dados.gravidadeAnsiedade.segments} onSegmentClick={handleFiltroInterativo} tipoFiltro="gravidade-gad7" filtroAtivo={filtroInterativo} />
            </div>
            <div className="flex flex-col gap-1">
              {dados.gravidadeAnsiedade.segments.filter((s: any) => s.percentage > 0).map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AUDIT */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">AUDIT</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Rastreio de uso de álcool (0-40 pontos)</div>
                  <div className="mt-2">
                    <div>Baixo risco: 0-7 pontos</div>
                    <div>Uso de risco: 8-15 pontos</div>
                    <div>Uso nocivo: 16-19 pontos</div>
                    <div>Provável dependência: ≥20 pontos</div>
                  </div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <StackedBar segments={dados.auditData.segments} onSegmentClick={handleFiltroInterativo} tipoFiltro="audit" filtroAtivo={filtroInterativo} />
            </div>
            <div className="flex flex-col gap-1">
              {dados.auditData.segments.filter((s: any) => s.percentage > 0).map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnóstico Principal - layout de barras horizontais */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Diagnóstico Principal</h3>
            </div>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="font-semibold mb-1">Regra de Cálculo:</div>
                <div>Distribuição dos diagnósticos principais em saúde mental (CID F00-F99)</div>
                <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Ansiedade */}
            <div 
              className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={(e) => handleFiltroInterativo('diagnostico-principal', 'Ansiedade', 'Diagnóstico: Ansiedade', e)}
              style={{ 
                opacity: filtroInterativo && filtroInterativo.tipo === 'diagnostico-principal' && filtroInterativo.valor !== 'Ansiedade' ? 0.4 : 1,
                borderColor: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Ansiedade' ? '#1e40af' : '#e5e7eb',
                borderWidth: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Ansiedade' ? '2px' : '1px',
                transform: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Ansiedade' ? 'scale(1.02)' : 'scale(1)'
              }}>
              <div className="text-center space-y-2">
                <div className="text-xs font-semibold text-gray-700">Ansiedade</div>
                <div className="text-2xl font-bold" style={{ color: '#f97316' }}>386</div>
                <div className="space-y-1">
                  <div className="relative w-full bg-gray-200 rounded-full h-2">
                    <div className="absolute inset-0 rounded-full transition-all duration-300" style={{ width: '40%', backgroundColor: '#f97316' }} />
                  </div>
                  <div className="text-[11px] font-semibold text-gray-600">40%</div>
                </div>
              </div>
            </div>
            
            {/* Depressão */}
            <div 
              className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={(e) => handleFiltroInterativo('diagnostico-principal', 'Depressão', 'Diagnóstico: Depressão', e)}
              style={{ 
                opacity: filtroInterativo && filtroInterativo.tipo === 'diagnostico-principal' && filtroInterativo.valor !== 'Depressão' ? 0.4 : 1,
                borderColor: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Depressão' ? '#1e40af' : '#e5e7eb',
                borderWidth: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Depressão' ? '2px' : '1px',
                transform: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Depressão' ? 'scale(1.02)' : 'scale(1)'
              }}>
              <div className="text-center space-y-2">
                <div className="text-xs font-semibold text-gray-700">Depressão</div>
                <div className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>290</div>
                <div className="space-y-1">
                  <div className="relative w-full bg-gray-200 rounded-full h-2">
                    <div className="absolute inset-0 rounded-full transition-all duration-300" style={{ width: '30%', backgroundColor: '#8b5cf6' }} />
                  </div>
                  <div className="text-[11px] font-semibold text-gray-600">30%</div>
                </div>
              </div>
            </div>
            
            {/* Ansiedade + Depressão */}
            <div 
              className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={(e) => handleFiltroInterativo('diagnostico-principal', 'Comorbidade Ansioso-Depressiva', 'Diagnóstico: Comorbidade Ansioso-Depressiva', e)}
              style={{ 
                opacity: filtroInterativo && filtroInterativo.tipo === 'diagnostico-principal' && filtroInterativo.valor !== 'Comorbidade Ansioso-Depressiva' ? 0.4 : 1,
                borderColor: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Comorbidade Ansioso-Depressiva' ? '#1e40af' : '#e5e7eb',
                borderWidth: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Comorbidade Ansioso-Depressiva' ? '2px' : '1px',
                transform: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Comorbidade Ansioso-Depressiva' ? 'scale(1.02)' : 'scale(1)'
              }}>
              <div className="text-center space-y-2">
                <div className="text-xs font-semibold text-gray-700 truncate group relative">
                  Ansiedade + Depressão
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-48 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="font-semibold text-center">Comorbidade Ansioso-Depressiva</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                  </div>
                </div>
                <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>193</div>
                <div className="space-y-1">
                  <div className="relative w-full bg-gray-200 rounded-full h-2">
                    <div className="absolute inset-0 rounded-full transition-all duration-300" style={{ width: '20%', backgroundColor: '#ef4444' }} />
                  </div>
                  <div className="text-[11px] font-semibold text-gray-600">20%</div>
                </div>
              </div>
            </div>
            
            {/* Outros */}
            <div 
              className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={(e) => handleFiltroInterativo('diagnostico-principal', 'Outros', 'Diagnóstico: Outros', e)}
              style={{ 
                opacity: filtroInterativo && filtroInterativo.tipo === 'diagnostico-principal' && filtroInterativo.valor !== 'Outros' ? 0.4 : 1,
                borderColor: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Outros' ? '#1e40af' : '#e5e7eb',
                borderWidth: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Outros' ? '2px' : '1px',
                transform: filtroInterativo?.tipo === 'diagnostico-principal' && filtroInterativo?.valor === 'Outros' ? 'scale(1.02)' : 'scale(1)'
              }}>
              <div className="text-center space-y-2">
                <div className="text-xs font-semibold text-gray-700">Outros</div>
                <div className="text-2xl font-bold" style={{ color: '#fbbf24' }}>97</div>
                <div className="space-y-1">
                  <div className="relative w-full bg-gray-200 rounded-full h-2">
                    <div className="absolute inset-0 rounded-full transition-all duration-300" style={{ width: '10%', backgroundColor: '#fbbf24' }} />
                  </div>
                  <div className="text-[11px] font-semibold text-gray-600">10%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Funil Epidemiológico + Acompanhamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">Funil Epidemiológico</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Progressão desde população elegível até pacientes em linha de cuidado de saúde mental</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {dados.funilEpidemiologico.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="relative rounded-md p-2 transition-all duration-300 hover:shadow-md" style={{ backgroundColor: ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee'][index] || item.cor }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{item.nivel}</span>
                      <span className="text-xs font-bold text-white">{item.quantidade.toLocaleString()}{item.percentual && (<span className="ml-1 font-normal text-white/80">({item.percentual}%)</span>)}</span>
                    </div>
                  </div>
                  {index < dados.funilEpidemiologico.length - 1 && (<div className="flex justify-center"><ChevronDown className="w-4 h-4 text-gray-400" /></div>)}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">Exames de Acompanhamento</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Percentual de exames e consultas em dia conforme protocolo de saúde mental</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">{dados.examesAcompanhamento.map((exame, index) => (<div key={index} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium">{exame.exame}</span><span className="text-gray-600">{exame.emDia} ({exame.percentual}%)</span></div><div className={`relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200`} onClick={(e) => handleFiltroInterativo('exame', exame.exame, `Exame: ${exame.exame}`, e)}><div className="absolute inset-0 rounded-lg transition-all duration-300" style={{ width: `${exame.percentual}%`, backgroundColor: exame.cor, opacity: 1 }} /></div></div>))}</div>
          </div>
        </div>

        {/* Estágio Motivacional */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Estágio Motivacional para Mudança</h3>
            </div>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
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
                <div key={index} className="relative mb-0.5 transition-all duration-300 hover:scale-[1.02] cursor-pointer" style={{ marginLeft: `${marginPercentage}%`, marginRight: `${marginPercentage}%`, opacity: filtroInterativo && !isActive ? 0.4 : 1, transform: isActive ? 'scale(1.05)' : 'scale(1)' }} onClick={(e) => handleFiltroInterativo('estagio', item.estagio, `Estágio Motivacional para Mudança: ${item.estagio}`, e)}>
                  <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: item.cor || item.color, minHeight: '28px', border: isActive ? '2px solid #1e40af' : 'none' }}>
                    <div className="absolute inset-0 flex items-center justify-between px-3 py-1"><span className="text-xs font-medium text-white">{item.estagio}</span><span className="text-xs text-white/90">{item.quantidade} ({item.percentual}%)</span></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                  </div>
                  {index < dados.estagioMotivacional.length - 1 && (<div className="absolute left-1/2 transform -translate-x-1/2 w-px h-1 bg-gray-300" style={{ bottom: '-2px', zIndex: 5 }} />)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fatores de Risco + Comorbidades - Full Width */}
        <div className="space-y-4">
          {/* Fatores de Risco - Full Width */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">Fatores de Risco Modificáveis</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Fatores de risco para saúde mental passíveis de intervenção</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">{dados.fatoresRisco.map((fator, index) => {
              const isActive = filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator;
              return (
                <div key={index} 
                  className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={(e) => handleFiltroInterativo('fator-risco', fator.fator, `Fator: ${fator.fator}`, e)}
                  style={{ 
                    opacity: filtroInterativo && !isActive ? 0.4 : 1,
                    borderColor: isActive ? '#1e40af' : '#e5e7eb',
                    borderWidth: isActive ? '2px' : '1px',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                  }}>
                  <div className="text-center space-y-2">
                    <div className="text-xs font-semibold text-gray-700 truncate group relative">
                      {fator.fator}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-48 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                        <div className="font-semibold text-center">{fator.fator}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: fator.cor }}>{fator.pacientes}</div>
                    <div className="space-y-1">
                      <div className="relative w-full bg-gray-200 rounded-full h-2">
                        <div className="absolute inset-0 rounded-full transition-all duration-300" style={{ width: `${fator.percentual}%`, backgroundColor: fator.cor }} />
                      </div>
                      <div className="text-[11px] font-semibold text-gray-600">{fator.percentual}%</div>
                    </div>
                  </div>
                </div>
              );
            })}</div>
          </div>
          {/* Top 5 Comorbidades - Full Width */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">Top 5 - Comorbidades</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Principais comorbidades associadas aos transtornos mentais</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">{dados.topComorbidades.map((comorb, index) => {
              const isActive = filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.cid;
              return (
                <div key={index} 
                  className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200 group relative"
                  onClick={(e) => handleFiltroInterativo('comorbidade', comorb.cid, `CID: ${comorb.cid}`, e)}
                  style={{ 
                    opacity: filtroInterativo && !isActive ? 0.4 : 1,
                    borderColor: isActive ? '#1e40af' : '#e5e7eb',
                    borderWidth: isActive ? '2px' : '1px',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                  }}>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">{comorb.descricao}</div>
                  <div className="text-center space-y-2">
                    <div className="text-xs font-semibold text-gray-700">{comorb.cid}</div>
                    <div className="text-2xl font-bold" style={{ color: comorb.cor }}>{comorb.pacientes}</div>
                    <div className="space-y-1">
                      <div className="relative w-full bg-gray-200 rounded-full h-2">
                        <div className="absolute inset-0 rounded-full transition-all duration-300" style={{ width: `${comorb.percentual}%`, backgroundColor: comorb.cor }} />
                      </div>
                      <div className="text-[11px] font-semibold text-gray-600">{comorb.percentual}%</div>
                    </div>
                  </div>
                </div>
              );
            })}</div>
          </div>
        </div>
        
        {/* Taxa de Acompanhamento - Últimos 12 Meses */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Taxa de Acompanhamento - Últimos 12 Meses</h3>
            </div>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="font-semibold mb-1">Regra de Cálculo:</div>
                <div>Percentual de pacientes com acompanhamento adequado (consulta nos últimos 6 meses) em cada mês</div>
                <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-1 mb-4">
            {heatmapTaxaAcompanhamento.map((item, index) => { 
              let backgroundColor;
              if (item.valor >= 75) backgroundColor = '#10b981'; // Verde
              else if (item.valor >= 50) backgroundColor = '#fbbf24'; // Amarelo
              else backgroundColor = '#ef4444'; // Vermelho
              return (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110" style={{ backgroundColor }}>
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
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
              <span className="text-gray-600">≥75%</span>
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
