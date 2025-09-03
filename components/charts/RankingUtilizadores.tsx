// Arquivo: components/charts/RankingUtilizadores.tsx
// Componente: TreeMap para ranking de hiperutilizadores PA Virtual
// Contexto: Dashboard APS - Identificação de pacientes com uso excessivo do PA Virtual
// Versão: Refatorada com seleção dinâmica de quantidade de pacientes

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, Treemap, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Phone, Info, AlertTriangle, ChevronDown, BarChart3 } from 'lucide-react';

interface RankingUtilizadoresProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

// Função para gerar dados expandidos de hiperutilizadores
const gerarDadosExpandidos = (quantidade: number) => {
  const dadosBase = [
    { prontuario: "002134", value: 18, criticidade: "alta", motivoPrincipal: "Ansiedade", ultimoAtendimento: "Hoje" },
    { prontuario: "007856", value: 15, criticidade: "alta", motivoPrincipal: "Dor crônica", ultimoAtendimento: "Ontem" },
    { prontuario: "004512", value: 14, criticidade: "media", motivoPrincipal: "Hipertensão", ultimoAtendimento: "Há 2 dias" },
    { prontuario: "009876", value: 12, criticidade: "alta", motivoPrincipal: "Depressão", ultimoAtendimento: "Hoje" },
    { prontuario: "003421", value: 11, criticidade: "media", motivoPrincipal: "Diabetes", ultimoAtendimento: "Há 3 dias" },
    { prontuario: "008765", value: 10, criticidade: "baixa", motivoPrincipal: "Tosse", ultimoAtendimento: "Há 1 semana" },
    { prontuario: "001987", value: 9, criticidade: "media", motivoPrincipal: "Lombalgia", ultimoAtendimento: "Há 4 dias" },
    { prontuario: "006543", value: 8, criticidade: "baixa", motivoPrincipal: "Cefaleia", ultimoAtendimento: "Há 5 dias" },
    { prontuario: "005432", value: 8, criticidade: "alta", motivoPrincipal: "Síndrome pânico", ultimoAtendimento: "Hoje" },
    { prontuario: "003210", value: 7, criticidade: "media", motivoPrincipal: "DPOC", ultimoAtendimento: "Há 2 dias" },
    { prontuario: "007654", value: 6, criticidade: "baixa", motivoPrincipal: "Alergia", ultimoAtendimento: "Há 1 semana" },
    { prontuario: "002468", value: 6, criticidade: "media", motivoPrincipal: "Asma", ultimoAtendimento: "Há 6 dias" },
    { prontuario: "009753", value: 5, criticidade: "baixa", motivoPrincipal: "Refluxo", ultimoAtendimento: "Há 10 dias" },
    { prontuario: "001864", value: 5, criticidade: "alta", motivoPrincipal: "Fibromialgia", ultimoAtendimento: "Ontem" },
    { prontuario: "006420", value: 4, criticidade: "media", motivoPrincipal: "Insônia", ultimoAtendimento: "Há 3 dias" }
  ];

  // Adicionar mais pacientes conforme necessário
  const motivosPossiveis = ["Ansiedade", "Dor crônica", "Hipertensão", "Depressão", "Diabetes", 
                           "Tosse", "Lombalgia", "Cefaleia", "Síndrome pânico", "DPOC", 
                           "Asma", "Alergia", "Refluxo", "Fibromialgia", "Insônia",
                           "Gastrite", "Enxaqueca", "Artrite", "Sinusite", "Dermatite"];
  
  const criticidades = ["alta", "media", "baixa"];
  const ultimosAtendimentos = ["Hoje", "Ontem", "Há 2 dias", "Há 3 dias", "Há 4 dias", 
                               "Há 5 dias", "Há 1 semana", "Há 10 dias", "Há 2 semanas"];
  
  let dadosCompletos = [...dadosBase];
  
  // Gerar dados adicionais até atingir a quantidade desejada
  for (let i = dadosCompletos.length; i < quantidade; i++) {
    const value = Math.max(2, Math.floor(Math.random() * 4) + 2); // Entre 2 e 5 atendimentos
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

// Gerar dados de volume dos últimos 12 meses baseado no filtro ativo
const gerarDadosVolume12Meses = (quantidadeSelecionada: number) => {
  // Base: volume total PA Virtual dos Top X nos últimos 12 meses
  const mesesBase = [
    'Ago/23', 'Set/23', 'Out/23', 'Nov/23', 'Dez/23', 'Jan/24',
    'Fev/24', 'Mar/24', 'Abr/24', 'Mai/24', 'Jun/24', 'Jul/24'
  ];
  
  // Volume médio por Top X (maior uso = maior volume)
  const volumeBase = {
    20: { base: 180, variacao: 40 },
    40: { base: 320, variacao: 60 },
    60: { base: 450, variacao: 80 },
    80: { base: 580, variacao: 100 },
    100: { base: 720, variacao: 120 }
  };
  
  const config = volumeBase[quantidadeSelecionada as keyof typeof volumeBase] || volumeBase[20];
  
  return mesesBase.map((mes, index) => {
    // Simular crescimento ao longo do tempo + variação mensal
    const tendencia = 1 + (index * 0.03); // 3% crescimento por mês
    const variacao = 0.85 + (Math.random() * 0.3); // Variação ±15%
    const volume = Math.round(config.base * tendencia * variacao);
    
    return {
      mes,
      volume,
      topX: `Top ${quantidadeSelecionada}`
    };
  });
};

// Gerar dados comparativos ano atual vs ano passado para Top X
const gerarDadosComparativosAnuais = (quantidadeSelecionada: number) => {
  const mesesBase = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  
  // Base para Top X - valores médios por mês para comparação anual
  const volumeBase = {
    20: { base2023: 160, base2024: 185, variacao: 25 },
    40: { base2023: 290, base2024: 335, variacao: 35 },
    60: { base2023: 420, base2024: 470, variacao: 45 },
    80: { base2023: 540, base2024: 595, variacao: 55 },
    100: { base2023: 670, base2024: 725, variacao: 65 }
  };
  
  const config = volumeBase[quantidadeSelecionada as keyof typeof volumeBase] || volumeBase[20];
  
  return mesesBase.map((mes, index) => {
    // 2023: dados completos
    const variacao2023 = 0.85 + (Math.random() * 0.3);
    const sazonalidade2023 = 1 + (Math.sin((index * Math.PI) / 6) * 0.15); // Variação sazonal
    const volume2023 = Math.round(config.base2023 * variacao2023 * sazonalidade2023);
    
    // 2024: apenas até julho (mes index 6)
    let volume2024 = null;
    if (index <= 6) { // Jan até Jul
      const variacao2024 = 0.88 + (Math.random() * 0.24);
      const sazonalidade2024 = 1 + (Math.sin((index * Math.PI) / 6) * 0.12);
      volume2024 = Math.round(config.base2024 * variacao2024 * sazonalidade2024);
    }
    
    return {
      mes,
      ano2023: volume2023,
      ano2024: volume2024
    };
  });
};

// Tooltip customizado para gráfico de volume
const CustomVolumeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xl">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span style={{ color: payload[0].color }}>{payload[0].payload.topX} Hiperutilizadores:</span>
          <span className="font-semibold">{payload[0].value} atendimentos</span>
        </div>
      </div>
    );
  }
  return null;
};

