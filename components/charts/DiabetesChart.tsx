// VERSAO GEMINI/components/charts/DiabetesChart.tsx
// Componente: Dashboard de acompanhamento de diabéticos, refatorado com o novo padrão interativo.
// Contexto: Dashboard APS - Análise detalhada de pacientes com diabetes.

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Info, Activity, Droplets, Calendar, FileText, Target, Users, BarChart3, ChevronDown, AlertTriangle } from 'lucide-react';
import { heatmapTaxaControle as heatmapTaxaControleRef } from '../../data/chartsData';

// Matriz de correlação epidemiológica específica para Diabetes
const CORRELACAO_EPIDEMIOLOGICA_DIABETES = {
  'Controlado': { 'HbA1c': { emDia: 0.95, vencido: 0.05 }, 'Fundo de olho': { emDia: 0.75, vencido: 0.25 }, 'I10': 0.65, 'E78.5': 0.55, 'N18.9': 0.05, 'Sedentarismo': 0.45, 'Ação': 0.60, 'Habitual': 0.75, '0-3 meses': 0.85 },
  'Não controlado': { 'HbA1c': { emDia: 0.70, vencido: 0.30 }, 'Fundo de olho': { emDia: 0.55, vencido: 0.45 }, 'I10': 0.75, 'E78.5': 0.70, 'N18.9': 0.15, 'Sedentarismo': 0.70, 'Contemplação': 0.45, 'Crescente': 0.55, '3-6 meses': 0.40 },
  'Sem medida': { 'HbA1c': { emDia: 0.40, vencido: 0.60 }, 'Fundo de olho': { emDia: 0.35, vencido: 0.65 }, 'I10': 0.85, 'E78.5': 0.80, 'N18.9': 0.30, 'Sedentarismo': 0.85, 'Pré-contemplação': 0.65, 'Alto Risco': 0.45, '6-12 meses': 0.55 },
  'DM Tipo 2': { 'I10': 0.75, 'E78.5': 0.68, 'E66.9': 0.45, 'Sedentarismo': 0.72 },
  'Alto Risco': { 'I10': 0.90, 'E78.5': 0.85, 'N18.9': 0.40, 'Sem medida': 0.45 },
  'Habitual': { 'I10': 0.45, 'E78.5': 0.40, 'N18.9': 0.02, 'Controlado': 0.75 },
  'Crescente': { 'I10': 0.65, 'E78.5': 0.60, 'N18.9': 0.10, 'Controlado': 0.55 },
  'I10': { 'Sedentarismo': 0.78, 'E78.5': 0.75, 'E66.9': 0.55, 'Controlado': 0.55 },
  'E78.5': { 'Sedentarismo': 0.68, 'I10': 0.70, 'E66.9': 0.60, 'Controlado': 0.60 },
  'E66.9': { 'Sedentarismo': 0.89, 'I10': 0.65, 'E78.5': 0.70, 'Controlado': 0.45 },
  'N18.9': { 'I10': 0.85, 'E78.5': 0.60, 'Controlado': 0.35 },
};

