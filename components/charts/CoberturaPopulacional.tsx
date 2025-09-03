// VERSAO GEMINI - Simplificado para Power BI
// Componente: Dashboard de cobertura populacional
// Mantém: Layout, cores e dados da VERSAO C
// Remove: Filtros internos complexos

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, AlertTriangle, Info } from 'lucide-react';

interface CoberturaPopulacionalProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
  localFilter?: { tipo: string; valor: string; label: string } | null;
  onLocalFilterChange?: (filter: { tipo: string; valor: string; label: string } | null) => void;
}

// Dados fixos idênticos à VERSAO C
const dadosBase = {
  vidasElegiveis: 8950,
  vidasVinculadas: 7720,
  naoVinculados: 1230,
  taxaVinculados: 86.3,
  
  // Distribuição do acompanhamento
  controladoTotal: 4014,    // 52% dos vinculados
  controleInadequadoTotal: 1930, // 25% dos vinculados
  inadequadoTotal: 1776,    // 23% dos vinculados
  
  // Métricas do período
  incrementoMes: 54,
  incrementoPercentual: 0.7,
  consultasMesAtual: 1843,
  
  // Alertas
  aVencer3Meses: 387,
  semAcompanhamento: 1776, // apenas inadequados (removido não vinculados)
  
  // Metas
  metaCobertura: 90,
  metaValor: 8055
};

// Sistema de filtros simplificado específico para cobertura populacional
function aplicarFiltroCobertura(dadosBase: typeof dadosBase, filtro: { tipo: string; valor: string; label: string }) {
  const dados = { ...dadosBase };
  
  // Simular correlações básicas baseadas no tipo de filtro
  switch (filtro.tipo) {
    case 'status-vinculacao':
      if (filtro.valor === 'vinculados') {
        // Focar apenas nos vinculados
        dados.naoVinculados = Math.round(dados.naoVinculados * 0.1);
        dados.semAcompanhamento = Math.round(dados.semAcompanhamento * 0.6);
        dados.consultasMesAtual = Math.round(dados.consultasMesAtual * 1.2);
      } else if (filtro.valor === 'nao-vinculados') {
        // Focar nos não vinculados
        dados.vidasVinculadas = Math.round(dados.vidasVinculadas * 0.1);
        dados.controladoTotal = 0;
        dados.controleInadequadoTotal = 0;
        dados.inadequadoTotal = Math.round(dados.naoVinculados * 0.8);
        dados.consultasMesAtual = Math.round(dados.consultasMesAtual * 0.1);
        dados.aVencer3Meses = Math.round(dados.aVencer3Meses * 0.2);
      }
      break;
      
    case 'status-acompanhamento':
      if (filtro.valor === 'controlado') {
        // Perfil de bem controlados
        dados.semAcompanhamento = Math.round(dados.semAcompanhamento * 0.3);
        dados.consultasMesAtual = Math.round(dados.consultasMesAtual * 1.3);
        dados.aVencer3Meses = Math.round(dados.aVencer3Meses * 0.5);
        dados.controleInadequadoTotal = Math.round(dados.controleInadequadoTotal * 0.2);
        dados.inadequadoTotal = Math.round(dados.inadequadoTotal * 0.1);
      } else if (filtro.valor === 'controle-inadequado') {
        // Perfil de controle inadequado
        dados.controladoTotal = Math.round(dados.controladoTotal * 0.3);
        dados.inadequadoTotal = Math.round(dados.inadequadoTotal * 0.7);
        dados.consultasMesAtual = Math.round(dados.consultasMesAtual * 0.8);
        dados.aVencer3Meses = Math.round(dados.aVencer3Meses * 1.5);
      } else if (filtro.valor === 'inadequado') {
        // Perfil inadequado
        dados.controladoTotal = Math.round(dados.controladoTotal * 0.1);
        dados.controleInadequadoTotal = Math.round(dados.controleInadequadoTotal * 0.4);
        dados.semAcompanhamento = Math.round(dados.semAcompanhamento * 1.5);
        dados.consultasMesAtual = Math.round(dados.consultasMesAtual * 0.4);
        dados.aVencer3Meses = Math.round(dados.aVencer3Meses * 2.0);
      }
      break;
      
    case 'periodo':
      // Filtros temporais afetam principalmente métricas de atividade
      const mesAtual = filtro.valor;
      if (mesAtual.includes('24')) {
        // Meses mais recentes têm mais atividade
        dados.consultasMesAtual = Math.round(dados.consultasMesAtual * 1.2);
        dados.incrementoMes = Math.round(dados.incrementoMes * 1.4);
      } else {
        // Meses mais antigos têm menos atividade
        dados.consultasMesAtual = Math.round(dados.consultasMesAtual * 0.7);
        dados.incrementoMes = Math.round(dados.incrementoMes * 0.6);
      }
      break;
      
    default:
      // Filtro genérico reduz ligeiramente todos os valores
      dados.vidasVinculadas = Math.round(dados.vidasVinculadas * 0.85);
      dados.controladoTotal = Math.round(dados.controladoTotal * 0.85);
      dados.controleInadequadoTotal = Math.round(dados.controleInadequadoTotal * 0.85);
      dados.inadequadoTotal = Math.round(dados.inadequadoTotal * 0.85);
      dados.consultasMesAtual = Math.round(dados.consultasMesAtual * 0.85);
      break;
  }
  
  // Recalcular percentuais
  dados.taxaVinculados = parseFloat(((dados.vidasVinculadas / dados.vidasElegiveis) * 100).toFixed(1));
  dados.semAcompanhamento = dados.inadequadoTotal; // apenas inadequados
  
  return dados;
}

