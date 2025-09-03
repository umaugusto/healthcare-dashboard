// Arquivo: components/charts/RastreioMamaChart.tsx
// Componente: Dashboard de rastreamento mamográfico com filtros interativos
// Contexto: Dashboard APS - Análise detalhada do rastreio de câncer de mama
// Padrão: Segue exatamente o padrão de funil do RastreioCitologiaChart

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { 
  Info, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Calendar, 
  Clock, 
  FileText, 
  Target, 
  BarChart3, 
  ChevronDown,
  Microscope,
  Heart
} from 'lucide-react';

interface RastreioMamaChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

// Dados mockados específicos para mamografia
const dadosMamografia = {
  elegiveis: 2048,
  coberturaAtual: 72.5,
  metaBienal: 80,
  taxaReconvocacao: 8.2,
  
  funilRastreamento: [
    { etapa: 'Elegíveis ao rastreio', valor: 2048, percentual: 100 },
    { etapa: 'Exames solicitados', valor: 1620, percentual: 79.1 },
    { etapa: 'Exames realizados', valor: 1485, percentual: 72.5 },
    { etapa: 'Com alteração', valor: 142, percentual: 9.6 },
    { etapa: 'Em acompanhamento', valor: 138, percentual: 97.2 }
  ],
  
  classificacaoBiRads: [
    { categoria: 'BI-RADS 0', quantidade: 125, percentual: 8.4, descricao: 'Inconclusivo' },
    { categoria: 'BI-RADS 1', quantidade: 680, percentual: 45.8, descricao: 'Negativo' },
    { categoria: 'BI-RADS 2', quantidade: 450, percentual: 30.3, descricao: 'Benigno' },
    { categoria: 'BI-RADS 3', quantidade: 88, percentual: 5.9, descricao: 'Provavelmente benigno' },
    { categoria: 'BI-RADS 4', quantidade: 97, percentual: 6.5, descricao: 'Suspeito' },
    { categoria: 'BI-RADS 5', quantidade: 45, percentual: 3.0, descricao: 'Altamente suspeito' }
  ],
  
  agingExames: [
    { periodo: 'Nunca realizaram', pacientes: 428, percentual: 20.9 },
    { periodo: '> 3 anos', pacientes: 185, percentual: 9.0 },
    { periodo: '2-3 anos', pacientes: 280, percentual: 13.7 },
    { periodo: '1-2 anos', pacientes: 385, percentual: 18.8 },
    { periodo: '< 1 ano', pacientes: 770, percentual: 37.6 }
  ],
  
  evolucaoTemporal: [
    { mes: 'Jan', cobertura: 68.2, realizados: 115, meta: 80 },
    { mes: 'Fev', cobertura: 69.5, realizados: 128, meta: 80 },
    { mes: 'Mar', cobertura: 70.8, realizados: 134, meta: 80 },
    { mes: 'Abr', cobertura: 71.2, realizados: 122, meta: 80 },
    { mes: 'Mai', cobertura: 71.9, realizados: 130, meta: 80 },
    { mes: 'Jun', cobertura: 72.5, realizados: 138, meta: 80 },
    { mes: 'Jul', cobertura: 73.1, realizados: 125, meta: 80 },
    { mes: 'Ago', cobertura: 72.8, realizados: 118, meta: 80 },
    { mes: 'Set', cobertura: 72.4, realizados: 123, meta: 80 },
    { mes: 'Out', cobertura: 72.7, realizados: 128, meta: 80 },
    { mes: 'Nov', cobertura: 72.5, realizados: 121, meta: 80 },
    { mes: 'Dez', cobertura: 72.5, realizados: 119, meta: 80 }
  ]
};

// Componente de Funil Visual Vertical
const FunnelChart = ({ data, title, icon: Icon, onItemClick, tipoFiltro, filtroAtivo, onNavigateToTable }: {
  data: any[],
  title: string,
  icon: React.ElementType,
  onItemClick?: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro?: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null,
  onNavigateToTable?: (type: string) => void
}) => {
  // Cores intuitivas: verde → amarelo → vermelho
  const coresIntuitivas = ['#86efac', '#a7f3d0', '#fde047', '#fb923c', '#ef4444'];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <h3 
            className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => onNavigateToTable && onNavigateToTable('funil-rastreamento-mamografico')}
            title="Ir para tabela detalhada"
          >
            {title}
          </h3>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Info className="w-3 h-3 text-gray-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-3">
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Regra de Cálculo - Funil de Rastreamento</p>
              <div className="text-xs space-y-1 text-gray-600">
                <p><strong>Elegíveis ao rastreio:</strong> Mulheres 50-69 anos sem contraindicações</p>
                <p><strong>Exames solicitados:</strong> Mamografias requisitadas pelo médico</p>
                <p><strong>Exames realizados:</strong> Mamografias efetivamente executadas</p>
                <p><strong>Com alteração:</strong> Resultados BI-RADS 4 ou 5</p>
                <p><strong>Em acompanhamento:</strong> Casos com follow-up adequado</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-1">
        {data.map((item, index) => {
          const isActive = filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === item.etapa;
          const backgroundColor = coresIntuitivas[index] || item.cor;
          const textColor = ['#fb923c', '#ef4444', '#dc2626'].includes(backgroundColor) ? 'white' : '#1f2937';
          
          return (
            <React.Fragment key={index}>
              <div
                className={`relative rounded-md p-2 transition-all duration-300 ${
                  onItemClick ? 'cursor-pointer hover:shadow-md' : ''
                }`}
                style={{ 
                  backgroundColor: backgroundColor,
                  opacity: filtroAtivo && !isActive ? 0.4 : 1,
                  transform: isActive ? 'scale(1.