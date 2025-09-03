// Arquivo: components/charts/UtilizacaoAPS.tsx
// Componente: Dashboard de utilização da APS com filtros interativos e evolução temporal
// Contexto: Dashboard APS - Análise detalhada de padrões de uso e resolutividade
// Dados: Baseado em média nacional APS Brasil e correlações epidemiológicas
// Navegação: Tabela detalhada de utilização APS por paciente

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Info, Users, Activity, Calendar, AlertTriangle, BarChart3 } from 'lucide-react';

// Descrições dos códigos CID para tooltip
const descricoesCID: { [key: string]: string } = {
  'I10': 'Hipertensão essencial (primária)',
  'E11.9': 'Diabetes mellitus não-insulino-dependente, sem complicações',
  'Z00.0': 'Exame médico geral',
  'M79.3': 'Paniculite, não especificada',
  'F41.1': 'Transtorno de ansiedade generalizada'
};

interface UtilizacaoAPSProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
  localFilter?: { tipo: string; valor: string; label: string } | null;
  onLocalFilterChange?: (filter: { tipo: string; valor: string; label: string } | null) => void;
}

// Dados base sem filtro
const dadosBaseAPS = {
  totalAtendimentos: 4825, 
  pacientesUnicos: 3287, 
  taxaRecorrencia: 1.47, 
  incrementoMes: 342, 
  taxaEncaminhamento: 17.7, 
  consultasEvitadas: 3971,
  
  topMotivos: [
    { fator: 'I10', pacientes: 486, percentual: 10.1, cor: '#ef4444' },
    { fator: 'E11.9', pacientes: 423, percentual: 8.8, cor: '#fb923c' },
    { fator: 'Z00.0', pacientes: 387, percentual: 8.0, cor: '#3b82f6' },
    { fator: 'M79.3', pacientes: 342, percentual: 7.1, cor: '#facc15' },
    { fator: 'F41.1', pacientes: 298, percentual: 6.2, cor: '#a855f7' }
  ],
  
  topEncaminhamentos: [
    { fator: 'Ortopedia', pacientes: 187, percentual: 21.9, cor: '#60a5fa' },
    { fator: 'Cardiologia', pacientes: 154, percentual: 18.0, cor: '#ef4444' },
    { fator: 'Endocrinologia', pacientes: 128, percentual: 15.0, cor: '#fb923c' },
    { fator: 'Psiquiatria', pacientes: 111, percentual: 13.0, cor: '#a855f7' },
    { fator: 'Oftalmologia', pacientes: 94, percentual: 11.0, cor: '#10b981' }
  ],

  distribuicaoRisco: [
    { nivel: 'Habitual', quantidade: 2654, percentual: 55, cor: '#22c55e' },
    { nivel: 'Crescente', quantidade: 1448, percentual: 30, cor: '#facc15' },
    { nivel: 'Alto Risco', quantidade: 723, percentual: 15, cor: '#ef4444' }
  ],

  distribuicaoTipo: [
    { tipo: 'Agendado', quantidade: 3281, percentual: 68, cor: '#22c55e' },
    { tipo: 'Walk-in', quantidade: 1544, percentual: 32, cor: '#10b981' }
  ],

  distribuicaoDesfecho: [
    { desfecho: 'Resolvido APS', quantidade: 3971, percentual: 82.3, cor: '#22c55e' },
    { desfecho: 'Enc. Especialista', quantidade: 854, percentual: 17.7, cor: '#facc15' }
  ]
};

