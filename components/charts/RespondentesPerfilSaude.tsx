// VERSAO GEMINI - Simplificado para Power BI
// Componente: Dashboard de respondentes do perfil de saúde
// Mantém: Layout, cores e dados da VERSAO C
// Remove: Complexidades desnecessárias

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText, AlertTriangle, Clock, Info } from 'lucide-react';

interface RespondentesPerfilSaudeProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
  localFilter?: { tipo: string; valor: string; label: string } | null;
  onLocalFilterChange?: (filter: { tipo: string; valor: string; label: string } | null) => void;
}

// Dados fixos idênticos à VERSAO C
const dadosBase = {
  taxaAtual: 72.1,
  totalRespondentes: 5564,
  incrementoPeriodo: 4.1,
  incrementoAbsoluto: 316,
  metaResposta: 80,
  metaValor: 6176,
  semResposta: 2156,
  vencendoMais12m: 852,
  respondentesNoPeriodo: 1543
};

// Sistema de filtros simplificado específico para perfil de saúde
function aplicarFiltroPerfilSaude(dadosBase: typeof dadosBase, filtro: { tipo: string; valor: string; label: string }) {
  const dados = { ...dadosBase };
  
  // Simular correlações básicas baseadas no tipo de filtro
  switch (filtro.tipo) {
    case 'aging':
      if (filtro.valor === 'Menos de 3 meses') {
        // Perfil de respondentes recentes
        dados.semResposta = Math.round(dados.semResposta * 0.4);
        dados.vencendoMais12m = Math.round(dados.vencendoMais12m * 0.2);
        dados.respondentesNoPeriodo = Math.round(dados.respondentesNoPeriodo * 1.4);
        dados.taxaAtual = Math.min(95, dados.taxaAtual * 1.2);
      } else if (filtro.valor === '3-9 meses') {
        // Perfil intermediário
        dados.semResposta = Math.round(dados.semResposta * 0.7);
        dados.vencendoMais12m = Math.round(dados.vencendoMais12m * 0.6);
        dados.respondentesNoPeriodo = Math.round(dados.respondentesNoPeriodo * 0.9);
        dados.taxaAtual = Math.max(50, dados.taxaAtual * 0.95);
      } else if (filtro.valor === 'Mais de 9 meses') {
        // Perfil de respostas antigas
        dados.semResposta = Math.round(dados.semResposta * 1.6);
        dados.vencendoMais12m = Math.round(dados.vencendoMais12m * 2.5);
        dados.respondentesNoPeriodo = Math.round(dados.respondentesNoPeriodo * 0.3);
        dados.taxaAtual = Math.max(30, dados.taxaAtual * 0.6);
      }
      break;
      
    case 'periodo':
      // Filtros temporais afetam principalmente métricas de atividade
      const mesAtual = filtro.valor;
      if (mesAtual.includes('24')) {
        // Meses mais recentes têm melhor taxa
        dados.respondentesNoPeriodo = Math.round(dados.respondentesNoPeriodo * 1.3);
        dados.incrementoAbsoluto = Math.round(dados.incrementoAbsoluto * 1.5);
        dados.taxaAtual = Math.min(85, dados.taxaAtual * 1.1);
      } else {
        // Meses mais antigos têm taxa menor
        dados.respondentesNoPeriodo = Math.round(dados.respondentesNoPeriodo * 0.6);
        dados.incrementoAbsoluto = Math.round(dados.incrementoAbsoluto * 0.4);
        dados.taxaAtual = Math.max(45, dados.taxaAtual * 0.85);
      }
      break;
      
    default:
      // Filtro genérico reduz ligeiramente todos os valores
      dados.totalRespondentes = Math.round(dados.totalRespondentes * 0.85);
      dados.respondentesNoPeriodo = Math.round(dados.respondentesNoPeriodo * 0.85);
      dados.taxaAtual = Math.max(40, dados.taxaAtual * 0.9);
      break;
  }
  
  // Recalcular valores derivados
  dados.incrementoPeriodo = parseFloat(((dados.incrementoAbsoluto / dados.totalRespondentes) * 100).toFixed(1));
  
  return dados;
}

// Dados de aging
const agingData = [
  { 
    label: 'Menos de 3 meses',
    percentage: 28,
    count: 2158,
    color: 'green',
    icon: '🟢'
  },
  { 
    label: '3-9 meses',
    percentage: 35,
    count: 2702,
    color: 'yellow',
    icon: '🟡'
  },
  { 
    label: 'Mais de 9 meses',
    percentage: 37,
    count: 2860,
    color: 'red',
    icon: '🔴'
  }
];

// Dados do heatmap temporal
const heatmapData = [
  { month: 'Jul', year: '23', value: 68 },
  { month: 'Ago', year: '23', value: 70 },
  { month: 'Set', year: '23', value: 67 },
  { month: 'Out', year: '23', value: 69 },
  { month: 'Nov', year: '23', value: 65 },
  { month: 'Dez', year: '23', value: 63 },
  { month: 'Jan', year: '24', value: 66 },
  { month: 'Fev', year: '24', value: 68 },
  { month: 'Mar', year: '24', value: 67 },
  { month: 'Abr', year: '24', value: 70 },
  { month: 'Mai', year: '24', value: 71 },
  { month: 'Jun', year: '24', value: 72.1 }
];

