// Arquivo: components/charts/ReabilitacaoChart.tsx
// Componente: Dashboard de cobertura de Reabilitação
// Contexto: Dashboard APS - Acompanhamento de pacientes em reabilitação
// Versão: Refatorada com foco em cobertura e adesão

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, Treemap, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Heart, Info, AlertTriangle, BarChart3 } from 'lucide-react';

interface ReabilitacaoChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

// Dados comparativos anuais para Reabilitação (Top 15 fixo)
const dadosComparativosReabilitacao = [
  { mes: 'Jan', ano2023: 245, ano2024: 278 },
  { mes: 'Fev', ano2023: 232, ano2024: 265 },
  { mes: 'Mar', ano2023: 267, ano2024: 290 },
  { mes: 'Abr', ano2023: 254, ano2024: 285 },
  { mes: 'Mai', ano2023: 271, ano2024: 298 },
  { mes: 'Jun', ano2024: 305, ano2023: 280 },
  { mes: 'Jul', ano2023: 258, ano2024: null }, // Meses futuros sem dado 2024
  { mes: 'Ago', ano2023: 274, ano2024: null },
  { mes: 'Set', ano2023: 261, ano2024: null },
  { mes: 'Out', ano2023: 287, ano2024: null },
  { mes: 'Nov', ano2023: 243, ano2024: null },
  { mes: 'Dez', ano2023: 276, ano2024: null }
];

// Dados de pacientes em reabilitação - foco em cobertura/adesão
const dadosPacientesReabilitacao = [
  { prontuario: "001234", sessoesRealizadas: 18, sessoesPrescritas: 20, adesao: 90, especialidade: "Fisioterapia", status: "boa" },
  { prontuario: "005678", sessoesRealizadas: 15, sessoesPrescritas: 20, adesao: 75, especialidade: "Neurologia", status: "regular" },
  { prontuario: "009012", sessoesRealizadas: 8, sessoesPrescritas: 16, adesao: 50, especialidade: "Ortopedia", status: "baixa" },
  { prontuario: "003456", sessoesRealizadas: 19, sessoesPrescritas: 20, adesao: 95, especialidade: "Fonoaudiologia", status: "boa" },
  { prontuario: "007890", sessoesRealizadas: 12, sessoesPrescritas: 20, adesao: 60, especialidade: "Ortopedia", status: "regular" },
  { prontuario: "002345", sessoesRealizadas: 16, sessoesPrescritas: 16, adesao: 100, especialidade: "Terapia Ocupacional", status: "boa" },
  { prontuario: "006789", sessoesRealizadas: 10, sessoesPrescritas: 20, adesao: 50, especialidade: "Fonoaudiologia", status: "baixa" },
  { prontuario: "001357", sessoesRealizadas: 14, sessoesPrescritas: 16, adesao: 87, especialidade: "Psicologia", status: "boa" },
  { prontuario: "004680", sessoesRealizadas: 7, sessoesPrescritas: 12, adesao: 58, especialidade: "Nutrição", status: "regular" },
  { prontuario: "008024", sessoesRealizadas: 11, sessoesPrescritas: 20, adesao: 55, especialidade: "Fisioterapia", status: "regular" },
  { prontuario: "002468", sessoesRealizadas: 5, sessoesPrescritas: 16, adesao: 31, especialidade: "Fonoaudiologia", status: "baixa" },
  { prontuario: "005791", sessoesRealizadas: 13, sessoesPrescritas: 16, adesao: 81, especialidade: "Psicologia", status: "boa" },
  { prontuario: "009135", sessoesRealizadas: 4, sessoesPrescritas: 20, adesao: 20, especialidade: "Fisioterapia", status: "baixa" },
  { prontuario: "003579", sessoesRealizadas: 15, sessoesPrescritas: 16, adesao: 94, especialidade: "Terapia Ocupacional", status: "boa" },
  { prontuario: "007913", sessoesRealizadas: 9, sessoesPrescritas: 12, adesao: 75, especialidade: "Neurologia", status: "regular" }
];