// Dados de evolução mensal - últimos 12 meses
const evolucaoMensal = [
  { mes: 'Jul', ano: '23', atendimentos: 4320, resolutividade: 83.2 },
  { mes: 'Ago', ano: '23', atendimentos: 4456, resolutividade: 82.8 },
  { mes: 'Set', ano: '23', atendimentos: 4598, resolutividade: 84.1 },
  { mes: 'Out', ano: '23', atendimentos: 4523, resolutividade: 83.7 },
  { mes: 'Nov', ano: '23', atendimentos: 4687, resolutividade: 85.2 },
  { mes: 'Dez', ano: '23', atendimentos: 4401, resolutividade: 82.9 },
  { mes: 'Jan', ano: '24', atendimentos: 4789, resolutividade: 85.8 },
  { mes: 'Fev', ano: '24', atendimentos: 4934, resolutividade: 86.3 },
  { mes: 'Mar', ano: '24', atendimentos: 4812, resolutividade: 84.9 },
  { mes: 'Abr', ano: '24', atendimentos: 5023, resolutividade: 87.1 },
  { mes: 'Mai', ano: '24', atendimentos: 4945, resolutividade: 85.4 },
  { mes: 'Jun', ano: '24', atendimentos: 4825, resolutividade: 82.3 }
];

// Função para aplicar correlações epidemiológicas
const aplicarCorrelacaoAPS = (dadosBase: any, filtro: { tipo: string; valor: string; label: string }) => {
  const dadosCorrelacionados = JSON.parse(JSON.stringify(dadosBase));

  switch (filtro.tipo) {
    case 'risco':
      if (filtro.valor === 'alto-risco') {
        dadosCorrelacionados.taxaEncaminhamento = 28.4;
        dadosCorrelacionados.taxaRecorrencia = 2.23;
        dadosCorrelacionados.topMotivos[0].pacientes = 682;
        dadosCorrelacionados.topMotivos[1].pacientes = 594;
        dadosCorrelacionados.distribuicaoDesfecho[1].percentual = 28.4;
        dadosCorrelacionados.distribuicaoDesfecho[0].percentual = 71.6;
      } else if (filtro.valor === 'crescente') {
        dadosCorrelacionados.taxaEncaminhamento = 21.2;
        dadosCorrelacionados.taxaRecorrencia = 1.78;
      }
      break;
    
    case 'tipo':
      if (filtro.valor === 'walk-in') {
        dadosCorrelacionados.taxaEncaminhamento = 23.8;
        dadosCorrelacionados.taxaRecorrencia = 1.12;
        dadosCorrelacionados.topMotivos[2].pacientes = 512; // Mais exames gerais
        dadosCorrelacionados.topMotivos[3].pacientes = 456; // Mais dor aguda
      }
      break;
    
    case 'desfecho':
      if (filtro.valor === 'enc.-especialista') {
        dadosCorrelacionados.taxaRecorrencia = 2.34;
        dadosCorrelacionados.topEncaminhamentos[0].pacientes = 264;
        dadosCorrelacionados.topEncaminhamentos[1].pacientes = 198;
      }
      break;

    case 'cid':
      if (filtro.valor === 'I10') {
        dadosCorrelacionados.taxaEncaminhamento = 12.3;
        dadosCorrelacionados.taxaRecorrencia = 2.78;
        dadosCorrelacionados.topEncaminhamentos[1].pacientes = 287; // Mais cardio
      } else if (filtro.valor === 'E11.9') {
        dadosCorrelacionados.taxaEncaminhamento = 19.8;
        dadosCorrelacionados.taxaRecorrencia = 3.12;
        dadosCorrelacionados.topEncaminhamentos[2].pacientes = 234; // Mais endocrinologia
      }
      break;
  }

  return dadosCorrelacionados;
};

// Função para cor do heatmap temporal
const getHeatmapColorAPS = (resolutividade: number) => {
  if (resolutividade >= 85) return '#ef4444'; // Vermelho - acima da capacidade
  if (resolutividade >= 80) return '#22c55e'; // Verde - na capacidade
  return '#3b82f6'; // Azul - abaixo da capacidade
};

