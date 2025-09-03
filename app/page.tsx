// VERSAO GEMINI/app/page.tsx
"use client";

import React, { useState } from 'react';
import DashboardHeader from '../components/layout/DashboardHeader';
import FilterSidebar from '../components/layout/FilterSidebar';
import TabNavigation from '../components/layout/TabNavigation';
import ChartsView from '../components/ChartsView';
import MicroTable from '../components/shared/MicroTable';
import { Filters, TableContext } from '../types';
import { Button } from '../components/ui/button';
import { PanelLeft } from 'lucide-react';

// Estado inicial para os filtros, garantindo que todos os campos existam.
const initialFiltersState: Filters = {
  cliente: '',
  produto: [],
  unidade: [],
  periodo: { start: '', end: '' },
  tempoPrograma: 'todos',
  medicoFamilia: [],
  enfermeiroFamilia: [],
  enfermeiroCoord: [],
  faixaEtaria: [],
  sexo: [],
  titularidade: [],
  linhasCuidado: [],
  cids: [],
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [tableInitialView, setTableInitialView] = useState<string | null>(null);
  const [tableContext, setTableContext] = useState<TableContext | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFiltersState);
  const [previousTab, setPreviousTab] = useState('visao-geral'); // Rastrear aba de origem

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleNavigateToTable = (viewType: string, context?: TableContext) => {
    setTableInitialView(viewType);
    if (context) {
      setTableContext(context);
    }
    setPreviousTab(activeTab); // Salvar aba atual antes de navegar
    setActiveTab('tabela');
  };

  const handleNavigateToCharts = () => {
    setTableInitialView(null);
    setTableContext(null);
    setActiveTab(previousTab); // Retornar para a aba de origem
  };
  
  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      const period = value as { start: string, end: string };
      return !!(period.start && period.end);
    }
    return value && value !== 'todos';
  }).length;

  const showTable = activeTab === 'tabela';

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen ? (
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            activeFiltersCount={activeFiltersCount}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        ) : (
           <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-white"
              title="Abrir filtros"
            >
              <PanelLeft className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        )}
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader selectedCliente={filters.cliente} />
          
          <div className="flex-1 overflow-auto">
            {showTable ? (
              <MicroTable 
                filters={filters} 
                onNavigateToCharts={handleNavigateToCharts}
                initialView={tableInitialView}
                tableContext={tableContext}
                sourceTab={previousTab}
              />
            ) : (
              <ChartsView 
                 filters={filters} 
                 onNavigateToTable={handleNavigateToTable}
                 activeTab={activeTab}
              />
            )}
          </div>
        </main>
      </div>
      
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
}