// Dados do heatmap temporal - últimos 12 meses
const heatmapData = [
  { month: 'Jul', year: '23', controlado: 42.3 },
  { month: 'Ago', year: '23', controlado: 44.1 },
  { month: 'Set', year: '23', controlado: 41.7 },
  { month: 'Out', year: '23', controlado: 45.8 },
  { month: 'Nov', year: '23', controlado: 43.2 },
  { month: 'Dez', year: '23', controlado: 40.9 },
  { month: 'Jan', year: '24', controlado: 44.6 },
  { month: 'Fev', year: '24', controlado: 47.3 },
  { month: 'Mar', year: '24', controlado: 46.1 },
  { month: 'Abr', year: '24', controlado: 49.2 },
  { month: 'Mai', year: '24', controlado: 51.8 },
  { month: 'Jun', year: '24', controlado: 52.0 }
];

// Função para cor do heatmap
const getHeatmapColor = (valor: number) => {
  if (valor >= 70) return '#16a34a'; // Verde escuro
  if (valor >= 50) return '#22c55e'; // Verde
  if (valor >= 40) return '#84cc16'; // Verde claro
  if (valor >= 30) return '#facc15'; // Amarelo
  if (valor >= 20) return '#fb923c'; // Laranja
  return '#ef4444'; // Vermelho
};

