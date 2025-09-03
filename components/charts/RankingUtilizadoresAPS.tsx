// Arquivo: components/charts/RankingUtilizadoresAPS.tsx
// Componente: TreeMap para ranking de hiperutilizadores APS
// Contexto: Dashboard APS - Identificação de pacientes com uso excessivo da APS
// Versão: Refatorada com seleção dinâmica de quantidade de pacientes

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, Treemap, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Users, Info, AlertTriangle, ChevronDown, BarChart3 } from 'lucide-react';

interface RankingUtilizadoresAPSProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

// Função para gerar dados expandidos de hiperutilizadores APS
const gerarDadosExpandidos = (quantidade: number) => {
  const dadosBase = [
    { prontuario: "003214", value: 12, criticidade: "alta", motivoPrincipal: "Múltiplas comorbidades", ultimoAtendimento: "Hoje" },
    { prontuario: "008567", value: 11, criticidade: "alta", motivoPrincipal: "IC descompensada", ultimoAtendimento: "Ontem" },
    { prontuario: "005123", value: 10, criticidade: "media", motivoPrincipal: "DM descompensada", ultimoAtendimento: "Há 2 dias" },
    { prontuario: "001987", value: 9, criticidade: "alta", motivoPrincipal: "DPOC grave", ultimoAtendimento: "Hoje" },
    { prontuario: "004532", value: 8, criticidade: "media", motivoPrincipal: "HAS descontrolada", ultimoAtendimento: "Há 3 dias" },
    { prontuario: "009876", value: 8, criticidade: "baixa", motivoPrincipal: "Ansiedade", ultimoAtendimento: "Há 1 semana" },
    { prontuario: "002198", value: 7, criticidade: "media", motivoPrincipal: "Dor crônica", ultimoAtendimento: "Há 4 dias" },
    { prontuario: "007654", value: 6, criticidade: "baixa", motivoPrincipal: "Cefaleia recorrente", ultimoAtendimento: "Há 5 dias" },
    { prontuario: "006543", value: 6, criticidade: "alta", motivoPrincipal: "DRC estágio 4", ultimoAtendimento: "Hoje" },
    { prontuario: "004321", value: 5, criticidade: "media", motivoPrincipal: "Fibromialgia", ultimoAtendimento: "Há 2 dias" },
    { prontuario: "008765", value: 5, criticidade: "baixa", motivoPrincipal: "Sintomas gripais", ultimoAtendimento: "Há 1 semana" },
    { prontuario: "003579", value: 4, criticidade: "media", motivoPrincipal: "Artrite reumatoide", ultimoAtendimento: "Há 6 dias" },
    { prontuario: "001864", value: 4, criticidade: "baixa", motivoPrincipal: "Gastrite", ultimoAtendimento: "Há 10 dias" },
    { prontuario: "002975", value: 4, criticidade: "alta", motivoPrincipal: "Pós-operatório", ultimoAtendimento: "Ontem" },
    { prontuario: "007531", value: 3, criticidade: "media", motivoPrincipal: "Hipotireoidismo", ultimoAtendimento: "Há 3 dias" }
  ];

  // Adicionar mais pacientes conforme necessário
  const motivosPossiveis = ["HAS descontrolada", "DM descompensada", "DPOC grave", "IC descompensada", 
                           "Múltiplas comorbidades", "Ansiedade", "Depressão", "Dor crônica", 
                           "Fibromialgia", "Artrite reumatoide", "Gastrite", "Cefaleia recorrente",
                           "Asma", "Hipotireoidismo", "DRC", "Pós-operatório", "Lombalgia",
                           "Síndrome metabólica", "Obesidade mórbida", "Transtorno bipolar"];
  
  const criticidades = ["alta", "media", "baixa"];
  const ultimosAtendimentos = ["Hoje", "Ontem", "Há 2 dias", "Há 3 dias", "Há 4 dias", 
                               "Há 5 dias", "Há 1 semana", "Há 10 dias", "Há 2 semanas"];
  
  let dadosCompletos = [...dadosBase];
  
  // Gerar dados adicionais até atingir a quantidade desejada
  for (let i = dadosCompletos.length; i < quantidade; i++) {
    const value = Math.max(2, Math.floor(Math.random() * 3) + 2); // Entre 2 e 4 consultas
    dadosCompletos.push({
      prontuario: String(100000 + Math.floor(Math.random() * 900000)).padStart(6, '0'),
      value: value,
      criticidade: criticidades[Math.floor(Math.random() * criticidades.length)],
      motivoPrincipal: motivosPossiveis[Math.floor(Math.random() * motivosPossiveis.length)],
      ultimoAtendimento: ultimosAtendimentos[Math.floor(Math.random() * ultimosAtendimentos.length)]
    });
  }
  
  return dadosCompletos.slice(0, quantidade);
};