// Dados completos para Diabetes, seguindo o padrão de Hipertensão
const dadosBaseDiabetes = {
  totalSemAcompanhamento: 295,
  totalLC: 1158,
  percentualLC: 79.7,
  taxaControle: 67.2,
  pacientesHbA1cAlta: 193,
  rastreioRetinopatia: 58.1,
  rastreioRetinopatiaAlto: 217,  // Número de rastreios com resultado alto
  medidasVencidas: 193,
  populacaoFiltrada: 'Todos os diabéticos',
  
  funilEpidemiologico: [
    { nivel: 'Elegíveis', quantidade: 6008, percentual: 100.0, cor: '#93c5fd' },
    { nivel: 'Vinculados', quantidade: 5500, percentual: 91.5, cor: '#d8b4fe' },
    { nivel: 'Com CID', quantidade: 1453, percentual: 26.4, cor: '#c084fc' },
    { nivel: 'Em linha de cuidado', quantidade: 1158, percentual: 79.7, cor: '#a855f7' }
  ],
  
  controlesGlicemico: [
    { nivel: 'Controlado', quantidade: 778, percentual: 67.2, cor: '#86efac' },
    { nivel: 'Não controlado', quantidade: 256, percentual: 22.1, cor: '#fde047' },
    { nivel: 'Sem medida', quantidade: 124, percentual: 10.7, cor: '#fca5a5' }
  ],
  
  distribuicaoTemporalMedidas: [
    { periodo: '0-3 meses', quantidade: 869, percentual: 75.0, cor: '#86efac' },
    { periodo: '3-6 meses', quantidade: 116, percentual: 10.0, cor: '#fde047' },
    { periodo: '6-12 meses', quantidade: 173, percentual: 15.0, cor: '#fca5a5' }
  ],
  
  examesAcompanhamento: [
    { exame: 'HbA1c', emDia: 950, total: 1158, percentual: 82, cor: '#fed7aa' },
    { exame: 'Glicemia jejum', emDia: 1019, total: 1158, percentual: 88, cor: '#fdba74' },
    { exame: 'Fundo de olho', emDia: 672, total: 1158, percentual: 58, cor: '#fb923c' },
    { exame: 'Microalbuminúria', emDia: 521, total: 1158, percentual: 45, cor: '#f97316' },
    { exame: 'Lipidograma', emDia: 811, total: 1158, percentual: 70, cor: '#ea580c' }
  ],
  
  topComorbidades: [
    { cid: 'I10', descricao: 'Hipertensão essencial', pacientes: 869, percentual: 75, cor: '#fca5a5' },
    { cid: 'E78.5', descricao: 'Dislipidemia', pacientes: 787, percentual: 68, cor: '#93c5fd' },
    { cid: 'E66.9', descricao: 'Obesidade', pacientes: 486, percentual: 42, cor: '#fde047' },
    { cid: 'N18.9', descricao: 'Doença renal crônica', pacientes: 139, percentual: 12, cor: '#d8b4fe' },
    { cid: 'Z87.891', descricao: 'Hist. pessoal de nicotina', pacientes: 93, percentual: 8, cor: '#a78bfa' }
  ],
  
  fatoresRisco: [
    { fator: 'Sedentarismo', pacientes: 811, percentual: 70, cor: '#f87171' },
    { fator: 'Dieta inadequada', pacientes: 718, percentual: 62, cor: '#fb923c' },
    { fator: 'Estresse crônico', pacientes: 463, percentual: 40, cor: '#a3a3a3' },
    { fator: 'Sono inadequado', pacientes: 405, percentual: 35, cor: '#c084fc' },
    { fator: 'Tabagismo', pacientes: 185, percentual: 16, cor: '#fbbf24' }
  ],
  
  estagioMotivacional: [
    { estagio: 'Pré-contemplação', quantidade: 463, percentual: 40.0, cor: '#ef4444' },
    { estagio: 'Contemplação', quantidade: 347, percentual: 30.0, cor: '#f59e0b' },
    { estagio: 'Preparação', quantidade: 232, percentual: 20.0, cor: '#eab308' },
    { estagio: 'Ação', quantidade: 81, percentual: 7.0, cor: '#22c55e' },
    { estagio: 'Manutenção', quantidade: 35, percentual: 3.0, cor: '#16a34a' }
  ],
  
  distribuicaoTipo: {
    segments: [
      { label: 'DM Tipo 2', value: 1082, percentage: 93.5, color: '#fed7aa' },
      { label: 'DM Tipo 1', value: 52, percentage: 4.5, color: '#fef3c7' },
      { label: 'DM Gestacional', value: 24, percentage: 2.0, color: '#ffedd5' }
    ]
  },
  
  estratificacaoFramingham: {
    segments: [
      { label: 'Habitual', value: 637, percentage: 55.0, color: '#86efac' },
      { label: 'Crescente', value: 347, percentage: 30.0, color: '#fde047' },
      { label: 'Alto Risco', value: 174, percentage: 15.0, color: '#fca5a5' }
    ]
  }
};


import { TableContext } from '../../types';

interface DiabetesChartProps {
  filters?: any;
  onNavigateToTable?: (type: string, context?: TableContext) => void;
  localFilter?: { tipo: string; valor: string; label: string } | null;
  onLocalFilterChange?: (filter: { tipo: string; valor: string; label: string } | null) => void;
}

