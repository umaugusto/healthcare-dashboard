// VERSAO GEMINI/components/charts/ObesidadeChart.tsx
// Componente: Dashboard de acompanhamento de obesidade, refatorado com o novo padrão interativo.
// Contexto: Dashboard APS - Análise detalhada de pacientes com obesidade/sobrepeso.

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Info, Scale, Activity, Calendar, FileText, Target, Users, BarChart3, ChevronDown, AlertTriangle } from 'lucide-react';

// Matriz de correlação epidemiológica específica para Obesidade
const CORRELACAO_EPIDEMIOLOGICA_OBESIDADE = {
    'Redução (>5%)': { 'IMC/Peso': { emDia: 0.95, vencido: 0.05 }, 'Perfil lipídico': { emDia: 0.85, vencido: 0.15 }, 'I10': 0.55, 'E78.5': 0.45, 'E11.9': 0.30, 'Sedentarismo': 0.35, 'Ação': 0.65, 'Baixo Risco': 0.70, '0-3 meses': 0.85 },
    'Manutenção (±5%)': { 'IMC/Peso': { emDia: 0.75, vencido: 0.25 }, 'Perfil lipídico': { emDia: 0.60, vencido: 0.40 }, 'I10': 0.65, 'E78.5': 0.50, 'E11.9': 0.35, 'Sedentarismo': 0.65, 'Contemplação': 0.45, 'Risco Moderado': 0.50, '3-6 meses': 0.45 },
    'Aumento (>5%)': { 'IMC/Peso': { emDia: 0.50, vencido: 0.50 }, 'Perfil lipídico': { emDia: 0.40, vencido: 0.60 }, 'I10': 0.80, 'E78.5': 0.75, 'E11.9': 0.55, 'Sedentarismo': 0.85, 'Pré-contemplação': 0.60, 'Alto Risco': 0.40, '6-12 meses': 0.60 },
    'Obesidade III': { 'I10': 0.85, 'E78.5': 0.80, 'E11.9': 0.60, 'G47.3': 0.40, 'Alto Risco': 0.65 },
    'Alto Risco': { 'I10': 0.85, 'E78.5': 0.80, 'E11.9': 0.55, 'Aumento (>5%)': 0.45 },
    'Baixo Risco': { 'I10': 0.40, 'E78.5': 0.35, 'E11.9': 0.20, 'Redução (>5%)': 0.70 },
};