// Gerar dados de volume dos últimos 12 meses baseado no filtro ativo (APS)
const gerarDadosVolumeAPS12Meses = (quantidadeSelecionada: number) => {
  const mesesBase = [
    'Ago/23', 'Set/23', 'Out/23', 'Nov/23', 'Dez/23', 'Jan/24',
    'Fev/24', 'Mar/24', 'Abr/24', 'Mai/24', 'Jun/24', 'Jul/24'
  ];
  
  // Volume médio por Top X APS (consultas presenciais = menor volume que PA Virtual)
  const volumeBase = {
    20: { base: 95, variacao: 20 },
    40: { base: 170, variacao: 30 },
    60: { base: 240, variacao: 40 },
    80: { base: 310, variacao: 50 },
    100: { base: 380, variacao: 60 }
  };
  
  const config = volumeBase[quantidadeSelecionada as keyof typeof volumeBase] || volumeBase[20];
  
  return mesesBase.map((mes, index) => {
    const tendencia = 1 + (index * 0.02); // 2% crescimento por mês (menor que PA Virtual)
    const variacao = 0.88 + (Math.random() * 0.24); // Variação ±12%
    const volume = Math.round(config.base * tendencia * variacao);
    
    return {
      mes,
      volume,
      topX: `Top ${quantidadeSelecionada}`
    };
  });
};

// Gerar dados comparativos ano atual vs ano passado para Top X APS
const gerarDadosComparativosAPSAnuais = (quantidadeSelecionada: number) => {
  const mesesBase = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  
  // Base para Top X APS - valores médios por mês para comparação anual
  const volumeBase = {
    20: { base2023: 85, base2024: 98, variacao: 18 },
    40: { base2023: 155, base2024: 175, variacao: 25 },
    60: { base2023: 220, base2024: 245, variacao: 35 },
    80: { base2023: 285, base2024: 315, variacao: 45 },
    100: { base2023: 350, base2024: 385, variacao: 55 }
  };
  
  const config = volumeBase[quantidadeSelecionada as keyof typeof volumeBase] || volumeBase[20];
  
  return mesesBase.map((mes, index) => {
    // 2023: dados completos
    const variacao2023 = 0.88 + (Math.random() * 0.24);
    const sazonalidade2023 = 1 + (Math.sin((index * Math.PI) / 6) * 0.10); // Variação sazonal menor que PA Virtual
    const volume2023 = Math.round(config.base2023 * variacao2023 * sazonalidade2023);
    
    // 2024: apenas até julho (mes index 6)
    let volume2024 = null;
    if (index <= 6) { // Jan até Jul
      const variacao2024 = 0.90 + (Math.random() * 0.20);
      const sazonalidade2024 = 1 + (Math.sin((index * Math.PI) / 6) * 0.08);
      volume2024 = Math.round(config.base2024 * variacao2024 * sazonalidade2024);
    }
    
    return {
      mes,
      ano2023: volume2023,
      ano2024: volume2024
    };
  });
};

// Tooltip customizado para gráfico de volume APS
const CustomVolumeAPSTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xl">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span style={{ color: payload[0].color }}>{payload[0].payload.topX} Hiperutilizadores:</span>
          <span className="font-semibold">{payload[0].value} consultas</span>
        </div>
      </div>
    );
  }
  return null;
};