// Componente StackedBar (reutilizado do padrão)
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
          <div
            key={`${segment.label}-${index}`}
            className={`absolute top-0 h-full flex items-center justify-center transition-all z-10 ${onSegmentClick ? 'cursor-pointer hover:shadow-md' : ''}`}
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
            {showLabel && <span className="text-xs font-semibold text-black bg-white/70 rounded px-1">{Number(segment.percentage).toFixed(1)}%</span>}
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

// Componente de Funil Visual - LAYOUT VERTICAL
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

// Componente de Funil para Estágio Motivacional
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


// Função de correlação epidemiológica, agora local e específica para diabetes
const aplicarCorrelacaoEpidemiologica = (dadosBase: any, filtro: { tipo: string; valor: string; label: string; }) => {
    const dadosFiltrados = JSON.parse(JSON.stringify(dadosBase));
    const correlacoes = CORRELACAO_EPIDEMIOLOGICA_DIABETES[filtro.valor as keyof typeof CORRELACAO_EPIDEMIOLOGICA_DIABETES] || {};
    let populacaoFiltrada = dadosBase.totalLC;

    switch (filtro.tipo) {
        case 'controle':
            const controle = dadosBase.controlesGlicemico.find((c: any) => c.nivel === filtro.valor);
            populacaoFiltrada = controle?.quantidade || 0;
            break;
    }

    dadosFiltrados.totalLC = Math.round(populacaoFiltrada);
    
    if (filtro.tipo !== 'controle' && dadosFiltrados.controlesGlicemico) {
        const totalControle = dadosFiltrados.totalLC;
        dadosFiltrados.controlesGlicemico.forEach((controle: any) => {
            const correlacao = (correlacoes as any)[controle.nivel] || 0.33;
            controle.quantidade = Math.round(totalControle * correlacao * (controle.percentual / 100));
        });
        const somaControles = dadosFiltrados.controlesGlicemico.reduce((sum: number, c: any) => sum + c.quantidade, 0);
        dadosFiltrados.controlesGlicemico.forEach((c: any) => {
            c.percentual = somaControles > 0 ? parseFloat(((c.quantidade / somaControles) * 100).toFixed(1)) : 0;
        });
    }

    if (dadosFiltrados.topComorbidades) {
        dadosFiltrados.topComorbidades.forEach((comorb: any) => {
            const correlacao = (correlacoes as any)[comorb.cid] || 0.5;
            comorb.pacientes = Math.round(populacaoFiltrada * correlacao);
            comorb.percentual = populacaoFiltrada > 0 ? Math.round((comorb.pacientes / populacaoFiltrada) * 100) : 0;
        });
    }

    return dadosFiltrados;
};


