// Arquivo: components/charts/RastreiosKPIs.tsx
// Componente: Cards compactos de rastreios com barra de progresso
// Contexto: Dashboard APS - Visualização de gaps de rastreamento
// Dados: Baseado em protocolos MS e sociedades médicas brasileiras
// Navegação: Click → Tabela filtrada por tipo de rastreio

import React from 'react';
import { Card } from '../ui/card';
import { 
  Users, 
  Microscope, 
  Stethoscope, 
  Brain, 
  Heart, 
  Wine, 
  Cigarette, 
  Activity
} from 'lucide-react';
import { rastreiosKPIsData } from '../../data/chartsData';

const iconMap: { [key: string]: React.ElementType } = {
  Users,
  Microscope, 
  Stethoscope,
  Brain,
  Heart,
  Wine,
  Cigarette,
  Activity
};

interface RastreiosKPIsProps {
  onNavigateToTable?: (type: string, rastreioId?: string) => void;
}

export default function RastreiosKPIs({ onNavigateToTable }: RastreiosKPIsProps) {
  const handleCardClick = (rastreioId: string) => {
    if (onNavigateToTable) {
      onNavigateToTable('rastreio-pendente', rastreioId);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
      {rastreiosKPIsData.map((rastreio) => {
        const Icon = iconMap[rastreio.icon] || Stethoscope;
        
        // Cores base por categoria
        const colors: { [key: string]: string } = {
          pink: 'bg-pink-50 text-pink-600 border-pink-200',
          rose: 'bg-rose-50 text-rose-600 border-rose-200',
          indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
          purple: 'bg-purple-50 text-purple-600 border-purple-200',
          violet: 'bg-violet-50 text-violet-600 border-violet-200',
          amber: 'bg-amber-50 text-amber-600 border-amber-200',
          orange: 'bg-orange-50 text-orange-600 border-orange-200',
          red: 'bg-red-50 text-red-600 border-red-200'
        };
        
        const colorClasses = colors[rastreio.color] || 'bg-gray-50 text-gray-600 border-gray-200';
        const [bgColor, textColor, borderColor] = colorClasses.split(' ');
        
        // Determina cor do percentual baseado na meta
        const gap = rastreio.meta - rastreio.percentualCobertura;
        let percentColor = textColor;
        if (gap <= 0) percentColor = 'text-green-600';  // Atingiu a meta
        else if (gap <= 5) percentColor = 'text-yellow-600';  // Próximo da meta
        else if (gap > 15) percentColor = 'text-red-600';  // Longe da meta

        // Cor da barra baseada na performance
        let barColor = 'bg-green-500';
        if (gap > 15) barColor = 'bg-red-500';
        else if (gap > 5) barColor = 'bg-yellow-500';

        return (
          <Card 
            key={rastreio.id}
            className={`cursor-pointer hover:shadow-md transition-all border ${borderColor} group relative`}
            onClick={() => handleCardClick(rastreio.id)}
          >
            <div className={`p-3 ${bgColor}`}>
              {/* Header com ícone e título */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-full bg-white border ${borderColor} flex-shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${textColor}`} />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="text-xs font-semibold text-gray-800 leading-tight truncate">
                    {rastreio.label}
                  </h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-xl font-bold ${percentColor} leading-tight`}>
                    {rastreio.percentualCobertura.toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Segunda linha com informações */}
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] text-gray-600">
                  {rastreio.realizados.toLocaleString('pt-BR')} de {rastreio.elegíveis.toLocaleString('pt-BR')}
                </div>
                <div className="text-[11px] text-gray-500">
                  Meta: {rastreio.meta}%
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(rastreio.percentualCobertura, 100)}%` }}
                />
                {/* Linha da meta */}
                <div 
                  className="absolute top-0 h-full w-px bg-gray-700 z-10"
                  style={{ left: `${rastreio.meta}%` }}
                />
              </div>
            </div>

            {/* Tooltip com explicação do indicador - aparece no hover */}
            <div className="absolute top-full left-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-3 py-2 z-50 pointer-events-none max-w-xs">
              <div className="font-semibold mb-1">População Elegível</div>
              <div className="text-[11px]">
                {rastreio.id === 'mamografia' && 'Mulheres de 50 a 69 anos. Rastreio bienal conforme diretrizes do Ministério da Saúde.'}
                {rastreio.id === 'citologia' && 'Mulheres de 25 a 64 anos com vida sexual ativa. Exame citopatológico a cada 3 anos após 2 exames normais.'}
                {rastreio.id === 'colonoscopia' && 'População acima de 50 anos. Pesquisa de sangue oculto nas fezes (SOF) a cada 2 anos ou colonoscopia a cada 10 anos.'}
                {rastreio.id === 'phq9' && 'Aplicado quando PHQ-2 inicial indica suspeita de depressão (pontuação ≥3). Avalia gravidade dos sintomas depressivos.'}
                {rastreio.id === 'gad7' && 'Aplicado quando GAD-2 inicial indica suspeita de ansiedade (pontuação ≥3). Avalia gravidade dos sintomas ansiosos.'}
                {rastreio.id === 'audit' && 'Todos os adultos acima de 18 anos. Identifica padrões de consumo de álcool de risco.'}
                {rastreio.id === 'fagerstrom' && 'Todos os fumantes ativos. Avalia grau de dependência nicotínica para orientar tratamento.'}
                {rastreio.id === 'framingham' && 'População de 40 a 74 anos sem doença cardiovascular prévia. Estima risco de evento cardiovascular em 10 anos.'}
              </div>
              <div className="absolute bottom-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -mb-1"></div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}