interface UtilizacaoPAVirtualProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}// Arquivo: components/charts/UtilizacaoPAVirtual.tsx
// Componente: Dashboard de utilização do PA Virtual com filtros interativos e evolução temporal
// Contexto: Dashboard APS - Análise detalhada de padrões de uso e efetividade PA Virtual
// Dados: Baseado em dados reais PA Virtual Brasil
// Navegação: Tabela detalhada de utilização PA Virtual por paciente

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LabelList } from 'recharts';
import { Activity, TrendingUp, Users, AlertTriangle, Shield, Info, BarChart3 } from 'lucide-react';

// Descrições dos códigos CID para tooltip
const descricoesCID: { [key: string]: string } = {
  'Z71.1': 'Pessoa consultando em nome de outra pessoa',
  'J00': 'Nasofaringite aguda [resfriado comum]',
  'M79.3': 'Paniculite, não especificada',
  'R50.9': 'Febre não especificada',
  'K59.0': 'Constipação',
  'I10': 'Hipertensão essencial (primária)',
  'E11': 'Diabetes mellitus não-insulino-dependente',
  'J44': 'Outras doenças pulmonares obstrutivas crônicas',
  'J45': 'Asma',
  'N39.0': 'Infecção do trato urinário de localização não especificada'
};

// Dados base sem filtro
const dadosBasePAVirtual = {
  totalAtendimentos: 3110,
  pacientesUnicos: 2487,
  taxaRecorrencia: 1.25,
  incrementoMes: 186,
  taxaResolucao: 78.5,
  encaminhamentosEvitados: 2433,
  
  // Top 5 Motivos Gerais - formato igual ao UtilizacaoAPS
  topMotivosGeral: [
    { fator: 'Z71.1', pacientes: 486, percentual: 15.6, cor: '#3b82f6' },
    { fator: 'J00', pacientes: 342, percentual: 11.0, cor: '#facc15' },
    { fator: 'M79.3', pacientes: 280, percentual: 9.0, cor: '#fb923c' },
    { fator: 'R50.9', pacientes: 218, percentual: 7.0, cor: '#10b981' },
    { fator: 'K59.0', pacientes: 187, percentual: 6.0, cor: '#a855f7' }
  ],
  
  // Top 5 Sensíveis APS - formato igual ao UtilizacaoAPS
  topMotivosSensiveis: [
    { fator: 'I10', pacientes: 387, percentual: 43.4, cor: '#ef4444' },
    { fator: 'E11', pacientes: 156, percentual: 17.5, cor: '#fb923c' },
    { fator: 'J44', pacientes: 134, percentual: 15.0, cor: '#facc15' },
    { fator: 'J45', pacientes: 125, percentual: 14.0, cor: '#84cc16' },
    { fator: 'N39.0', pacientes: 89, percentual: 10.0, cor: '#10b981' }
  ],
  
  // Distribuição por padrão de uso
  distribuicaoUso: [
    { categoria: 'Baixo', descricao: '<1 atendimento/mês', usuarios: 1350, percentual: 54.3, cor: '#22c55e' },
    { categoria: 'Na Média', descricao: '1-2 atendimentos/mês', usuarios: 750, percentual: 30.2, cor: '#84cc16' },
    { categoria: 'Alto', descricao: '3-5 atendimentos/mês', usuarios: 357, percentual: 14.3, cor: '#fb923c' },
    { categoria: 'Hiperutilização', descricao: '>5 atendimentos/mês', usuarios: 30, percentual: 1.2, cor: '#ef4444' }
  ],
  
  // Distribuição por desfecho
  distribuicaoDesfecho: [
    { desfecho: 'Alta pós-teleconsulta', quantidade: 1555, percentual: 50.0, cor: '#10b981' },
    { desfecho: 'Alta com enc. oportuno', quantidade: 933, percentual: 30.0, cor: '#3b82f6' },
    { desfecho: 'Enc. PA/PS', quantidade: 622, percentual: 20.0, cor: '#f59e0b' }
  ]
};

