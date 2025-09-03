import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

// Types baseados no projeto original
interface Filters {
  cliente: string;
  produto: string[];
  unidade: string[];
  periodo: { start: string; end: string };
  tempoPrograma: string;
  medicoFamilia: string[];
  enfermeiroFamilia: string[];
  enfermeiroCoord: string[];
  faixaEtaria: string[];
  sexo: string[];
  titularidade: string[];
  linhasCuidado: string[];
  cids: string[];
}

interface TableContext {
  source: string;
  chartType: string;
  filters?: any;
  columns?: string[];
  title?: string;
}

interface LocalFilter {
  type: string;
  value: string;
  label: string;
}

interface DashboardState {
  // Estado das abas
  activeTab: string;
  previousTab: string;
  setActiveTab: (tab: string) => void;
  
  // Filtros globais
  filters: Filters;
  updateFilter: (field: keyof Filters, value: any) => void;
  resetFilters: () => void;
  
  // Filtros locais (para interatividade entre gráficos)
  localFilter: LocalFilter | null;
  setLocalFilter: (filter: LocalFilter | null) => void;
  
  // Contexto da tabela
  tableContext: TableContext | null;
  setTableContext: (context: TableContext | null) => void;
  
  // Estado da sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Contadores e métricas
  activeFiltersCount: number;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Estado inicial dos filtros (baseado no projeto original)
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

// Função para contar filtros ativos
const countActiveFilters = (filters: Filters): number => {
  return Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      const period = value as { start: string; end: string };
      return !!(period.start && period.end);
    }
    return value && value !== 'todos';
  }).length;
};

export const useDashboardStore = create<DashboardState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Estado inicial
      activeTab: 'visao-geral',
      previousTab: 'visao-geral',
      filters: initialFiltersState,
      localFilter: null,
      tableContext: null,
      sidebarOpen: true,
      activeFiltersCount: 0,
      isLoading: false,

      // Actions
      setActiveTab: (tab: string) => {
        const currentTab = get().activeTab;
        set({ 
          previousTab: currentTab, 
          activeTab: tab 
        });
      },

      updateFilter: (field: keyof Filters, value: any) => {
        set((state) => {
          const newFilters = { ...state.filters, [field]: value };
          return {
            filters: newFilters,
            activeFiltersCount: countActiveFilters(newFilters),
            // Reset local filter when global filters change
            localFilter: null,
          };
        });
      },

      resetFilters: () => {
        set({
          filters: initialFiltersState,
          activeFiltersCount: 0,
          localFilter: null,
        });
      },

      setLocalFilter: (filter: LocalFilter | null) => {
        set({ localFilter: filter });
      },

      setTableContext: (context: TableContext | null) => {
        set({ tableContext: context });
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      setIsLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    })),
    {
      name: 'dashboard-store',
    }
  )
);

// Selectors para performance otimizada
export const useActiveTab = () => useDashboardStore((state) => state.activeTab);
export const useFilters = () => useDashboardStore((state) => state.filters);
export const useLocalFilter = () => useDashboardStore((state) => state.localFilter);
export const useTableContext = () => useDashboardStore((state) => state.tableContext);
export const useSidebarOpen = () => useDashboardStore((state) => state.sidebarOpen);
export const useActiveFiltersCount = () => useDashboardStore((state) => state.activeFiltersCount);

// Custom hook para navegação de tabela
export const useTableNavigation = () => {
  const setTableContext = useDashboardStore((state) => state.setTableContext);
  const setActiveTab = useDashboardStore((state) => state.setActiveTab);
  
  const navigateToTable = (viewType: string, context?: Partial<TableContext>) => {
    setTableContext({
      source: 'chart',
      chartType: viewType,
      ...context,
    });
    setActiveTab('tabela');
  };

  const navigateToCharts = () => {
    const previousTab = useDashboardStore.getState().previousTab;
    setTableContext(null);
    setActiveTab(previousTab || 'visao-geral');
  };

  return { navigateToTable, navigateToCharts };
};

// Persistence middleware para filtros (opcional)
export const usePersistentFilters = () => {
  const filters = useFilters();
  
  // Save filters to localStorage
  const saveFilters = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-filters', JSON.stringify(filters));
    }
  };

  // Load filters from localStorage
  const loadFilters = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-filters');
      if (saved) {
        const parsedFilters = JSON.parse(saved);
        useDashboardStore.getState().updateFilter('cliente', parsedFilters.cliente);
        // Carregar outros filtros conforme necessário
      }
    }
  };

  return { saveFilters, loadFilters };
};