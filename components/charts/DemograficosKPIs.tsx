// VERSAO GEMINI 0.1/components/charts/DemograficosKPIs.tsx
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { demograficosData } from '../../data/chartsData';
import { Users, Heart, BarChart3, Clock } from 'lucide-react'; // Ícones genéricos

const iconMap = {
  'Composição Familiar': Users,
  'Distribuição por Sexo': Heart,
  'Distribuição Etária': BarChart3,
  'Tempo no Programa': Clock,
};

// Calcula valores absolutos baseados em população de 5500
const calculateAbsoluteValues = (data: any[]) => {
  const TOTAL_POPULATION = 5500;
  return data.map(item => ({
    ...item,
    absoluteValue: Math.round((item.value / 100) * TOTAL_POPULATION)
  }));
};

const DonutChart = ({ segments }: { segments: { value: number; color: string; label: string; absoluteValue: number }[] }) => {
  const size = 100;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let accumulatedPercentage = 0;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        
        {segments.map((segment, index) => {
          const segmentLength = (segment.value / 100) * circumference;
          const gap = 0.5; // pequeno gap entre segmentos
          const strokeDasharray = `${segmentLength - gap} ${circumference - segmentLength + gap}`;
          const strokeDashoffset = circumference - (accumulatedPercentage / 100) * circumference;
          
          accumulatedPercentage += segment.value;
          
          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
              className="hover:opacity-80 transition-opacity"
            />
          );
        })}
      </svg>
      
      {/* Labels com percentual */}
      {segments.map((segment, index) => {
        const angle = ((segments.slice(0, index).reduce((sum, s) => sum + s.value, 0) + segment.value / 2) / 100) * 360 - 90;
        const labelRadius = radius + 8; // Reduzido para ficar mais próximo do gráfico
        const x = size / 2 + labelRadius * Math.cos((angle * Math.PI) / 180);
        const y = size / 2 + labelRadius * Math.sin((angle * Math.PI) / 180);
        
        return (
          <div
            key={index}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <span className="bg-white px-0.5 rounded text-[9px] font-semibold text-gray-700 shadow-sm">
              {segment.value}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

const Legend = ({ items }: { items: { color: string; label: string; value: number; absoluteValue: number }[] }) => (
  <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-[10px] pr-[0px] pb-[0px] pl-[0px] m-[0px]">
    {items.map((item, index) => (
      <div key={index} className="flex items-center gap-1.5">
        <div className="rounded-sm shrink-0 size-2" style={{ backgroundColor: item.color }} />
        <span className="text-[#4a5565] text-[10px] font-medium truncate">
          {item.label} ({item.absoluteValue.toLocaleString('pt-BR')})
        </span>
      </div>
    ))}
  </div>
);

export default function DemograficosKPIs() {
  const kpis = [
    { id: 'composicao-familiar', title: 'Composição Familiar', data: calculateAbsoluteValues(demograficosData.composicaoFamiliar) },
    { id: 'distribuicao-sexo', title: 'Distribuição por Sexo', data: calculateAbsoluteValues(demograficosData.distribuicaoSexo) },
    { id: 'distribuicao-etaria', title: 'Distribuição Etária', data: calculateAbsoluteValues(demograficosData.distribuicaoEtaria) },
    { id: 'tempo-programa', title: 'Tempo no Programa', data: calculateAbsoluteValues(demograficosData.tempoPrograma) }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.title as keyof typeof iconMap] || Users;
        return (
          <Card key={kpi.id} className="hover:shadow-lg transition-shadow overflow-hidden p-[0px] pt-[0px] pr-[0px] pb-[0px] pl-[8px]">
            <CardContent className="p-[0px] p-[0px] p-[0px]">
              <div className="flex flex-col gap-2 items-center justify-start p-3 h-full pt-[10px] pr-[10px] pb-[0px] pl-[10px]">
                <div className="flex items-center gap-2 w-full py-[8px] px-[0px]">
                  <Icon className="size-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-[#364153]">{kpi.title}</h3>
                </div>
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="flex items-center justify-center">
                    <DonutChart segments={kpi.data} />
                  </div>
                  <div className="w-full px-2">
                    <Legend items={kpi.data} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
