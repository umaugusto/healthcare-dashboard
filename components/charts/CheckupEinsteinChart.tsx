// Arquivo: components/charts/CheckupEinsteinChart.tsx
// Componente: Dashboard de realização do Checkup Anual
// Contexto: Dashboard APS - Acompanhamento de elegíveis que realizaram checkup
// Versão: Refatorada com gráfico de linha e comparativo anual

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { Info, CheckCircle, BarChart3 } from 'lucide-react';

interface CheckupEinsteinChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

// Dados de evolução mensal com meta e teto corrigidos - números realistas
const dadosEvolucao = [
  { mes: 'Jan', realizados: 2, meta: 40, teto: 50 },
  { mes: 'Fev', realizados: 8, meta: 40, teto: 50 },
  { mes: 'Mar', realizados: 15, meta: 40, teto: 50 },
  { mes: 'Abr', realizados: 22, meta: 40, teto: 50 },
  { mes: 'Mai', realizados: 31, meta: 40, teto: 50 },
  { mes: 'Jun', realizados: 38, projecao: 38, meta: 40, teto: 50 },
  { mes: 'Jul', projecao: 42, meta: 40, teto: 50 },
  { mes: 'Ago', projecao: 45, meta: 40, teto: 50 },
  { mes: 'Set', projecao: 47, meta: 40, teto: 50 },
  { mes: 'Out', meta: 40, teto: 50 },
  { mes: 'Nov', meta: 40, teto: 50 },
  { mes: 'Dez', meta: 40, teto: 50 }
];

// Dados comparativos 2023 vs 2024 - 12 meses completos com números realistas
const dadosComparativos = [
  { mes: 'Jan', ano2023: 8, ano2024: 2 },
  { mes: 'Fev', ano2023: 12, ano2024: 8 },
  { mes: 'Mar', ano2023: 18, ano2024: 15 },
  { mes: 'Abr', ano2023: 25, ano2024: 22 },
  { mes: 'Mai', ano2023: 28, ano2024: 31 },
  { mes: 'Jun', ano2023: 35, ano2024: 38 },
  { mes: 'Jul', ano2023: 32, ano2024: null }, // Meses futuros sem dado 2024
  { mes: 'Ago', ano2023: 38, ano2024: null },
  { mes: 'Set', ano2023: 41, ano2024: null },
  { mes: 'Out', ano2023: 43, ano2024: null },
  { mes: 'Nov', ano2023: 39, ano2024: null },
  { mes: 'Dez', ano2023: 45, ano2024: null }
];

// Dados para o heatmap de taxa de acompanhamento - só até junho
const heatmapTaxaAcompanhamento = [
  { mes: 'Jan', valor: 76 },
  { mes: 'Fev', valor: 81 },
  { mes: 'Mar', valor: 87 },
  { mes: 'Abr', valor: 82 },
  { mes: 'Mai', valor: 91 },
  { mes: 'Jun', valor: 97 },
  { mes: 'Jul', valor: null }, // Meses futuros sem valor
  { mes: 'Ago', valor: null },
  { mes: 'Set', valor: null },
  { mes: 'Out', valor: null },
  { mes: 'Nov', valor: null },
  { mes: 'Dez', valor: null }
];