// Dados completos para Obesidade, seguindo o padrão
const dadosBaseObesidade = {
  totalSemAcompanhamento: 463,
  totalLC: 1544,
  percentualLC: 77.0,
  taxaReducao: 42.3,
  pacientesGanharamPeso: 312,
  pacientesIMCAlto: 385, // Obesidade II e III
  medidasVencidas: 463,
  populacaoFiltrada: 'Todos com Sobrepeso/Obesidade',
  
  funilEpidemiologico: [
    { nivel: 'Elegíveis', quantidade: 6008, percentual: 100.0, cor: '#93c5fd' },
    { nivel: 'Vinculados', quantidade: 5500, percentual: 91.5, cor: '#d8b4fe' },
    { nivel: 'Com CID', quantidade: 2007, percentual: 36.5, cor: '#c084fc' },
    { nivel: 'Em linha de cuidado', quantidade: 1544, percentual: 77.0, cor: '#a855f7' }
  ],
  
  distribuicaoEvolucao: [
    { nivel: 'Redução (>5%)', quantidade: 653, percentual: 42.3, cor: '#86efac' },
    { nivel: 'Manutenção (±5%)', quantidade: 579, percentual: 37.5, cor: '#fde047' },
    { nivel: 'Aumento (>5%)', quantidade: 312, percentual: 20.2, cor: '#fca5a5' }
  ],
  
  distribuicaoTemporalMedidas: [
    { periodo: '0-3 meses', quantidade: 1081, percentual: 70.0, cor: '#86efac' },
    { periodo: '3-6 meses', quantidade: 232, percentual: 15.0, cor: '#fde047' },
    { periodo: '6-12 meses', quantidade: 231, percentual: 15.0, cor: '#fca5a5' }
  ],
  
  examesAcompanhamento: [
    { exame: 'IMC/Peso', emDia: 1158, total: 1544, percentual: 75, cor: '#fef3c7' },
    { exame: 'Circunferência abdominal', emDia: 1081, total: 1544, percentual: 70, cor: '#fde047' },
    { exame: 'Perfil lipídico', emDia: 926, total: 1544, percentual: 60, cor: '#fbbf24' },
    { exame: 'Bioimpedância', emDia: 618, total: 1544, percentual: 40, cor: '#f59e0b' }
  ],
  
  topComorbidades: [
    { cid: 'I10', descricao: 'Hipertensão essencial', pacientes: 987, percentual: 63.9, cor: '#fca5a5' },
    { cid: 'E78.5', descricao: 'Dislipidemia', pacientes: 710, percentual: 46.0, cor: '#93c5fd' },
    { cid: 'E11.9', descricao: 'Diabetes tipo 2', pacientes: 554, percentual: 35.9, cor: '#fde047' },
    { cid: 'G47.3', descricao: 'Apneia do sono', pacientes: 232, percentual: 15.0, cor: '#d8b4fe' },
    { cid: 'M54.5', descricao: 'Dor lombar', pacientes: 417, percentual: 27.0, cor: '#fed7aa' }
  ],
  
  fatoresRisco: [
    { fator: 'Sedentarismo', pacientes: 1236, percentual: 80, cor: '#f87171' },
    { fator: 'Dieta inadequada', pacientes: 1081, percentual: 70, cor: '#fb923c' },
    { fator: 'Sono inadequado', pacientes: 911, percentual: 59, cor: '#c084fc' },
    { fator: 'Estresse', pacientes: 772, percentual: 50, cor: '#a3a3a3' },
    { fator: 'Compulsão Alimentar', pacientes: 463, percentual: 30, cor: '#fbbf24' }
  ],
  
  estagioMotivacional: [
    { estagio: 'Pré-contemplação', quantidade: 618, percentual: 40.0, cor: '#ef4444' },
    { estagio: 'Contemplação', quantidade: 463, percentual: 30.0, cor: '#f59e0b' },
    { estagio: 'Preparação', quantidade: 309, percentual: 20.0, cor: '#eab308' },
    { estagio: 'Ação', quantidade: 108, percentual: 7.0, cor: '#22c55e' },
    { estagio: 'Manutenção', quantidade: 46, percentual: 3.0, cor: '#16a34a' }
  ],
  
  distribuicaoGrau: {
    segments: [
      { label: 'Sobrepeso', value: 618, percentage: 40.0, color: '#fed7aa' },
      { label: 'Obesidade I', value: 541, percentage: 35.0, color: '#fbbf24' },
      { label: 'Obesidade II', value: 270, percentage: 17.5, color: '#f59e0b' },
      { label: 'Obesidade III', value: 115, percentage: 7.5, color: '#ea580c' }
    ]
  },
  
  estratificacaoRiscoMetabolico: {
    segments: [
      { label: 'Baixo Risco', value: 541, percentage: 35.0, color: '#86efac' },
      { label: 'Risco Moderado', value: 618, percentage: 40.0, color: '#fde047' },
      { label: 'Alto Risco', value: 385, percentage: 25.0, color: '#fca5a5' }
    ]
  }
};

const heatmapTaxaReducao = [
    { mes: 'Jan', valor: 38, intensidade: 0.38, incremento: 0 },
    { mes: 'Fev', valor: 39, intensidade: 0.39, incremento: 1 },
    { mes: 'Mar', valor: 40, intensidade: 0.40, incremento: 1 },
    { mes: 'Abr', valor: 41, intensidade: 0.41, incremento: 1 },
    { mes: 'Mai', valor: 42, intensidade: 0.42, incremento: 1 },
    { mes: 'Jun', valor: 44, intensidade: 0.44, incremento: 2 },
    { mes: 'Jul', valor: 43, intensidade: 0.43, incremento: -1 },
    { mes: 'Ago', valor: 45, intensidade: 0.45, incremento: 2 },
    { mes: 'Set', valor: 44, intensidade: 0.44, incremento: -1 },
    { mes: 'Out', valor: 43, intensidade: 0.43, incremento: -1 },
    { mes: 'Nov', valor: 43, intensidade: 0.43, incremento: 0 },
    { mes: 'Dez', valor: 42.3, intensidade: 0.423, incremento: -0.7 }
];

interface ObesidadeChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

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

