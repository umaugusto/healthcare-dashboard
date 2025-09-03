'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardHeader from '@/components/layout/DashboardHeader'
import FilterSidebar from '@/components/layout/FilterSidebar'
import TabNavigation from '@/components/layout/TabNavigation'
import ChartsView from '@/components/ChartsView'
import { Button } from '@/components/ui/button'
import RealtimeIndicator from '@/components/ui/realtime-indicator'
import { PanelLeft } from 'lucide-react'
import { useDashboardStore } from '@/lib/hooks/useDashboardStore'

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const {
    activeTab,
    setActiveTab,
    filters,
    updateFilter,
    activeFiltersCount,
    tableContext,
    setTableContext
  } = useDashboardStore()

  const handleNavigateToTable = (viewType: string, context?: any) => {
    setTableContext({
      source: 'chart',
      chartType: viewType,
      filters: context?.filters,
      columns: context?.columns,
      title: context?.title,
    })
    setActiveTab('tabela')
  }

  const handleNavigateToCharts = () => {
    setTableContext(null)
    setActiveTab('visao-geral')
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Indicador Real-time */}
      <RealtimeIndicator />
      
      <motion.div 
        className="flex-1 flex overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar de Filtros */}
        {sidebarOpen ? (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <FilterSidebar
              filters={filters}
              onFilterChange={updateFilter}
              activeFiltersCount={activeFiltersCount}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
          </motion.div>
        ) : (
          <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-white hover:bg-gray-50 transition-colors"
              title="Abrir filtros"
            >
              <PanelLeft className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        )}
        
        {/* Conteúdo Principal */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader selectedCliente={filters.cliente} />
          
          <div className="flex-1 overflow-auto">
            <motion.div 
              className="h-full"
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChartsView 
                filters={filters}
                onNavigateToTable={handleNavigateToTable}
                activeTab={activeTab}
                tableContext={tableContext}
                onNavigateToCharts={handleNavigateToCharts}
              />
            </motion.div>
          </div>
          
          {/* Navegação por Abas */}
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </main>
      </motion.div>
    </div>
  )
}