// Tooltip customizado para gráfico de linha
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xl">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          let displayValue = entry.value;
          let displayName = entry.name;
          
          // Ajustar nomes e valores das linhas de referência
          if (entry.name === 'Meta (80%)') {
            displayValue = '40 (80%)';
          } else if (entry.name === 'Teto (100%)') {
            displayValue = '50 (100%)';
          }
          
          return (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span style={{ color: entry.color }}>{displayName}:</span>
              <span className="font-semibold">
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

// Tooltip customizado para gráfico de barras
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xl">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3 text-sm">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CheckupEinsteinChart({ filters, onNavigateToTable }: CheckupEinsteinChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleTitleClick = () => {
    if (onNavigateToTable) {
      onNavigateToTable('checkup-einstein');
    }
  };

  // Estatísticas ajustadas para números realistas
  const totalRealizados = 38;
  const totalElegiveis = 5820;
  const taxaCobertura = 97;
  const crescimentoMes = 15;
  const variacaoYoY = 10.2;

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gray-600" />
            <span 
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleTitleClick}
            >
              Cobertura Checkup Anual
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
                <h4 className="font-semibold mb-2 text-sm">Cobertura Checkup Anual</h4>
                <div className="space-y-2">
                  <p>Acompanhamento da realização do checkup preventivo anual pelos pacientes elegíveis.</p>
                  <p>Meta de cobertura: 80% da população elegível com checkup realizado.</p>
                  <div className="mt-3">
                    <span className="font-medium">Indicadores monitorados:</span>
                    <ul className="ml-3 mt-1 space-y-0.5">
                      <li>• Taxa de cobertura atual</li>
                      <li>• Evolução mensal</li>
                      <li>• Comparação com anos anteriores</li>
                      <li>• Agendamentos futuros</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 px-6">
        {/* Cards de métricas - ajustados para só dados */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Cobertura Atual</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{taxaCobertura}%</p>
            <p className="text-[11px] text-gray-500">{totalRealizados} realizados</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Total Elegíveis</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalElegiveis.toLocaleString('pt-BR')}</p>
            <p className="text-[11px] text-gray-500">população total</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Variação Anual</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">+{variacaoYoY}%</p>
            <p className="text-[11px] text-gray-500">vs 2023</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-gray-600">Agendados</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <p className="text-2xl font-bold text-purple-600">12</p>
            </div>
            <p className="text-[11px] text-gray-500">próx. 30 dias</p>
          </div>
        </div>

        {/* Gráfico de linha - Evolução mensal com meta, teto e projeção */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Evolução da Cobertura - 2024 (Meta: 40 | Teto: 50)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dadosEvolucao}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 55]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              
              {/* Linha de realizados */}
              <Line 
                type="monotone" 
                dataKey="realizados" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                name="Realizados"
                connectNulls={false}
              />
              
              {/* Linha de projeção - apenas 3 meses */}
              <Line 
                type="monotone" 
                dataKey="projecao" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', r: 3, stroke: '#fff', strokeWidth: 1 }}
                name="Projeção"
                connectNulls={false}
              />
              
              {/* Linha de meta em 80% - agora 400 realizados */}
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke="#fbbf24" 
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={false}
                name="Meta (80%)"
              />
              
              {/* Linha de teto - máximo 500 */}
              <Line 
                type="monotone" 
                dataKey="teto" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={false}
                name="Teto (100%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico comparativo 2023 vs 2024 - 12 meses */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Comparativo Anual - Realizados (12 Meses)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dadosComparativos} barCategoryGap={"20%"}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              
              <Bar dataKey="ano2023" fill="#93c5fd" name="2023" radius={[3, 3, 0, 0]} maxBarSize={25} />
              <Bar dataKey="ano2024" fill="#3b82f6" name="2024" radius={[3, 3, 0, 0]} maxBarSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Heatmap de Taxa de Acompanhamento */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">Taxa de Acompanhamento Mensal</h3>
          </div>
          
          <div className="mb-2 text-xs text-gray-500 text-center">
            * Dados disponíveis até Junho de 2024
          </div>
          
          <div className="grid grid-cols-12 gap-1 mb-4">
            {heatmapTaxaAcompanhamento.map((item, index) => {
              // Se não tem valor, renderiza vazio
              if (item.valor === null) {
                return (
                  <div key={index} className="relative group">
                    <div 
                      className="aspect-square rounded flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300"
                    >
                      <span className="text-[8px] text-gray-400">--</span>
                    </div>
                    <p className="text-[10px] text-center text-gray-600 mt-1">{item.mes}</p>
                  </div>
                );
              }
              
              let backgroundColor;
              if (item.valor <= 80) backgroundColor = '#dc2626';
              else if (item.valor <= 85) backgroundColor = '#ef4444';
              else if (item.valor <= 90) backgroundColor = '#f59e0b';
              else if (item.valor <= 94) backgroundColor = '#fbbf24';
              else if (item.valor <= 97) backgroundColor = '#10b981';
              else backgroundColor = '#059669';
              
              return (
                <div key={index} className="relative group">
                  <div 
                    className="aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor }}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {item.valor}
                    </span>
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      <div className="font-semibold">{item.mes}</div>
                      <div>{item.valor}% de cobertura</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-gray-600 mt-1">{item.mes}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-gray-600">Crítico (&lt;80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-gray-600">Alerta (80-90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
              <span className="text-gray-600">Bom (90-95%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-gray-600">Ótimo (&gt;95%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-dashed border-gray-300 rounded bg-gray-100"></div>
              <span className="text-gray-600">Futuro</span>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}