// Tooltip customizado para gráfico comparativo anual APS
const CustomComparativoAPSTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xl">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3 text-sm">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-semibold">{entry.value || '--'} consultas</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Função para calcular top motivos baseado nos dados selecionados
const calcularTopMotivos = (dados: any[]) => {
  const contagem: { [key: string]: number } = {};
  
  // Agrupar motivos similares
  const grupoMotivos: { [key: string]: string } = {
    'HAS descontrolada': 'Doenças crônicas descompensadas',
    'DM descompensada': 'Doenças crônicas descompensadas',
    'DPOC grave': 'Doenças crônicas descompensadas',
    'IC descompensada': 'Doenças crônicas descompensadas',
    'DRC estágio 4': 'Doenças crônicas descompensadas',
    'DRC': 'Doenças crônicas descompensadas',
    'Asma': 'Doenças crônicas descompensadas',
    'Múltiplas comorbidades': 'Múltiplas comorbidades',
    'Síndrome metabólica': 'Múltiplas comorbidades',
    'Obesidade mórbida': 'Múltiplas comorbidades',
    'Ansiedade': 'Transtornos de ansiedade/depressão',
    'Depressão': 'Transtornos de ansiedade/depressão',
    'Transtorno bipolar': 'Transtornos de ansiedade/depressão',
    'Dor crônica': 'Dor crônica não controlada',
    'Fibromialgia': 'Dor crônica não controlada',
    'Lombalgia': 'Dor crônica não controlada',
    'Artrite reumatoide': 'Dor crônica não controlada',
    'Pós-operatório': 'Pós-operatório/Reabilitação'
  };
  
  dados.forEach(paciente => {
    const grupo = grupoMotivos[paciente.motivoPrincipal] || paciente.motivoPrincipal;
    if (contagem[grupo]) {
      contagem[grupo] += paciente.value;
    } else {
      contagem[grupo] = paciente.value;
    }
  });
  
  const motivosOrdenados = Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const total = motivosOrdenados.reduce((sum, [_, qtd]) => sum + qtd, 0);
  
  const cores = ['#ef4444', '#fb923c', '#facc15', '#60a5fa', '#10b981'];
  
  return motivosOrdenados.map(([motivo, qtd], index) => ({
    motivo: motivo,
    qtd: qtd,
    percentual: Math.round((qtd / total) * 100),
    cor: cores[index]
  }));
};

// Cores por criticidade
const COLORS = {
  alta: '#ef4444',
  media: '#f59e0b',
  baixa: '#10b981'
};

// Tooltip customizado
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xl max-w-sm">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Prontuário:</span>
            <span className="font-medium">{data.prontuario}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Consultas no mês:</span>
            <span className="font-bold text-lg">{data.value}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Motivo principal:</span>
            <span className="font-medium">{data.motivoPrincipal}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Último atendimento:</span>
            <span className="font-medium">{data.ultimoAtendimento}</span>
          </div>
          <div className="pt-2">
            <div className={`inline-block px-3 py-1 rounded text-xs font-medium text-white ${
              data.criticidade === 'alta' ? 'bg-red-500' : 
              data.criticidade === 'media' ? 'bg-yellow-500' : 'bg-green-500'
            }`}>
              Criticidade {data.criticidade}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Conteúdo customizado do TreeMap
const CustomContent = (props: any) => {
  const { x, y, width, height, value, criticidade, depth } = props;
  
  if (depth < 1) {
    return null;
  }
  
  const fillColor = COLORS[criticidade as keyof typeof COLORS] || '#94a3b8';
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: fillColor,
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
          cursor: 'pointer'
        }}
      />
      {width > 30 && height > 25 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 4}
          textAnchor="middle"
          fill="#fff"
          fontSize={width > 50 ? 14 : 11}
          fontWeight="600"
        >
          {value}
        </text>
      )}
    </g>
  );
};