// Dados do heatmap temporal
const heatmapData = [
  { mes: 'Jul', ano: '23', atendimentos: 2650 },
  { mes: 'Ago', ano: '23', atendimentos: 2780 },
  { mes: 'Set', ano: '23', atendimentos: 2920 },
  { mes: 'Out', ano: '23', atendimentos: 2850 },
  { mes: 'Nov', ano: '23', atendimentos: 3050 },
  { mes: 'Dez', ano: '23', atendimentos: 2890 },
  { mes: 'Jan', ano: '24', atendimentos: 3150 },
  { mes: 'Fev', ano: '24', atendimentos: 3280 },
  { mes: 'Mar', ano: '24', atendimentos: 3180 },
  { mes: 'Abr', ano: '24', atendimentos: 3350 },
  { mes: 'Mai', ano: '24', atendimentos: 3220 },
  { mes: 'Jun', ano: '24', atendimentos: 3110 }
];

// Função para aplicar correlações epidemiológicas PA Virtual
const aplicarCorrelacaoPAVirtual = (dadosBase: any, filtro: { tipo: string; valor: string; label: string }) => {
  const dadosCorrelacionados = JSON.parse(JSON.stringify(dadosBase));

  switch (filtro.tipo) {
    case 'uso':
      if (filtro.valor === 'hiperutilização') {
        dadosCorrelacionados.taxaResolucao = 62.3;
        dadosCorrelacionados.taxaRecorrencia = 2.78;
        dadosCorrelacionados.topMotivosGeral[0].pacientes = 687;
        dadosCorrelacionados.distribuicaoDesfecho[2].percentual = 35.2;
      } else if (filtro.valor === 'frequente') {
        dadosCorrelacionados.taxaResolucao = 68.9;
        dadosCorrelacionados.taxaRecorrencia = 1.98;
      }
      break;
    
    case 'desfecho':
      if (filtro.valor === 'enc.-pa/ps') {
        dadosCorrelacionados.taxaRecorrencia = 2.12;
        dadosCorrelacionados.topMotivosSensiveis[0].pacientes = 524; // Mais hipertensão
        dadosCorrelacionados.topMotivosSensiveis[1].pacientes = 298; // Mais diabetes
      }
      break;

    case 'cid':
      if (filtro.valor === 'I10') {
        dadosCorrelacionados.taxaResolucao = 85.4;
        dadosCorrelacionados.taxaRecorrencia = 1.87;
      } else if (filtro.valor === 'Z71.1') {
        dadosCorrelacionados.taxaResolucao = 92.1;
        dadosCorrelacionados.taxaRecorrencia = 1.12;
      }
      break;
  }

  return dadosCorrelacionados;
};

// Função para cor do heatmap
const getHeatmapColor = (atendimentos: number) => {
  const intensidade = atendimentos / 3350;
  if (intensidade >= 0.9) return '#ef4444'; // Vermelho - Acima da capacidade
  if (intensidade >= 0.8) return '#22c55e'; // Verde - Na capacidade
  return '#3b82f6'; // Azul - Abaixo da capacidade
};