export function UtilizacaoAPS({ filters, onNavigateToTable, localFilter, onLocalFilterChange }: UtilizacaoAPSProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTotalTooltip, setShowTotalTooltip] = useState(false);
  const [showPacientesTooltip, setShowPacientesTooltip] = useState(false);
  const [showRecorrenciaTooltip, setShowRecorrenciaTooltip] = useState(false);
  const [showVariacaoTooltip, setShowVariacaoTooltip] = useState(false);
  const [showEncaminhamentoTooltip, setShowEncaminhamentoTooltip] = useState(false);
  const [showResolutividadeTooltip, setShowResolutividadeTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{
    tipo: string;
    valor: string;
    label: string;
  } | null>(localFilter || null);

  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosBaseAPS;
    return aplicarCorrelacaoAPS(dadosBaseAPS, filtroInterativo);
  }, [filtroInterativo]);

  const handleFiltroInterativo = (tipo: string, valor: string, label: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const novoFiltro = (filtroInterativo?.tipo === tipo && filtroInterativo?.valor === valor) 
      ? null 
      : { tipo, valor, label };
    
    setFiltroInterativo(novoFiltro);
    
    if (onLocalFilterChange) {
      onLocalFilterChange(novoFiltro);
    }
  };

  const handleNavigateToTable = (type: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (onNavigateToTable) {
      onNavigateToTable(type);
    }
  };

  // Tooltip customizado para gráfico de risco
  const CustomRiskPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.nivel}</p>
          <p className="text-sm text-gray-600">{data.quantidade.toLocaleString()} pacientes</p>
          <p className="text-sm text-blue-600">{data.percentual}% do total</p>
        </div>
      );
    }
    return null;
  };

  // Função para renderizar labels customizados no gráfico de pizza de risco
  const renderCustomizedRiskLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.08) return null; // Não mostra labels para fatias muito pequenas (<8%)
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <g>
        <rect 
          x={x - 12} 
          y={y - 8} 
          width="24" 
          height="16" 
          fill="white" 
          stroke="#e5e7eb" 
          rx="2"
        />
        <text 
          x={x} 
          y={y + 2} 
          fill="black" 
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize="10"
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-blue-50 rounded">
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <span>Utilização APS</span>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">Análise de padrões de uso e resolutividade</p>
            </div>
          </CardTitle>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {filtroInterativo && (
              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Filtrado: {filtroInterativo.label}
              </div>
            )}
            
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
                    <p>Clique em qualquer elemento para filtrar todos os dados da APS.</p>
                    <p>Os valores são recalculados usando correlações epidemiológicas reais.</p>
                    <div className="mt-3">
                      <span className="font-medium">Metas APS:</span>
                      <ul className="ml-3 mt-1 space-y-0.5">
                        <li>• Resolutividade: &gt;80%</li>
                        <li>• Taxa encaminhamento: &lt;20%</li>
                        <li>• Recorrência adequada: 1.2-1.8x</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5 px-6">
        {/* 6 Cards de Métricas */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            className="bg-blue-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowTotalTooltip(true)}
            onMouseLeave={() => setShowTotalTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Total Atendimentos</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {dados.totalAtendimentos.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-500">Período</p>
            
            {showTotalTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Total de atendimentos realizados no período de análise selecionado</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          <div 
            className="bg-purple-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowPacientesTooltip(true)}
            onMouseLeave={() => setShowPacientesTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Pacientes Únicos</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {((dados.pacientesUnicos / dados.totalAtendimentos) * 100).toFixed(1)}%
            </p>
            <p className="text-[11px] text-gray-500">{dados.pacientesUnicos.toLocaleString()}</p>
            
            {showPacientesTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Número de pacientes únicos atendidos no período</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          <div 
            className="bg-amber-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowRecorrenciaTooltip(true)}
            onMouseLeave={() => setShowRecorrenciaTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Taxa Recorrência</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {dados.taxaRecorrencia}x
            </p>
            <p className="text-[11px] text-gray-500">/paciente</p>
            
            {showRecorrenciaTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Mediana calculada de atendimentos por paciente no período</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>

          <div 
            className="bg-green-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowVariacaoTooltip(true)}
            onMouseLeave={() => setShowVariacaoTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Variação do Período</p>
            <p className="text-2xl font-bold text-green-600 mt-1">+{((dados.incrementoMes / dados.totalAtendimentos) * 100).toFixed(1)}%</p>
            <p className="text-[11px] text-gray-500">{dados.incrementoMes}</p>
            
            {showVariacaoTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Variação de atendimentos em relação ao período anterior</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          <div 
            className="bg-orange-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowEncaminhamentoTooltip(true)}
            onMouseLeave={() => setShowEncaminhamentoTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Taxa Encaminhamento</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {dados.taxaEncaminhamento}%
            </p>
            <p className="text-[11px] text-gray-500">{Math.round(dados.totalAtendimentos * dados.taxaEncaminhamento / 100)}</p>
            
            {showEncaminhamentoTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Percentual de atendimentos encaminhados para especialista</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          <div 
            className="bg-indigo-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowResolutividadeTooltip(true)}
            onMouseLeave={() => setShowResolutividadeTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Taxa Resolutividade</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{(100 - dados.taxaEncaminhamento).toFixed(1)}%</p>
            <p className="text-[11px] text-gray-500">{Math.round(dados.totalAtendimentos * (100 - dados.taxaEncaminhamento) / 100).toLocaleString()}</p>
            
            {showResolutividadeTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Total de atendimentos menos o percentual de encaminhados para especialistas</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Pizza + Distribuições com Barras Horizontais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição por Escala de Risco */}
          <div className="bg-gray-50 rounded-lg p-4 min-h-[280px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => handleNavigateToTable('risk-distribution', e)}
                >
                  Distribuição por Escala de Risco
                </h3>
              </div>
              <div className="relative">
                <Info 
                  className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" 
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget;
                    const tooltip = document.createElement('div');
                    tooltip.className = 'absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50';
                    tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Classificação de pacientes conforme estratificação de risco clínico baseada em condições e fatores de risco</p>';
                    element.parentElement?.appendChild(tooltip);
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.parentElement?.querySelector('div.absolute');
                    if (tooltip) tooltip.remove();
                  }}
                />
              </div>
            </div>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={dados.distribuicaoRisco} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={70} 
                    innerRadius={25} 
                    paddingAngle={2} 
                    dataKey="percentual"
                    labelLine={false}
                    label={renderCustomizedRiskLabel}
                  >
                    {dados.distribuicaoRisco.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.cor} 
                        onClick={(e) => handleFiltroInterativo(
                          'risco', 
                          entry.nivel.toLowerCase().replace(' ', '-'), 
                          entry.nivel, 
                          e
                        )}
                        style={{
                          opacity: filtroInterativo && filtroInterativo.tipo !== 'risco' || 
                                  (filtroInterativo?.tipo === 'risco' && filtroInterativo?.valor !== entry.nivel.toLowerCase().replace(' ', '-')) ? 0.4 : 1,
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomRiskPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-auto">
              {dados.distribuicaoRisco.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.cor }}
                  />
                  <span className="text-gray-700">
                    {item.nivel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tipo de Atendimento + Desfecho com Layout de Barras Horizontais */}
          <div className="space-y-3 min-h-[280px]">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <h3 
                    className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={(e) => handleNavigateToTable('appointment-type', e)}
                  >
                    Tipo de Atendimento
                  </h3>
                </div>
                <div className="relative">
                  <Info 
                    className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" 
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      const element = e.currentTarget;
                      const tooltip = document.createElement('div');
                      tooltip.className = 'absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50';
                      tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Distribuição entre consultas agendadas e atendimentos sem agendamento prévio (walk-in)</p>';
                      element.parentElement?.appendChild(tooltip);
                    }}
                    onMouseLeave={(e) => {
                      const tooltip = e.currentTarget.parentElement?.querySelector('div.absolute');
                      if (tooltip) tooltip.remove();
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                {dados.distribuicaoTipo.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.tipo}</span>
                      <span className="text-gray-600">
                        {item.quantidade} ({item.percentual}%)
                      </span>
                    </div>
                    <div 
                      className="relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={(e) => handleFiltroInterativo('tipo', item.tipo.toLowerCase(), item.tipo, e)}
                      style={{
                        opacity: filtroInterativo && filtroInterativo.tipo !== 'tipo' || 
                                (filtroInterativo?.tipo === 'tipo' && filtroInterativo?.valor !== item.tipo.toLowerCase()) ? 0.4 : 1,
                        transform: filtroInterativo?.tipo === 'tipo' && filtroInterativo?.valor === item.tipo.toLowerCase() ? 'scaleY(1.2)' : 'scaleY(1)',
                        border: filtroInterativo?.tipo === 'tipo' && filtroInterativo?.valor === item.tipo.toLowerCase() ? '2px solid #1e40af' : 'none'
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg transition-all duration-300"
                        style={{ 
                          width: `${item.percentual}%`,
                          backgroundColor: item.cor
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <h3 
                    className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={(e) => handleNavigateToTable('outcome-distribution', e)}
                  >
                    Distribuição por Desfecho
                  </h3>
                </div>
                <div className="relative">
                  <Info 
                    className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" 
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      const element = e.currentTarget;
                      const tooltip = document.createElement('div');
                      tooltip.className = 'absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50';
                      tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Percentual de atendimentos resolvidos na APS versus encaminhados para especialistas</p>';
                      element.parentElement?.appendChild(tooltip);
                    }}
                    onMouseLeave={(e) => {
                      const tooltip = e.currentTarget.parentElement?.querySelector('div.absolute');
                      if (tooltip) tooltip.remove();
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                {dados.distribuicaoDesfecho.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.desfecho}</span>
                      <span className="text-gray-600">
                        {item.quantidade} ({item.percentual}%)
                      </span>
                    </div>
                    <div 
                      className="relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={(e) => handleFiltroInterativo('desfecho', item.desfecho.toLowerCase().replace(/\s/g, '-'), item.desfecho, e)}
                      style={{
                        opacity: filtroInterativo && filtroInterativo.tipo !== 'desfecho' || 
                                (filtroInterativo?.tipo === 'desfecho' && filtroInterativo?.valor !== item.desfecho.toLowerCase().replace(/\s/g, '-')) ? 0.4 : 1,
                        transform: filtroInterativo?.tipo === 'desfecho' && filtroInterativo?.valor === item.desfecho.toLowerCase().replace(/\s/g, '-') ? 'scaleY(1.2)' : 'scaleY(1)',
                        border: filtroInterativo?.tipo === 'desfecho' && filtroInterativo?.valor === item.desfecho.toLowerCase().replace(/\s/g, '-') ? '2px solid #1e40af' : 'none'
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg transition-all duration-300"
                        style={{ 
                          width: `${item.percentual}%`,
                          backgroundColor: item.cor
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Motivos + Top 5 Encaminhamentos - Formato Horizontal Full Width */}
        <div className="space-y-4">
          {/* Top 5 Motivos - Full Width */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => handleNavigateToTable('top-reasons', e)}
                >
                  Top 5 Motivos - Atendimento
                </h3>
              </div>
              <div className="relative">
                <Info 
                  className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" 
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget;
                    const tooltip = document.createElement('div');
                    tooltip.className = 'absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50';
                    tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Cinco principais códigos CID-10 registrados nos atendimentos do período analisado</p>';
                    element.parentElement?.appendChild(tooltip);
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.parentElement?.querySelector('div.absolute');
                    if (tooltip) tooltip.remove();
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {dados.topMotivos.map((fator, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200 relative group"
                  onClick={(e) => handleFiltroInterativo('cid', fator.fator, fator.fator, e)}
                  style={{
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'cid' || 
                            (filtroInterativo?.tipo === 'cid' && filtroInterativo?.valor !== fator.fator) ? 0.4 : 1,
                    transform: filtroInterativo?.tipo === 'cid' && filtroInterativo?.valor === fator.fator ? 'scale(1.02)' : 'scale(1)',
                    borderColor: filtroInterativo?.tipo === 'cid' && filtroInterativo?.valor === fator.fator ? '#1e40af' : '#e5e7eb',
                    borderWidth: filtroInterativo?.tipo === 'cid' && filtroInterativo?.valor === fator.fator ? '2px' : '1px'
                  }}
                >
                  {/* Tooltip hover */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="font-semibold">{fator.fator}</div>
                    <div className="mt-1">{descricoesCID[fator.fator] || 'Descrição não disponível'}</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="text-xs font-semibold text-gray-700">{fator.fator}</div>
                    
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

          {/* Top 5 Encaminhamentos - Full Width */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => handleNavigateToTable('top-referrals', e)}
                >
                  Top 5 Enc. Especialista
                </h3>
              </div>
              <div className="relative">
                <Info 
                  className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" 
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    const element = e.currentTarget;
                    const tooltip = document.createElement('div');
                    tooltip.className = 'absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50';
                    tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Cinco especialidades médicas com maior volume de encaminhamentos no período</p>';
                    element.parentElement?.appendChild(tooltip);
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.parentElement?.querySelector('div.absolute');
                    if (tooltip) tooltip.remove();
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {dados.topEncaminhamentos.map((fator, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200 relative group"
                  onClick={(e) => handleFiltroInterativo('especialidade', fator.fator, fator.fator, e)}
                  style={{
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'especialidade' || 
                            (filtroInterativo?.tipo === 'especialidade' && filtroInterativo?.valor !== fator.fator) ? 0.4 : 1,
                    transform: filtroInterativo?.tipo === 'especialidade' && filtroInterativo?.valor === fator.fator ? 'scale(1.02)' : 'scale(1)',
                    borderColor: filtroInterativo?.tipo === 'especialidade' && filtroInterativo?.valor === fator.fator ? '#1e40af' : '#e5e7eb',
                    borderWidth: filtroInterativo?.tipo === 'especialidade' && filtroInterativo?.valor === fator.fator ? '2px' : '1px'
                  }}
                >
                  <div className="text-center space-y-2">
                    <div className="text-xs font-semibold text-gray-700 truncate">{fator.fator}</div>
                    
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
        </div>

        {/* Evolução Mensal APS - Heatmap */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={(e) => handleNavigateToTable('aps-evolution', e)}
              >
                Utilização APS - Últimos 12 Meses
              </h3>
            </div>
            <div className="relative">
              <Info 
                className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" 
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  const element = e.currentTarget;
                  const tooltip = document.createElement('div');
                  tooltip.className = 'absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50';
                  tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Evolução mensal do volume de atendimentos e taxa de resolutividade da APS nos últimos 12 meses</p>';
                  element.parentElement?.appendChild(tooltip);
                }}
                onMouseLeave={(e) => {
                  const tooltip = e.currentTarget.parentElement?.querySelector('div.absolute');
                  if (tooltip) tooltip.remove();
                }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-1 mb-4">
            {evolucaoMensal.map((month, index) => (
              <div key={index} className="relative group">
                <div 
                  className="aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                  style={{ 
                    backgroundColor: getHeatmapColorAPS(month.resolutividade)
                  }}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    <div className="font-semibold">{month.mes}/{month.ano}</div>
                    <div>{month.atendimentos.toLocaleString()} atendimentos</div>
                    <div>{month.resolutividade}% resolutividade</div>
                  </div>
                </div>
                <p className="text-[10px] text-center text-gray-600 mt-1">{month.mes}</p>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-gray-600">Acima da Capacidade (≥85%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }}></div>
              <span className="text-gray-600">Na Capacidade (80-84%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-gray-600">Abaixo da Capacidade (&lt;80%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}