export default function DiabetesChart({ filters, onNavigateToTable, localFilter, onLocalFilterChange }: DiabetesChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{ tipo: string; valor: string; label: string; } | null>(localFilter || null);

  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosBaseDiabetes;
    return aplicarCorrelacaoEpidemiologica(dadosBaseDiabetes, filtroInterativo);
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
  
  // Função para navegar para tabela com contexto específico
  const handleCardClick = (chartType: string, title: string) => {
    if (onNavigateToTable) {
      const context: TableContext = {
        source: 'Análise de Diabetes',
        chartType: `diabetes-${chartType}`,
        title: `Diabetes - ${title}`,
        filters: filtroInterativo
      };
      onNavigateToTable('chronic-diseases', context);
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-orange-50 rounded"><Activity className="w-4 h-4 text-orange-500" /></div>
            <div>
              <span>Análise de Diabetes</span>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">Controle glicêmico e acompanhamento</p>
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
                <h4 className="font-semibold mb-2 text-sm">Filtros Interativos</h4>
                <p>Clique em qualquer elemento para filtrar os dados. As correlações simulam o impacto epidemiológico da seleção.</p>
                <div className="mt-3">
                  <span className="font-medium">Controle Glicêmico:</span>
                  <ul className="ml-3 mt-1 space-y-0.5">
                    <li>• Controlado: HbA1c &lt;7%</li>
                    <li>• Não controlado: HbA1c ≥7%</li>
                    <li>• Sem medida: Sem resultado nos últimos 6 meses</li>
                  </ul>
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
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {/* Linha 1 */}
          <div className="bg-blue-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Total Linha de Cuidado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-blue-600">{dados.totalLC}</p>
              <p className="text-[11px] text-gray-500">{dados.percentualLC}%</p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Total de diabéticos vinculados e em acompanhamento ativo na APS</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">DM Não Controlado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-yellow-600">
                {dados.controlesGlicemico[1].quantidade}
              </p>
              <p className="text-[11px] text-gray-500">
                {dados.controlesGlicemico[1].percentual}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Pacientes com HbA1c ≥7% na última medição</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Rastreio Alterado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-purple-600">
                {dados.rastreioRetinopatiaAlto || 217}
              </p>
              <p className="text-[11px] text-gray-500">
                {((217 / dados.totalLC) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-50">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Diabéticos com rastreio de retinopatia alterado nos últimos 12 meses</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>

          {/* Linha 2 */}
          <div className="bg-rose-50 rounded-lg p-3 flex flex-col justify-between text-center relative group cursor-help min-h-[90px]">
            <p className="text-xs font-medium text-gray-600">Total Acompanhamento Inadequado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-rose-600">
                {dadosBaseDiabetes.totalSemAcompanhamento.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500">
                {((dadosBaseDiabetes.totalSemAcompanhamento / (dadosBaseDiabetes.totalSemAcompanhamento + dadosBaseDiabetes.totalLC)) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="absolute -top-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 max-w-[200px]">
              <div className="font-semibold mb-1">Regra de Cálculo:</div>
              <div>Diabéticos que não realizaram consulta ou medição de HbA1c nos últimos 12 meses</div>
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
              <div>Total de exames de acompanhamento vencidos (HbA1c, lipidograma, microalbuminúria)</div>
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
              <div>Medidas de HbA1c que passarão para acima de 6 meses nos próximos 90 dias</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
        </div>

        {/* Distribuição por Tipo + Risco */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('tipo', 'Tipo de Diabetes')}>Tipo de Diabetes</h3>
                </div>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="font-semibold mb-2">Classificação por Tipo de Diabetes:</div>
                    <div className="text-[11px] space-y-1">
                      <p>• <span className="font-medium">DM Tipo 1:</span> Diabetes insulino-dependente</p>
                      <p>• <span className="font-medium">DM Tipo 2:</span> Diabetes não insulino-dependente</p>
                      <p>• <span className="font-medium">DM Gestacional:</span> Diabetes diagnosticado na gestação</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4"><StackedBar segments={dados.distribuicaoTipo.segments} onSegmentClick={handleFiltroInterativo} tipoFiltro="tipo-diabetes" filtroAtivo={filtroInterativo} /></div>
              <div className="flex items-center justify-center gap-4">{dados.distribuicaoTipo.segments.filter((s: any) => s.percentage > 0).map((item: any, index: number) => (<div key={index} className="flex items-center gap-1 text-xs"><div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} /><span className="text-gray-600">{item.label.replace('DM ', '')}</span></div>))}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('classificacao-risco', 'Classificação de Risco')}>Classificação de Risco</h3>
                </div>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="font-semibold mb-2">Estratificação de Risco:</div>
                    <div className="text-[11px] space-y-1">
                      <p>• <span className="font-medium">Habitual:</span> Risco baixo/esperado para população</p>
                      <p>• <span className="font-medium">Crescente:</span> Risco moderado/intermediário</p>
                      <p>• <span className="font-medium">Alto Risco:</span> Risco elevado/prioritário</p>
                      <p className="mt-2">Baseado em protocolos clínicos e diretrizes nacionais</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4"><StackedBar segments={dados.estratificacaoFramingham.segments} onSegmentClick={handleFiltroInterativo} tipoFiltro="risco-cardiovascular" filtroAtivo={filtroInterativo} /></div>
              <div className="flex items-center justify-center gap-4">{dados.estratificacaoFramingham.segments.filter((s: any) => s.percentage > 0).map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.label}</span>
                </div>
              ))}</div>
            </div>
        </div>

        {/* Funil Epidemiológico + Exames */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('funil-epidemiologico', 'Funil Epidemiológico')}>Funil Epidemiológico</h3>
              </div>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  <div className="font-semibold mb-2">Funil de Acompanhamento:</div>
                  <div className="text-[11px] space-y-1">
                    <p>• <span className="font-medium">Elegíveis:</span> População total do território</p>
                    <p>• <span className="font-medium">Vinculados:</span> Cadastrados na unidade</p>
                    <p>• <span className="font-medium">Com CID:</span> Diagnosticados com diabetes</p>
                    <p>• <span className="font-medium">Em linha de cuidado:</span> Em acompanhamento ativo</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {dados.funilEpidemiologico.map((item: any, index: number) => (
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
          {/* Exames de Acompanhamento */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('exames-acompanhamento', 'Exames de Acompanhamento')}>Exames de Acompanhamento</h3>
              </div>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  <div className="font-semibold mb-2">Periodicidade dos Exames:</div>
                  <div className="text-[11px] space-y-1">
                    <p>• <span className="font-medium">HbA1c:</span> A cada 3-6 meses</p>
                    <p>• <span className="font-medium">Glicemia jejum:</span> A cada 6 meses</p>
                    <p>• <span className="font-medium">Fundo de olho:</span> Anualmente</p>
                    <p>• <span className="font-medium">Microalbuminúria:</span> Anualmente</p>
                    <p>• <span className="font-medium">Lipidograma:</span> Anualmente</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">{dados.examesAcompanhamento.map((exame: any, index: number) => (<div key={index} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium">{exame.exame}</span><span className="text-gray-600">{exame.emDia} ({exame.percentual}%)</span></div><div className={`relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200`} onClick={(e) => handleFiltroInterativo('exame', exame.exame, `Exame: ${exame.exame}`, e)}><div className="absolute inset-0 rounded-lg transition-all duration-300" style={{ width: `${exame.percentual}%`, backgroundColor: exame.cor, opacity: filtroInterativo && filtroInterativo.tipo !== 'exame' || (filtroInterativo?.tipo === 'exame' && filtroInterativo?.valor !== exame.exame) ? 0.4 : 1, transform: filtroInterativo?.tipo === 'exame' && filtroInterativo?.valor === exame.exame ? 'scaleY(1.2)' : 'scaleY(1)', border: filtroInterativo?.tipo === 'exame' && filtroInterativo?.valor === exame.exame ? '2px solid #1e40af' : 'none' }} /></div></div>))}</div>
          </div>
        </div>
        
        {/* Controle Glicêmico + Última Medida */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('controle-glicemico', 'Controle Glicêmico')}>Controle Glicêmico</h3>
                </div>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="font-semibold mb-2">Regra de Cálculo:</div>
                    <div className="text-[11px] space-y-1">
                      <p>• <span className="font-medium">Controlado:</span> HbA1c {'<'}7%</p>
                      <p>• <span className="font-medium">Não controlado:</span> HbA1c ≥7%</p>
                      <p>• <span className="font-medium">Sem medida:</span> Sem resultado nos últimos 6 meses</p>
                    </div>
                  </div>
                </div>
              </div><div className="space-y-3">{dados.controlesGlicemico.map((item:any, index:number) => (<div key={index} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium">{item.nivel}</span><span className="text-gray-600">{item.quantidade} ({item.percentual}%)</span></div><div className={`relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200 z-10`} onClick={(e) => handleFiltroInterativo('controle', item.nivel, `Controle: ${item.nivel}`, e)}><div className="absolute inset-0 rounded-lg transition-all duration-300" style={{ width: `${item.percentual}%`, backgroundColor: item.cor, opacity: filtroInterativo && filtroInterativo.tipo !== 'controle' || (filtroInterativo?.tipo === 'controle' && filtroInterativo?.valor !== item.nivel) ? 0.4 : 1, transform: filtroInterativo?.tipo === 'controle' && filtroInterativo?.valor === item.nivel ? 'scaleY(1.2)' : 'scaleY(1)', border: filtroInterativo?.tipo === 'controle' && filtroInterativo?.valor === item.nivel ? '2px solid #1e40af' : 'none' }} /></div></div>))}</div></div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('ultima-medida-glicemia', 'Última Medida Glicemia')}>Última Medida Glicemia</h3>
                </div>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="font-semibold mb-2">Regra de Cálculo:</div>
                    <div className="text-[11px]">Distribuição temporal das últimas medições de HbA1c realizadas</div>
                  </div>
                </div>
              </div><div className="space-y-3">{dados.distribuicaoTemporalMedidas.map((item:any, index:number) => (<div key={index} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium">{item.periodo}</span><span className="text-gray-600">{item.quantidade} ({item.percentual}%)</span></div><div className={`relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200 z-10`} onClick={(e) => handleFiltroInterativo('tempo-medida', item.periodo, `Tempo: ${item.periodo}`, e)}><div className="absolute inset-0 rounded-lg transition-all duration-300" style={{ width: `${item.percentual}%`, backgroundColor: item.cor, opacity: filtroInterativo && filtroInterativo.tipo !== 'tempo-medida' || (filtroInterativo?.tipo === 'tempo-medida' && filtroInterativo?.valor !== item.periodo) ? 0.4 : 1, transform: filtroInterativo?.tipo === 'tempo-medida' && filtroInterativo?.valor === item.periodo ? 'scaleY(1.2)' : 'scaleY(1)', border: filtroInterativo?.tipo === 'tempo-medida' && filtroInterativo?.valor === item.periodo ? '2px solid #1e40af' : 'none' }} /></div></div>))}</div></div>
        </div>

        {/* Estágio Motivacional em Funil - ocupando largura total */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('estagio-motivacional', 'Estágio Motivacional para Mudança')}>Estágio Motivacional para Mudança</h3>
            </div>
            <div className="relative group">
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                <div className="font-semibold mb-2">Regra de Cálculo:</div>
                <div className="text-[11px]">Classificação baseada no modelo transteórico</div>
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
                <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('fatores-risco', 'Fatores de Risco Modificáveis')}>Fatores de Risco Modificáveis</h3>
              </div>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  <div className="font-semibold mb-2">Fatores de Risco para Diabetes:</div>
                  <div className="text-[11px] space-y-1">
                    <p>Fatores modificáveis que influenciam o controle glicêmico e progressão da doença</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">{dados.fatoresRisco.map((fator, index) => (<div key={index} className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200" onClick={(e) => handleFiltroInterativo('fator-risco', fator.fator, `Fator: ${fator.fator}`, e)} style={{ opacity: filtroInterativo && filtroInterativo.tipo !== 'fator-risco' || (filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor !== fator.fator) ? 0.4 : 1, transform: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? 'scale(1.02)' : 'scale(1)', borderColor: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? '#1e40af' : '#e5e7eb', borderWidth: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? '2px' : '1px' }}><div className="text-center space-y-2"><div className="text-xs font-semibold text-gray-700 truncate group relative">{fator.fator}<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-48 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none"><div className="font-semibold text-center">{fator.fator}</div><div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div></div></div><div className="text-2xl font-bold" style={{ color: fator.cor }}>{fator.pacientes}</div><div className="space-y-1"><div className="relative w-full bg-gray-200 rounded-full h-2"><div className="absolute inset-0 rounded-full transition-all duration-300" style={{ width: `${fator.percentual}%`, backgroundColor: fator.cor }} /></div><div className="text-[11px] font-semibold text-gray-600">{fator.percentual}%</div></div></div></div>))}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('comorbidades', 'Top 5 - Comorbidades')}>Top 5 - Comorbidades</h3>
              </div>
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  <div className="font-semibold mb-2">Principais Comorbidades:</div>
                  <div className="text-[11px] space-y-1">
                    <p>Condições clínicas mais frequentemente associadas ao diabetes na população acompanhada</p>
                  </div>
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
              <h3 className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleCardClick('taxa-acompanhamento', 'Taxa de Acompanhamento - Últimos 12 Meses')}>Taxa de Acompanhamento - Últimos 12 Meses</h3>
            </div>
            <div className="relative group">
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                <div className="font-semibold mb-2">Regra de Cálculo:</div>
                <div className="text-[11px]">Percentual de pacientes com acompanhamento adequado (consulta nos últimos 6 meses) em cada mês</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-1 mb-4">
            {heatmapTaxaControleRef.map((item, index) => {
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
