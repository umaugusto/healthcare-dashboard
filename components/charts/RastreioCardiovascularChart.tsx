"use client";
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEpidemiologicalData } from '@/hooks/useEpidemiologicalData';
import { Filters } from '@/types';
import { CORRELACAO_EPIDEMIOLOGICA_HIPERTENSAO } from '@/data/correlations';

// Componente de Tooltip customizado para exibir mais detalhes
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-md">
        <p className="font-bold text-gray-800">{label}</p>
        <p className="text-sm text-gray-600">Elegíveis: {data.elegiveis.toLocaleString('pt-BR')}</p>
        <p className="text-sm text-gray-600">Realizados: {data.realizados.toLocaleString('pt-BR')}</p>
        <p className="text-sm text-green-600">Índice: {(data.indice * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

// Props do componente principal
interface RastreioCardiovascularChartProps {
  filters: Filters;
}

export function RastreioCardiovascularChart({ filters }: RastreioCardiovascularChartProps) {
  // Estado para controlar a métrica ativa ('elegiveis', 'realizados', ou 'indice')
  const [activeMetric, setActiveMetric] = useState<'elegiveis' | 'realizados' | 'indice'>('indice');
  
  // Estado para a correlação ativa, que pode ser clicada no gráfico
  const [activeCorrelation, setActiveCorrelation] = useState<string | null>(null);

  // Busca os dados usando o hook da Versão D
  const { data, loading } = useEpidemiologicalData('cardiovascular', null);

  // Função para lidar com o clique em uma barra do gráfico
  const handleBarClick = (data: any) => {
    if (data && data.name) {
      // Alterna a seleção da correlação
      setActiveCorrelation(prev => (prev === data.name ? null : data.name));
    }
  };

  // Memoiza os dados da correlação para evitar recálculos
  const correlationData = useMemo(() => {
    if (!activeCorrelation) return null;
    return CORRELACAO_EPIDEMIOLOGICA_HIPERTENSAO;
  }, [activeCorrelation]);

  // Formata os dados para o gráfico, garantindo que sejam números
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      elegiveis: Number(item.elegiveis) || 0,
      realizados: Number(item.realizados) || 0,
      indice: Number(item.indice) || 0,
    }));
  }, [data]);


  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Rastreio Cardiovascular</CardTitle>
            <CardDescription>Análise de elegíveis, realizados e índice.</CardDescription>
          </div>
          {/* Botões para trocar a métrica visualizada */}
          <div className="flex space-x-2">
            <Button
              variant={activeMetric === 'elegiveis' ? 'default' : 'outline'}
              onClick={() => setActiveMetric('elegiveis')}
            >
              Elegíveis
            </Button>
            <Button
              variant={activeMetric === 'realizados' ? 'default' : 'outline'}
              onClick={() => setActiveMetric('realizados')}
            >
              Realizados
            </Button>
            <Button
              variant={activeMetric === 'indice' ? 'default' : 'outline'}
              onClick={() => setActiveMetric('indice')}
            >
              Índice
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Área do Gráfico */}
          <div className="md:col-span-2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(value) =>
                    activeMetric === 'indice'
                      ? `${(value * 100).toFixed(0)}%`
                      : new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value)
                  }
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240, 240, 240, 0.5)' }} />
                <Bar dataKey={activeMetric} onClick={handleBarClick} radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === activeCorrelation ? '#16a34a' : '#3b82f6'} 
                      className="transition-all duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Painel de Correlação */}
          <div className="md:col-span-1 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Correlações</h3>
            {activeCorrelation && correlationData ? (
              <div>
                <h4 className="font-medium text-md text-blue-600 mb-2">{activeCorrelation}</h4>
                <ul className="space-y-1">
                  {Object.entries(correlationData).map(([key, value]) => (
                    <li key={key} className="text-sm text-gray-700 flex justify-between">
                      <span>{key.replace(/_/g, ' ')}:</span>
                      <span className="font-bold">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Clique em uma barra do gráfico para ver as correlações detalhadas.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