export function CoberturaPopulacional({ filters, onNavigateToTable, localFilter, onLocalFilterChange }: CoberturaPopulacionalProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSemAcompanhamentoTooltip, setShowSemAcompanhamentoTooltip] = useState(false);
  const [showTaxaVinculadosTooltip, setShowTaxaVinculadosTooltip] = useState(false);
  const [showIncrementoTooltip, setShowIncrementoTooltip] = useState(false);
  const [showMetaTooltip, setShowMetaTooltip] = useState(false);
  const [showAVencerTooltip, setShowAVencerTooltip] = useState(false);
  const [showConsultasTooltip, setShowConsultasTooltip] = useState(false);
  const [showFunilCoberturaTooltip, setShowFunilCoberturaTooltip] = useState(false);
  const [showTaxaAcompanhamentoTooltip, setShowTaxaAcompanhamentoTooltip] = useState(false);
  const [showEvolucaoTooltip, setShowEvolucaoTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{
    tipo: string;
    valor: string;
    label: string;
  } | null>(localFilter || null);

  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosBase;
    return aplicarFiltroCobertura(dadosBase, filtroInterativo);
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
            <Users className="w-4 h-4 text-gray-600" />
            <div>
              <span>Cobertura Populacional</span>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">Elegíveis versus Vinculados</p>
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
              <div className="absolute right-0 top-8 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Sobre este indicador</div>
                <p className="mb-2">
                  A cobertura populacional mede o percentual de pessoas elegíveis que estão vinculadas e ativas no programa APS.
                </p>
                <div className="space-y-1 text-[11px]">
                  <div><span className="font-medium">Elegíveis:</span> Todos com direito ao serviço</div>
                  <div><span className="font-medium">Vinculados:</span> Já utilizaram o serviço</div>
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
        {/* KPIs Principais - 6 cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* Taxa de Vinculados */}
          <div 
            className="bg-blue-50 rounded-lg p-3 flex flex-col justify-between text-center relative min-h-[90px]"
            onMouseEnter={() => setShowTaxaVinculadosTooltip(true)}
            onMouseLeave={() => setShowTaxaVinculadosTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Taxa de Vinculados</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-blue-600">{dados.vidasVinculadas.toLocaleString()}</p>
              <p className="text-[11px] text-gray-500">{dados.taxaVinculados}%</p>
            </div>
            
            {showTaxaVinculadosTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Pacientes que tiveram atendimento com a APS nos últimos 12 meses</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          {/* Incremento do Período */}
          <div 
            className="bg-green-50 rounded-lg p-3 flex flex-col justify-between text-center relative min-h-[90px]"
            onMouseEnter={() => setShowIncrementoTooltip(true)}
            onMouseLeave={() => setShowIncrementoTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Incremento do Período</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-green-600">+{dados.incrementoMes}</p>
              <p className="text-[11px] text-gray-500">{dados.incrementoPercentual}%</p>
            </div>
            
            {showIncrementoTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Número de vidas que realizaram primeiro atendimento no período</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          {/* Meta */}
          <div 
            className="bg-green-50 rounded-lg p-3 flex flex-col justify-between text-center relative min-h-[90px]"
            onMouseEnter={() => setShowMetaTooltip(true)}
            onMouseLeave={() => setShowMetaTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Meta</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-green-600">{dados.metaValor.toLocaleString()}</p>
              <p className="text-[11px] text-gray-500">{dados.metaCobertura}%</p>
            </div>
            
            {showMetaTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Objetivo de vinculação de pacientes a realizarem atendimento com a APS</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>

          {/* Sem Acompanhamento */}
          <div 
            className="bg-red-50 rounded-lg p-3 flex flex-col justify-between text-center relative min-h-[90px]"
            onMouseEnter={() => setShowSemAcompanhamentoTooltip(true)}
            onMouseLeave={() => setShowSemAcompanhamentoTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Acompanhamento Inadequado</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-red-600">{dados.semAcompanhamento.toLocaleString()}</p>
              <p className="text-[11px] text-gray-500">{((dados.semAcompanhamento / dados.vidasElegiveis) * 100).toFixed(1)}%</p>
            </div>
            
            {showSemAcompanhamentoTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Pacientes com última consulta há mais de 12 meses</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          {/* A Vencer */}
          <div 
            className="bg-amber-50 rounded-lg p-3 flex flex-col justify-between text-center relative min-h-[90px]"
            onMouseEnter={() => setShowAVencerTooltip(true)}
            onMouseLeave={() => setShowAVencerTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Previsão Novos Inadequados</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-amber-600">{dados.aVencer3Meses.toLocaleString()}</p>
              <p className="text-[11px] text-gray-500">{((dados.aVencer3Meses / dados.vidasVinculadas) * 100).toFixed(1)}%</p>
            </div>
            
            {showAVencerTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Previsão de pacientes que passarão a ter atendimento acima de 12 meses</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
          
          {/* Consultas no Período */}
          <div 
            className="bg-purple-50 rounded-lg p-3 flex flex-col justify-between text-center relative min-h-[90px]"
            onMouseEnter={() => setShowConsultasTooltip(true)}
            onMouseLeave={() => setShowConsultasTooltip(false)}
          >
            <p className="text-xs font-medium text-gray-600">Atendimentos no Período</p>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-purple-600">{dados.consultasMesAtual.toLocaleString()}</p>
              <p className="text-[11px] text-gray-500">{((dados.consultasMesAtual / dados.vidasVinculadas) * 100).toFixed(1)}%</p>
            </div>
            
            {showConsultasTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                <div className="font-semibold mb-1">Regra de Cálculo</div>
                <p>Total de atendimentos realizados com a APS no período</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
              </div>
            )}
          </div>
        </div>

        {/* Funis lado a lado */}
        <div className="grid grid-cols-2 gap-4">
          {/* Funil de Cobertura */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => handleNavigateToTable('coverage', e)}
                >
                  Funil de Cobertura
                </h3>
              </div>
              <div 
                onMouseEnter={() => setShowFunilCoberturaTooltip(true)}
                onMouseLeave={() => setShowFunilCoberturaTooltip(false)}
                className="relative"
              >
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                
                {showFunilCoberturaTooltip && (
                  <div className="absolute right-0 top-8 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                    <div className="font-semibold mb-1">Regra de Cálculo</div>
                    <p>Funil demonstrando a progressão desde população elegível até vinculados e não vinculados ao programa de APS.</p>
                    <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Elegíveis */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Elegíveis</span>
                  <span className="text-gray-600">{dados.vidasElegiveis.toLocaleString()}</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-4">
                  <div className="h-full rounded-full bg-gray-400" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Vinculados */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Vinculados</span>
                  <span className="text-gray-600">{dados.vidasVinculadas.toLocaleString()}</span>
                </div>
                <div 
                  className="relative w-full bg-gray-200 rounded-full h-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={(e) => handleFiltroInterativo('status-vinculacao', 'vinculados', 'Status: Vinculados', e)}
                >
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
                    style={{ 
                      width: `${dados.taxaVinculados}%`,
                      opacity: filtroInterativo && filtroInterativo.tipo !== 'status-vinculacao' || (filtroInterativo?.tipo === 'status-vinculacao' && filtroInterativo?.valor !== 'vinculados') ? 0.4 : 1,
                      transform: filtroInterativo?.tipo === 'status-vinculacao' && filtroInterativo?.valor === 'vinculados' ? 'scaleY(1.2)' : 'scaleY(1)',
                    }}
                  />
                </div>
              </div>

              {/* Não vinculados */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Não vinculados</span>
                  <span className="text-gray-600">{dados.naoVinculados.toLocaleString()}</span>
                </div>
                <div 
                  className="relative w-full bg-gray-200 rounded-full h-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={(e) => handleFiltroInterativo('status-vinculacao', 'nao-vinculados', 'Status: Não Vinculados', e)}
                >
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all"
                    style={{ 
                      width: `${(dados.naoVinculados / dados.vidasElegiveis * 100).toFixed(1)}%`,
                      opacity: filtroInterativo && filtroInterativo.tipo !== 'status-vinculacao' || (filtroInterativo?.tipo === 'status-vinculacao' && filtroInterativo?.valor !== 'nao-vinculados') ? 0.4 : 1,
                      transform: filtroInterativo?.tipo === 'status-vinculacao' && filtroInterativo?.valor === 'nao-vinculados' ? 'scaleY(1.2)' : 'scaleY(1)',
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t text-xs text-gray-500 text-center">
              Taxa de vinculação: {dados.taxaVinculados}%
            </div>
          </div>

          {/* Funil de Acompanhamento */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                <h3 
                  className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => handleNavigateToTable('followup', e)}
                >
                  Taxa de Acompanhamento
                </h3>
              </div>
              <div 
                onMouseEnter={() => setShowTaxaAcompanhamentoTooltip(true)}
                onMouseLeave={() => setShowTaxaAcompanhamentoTooltip(false)}
                className="relative"
              >
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                
                {showTaxaAcompanhamentoTooltip && (
                  <div className="absolute right-0 top-8 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                    <div className="font-semibold mb-1">Regra de Cálculo</div>
                    <p>Distribuição dos pacientes vinculados conforme frequência de atendimento: adequado (até 6 meses), aceitável (6-12 meses) e inadequado (acima de 12 meses).</p>
                    <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Controlado */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Adequado (até 6 meses)</span>
                  <span className="text-gray-600">{dados.controladoTotal.toLocaleString()}</span>
                </div>
                <div 
                  className="relative w-full bg-gray-200 rounded-full h-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={(e) => handleFiltroInterativo('status-acompanhamento', 'controlado', 'Acompanhamento: Controlado', e)}
                >
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                    style={{ 
                      width: `${(dados.controladoTotal / dados.vidasVinculadas * 100).toFixed(0)}%`,
                      opacity: filtroInterativo && filtroInterativo.tipo !== 'status-acompanhamento' || (filtroInterativo?.tipo === 'status-acompanhamento' && filtroInterativo?.valor !== 'controlado') ? 0.4 : 1,
                      transform: filtroInterativo?.tipo === 'status-acompanhamento' && filtroInterativo?.valor === 'controlado' ? 'scaleY(1.2)' : 'scaleY(1)',
                    }}
                  />
                </div>
              </div>

              {/* Controle Inadequado */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium"> Aceitável (6 a 12 meses)</span>
                  <span className="text-gray-600">{dados.controleInadequadoTotal.toLocaleString()}</span>
                </div>
                <div 
                  className="relative w-full bg-gray-200 rounded-full h-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={(e) => handleFiltroInterativo('status-acompanhamento', 'controle-inadequado', 'Acompanhamento: Controle Inadequado', e)}
                >
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all"
                    style={{ 
                      width: `${(dados.controleInadequadoTotal / dados.vidasVinculadas * 100).toFixed(0)}%`,
                      opacity: filtroInterativo && filtroInterativo.tipo !== 'status-acompanhamento' || (filtroInterativo?.tipo === 'status-acompanhamento' && filtroInterativo?.valor !== 'controle-inadequado') ? 0.4 : 1,
                      transform: filtroInterativo?.tipo === 'status-acompanhamento' && filtroInterativo?.valor === 'controle-inadequado' ? 'scaleY(1.2)' : 'scaleY(1)',
                    }}
                  />
                </div>
              </div>

              {/* Inadequado */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Inadequado (acima de 12 meses)</span>
                  <span className="text-gray-600">{dados.inadequadoTotal.toLocaleString()}</span>
                </div>
                <div 
                  className="relative w-full bg-gray-200 rounded-full h-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={(e) => handleFiltroInterativo('status-acompanhamento', 'inadequado', 'Acompanhamento: Inadequado', e)}
                >
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all"
                    style={{ 
                      width: `${(dados.inadequadoTotal / dados.vidasVinculadas * 100).toFixed(0)}%`,
                      opacity: filtroInterativo && filtroInterativo.tipo !== 'status-acompanhamento' || (filtroInterativo?.tipo === 'status-acompanhamento' && filtroInterativo?.valor !== 'inadequado') ? 0.4 : 1,
                      transform: filtroInterativo?.tipo === 'status-acompanhamento' && filtroInterativo?.valor === 'inadequado' ? 'scaleY(1.2)' : 'scaleY(1)',
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t text-xs text-gray-500 text-center">
              {dados.vidasVinculadas.toLocaleString()} pacientes ativos
            </div>
          </div>
        </div>

        {/* Heatmap Temporal */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={(e) => handleNavigateToTable('evolution', e)}
            >
              Evolução da Taxa de Acompanhamento
            </h3>
            <div 
              onMouseEnter={() => setShowEvolucaoTooltip(true)}
              onMouseLeave={() => setShowEvolucaoTooltip(false)}
              className="relative"
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              
              {showEvolucaoTooltip && (
                <div className="absolute right-0 top-8 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50">
                  <div className="font-semibold mb-1">Regra de Cálculo</div>
                  <p>Taxa de pacientes com acompanhamento adequado (atendimento {'<'} 6 meses) ao longo dos últimos 12 meses.</p>
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
                    backgroundColor: getHeatmapColor(month.controlado),
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'periodo' || (filtroInterativo?.tipo === 'periodo' && filtroInterativo?.valor !== `${month.month}/${month.year}`) ? 0.6 : 1,
                    transform: filtroInterativo?.tipo === 'periodo' && filtroInterativo?.valor === `${month.month}/${month.year}` ? 'scale(1.15)' : 'scale(1)',
                    border: filtroInterativo?.tipo === 'periodo' && filtroInterativo?.valor === `${month.month}/${month.year}` ? '2px solid #1e40af' : 'none'
                  }}
                  onClick={(e) => handleFiltroInterativo('periodo', `${month.month}/${month.year}`, `Período: ${month.month}/${month.year}`, e)}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    <div className="font-semibold">{month.month}/{month.year}</div>
                    <div className="text-green-400">Controlado: {month.controlado.toFixed(1)}%</div>
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
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-gray-600">Adequado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-gray-600">Aceitável</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-gray-600">Inadequado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}