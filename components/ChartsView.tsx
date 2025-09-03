// VERSAO GEMINI/components/ChartsView.tsx
"use client";

import React, { useState } from 'react';
import { Filters, LocalFilter } from '../types';

// Import all chart components - Corrigido para named exports
import { OverviewView } from './views/overview-view';
import DemograficosKPIs from './charts/DemograficosKPIs';
import { CoberturaPopulacional } from './charts/CoberturaPopulacional';
import { RespondentesPerfilSaude } from './charts/RespondentesPerfilSaude';
import { UtilizacaoAPS } from './charts/UtilizacaoAPS';
import { UtilizacaoPAVirtual } from './charts/UtilizacaoPAVirtual';
import CronicosKPIs from './charts/CronicosKPIs';
import HipertensaoChart from './charts/HipertensaoChart';
import DiabetesChart from './charts/DiabetesChart';
import ObesidadeChart from './charts/ObesidadeChart';
import SaudeMentalChart from './charts/SaudeMentalChart';
// Rastreios
import RastreiosKPIs from './charts/RastreiosKPIs';
import MamografiaChart from './charts/MamografiaChart';
import RastreioCitologiaChart from './charts/RastreioCitologiaChart';
import RastreioColonChart from './charts/RastreioColonChart';
// import RastreioSaudeMentalChart from './charts/RastreioSaudeMentalChart'; // Temporariamente oculto
// import RastreioAuditChart from './charts/RastreioAuditChart'; // Temporariamente oculto
// Utilização - Componentes corretos para esta aba
import { RankingUtilizadores } from './charts/RankingUtilizadores';
import { RankingUtilizadoresAPS } from './charts/RankingUtilizadoresAPS';
import { CheckupEinsteinChart } from './charts/CheckupEinsteinChart';
import { ReabilitacaoChart } from './charts/ReabilitacaoChart';

interface ChartsViewProps {
  filters: Filters;
  onNavigateToTable: (type: string, condition?: string) => void;
  activeTab: string;
}

export default function ChartsView({ filters, onNavigateToTable, activeTab }: ChartsViewProps) {
  const [localFilter, setLocalFilter] = useState<LocalFilter | null>(null);

  const handleLocalFilterChange = (filter: LocalFilter | null) => {
    if (localFilter && filter && localFilter.type === filter.type && localFilter.value === filter.value) {
      setLocalFilter(null);
    } else {
      setLocalFilter(filter);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "visao-geral":
        return (
          <OverviewView 
            filters={filters}
            onNavigateToTable={onNavigateToTable}
          />
        );
      case "cronicos":
        return (
          <>
            <CronicosKPIs />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HipertensaoChart 
                filters={filters}
                localFilter={localFilter}
                onLocalFilterChange={handleLocalFilterChange}
                onNavigateToTable={onNavigateToTable}
              />
              <DiabetesChart 
                filters={filters}
                localFilter={localFilter}
                onLocalFilterChange={handleLocalFilterChange}
                onNavigateToTable={onNavigateToTable}
              />
              <ObesidadeChart 
                filters={filters}
                localFilter={localFilter}
                onLocalFilterChange={handleLocalFilterChange}
                onNavigateToTable={onNavigateToTable}
              />
              <SaudeMentalChart 
                filters={filters}
                localFilter={localFilter}
                onLocalFilterChange={handleLocalFilterChange}
                onNavigateToTable={onNavigateToTable}
              />
            </div>
          </>
        );
      case "rastreios":
        return (
          <>
            <RastreiosKPIs onNavigateToTable={onNavigateToTable} />
            
            {/* Grid de análises detalhadas - incluindo AUDIT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <MamografiaChart 
                filters={filters}
                onNavigateToTable={onNavigateToTable}
              />
              <RastreioCitologiaChart 
                filters={filters}
                onNavigateToTable={onNavigateToTable}
              />
              <RastreioColonChart 
                filters={filters}
                onNavigateToTable={onNavigateToTable}
              />
              {/* Temporariamente oculto - Rastreio de Saúde Mental
              <RastreioSaudeMentalChart 
                filters={filters}
                onNavigateToTable={onNavigateToTable}
              />
              */}
              {/* Temporariamente oculto 
              <RastreioAuditChart 
                filters={filters}
                onNavigateToTable={onNavigateToTable}
              />
              */}
            </div>
          </>
        );
      case "utilizacao":
        return (
          <>
            {/* KPIs de Utilização - métricas específicas desta aba */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-red-50 rounded">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11a2 2 0 002 2h4v-6h2v6h4a2 2 0 002-2V7l-7-5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Utilização PA</span>
                </div>
                <div className="text-2xl font-bold text-red-600">1.247</div>
                <div className="text-xs text-gray-500 mt-1">Top 10% = 42% total</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-blue-50 rounded">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Utilização APS</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">2.156</div>
                <div className="text-xs text-gray-500 mt-1">Top 10% = 38% total</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-green-50 rounded">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Checkup Realizados</span>
                </div>
                <div className="text-2xl font-bold text-green-600">485</div>
                <div className="text-xs text-gray-500 mt-1">97% cobertura</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-purple-50 rounded">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Reabilitação</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">342</div>
                <div className="text-xs text-gray-500 mt-1">15 pac = 35% total</div>
              </div>
            </div>

            {/* Grid de análises detalhadas da aba utilização */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RankingUtilizadores 
                filters={filters}
                onNavigateToTable={onNavigateToTable}
              />
              <RankingUtilizadoresAPS 
                filters={filters}
                onNavigateToTable={onNavigateToTable}
              />
              <CheckupEinsteinChart 
                filters={filters}
                onNavigateToTable={onNavigateToTable}
              />
              <ReabilitacaoChart 
                filters={filters}
                onNavigateToTable={onNavigateToTable}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-[1600px] mx-auto">
      {renderTabContent()}
    </div>
  );
}