// Cores por status de adesão
const COLORS = {
  boa: '#10b981',
  regular: '#f59e0b',
  baixa: '#ef4444'
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
            <span className="text-gray-600">Adesão:</span>
            <span className="font-bold text-lg">{data.value}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Sessões:</span>
            <span className="font-medium">{data.sessoesRealizadas}/{data.sessoesPrescritas}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Especialidade:</span>
            <span className="font-medium">{data.especialidade}</span>
          </div>
          <div className="pt-2">
            <div className={`inline-block px-3 py-1 rounded text-xs font-medium text-white ${
              data.status === 'boa' ? 'bg-green-500' : 
              data.status === 'regular' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              Adesão {data.status}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Tooltip customizado para gráfico comparativo anual Reabilitação
const CustomComparativoReabilitacaoTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xl">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3 text-sm">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-semibold">{entry.value || '--'} sessões</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Conteúdo customizado do TreeMap
const CustomContent = (props: any) => {
  const { x, y, width, height, value, status, depth } = props;
  
  if (depth < 1) {
    return null;
  }
  
  const fillColor = COLORS[status as keyof typeof COLORS] || '#94a3b8';
  
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
      {width > 40 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 4}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
          fontWeight="600"
        >
          {value}
        </text>
      )}
    </g>
  );
};

export function ReabilitacaoChart({ filters, onNavigateToTable }: ReabilitacaoChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleTitleClick = () => {
    if (onNavigateToTable) {
      onNavigateToTable('reabilitacao');
    }
  };

  // Estatísticas resumidas
  const pacientesComBoaAdesao = dadosPacientesReabilitacao.filter(p => p.status === 'boa').length;
  const pacientesComBaixaAdesao = dadosPacientesReabilitacao.filter(p => p.status === 'baixa').length;
  const mediaAdesao = (dadosPacientesReabilitacao.reduce((sum, p) => sum + p.adesao, 0) / dadosPacientesReabilitacao.length).toFixed(1);
  const totalPacientes = dadosPacientesReabilitacao.length;
  
  // Preparar dados para o TreeMap
  const dadosTreemap = dadosPacientesReabilitacao.map(p => ({
    ...p,
    value: p.adesao
  }));

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-gray-600" />
            <span 
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleTitleClick}
            >
              Cobertura Reabilitação
            </span>
          </div>
          <div
            className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            {showTooltip && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl z-50">
                <h4 className="font-semibold mb-2 text-sm">Cobertura de Reabilitação</h4>
                <div className="space-y-2">
                  <p>Acompanhamento da adesão dos pacientes às sessões de reabilitação prescritas.</p>
                  <p>A subutilização do serviço é um desafio para garantir resultados terapêuticos.</p>
                  <div className="mt-3">
                    <span className="font-medium">Indicadores monitorados:</span>
                    <ul className="ml-3 mt-1 space-y-0.5">
                      <li>• Taxa de adesão às sessões</li>
                      <li>• Sessões realizadas vs prescritas</li>
                      <li>• Distribuição por especialidade</li>
                      <li>• Evolução temporal</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 px-6">
        {/* Cards de métricas */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Adesão Média</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{mediaAdesao}%</p>
            <p className="text-[11px] text-gray-500">Meta: 80%</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Boa Adesão</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pacientesComBoaAdesao}</p>
            <p className="text-[11px] text-gray-500">{((pacientesComBoaAdesao/totalPacientes)*100).toFixed(0)}% dos pacientes</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Baixa Adesão</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{pacientesComBaixaAdesao}</p>
            <p className="text-[11px] text-gray-500">{((pacientesComBaixaAdesao/totalPacientes)*100).toFixed(0)}% dos pacientes</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Total Pacientes</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalPacientes}</p>
            <p className="text-[11px] text-gray-500">Em reabilitação</p>
          </div>
        </div>

        {/* TreeMap */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Taxa de Adesão por Paciente - Junho/24</h3>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-gray-600">Boa ({'>'} 80%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-gray-600">Regular (50-80%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-gray-600">Baixa ({'<'} 50%)</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <Treemap
              data={dadosTreemap}
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

        {/* Gráfico Comparativo Anual Reabilitação - 2023 vs 2024 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Comparativo Anual - Sessões Realizadas (12 Meses)
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dadosComparativosReabilitacao} barCategoryGap={"20%"}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomComparativoReabilitacaoTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              
              <Bar dataKey="ano2023" fill="#fca5a5" name="2023" radius={[3, 3, 0, 0]} maxBarSize={25} />
              <Bar dataKey="ano2024" fill="#ef4444" name="2024" radius={[3, 3, 0, 0]} maxBarSize={25} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Comparação do volume total de sessões de reabilitação realizadas (2024 até Junho)
          </div>
        </div>

      </CardContent>
    </Card>
  );
}