export function UtilizacaoPAVirtual({ filters, onNavigateToTable }: UtilizacaoPAVirtualProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTotalTooltip, setShowTotalTooltip] = useState(false);
  const [showPacientesTooltip, setShowPacientesTooltip] = useState(false);
  const [showRecorrenciaTooltip, setShowRecorrenciaTooltip] = useState(false);
  const [showVariacaoTooltip, setShowVariacaoTooltip] = useState(false);
  const [showResolucaoTooltip, setShowResolucaoTooltip] = useState(false);
  const [showResolutividadeTooltip, setShowResolutividadeTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{
    tipo: string;
    valor: string;
    label: string;
  } | null>(null);

  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosBasePAVirtual;
    return aplicarCorrelacaoPAVirtual(dadosBasePAVirtual, filtroInterativo);
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

  const handleNavigateToTable = (type: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (onNavigateToTable) {
      onNavigateToTable(type);
    }
  };

  const handleCardClick = () => {
    if (onNavigateToTable) {
      onNavigateToTable('pa-utilization');
    }
  };

  // Tooltip customizado
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.categoria}</p>
          <p className="text-sm text-gray-600">{data.descricao}</p>
          <p className="text-sm text-blue-600">
            {data.usuarios.toLocaleString()} usuários ({data.percentual}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Função para renderizar labels customizados no gráfico de pizza
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-blue-50 rounded">
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <span>Utilização PA Virtual</span>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">Análise de padrões de uso e efetividade</p>
            </div>
          </CardTitle>
          
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {filtroInterativo && (
              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Filtrado: {filtroInterativo.label}
              </div>
            )}

            {/* Ícone de informação */}
            <div 
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="relative"
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              
              {showTooltip && (
                <div className="absolute right-0 top-8 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                  <div className="font-semibold mb-1">Sistema de Filtros Interativos</div>
                  <p className="mb-2">
                    Clique em qualquer elemento para filtrar todos os dados do PA Virtual.
                  </p>
                  <div className="space-y-1 text-[11px]">
                    <div><span className="font-medium">Adequada:</span> 1-2 atendimentos/mês (92% resolução)</div>
                    <div><span className="font-medium">Moderada:</span> 3-5 atendimentos/mês (85% resolução)</div>
                    <div><span className="font-medium">Frequente:</span> 6-10 atendimentos/mês (68% resolução)</div>
                  </div>
                  <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5 px-6" onClick={(e) => e.stopPropagation()}>
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
                <p>Total de atendimentos realizados no PA Virtual no período de análise selecionado</p>
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
                <p>Número de pacientes únicos atendidos no PA Virtual no período</p>
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
                <p>Mediana calculada de atendimentos por paciente no PA Virtual</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>

          <div 
            className="bg-green-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowVariacaoTooltip(true)}
            onMouseLeave={() => setShowVariacaoTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Incremento no Mês</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{((dados.incrementoMes / dados.totalAtendimentos) * 100).toFixed(1)}%</p>
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
            onMouseEnter={() => setShowResolucaoTooltip(true)}
            onMouseLeave={() => setShowResolucaoTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Taxa Encaminhamento PS</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {dados.distribuicaoDesfecho[2].percentual}%
            </p>
            <p className="text-[11px] text-gray-500">{dados.distribuicaoDesfecho[2].quantidade}</p>
            
            {showResolucaoTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Percentual de atendimentos encaminhados para pronto-socorro</p>
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
            <p className="text-2xl font-bold text-indigo-600 mt-1">{(100 - dados.distribuicaoDesfecho[2].percentual).toFixed(1)}%</p>
            <p className="text-[11px] text-gray-500">{(dados.distribuicaoDesfecho[0].quantidade + dados.distribuicaoDesfecho[1].quantidade).toLocaleString()}</p>
            
            {showResolutividadeTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Percentual de atendimentos resolvidos sem necessidade de encaminhamento ao pronto-socorro</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Pizza e Distribuição por Desfecho */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => handleNavigateToTable('usage-pattern', e)}
                >
                  Padrão de Uso
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
                    tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Classificação baseada na média de atendimentos mensais. Referência: 1.3 atendimentos/pessoa/mês é o padrão esperado para pronto-socorro</p>';
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
                    data={dados.distribuicaoUso}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={0}
                    paddingAngle={2}
                    dataKey="percentual"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {dados.distribuicaoUso.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.cor}
                        onClick={(e) => handleFiltroInterativo(
                          'uso', 
                          entry.categoria.toLowerCase(), 
                          entry.categoria, 
                          e
                        )}
                        style={{
                          opacity: filtroInterativo && filtroInterativo.tipo !== 'uso' || 
                                  (filtroInterativo?.tipo === 'uso' && filtroInterativo?.valor !== entry.categoria.toLowerCase()) ? 0.4 : 1,
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              {dados.distribuicaoUso.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.cor }}
                  />
                  <span className="text-gray-700">
                    {item.categoria}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Distribuição por Desfecho - Gráfico Donut */}
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
                    tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Percentual de atendimentos por tipo de desfecho: alta pós-teleconsulta, alta com encaminhamento oportuno ou encaminhamento ao pronto-socorro</p>';
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
                    data={dados.distribuicaoDesfecho}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="percentual"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                      if (percent < 0.15) return null; // Não mostra labels para fatias pequenas (<15%)
                      
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
                    }}
                  >
                    {dados.distribuicaoDesfecho.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.cor}
                        onClick={(e) => handleFiltroInterativo(
                          'desfecho', 
                          entry.desfecho.toLowerCase().replace(/\s/g, '-'), 
                          entry.desfecho, 
                          e
                        )}
                        style={{
                          opacity: filtroInterativo && filtroInterativo.tipo !== 'desfecho' || 
                                  (filtroInterativo?.tipo === 'desfecho' && filtroInterativo?.valor !== entry.desfecho.toLowerCase().replace(/\s/g, '-')) ? 0.4 : 1,
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold">{data.desfecho}</p>
                          <p className="text-sm text-blue-600">
                            {data.quantidade.toLocaleString()} atendimentos ({data.percentual}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {dados.distribuicaoDesfecho.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.cor }}
                    />
                    <span className="text-gray-700">{item.desfecho}</span>
                  </div>
                  <span className="text-gray-600 font-medium text-right">
                    {item.quantidade.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 5 Motivos - Formato Horizontal Full Width */}
        <div className="space-y-4">
          {/* Top 5 Motivos Geral - Full Width */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => handleNavigateToTable('top-reasons-general', e)}
                >
                  Top 5 Motivos - Geral
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
                    tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Cinco principais códigos CID-10 registrados nos atendimentos do PA Virtual no período analisado</p>';
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
              {dados.topMotivosGeral.map((fator, index) => (
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

          {/* Top 5 Sensíveis APS - Full Width */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => handleNavigateToTable('top-aps-sensitive', e)}
                >
                  Top 5 - Sensíveis à APS
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
                    tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Cinco principais condições sensíveis à atenção primária que foram atendidas no PA Virtual e poderiam ter sido resolvidas na APS</p>';
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
              {dados.topMotivosSensiveis.map((fator, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all duration-200 relative group"
                  onClick={(e) => handleFiltroInterativo('cid-sensivel', fator.fator, fator.fator, e)}
                  style={{
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'cid-sensivel' || 
                            (filtroInterativo?.tipo === 'cid-sensivel' && filtroInterativo?.valor !== fator.fator) ? 0.4 : 1,
                    transform: filtroInterativo?.tipo === 'cid-sensivel' && filtroInterativo?.valor === fator.fator ? 'scale(1.02)' : 'scale(1)',
                    borderColor: filtroInterativo?.tipo === 'cid-sensivel' && filtroInterativo?.valor === fator.fator ? '#1e40af' : '#e5e7eb',
                    borderWidth: filtroInterativo?.tipo === 'cid-sensivel' && filtroInterativo?.valor === fator.fator ? '2px' : '1px'
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
        </div>

        {/* Evolução Mensal - Heatmap */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={(e) => handleNavigateToTable('pa-evolution', e)}
              >
                Utilização PA Virtual - Últimos 12 Meses
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
                  tooltip.innerHTML = '<div class="font-semibold mb-1">Regra de Cálculo</div><p>Evolução mensal do volume de atendimentos em relação à capacidade operacional do PA Virtual</p>';
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
            {heatmapData.map((month, index) => {
              const intensidade = month.atendimentos / 3350;
              return (
                <div key={index} className="relative group">
                  <div 
                    className="aspect-square rounded flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                    style={{ 
                      backgroundColor: getHeatmapColor(month.atendimentos),
                      opacity: 0.4 + (intensidade * 0.6)
                    }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      <div className="font-semibold">{month.mes}/{month.ano}</div>
                      <div>{month.atendimentos.toLocaleString()} atendimentos</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-gray-600 mt-1">{month.mes}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-gray-600">Acima da Capacidade (≥90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }}></div>
              <span className="text-gray-600">Na Capacidade (80-89%)</span>
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