// Função para cor do heatmap (usando padrão HipertensaoChart)
const getHeatmapColor = (value: number) => {
  if (value >= 70) return '#16a34a'; // Verde escuro (bom)
  if (value >= 60) return '#22c55e'; // Verde (adequado)
  if (value >= 50) return '#84cc16'; // Verde claro (médio)
  if (value >= 40) return '#facc15'; // Amarelo (baixo)
  if (value >= 30) return '#fb923c'; // Laranja (crítico)
  return '#ef4444'; // Vermelho (muito baixo)
};

// Função para cores das barras
const getBarColor = (cor: string) => {
  const colorMap: { [key: string]: string } = {
    'green': 'from-green-500 to-green-400',
    'yellow': 'from-yellow-500 to-yellow-400',
    'red': 'from-red-500 to-red-400'
  };
  return colorMap[cor] || 'from-gray-500 to-gray-400';
};

export function RespondentesPerfilSaude({ filters, onNavigateToTable, localFilter, onLocalFilterChange }: RespondentesPerfilSaudeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTaxaAtualTooltip, setShowTaxaAtualTooltip] = useState(false);
  const [showIncrementoTooltip, setShowIncrementoTooltip] = useState(false);
  const [showMetaTooltip, setShowMetaTooltip] = useState(false);
  const [showSemRespostaTooltip, setShowSemRespostaTooltip] = useState(false);
  const [showVencendoTooltip, setShowVencendoTooltip] = useState(false);
  const [showRespondentesTooltip, setShowRespondentesTooltip] = useState(false);
  const [showDistribuicaoTooltip, setShowDistribuicaoTooltip] = useState(false);
  const [showTaxaPreenchimentoTooltip, setShowTaxaPreenchimentoTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{
    tipo: string;
    valor: string;
    label: string;
  } | null>(localFilter || null);

  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosBase;
    return aplicarFiltroPerfilSaude(dadosBase, filtroInterativo);
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

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4 text-gray-600" />
            <div>
              <span>Respondentes do Perfil de Saúde</span>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">Perfil de saúde e aging</p>
            </div>
          </CardTitle>
          
          {/* Ícone de informação */}
          <div 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative"
          >
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            
            {showTooltip && (
              <div className="absolute right-0 top-8 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Sobre este indicador</div>
                <p className="mb-2">
                  Mede o percentual de vinculados que responderam ao perfil de saúde nos últimos 12 meses.
                </p>
                <div className="space-y-1 text-[11px]">
                  <div><span className="font-medium">Meta:</span> 80% de respondentes</div>
                  <div><span className="font-medium">Válido:</span> Resposta até 12 meses</div>
                  <div><span className="font-medium">Vencendo:</span> Resposta há +9 meses</div>
                </div>
                <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>
        {filtroInterativo && (
          <div className="mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded inline-block">
            Filtrado: {filtroInterativo.label}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-5 px-6">
        {/* 6 Cards de Métricas */}
        <div className="grid grid-cols-3 gap-3">
          {/* Taxa Atual */}
          <div 
            className="bg-blue-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowTaxaAtualTooltip(true)}
            onMouseLeave={() => setShowTaxaAtualTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Taxa Atual</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{dados.totalRespondentes.toLocaleString()}</p>
            <p className="text-[11px] text-gray-500">{dados.taxaAtual}%</p>
            
            {showTaxaAtualTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Número de respostas únicas registradas no perfil de saúde nos últimos 12 meses</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          {/* Incremento do Período */}
          <div 
            className="bg-green-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowIncrementoTooltip(true)}
            onMouseLeave={() => setShowIncrementoTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Incremento do Período</p>
            <p className="text-2xl font-bold text-green-600 mt-1">+{dados.incrementoAbsoluto}</p>
            <p className="text-[11px] text-gray-500">{dados.incrementoPeriodo}%</p>
            
            {showIncrementoTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Número de novas respostas únicas do período de análise selecionado no filtro</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          {/* Meta */}
          <div 
            className="bg-green-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowMetaTooltip(true)}
            onMouseLeave={() => setShowMetaTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Meta</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{dados.metaValor.toLocaleString()}</p>
            <p className="text-[11px] text-gray-500">{dados.metaResposta}%</p>
            
            {showMetaTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Objetivo de respostas ao perfil de saúde</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>

          {/* Sem Resposta */}
          <div 
            className="bg-red-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowSemRespostaTooltip(true)}
            onMouseLeave={() => setShowSemRespostaTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Sem Resposta</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{dados.semResposta.toLocaleString()}</p>
            <p className="text-[11px] text-gray-500">{((dados.semResposta / (dados.totalRespondentes + dados.semResposta)) * 100).toFixed(1)}%</p>
            
            {showSemRespostaTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Elegíveis que não responderam ao questionário de saúde</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          {/* Vencendo */}
          <div 
            className="bg-amber-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowVencendoTooltip(true)}
            onMouseLeave={() => setShowVencendoTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Vencendo {">"}12m</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{dados.vencendoMais12m.toLocaleString()}</p>
            <p className="text-[11px] text-gray-500">{((dados.vencendoMais12m / dados.totalRespondentes) * 100).toFixed(1)}%</p>
            
            {showVencendoTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Respostas com mais de 12 meses que vencerão nos próximos 3 meses</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          {/* Taxa de Respostas */}
          <div 
            className="bg-purple-50 rounded-lg p-3 text-center relative"
            onMouseEnter={() => setShowRespondentesTooltip(true)}
            onMouseLeave={() => setShowRespondentesTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Respostas do Período</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{dados.respondentesNoPeriodo.toLocaleString()}</p>
            <p className="text-[11px] text-gray-500">{((dados.respondentesNoPeriodo / dados.totalRespondentes) * 100).toFixed(1)}%</p>
            
            {showRespondentesTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Total de respostas registradas no período de análise selecionado no filtro</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
        </div>

        {/* Aging Visual */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <h3 
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={(e) => handleNavigateToTable('aging', e)}
              >
                Distribuição de Respostas do Perfil de Saúde
              </h3>
            </div>
            <div 
              onMouseEnter={() => setShowDistribuicaoTooltip(true)}
              onMouseLeave={() => setShowDistribuicaoTooltip(false)}
              className="relative"
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              
              {showDistribuicaoTooltip && (
                <div className="absolute right-0 top-8 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                  <div className="font-semibold mb-1">Regra de Cálculo</div>
                  <p>Distribuição das respostas por tempo desde o último preenchimento. Respostas com mais de 12 meses são consideradas vencidas.</p>
                  <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            {agingData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`text-${item.color}-600`}>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    {item.label === 'Mais de 9 meses' && (
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                    )}
                  </div>
                  <span className="text-gray-600">{item.count.toLocaleString()}</span>
                </div>
                <div 
                  className="relative w-full bg-gray-200 rounded-full h-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={(e) => handleFiltroInterativo('aging', item.label, `Aging: ${item.label}`, e)}
                >
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${getBarColor(item.color)} transition-all`}
                    style={{ 
                      width: `${item.percentage}%`,
                      opacity: filtroInterativo && filtroInterativo.tipo !== 'aging' || (filtroInterativo?.tipo === 'aging' && filtroInterativo?.valor !== item.label) ? 0.4 : 1,
                      transform: filtroInterativo?.tipo === 'aging' && filtroInterativo?.valor === item.label ? 'scaleY(1.2)' : 'scaleY(1)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t text-xs text-gray-500 text-center">
            {dados.totalRespondentes.toLocaleString()} total de respondentes
          </div>
        </div>

        {/* Heatmap Temporal */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={(e) => handleNavigateToTable('evolution', e)}
            >
              Taxa de Preenchimento do Perfil de Saúde
            </h3>
            <div 
              onMouseEnter={() => setShowTaxaPreenchimentoTooltip(true)}
              onMouseLeave={() => setShowTaxaPreenchimentoTooltip(false)}
              className="relative"
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              
              {showTaxaPreenchimentoTooltip && (
                <div className="absolute right-0 top-8 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                  <div className="font-semibold mb-1">Regra de Cálculo</div>
                  <p>Evolução mensal da taxa de preenchimento do perfil de saúde nos últimos 12 meses.</p>
                  <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Grid do Heatmap */}
          <div className="grid grid-cols-12 gap-1 mb-3">
            {heatmapData.map((month, index) => (
              <div key={index} className="relative group">
                <div 
                  className="aspect-square rounded flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: getHeatmapColor(month.value),
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'periodo' || (filtroInterativo?.tipo === 'periodo' && filtroInterativo?.valor !== `${month.month}/${month.year}`) ? 0.6 : 1,
                    transform: filtroInterativo?.tipo === 'periodo' && filtroInterativo?.valor === `${month.month}/${month.year}` ? 'scale(1.15)' : 'scale(1)',
                    border: filtroInterativo?.tipo === 'periodo' && filtroInterativo?.valor === `${month.month}/${month.year}` ? '2px solid #1e40af' : 'none'
                  }}
                  onClick={(e) => handleFiltroInterativo('periodo', `${month.month}/${month.year}`, `Período: ${month.month}/${month.year}`, e)}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    <div className="font-semibold">{month.month}/{month.year}</div>
                    <div>{month.value}% com resposta válida</div>
                  </div>
                </div>
                <p className="text-[10px] text-center text-gray-600 mt-1">{month.month}</p>
              </div>
            ))}
          </div>
          
          {/* Separador de anos */}
          <div className="flex items-center justify-center text-xs text-gray-500 gap-6 mb-3">
            <span>2023</span>
            <span className="text-gray-300">|</span>
            <span>2024</span>
          </div>
          
          {/* Legenda */}
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-gray-600">Crítico ({'<'}40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#facc15' }}></div>
              <span className="text-gray-600">Moderado (40-60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#84cc16' }}></div>
              <span className="text-gray-600">Adequado (60-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#16a34a' }}></div>
              <span className="text-gray-600">Bom ({'>'} 70%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}