export function RankingUtilizadoresAPS({ filters, onNavigateToTable }: RankingUtilizadoresAPSProps) {
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(20);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const opcoesQuantidade = [
    { valor: 20, label: 'Top 20' },
    { valor: 40, label: 'Top 40' },
    { valor: 60, label: 'Top 60' },
    { valor: 80, label: 'Top 80' },
    { valor: 100, label: 'Top 100' }
  ];
  
  // Gerar dados de volume dos últimos 12 meses
  const dadosVolumeAPS12Meses = useMemo(() => 
    gerarDadosVolumeAPS12Meses(quantidadeSelecionada), 
    [quantidadeSelecionada]
  );
  
  // Gerar dados comparativos anuais APS
  const dadosComparativosAPSAnuais = useMemo(() => 
    gerarDadosComparativosAPSAnuais(quantidadeSelecionada), 
    [quantidadeSelecionada]
  );
  
  // Gerar dados baseados na quantidade selecionada
  const dadosUtilizadores = useMemo(() => 
    gerarDadosExpandidos(quantidadeSelecionada), 
    [quantidadeSelecionada]
  );
  
  // Calcular estatísticas
  const estatisticas = useMemo(() => {
    const totalConsultas = dadosUtilizadores.reduce((sum, user) => sum + user.value, 0);
    const mediaConsultas = totalConsultas / dadosUtilizadores.length;
    
    // Calcular mediana
    const valoresOrdenados = [...dadosUtilizadores].map(u => u.value).sort((a, b) => a - b);
    const meio = Math.floor(valoresOrdenados.length / 2);
    const mediana = valoresOrdenados.length % 2 === 0 
      ? (valoresOrdenados[meio - 1] + valoresOrdenados[meio]) / 2 
      : valoresOrdenados[meio];
    
    // Média geral de todos os pacientes APS (não apenas hiperutilizadores)
    const mediaGeral = 2.8;
    
    // Condições sensíveis à APS
    const condicoesSensiveisAPS = ['HAS descontrolada', 'DM descompensada', 'DPOC grave', 
                                   'IC descompensada', 'Asma', 'DRC', 'DRC estágio 4',
                                   'Hipotireoidismo', 'Síndrome metabólica'];
    const pacientesCondicoesSensiveis = dadosUtilizadores.filter(p => 
      condicoesSensiveisAPS.some(condicao => p.motivoPrincipal.includes(condicao.split(' ')[0]))
    ).length;
    const taxaSensivelAPS = (pacientesCondicoesSensiveis / dadosUtilizadores.length * 100);
    
    // Saúde Mental
    const condicoesSaudeMental = ['Ansiedade', 'Depressão', 'Transtorno bipolar'];
    const pacientesSaudeMental = dadosUtilizadores.filter(p => 
      condicoesSaudeMental.includes(p.motivoPrincipal)
    ).length;
    const percentualSaudeMental = (pacientesSaudeMental / dadosUtilizadores.length * 100);
    
    return {
      totalConsultas,
      mediaConsultas,
      mediana,
      mediaGeral,
      variacaoMedia: mediaConsultas - mediaGeral,
      variacaoMediana: mediana - mediaGeral,
      pacientesCondicoesSensiveis,
      taxaSensivelAPS,
      pacientesSaudeMental,
      percentualSaudeMental,
      percentualDoTotal: ((dadosUtilizadores.length / 5500) * 100).toFixed(1) // 5500 é o total de pacientes vinculados
    };
  }, [dadosUtilizadores]);
  
  // Calcular top 5 motivos baseado nos dados selecionados
  const topMotivos = useMemo(() => 
    calcularTopMotivos(dadosUtilizadores), 
    [dadosUtilizadores]
  );

  const handleTitleClick = () => {
    if (onNavigateToTable) {
      onNavigateToTable('aps-hyperutilization');
    }
  };
  
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownAberto(!dropdownAberto);
  };
  
  const handleSelecaoQuantidade = (valor: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantidadeSelecionada(valor);
    setDropdownAberto(false);
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span 
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleTitleClick}
            >
              Ranking Utilizadores APS
            </span>
          </div>
          
          {/* Ícone informativo com tooltip e dropdown */}
          <div className="flex items-center gap-2">
            <div
              className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              {showTooltip && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl z-50">
                  <h4 className="font-semibold mb-2 text-sm">Ranking de Utilizadores APS</h4>
                  <div className="space-y-2">
                    <p>Análise dos pacientes com maior frequência de consultas presenciais na APS.</p>
                    <p>Permite identificar oportunidades de coordenação do cuidado e gestão de casos complexos.</p>
                    <div className="mt-3">
                      <span className="font-medium">Indicadores analisados:</span>
                      <ul className="ml-3 mt-1 space-y-0.5">
                        <li>• Número de consultas no mês</li>
                        <li>• Condições sensíveis à APS</li>
                        <li>• Comorbidades associadas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Dropdown de seleção de quantidade */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleDropdownClick}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>Top {quantidadeSelecionada}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownAberto ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownAberto && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {opcoesQuantidade.map((opcao) => (
                  <button
                    key={opcao.valor}
                    onClick={(e) => handleSelecaoQuantidade(opcao.valor, e)}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                      quantidadeSelecionada === opcao.valor ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    } ${opcao.valor === 20 ? 'rounded-t-lg' : ''} ${opcao.valor === 100 ? 'rounded-b-lg' : ''}`}
                  >
                    {opcao.label}
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 px-6">
        {/* Cards de métricas atualizados */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Total Consultas</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{estatisticas.totalConsultas}</p>
            <p className="text-[11px] text-gray-500">Top {quantidadeSelecionada} = {estatisticas.percentualDoTotal}%</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Média | Mediana</p>
            <p className="text-xl font-bold text-amber-600 mt-1">
              {estatisticas.mediaConsultas.toFixed(1)} | {estatisticas.mediana.toFixed(1)}
            </p>
            <p className="text-[11px] text-gray-500">
              {estatisticas.variacaoMedia > 0 ? '+' : ''}{estatisticas.variacaoMedia.toFixed(1)} | {estatisticas.variacaoMediana > 0 ? '+' : ''}{estatisticas.variacaoMediana.toFixed(1)}
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Saúde Mental</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{estatisticas.percentualSaudeMental.toFixed(0)}%</p>
            <p className="text-[11px] text-gray-500">{estatisticas.pacientesSaudeMental} pacientes</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Taxa Sensível APS</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{estatisticas.taxaSensivelAPS.toFixed(0)}%</p>
            <p className="text-[11px] text-gray-500">{estatisticas.pacientesCondicoesSensiveis} pacientes</p>
          </div>
        </div>

        {/* TreeMap */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Top {quantidadeSelecionada} Hiperutilizadores APS - Junho/24
            </h3>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-gray-600">Alta</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-gray-600">Média</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-gray-600">Baixa</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <Treemap
              data={dadosUtilizadores}
              dataKey="value"
              aspectRatio={4/3}
              stroke="#fff"
              fill="#8884d8"
              content={<CustomContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Volume dos Últimos 12 Meses APS - Responde ao filtro Top X */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Volume APS - Top {quantidadeSelecionada} (Últimos 12 Meses)
            </h3>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dadosVolumeAPS12Meses} barCategoryGap={"15%"}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 10 }} 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomVolumeAPSTooltip />} />
              
              <Bar 
                dataKey="volume" 
                fill="#10b981" 
                name={`Top ${quantidadeSelecionada}`} 
                radius={[2, 2, 0, 0]} 
                maxBarSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Volume total de consultas APS dos {quantidadeSelecionada} maiores utilizadores por mês
          </div>
        </div>

        {/* Gráfico Comparativo Anual APS - Top X: 2023 vs 2024 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Comparativo Anual - Top {quantidadeSelecionada} Hiperutilizadores APS (12 Meses)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dadosComparativosAPSAnuais} barCategoryGap={"20%"}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomComparativoAPSTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              
              <Bar dataKey="ano2023" fill="#86efac" name="2023" radius={[3, 3, 0, 0]} maxBarSize={25} />
              <Bar dataKey="ano2024" fill="#10b981" name="2024" radius={[3, 3, 0, 0]} maxBarSize={25} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Comparação do volume de consultas APS - Top {quantidadeSelecionada} por mês (2024 até Julho)
          </div>
        </div>

        {/* Top 5 motivos - Dinâmico baseado na seleção */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Top 5 Motivos de Hiperutilização (Top {quantidadeSelecionada})
          </h3>
          <div className="space-y-2">
            {topMotivos.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.motivo}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">{item.qtd}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentual}%`, backgroundColor: item.cor }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-10 text-right">{item.percentual}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}