// Tooltip customizado para gráfico comparativo anual
const CustomComparativoTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xl">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3 text-sm">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-semibold">{entry.value || '--'} atendimentos</span>
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
  
  dados.forEach(paciente => {
    if (contagem[paciente.motivoPrincipal]) {
      contagem[paciente.motivoPrincipal] += paciente.value;
    } else {
      contagem[paciente.motivoPrincipal] = paciente.value;
    }
  });
  
  const motivosOrdenados = Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const total = motivosOrdenados.reduce((sum, [_, qtd]) => sum + qtd, 0);
  
  const cores = ['#ef4444', '#fb923c', '#facc15', '#60a5fa', '#a855f7'];
  
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
            <span className="text-gray-600">Atendimentos no mês:</span>
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

export function RankingUtilizadores({ filters, onNavigateToTable }: RankingUtilizadoresProps) {
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
  const dadosVolume12Meses = useMemo(() => 
    gerarDadosVolume12Meses(quantidadeSelecionada), 
    [quantidadeSelecionada]
  );
  
  // Gerar dados comparativos anuais
  const dadosComparativosAnuais = useMemo(() => 
    gerarDadosComparativosAnuais(quantidadeSelecionada), 
    [quantidadeSelecionada]
  );
  
  // Gerar dados baseados na quantidade selecionada
  const dadosUtilizadores = useMemo(() => 
    gerarDadosExpandidos(quantidadeSelecionada), 
    [quantidadeSelecionada]
  );
  
  // Calcular estatísticas
  const estatisticas = useMemo(() => {
    const totalAtendimentos = dadosUtilizadores.reduce((sum, user) => sum + user.value, 0);
    const pacientesAltoRisco = dadosUtilizadores.filter(u => u.criticidade === 'alta').length;
    const mediaAtendimentos = totalAtendimentos / dadosUtilizadores.length;
    
    // Calcular mediana
    const valoresOrdenados = [...dadosUtilizadores].map(u => u.value).sort((a, b) => a - b);
    const meio = Math.floor(valoresOrdenados.length / 2);
    const mediana = valoresOrdenados.length % 2 === 0 
      ? (valoresOrdenados[meio - 1] + valoresOrdenados[meio]) / 2 
      : valoresOrdenados[meio];
    
    // Média geral de todos os pacientes PA Virtual (não apenas hiperutilizadores)
    const mediaGeral = 3.2;
    
    // Taxa de encaminhamento para PS dos hiperutilizadores
    const taxaEncaminhamentoPS = 22.4; // % dos hiperutilizadores que foram encaminhados ao PS
    const qtdEncaminhados = Math.round(dadosUtilizadores.length * taxaEncaminhamentoPS / 100);
    
    // Calcular pacientes com condições sensíveis à APS
    const condicoesSensiveisAPS = ['Hipertensão', 'Diabetes', 'DPOC', 'Asma', 'Insônia', 'Gastrite', 'Artrite'];
    const pacientesCondicoesSensiveis = dadosUtilizadores.filter(p => 
      condicoesSensiveisAPS.includes(p.motivoPrincipal)
    ).length;
    const percentualCondicoesSensiveis = (pacientesCondicoesSensiveis / dadosUtilizadores.length * 100);
    
    return {
      totalAtendimentos,
      pacientesAltoRisco,
      mediaAtendimentos,
      mediana,
      mediaGeral,
      variacaoMedia: mediaAtendimentos - mediaGeral,
      variacaoMediana: mediana - mediaGeral,
      taxaEncaminhamentoPS,
      qtdEncaminhados,
      pacientesCondicoesSensiveis,
      percentualCondicoesSensiveis,
      percentualDoTotal: ((dadosUtilizadores.length / 2487) * 100).toFixed(1) // 2487 é o total de pacientes únicos PA Virtual
    };
  }, [dadosUtilizadores]);
  
  // Calcular top 5 motivos baseado nos dados selecionados
  const topMotivos = useMemo(() => 
    calcularTopMotivos(dadosUtilizadores), 
    [dadosUtilizadores]
  );

  const handleTitleClick = () => {
    if (onNavigateToTable) {
      onNavigateToTable('pa-hyperutilization');
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
            <Phone className="w-4 h-4 text-gray-600" />
            <span 
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleTitleClick}
            >
              Ranking Utilizadores PA Virtual
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
                  <h4 className="font-semibold mb-2 text-sm">Ranking de Utilizadores PA Virtual</h4>
                  <div className="space-y-2">
                    <p>Análise dos pacientes com maior frequência de uso do PA Virtual no período.</p>
                    <p>Identifica padrões de utilização e oportunidades de otimização do serviço.</p>
                    <div className="mt-3">
                      <span className="font-medium">Critérios de ordenação:</span>
                      <ul className="ml-3 mt-1 space-y-0.5">
                        <li>• Número de atendimentos no mês</li>
                        <li>• Criticidade do caso</li>
                        <li>• Motivo principal de consulta</li>
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
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Total Atendimentos</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{estatisticas.totalAtendimentos}</p>
            <p className="text-[11px] text-gray-500">Top {quantidadeSelecionada} = {estatisticas.percentualDoTotal}%</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Média | Mediana</p>
            <p className="text-xl font-bold text-amber-600 mt-1">
              {estatisticas.mediaAtendimentos.toFixed(1)} | {estatisticas.mediana.toFixed(1)}
            </p>
            <p className="text-[11px] text-gray-500">
              {estatisticas.variacaoMedia > 0 ? '+' : ''}{estatisticas.variacaoMedia.toFixed(1)} | {estatisticas.variacaoMediana > 0 ? '+' : ''}{estatisticas.variacaoMediana.toFixed(1)}
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Condições Sensíveis APS</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{estatisticas.percentualCondicoesSensiveis.toFixed(1)}%</p>
            <p className="text-[11px] text-gray-500">{estatisticas.pacientesCondicoesSensiveis} pacientes</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Taxa Enc. PS</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{estatisticas.taxaEncaminhamentoPS}%</p>
            <p className="text-[11px] text-gray-500">{estatisticas.qtdEncaminhados} pacientes</p>
          </div>
        </div>

        {/* TreeMap */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Top {quantidadeSelecionada} Hiperutilizadores PA Virtual - Junho/24
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

        {/* Gráfico de Volume dos Últimos 12 Meses - Responde ao filtro Top X */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Volume PA Virtual - Top {quantidadeSelecionada} (Últimos 12 Meses)
            </h3>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dadosVolume12Meses} barCategoryGap={"15%"}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 10 }} 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomVolumeTooltip />} />
              
              <Bar 
                dataKey="volume" 
                fill="#3b82f6" 
                name={`Top ${quantidadeSelecionada}`} 
                radius={[2, 2, 0, 0]} 
                maxBarSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Volume total de atendimentos PA Virtual dos {quantidadeSelecionada} maiores utilizadores por mês
          </div>
        </div>

        {/* Gráfico Comparativo Anual - Top X: 2023 vs 2024 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Comparativo Anual - Top {quantidadeSelecionada} Hiperutilizadores (12 Meses)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dadosComparativosAnuais} barCategoryGap={"20%"}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomComparativoTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              
              <Bar dataKey="ano2023" fill="#93c5fd" name="2023" radius={[3, 3, 0, 0]} maxBarSize={25} />
              <Bar dataKey="ano2024" fill="#3b82f6" name="2024" radius={[3, 3, 0, 0]} maxBarSize={25} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Comparação do volume de atendimentos PA Virtual - Top {quantidadeSelecionada} por mês (2024 até Julho)
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