// Função de correlação epidemiológica
const aplicarCorrelacaoEpidemiologica = (dadosBase: any, filtro: { tipo: string; valor: string; label: string; }) => {
    const dadosFiltrados = JSON.parse(JSON.stringify(dadosBase));
    const correlacoes = CORRELACAO_EPIDEMIOLOGICA_OBESIDADE[filtro.valor as keyof typeof CORRELACAO_EPIDEMIOLOGICA_OBESIDADE] || {};
    let populacaoFiltrada = dadosBase.totalLC;
    switch (filtro.tipo) {
        case 'evolucao':
            const evolucao = dadosBase.distribuicaoEvolucao.find((e: any) => e.nivel === filtro.valor);
            populacaoFiltrada = evolucao?.quantidade || 0;
            break;
    }
    dadosFiltrados.totalLC = Math.round(populacaoFiltrada);
    return dadosFiltrados;
};


export default function ObesidadeChart({ filters, onNavigateToTable }: ObesidadeChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{ tipo: string; valor: string; label: string; } | null>(null);

  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosBaseObesidade;
    return aplicarCorrelacaoEpidemiologica(dadosBaseObesidade, filtroInterativo);
  }, [filtroInterativo]);

  const handleFiltroInterativo = (tipo: string, valor: string, label: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (filtroInterativo?.tipo === tipo && filtroInterativo?.valor === valor) {
      setFiltroInterativo(null);
    } else {
      setFiltroInterativo({ tipo, valor, label });
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-amber-50 rounded"><Scale className="w-4 h-4 text-amber-500" /></div>
            <div>
              <span>Análise de Obesidade</span>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">Controle de peso e acompanhamento</p>
            </div>
          </CardTitle>
          <div className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            {showTooltip && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl z-50">
                <h4 className="font-semibold mb-2 text-sm">Filtros Interativos</h4>
                <p>Clique em qualquer elemento para filtrar os dados.</p>
              </div>
            )}
          </div>
        </div>
        {filtroInterativo && (<div className="absolute top-1 right-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Filtrado: {filtroInterativo.label}</div>)}
      </CardHeader>
      
      <CardContent className="space-y-5 px-6">
        {/* Cards de Métricas - 6 cards padronizados */}
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
              <div>Total de pacientes com CID E66 em linha de cuidado</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">IMC Não Controlado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-yellow-600">
                {dados.pacientesIMCAlto}
              </p>
              <p className="text-[11px] text-gray-500">
                {((dados.pacientesIMCAlto / dados.totalLC) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pacientes com IMC ≥35 kg/m² (Obesidade grau II e III)</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Risco Metabólico Alto</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-purple-600">
                {385}
              </p>
              <p className="text-[11px] text-gray-500">
                {((385 / dados.totalLC) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pacientes com 3+ alterações metabólicas</div>
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
            <div className="absolute -top-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 max-w-[200px]">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pacientes com obesidade sem medida de IMC/peso nos últimos 12 meses</div>
              <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Medidas Pendentes</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(dados.totalLC * 0.15)}
              </p>
              <p className="text-[11px] text-gray-500">
                {(15).toFixed(1)}%
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
              <div>Medidas de IMC/peso que passarão para acima de 12 meses nos próximos 90 dias</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
        </div>

        {/* Distribuição por Grau + Risco */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">Grau de Obesidade</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Classificação IMC:</div>
                  <div>Sobrepeso: IMC 25-29,9</div>
                  <div>Obesidade I: IMC 30-34,9</div>
                  <div>Obesidade II: IMC 35-39,9</div>
                  <div>Obesidade III: IMC ≥40</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div><div className="mb-4"><StackedBar segments={dados.distribuicaoGrau.segments} onSegmentClick={handleFiltroInterativo} tipoFiltro="grau-obesidade" filtroAtivo={filtroInterativo} /></div><div className="flex items-center justify-center gap-4">{dados.distribuicaoGrau.segments.filter(s => s.percentage > 0).map((item, index) => (<div key={index} className="flex items-center gap-1 text-xs"><div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} /><span className="text-gray-600">{item.label === 'Sobrepeso' ? 'Sobrepeso' : item.label.replace('Obesidade ', '')}</span></div>))}</div></div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">Risco Metabólico</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Baseado em circunferência abdominal, glicemia, pressão arterial e lipídeos</div>
                  <div className="mt-2">
                    <div>Baixo Risco: Sem alterações metabólicas</div>
                    <div>Risco Moderado: 1-2 alterações</div>
                    <div>Alto Risco: 3+ alterações</div>
                  </div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div><div className="mb-4"><StackedBar segments={dados.estratificacaoRiscoMetabolico.segments} onSegmentClick={handleFiltroInterativo} tipoFiltro="risco-metabolico" filtroAtivo={filtroInterativo} /></div><div className="flex items-center justify-center gap-4">{dados.estratificacaoRiscoMetabolico.segments.filter(s => s.percentage > 0).map((item, index) => (<div key={index} className="flex items-center gap-1 text-xs"><div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} /><span className="text-gray-600">{item.label.replace('Risco ', '').replace(' Risco', '')}</span></div>))}</div></div>
        </div>

        {/* Funil Epidemiológico + Exames */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">Funil Epidemiológico</h3>
              </div>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Progressão desde população elegível até pacientes em linha de cuidado com obesidade/sobrepeso</div>
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
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Percentual de exames em dia conforme protocolo de acompanhamento para obesidade</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">{dados.examesAcompanhamento.map((exame, index) => (<div key={index} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium">{exame.exame}</span><span className="text-gray-600">{exame.emDia} ({exame.percentual}%)</span></div><div className={`relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200`} onClick={(e) => handleFiltroInterativo('exame', exame.exame, `Exame: ${exame.exame}`, e)}><div className="absolute inset-0 rounded-lg transition-all duration-300" style={{ width: `${exame.percentual}%`, backgroundColor: exame.cor, opacity: filtroInterativo && filtroInterativo.tipo !== 'exame' || (filtroInterativo?.tipo === 'exame' && filtroInterativo?.valor !== exame.exame) ? 0.4 : 1, transform: filtroInterativo?.tipo === 'exame' && filtroInterativo?.valor === exame.exame ? 'scaleY(1.2)' : 'scaleY(1)', border: filtroInterativo?.tipo === 'exame' && filtroInterativo?.valor === exame.exame ? '2px solid #1e40af' : 'none' }} /></div></div>))}</div>
          </div>
        </div>

        {/* Evolução do Peso + Última Medida */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Evolução do Peso</h3>
                </div>
                <div className="relative group">
                  <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="font-semibold mb-1">Regra de Cálculo:</div>
                    <div>Comparação do peso atual com última medição há 6 meses:</div>
                    <div className="mt-1">
                      <div>Redução: Perda {'>'} 5% do peso</div>
                      <div>Manutenção: Variação ±5%</div>
                      <div>Aumento: Ganho {'>'} 5% do peso</div>
                    </div>
                    <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                  </div>
                </div>
              </div><div className="space-y-3">{dados.distribuicaoEvolucao.map((item:any, index:number) => (<div key={index} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium">{item.nivel}</span><span className="text-gray-600">{item.quantidade} ({item.percentual}%)</span></div><div className={`relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200 z-10`} onClick={(e) => handleFiltroInterativo('evolucao', item.nivel, `Evolução: ${item.nivel}`, e)}><div className="absolute inset-0 rounded-lg transition-all duration-300" style={{ width: `${item.percentual}%`, backgroundColor: item.cor, opacity: filtroInterativo && filtroInterativo.tipo !== 'evolucao' || (filtroInterativo?.tipo === 'evolucao' && filtroInterativo?.valor !== item.nivel) ? 0.4 : 1, transform: filtroInterativo?.tipo === 'evolucao' && filtroInterativo?.valor === item.nivel ? 'scaleY(1.2)' : 'scaleY(1)', border: filtroInterativo?.tipo === 'evolucao' && filtroInterativo?.valor === item.nivel ? '2px solid #1e40af' : 'none' }} /></div></div>))}</div></div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Última Medida IMC/Peso</h3>
                </div>
                <div className="relative group">
                  <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="font-semibold mb-1">Regra de Cálculo:</div>
                    <div>Distribuição temporal das últimas medições de IMC/Peso realizadas</div>
                    <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                  </div>
                </div>
              </div><div className="space-y-3">{dados.distribuicaoTemporalMedidas.map((item:any, index:number) => (<div key={index} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium">{item.periodo}</span><span className="text-gray-600">{item.quantidade} ({item.percentual}%)</span></div><div className={`relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200 z-10`} onClick={(e) => handleFiltroInterativo('tempo-medida', item.periodo, `Tempo: ${item.periodo}`, e)}><div className="absolute inset-0 rounded-lg transition-all duration-300" style={{ width: `${item.percentual}%`, backgroundColor: item.cor, opacity: filtroInterativo && filtroInterativo.tipo !== 'tempo-medida' || (filtroInterativo?.tipo === 'tempo-medida' && filtroInterativo?.valor !== item.periodo) ? 0.4 : 1, transform: filtroInterativo?.tipo === 'tempo-medida' && filtroInterativo?.valor === item.periodo ? 'scaleY(1.2)' : 'scaleY(1)', border: filtroInterativo?.tipo === 'tempo-medida' && filtroInterativo?.valor === item.periodo ? '2px solid #1e40af' : 'none' }} /></div></div>))}</div></div>
        </div>

        {/* Estágio Motivacional em Funil */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Estágio Motivacional para Mudança</h3>
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
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Fatores de risco para obesidade passíveis de intervenção</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">{dados.fatoresRisco.map((fator, index) => (<div key={index} className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200" onClick={(e) => handleFiltroInterativo('fator-risco', fator.fator, `Fator: ${fator.fator}`, e)} style={{ opacity: filtroInterativo && filtroInterativo.tipo !== 'fator-risco' || (filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor !== fator.fator) ? 0.4 : 1, transform: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? 'scale(1.02)' : 'scale(1)', borderColor: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? '#1e40af' : '#e5e7eb', borderWidth: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? '2px' : '1px' }}><div className="text-center space-y-2"><div className="text-xs font-semibold text-gray-700 truncate group relative">{fator.fator}<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-48 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none"><div className="font-semibold text-center">{fator.fator}</div><div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div></div></div><div className="text-2xl font-bold" style={{ color: fator.cor }}>{fator.pacientes}</div><div className="space-y-1"><div className="relative w-full bg-gray-200 rounded-full h-2"><div className="absolute inset-0 rounded-full transition-all duration-300" style={{ width: `${fator.percentual}%`, backgroundColor: fator.cor }} /></div><div className="text-[11px] font-semibold text-gray-600">{fator.percentual}%</div></div></div></div>))}</div>
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
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-semibold mb-1">Regra de Cálculo:</div>
                  <div>Principais comorbidades associadas à obesidade</div>
                  <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">{dados.topComorbidades.map((comorb, index) => (<div key={index} className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200 group relative" onClick={(e) => handleFiltroInterativo('comorbidade', comorb.cid, `Comorbidade: ${comorb.cid}`, e)} style={{ opacity: filtroInterativo && filtroInterativo.tipo !== 'comorbidade' || (filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor !== comorb.cid) ? 0.4 : 1, transform: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.cid ? 'scale(1.02)' : 'scale(1)', borderColor: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.cid ? '#1e40af' : '#e5e7eb', borderWidth: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.cid ? '2px' : '1px' }}><div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">{comorb.descricao}</div><div className="text-center space-y-2"><div className="text-xs font-semibold text-gray-700">{comorb.cid}</div><div className="text-2xl font-bold" style={{ color: comorb.cor }}>{comorb.pacientes}</div><div className="space-y-1"><div className="relative w-full bg-gray-200 rounded-full h-2"><div className="absolute inset-0 rounded-full transition-all duration-300" style={{ width: `${comorb.percentual}%`, backgroundColor: comorb.cor }} /></div><div className="text-[11px] font-semibold text-gray-600">{comorb.percentual}%</div></div></div></div>))}</div>
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
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="font-semibold mb-1">Regra de Cálculo:</div>
                <div>Percentual de pacientes com acompanhamento adequado (consulta nos últimos 6 meses) em cada mês</div>
                <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-1 mb-4">
            {[{mes:'Jan',valor:68},{mes:'Fev',valor:69},{mes:'Mar',valor:71},{mes:'Abr',valor:70},{mes:'Mai',valor:72},{mes:'Jun',valor:73},{mes:'Jul',valor:74},{mes:'Ago',valor:75},{mes:'Set',valor:73},{mes:'Out',valor:72},{mes:'Nov',valor:71},{mes:'Dez',valor:70}].map((item, index) => {
              let backgroundColor;
              if (item.valor >= 75) backgroundColor = '#10b981'; // Verde
              else if (item.valor >= 50) backgroundColor = '#fbbf24'; // Amarelo
              else backgroundColor = '#ef4444'; // Vermelho
              return (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110" style={{ backgroundColor }}>
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
