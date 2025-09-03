// Arquivo: components/shared/MicroTable.tsx
// Componente: Tabela analítica detalhada com visualizações pré-definidas
// Contexto: Dashboard APS - Visão detalhada de pacientes com colunas configuráveis
// Padrão: Baseado na versão C com adaptações para estrutura da versão D

import React, { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Columns,
  BarChart3,
  FileText,
  UserCheck,
  AlertCircle,
  Check,
  Clock,
  Brain,
  Pin,
  PinOff
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';


import { ColumnFilter } from './ColumnFilter';
import { TableContext } from '../../types';

interface MicroTableProps {
  filters?: any;
  onNavigateToCharts: () => void;
  initialView?: string | null;
  tableContext?: TableContext | null;
  sourceTab?: string; // Nova prop para rastrear aba de origem
}

// Definição de todas as colunas disponíveis
interface Column {
  id: string;
  label: string;
  width?: string;
  sortable?: boolean;
  required?: boolean; // Colunas que não podem ser ocultadas
}

const ALL_COLUMNS: Column[] = [
  { id: 'prontuario', label: 'Prontuário', sortable: true },
  { id: 'cpf', label: 'CPF', sortable: true, required: true },
  { id: 'name', label: 'Nome', sortable: true, required: true },
  { id: 'age', label: 'Idade', sortable: true },
  { id: 'sex', label: 'Sexo', sortable: true }, // Alterado para ter filtro
  { id: 'conditions', label: 'Condições', sortable: true }, // Alterado para ter filtro
  { id: 'risk', label: 'Risco', sortable: true }, // Já tem filtro
  { id: 'lastVisit', label: 'Último Atend.', sortable: true },
  { id: 'doctor', label: 'Médico', sortable: true }, // Alterado para ter filtro
  { id: 'nurse', label: 'Enfermeiro', sortable: true }, // Alterado para ter filtro
  { id: 'profileResponse', label: 'Perfil Saúde', sortable: true }, // Alterado para ter filtro
  { id: 'mentalHealthScreening', label: 'Rastreio Mental', sortable: true }, // Alterado para ter filtro
  { id: 'paVisits', label: 'Visitas PA', sortable: true },
  { id: 'tempoPrograma', label: 'Tempo Programa', sortable: true },
  { id: 'rastreioOncologico', label: 'Rastreio Onco.', sortable: true }, // Alterado para ter filtro
  { id: 'proximaConsulta', label: 'Próx. Consulta', sortable: true },
  { id: 'phq9', label: 'PHQ-9', sortable: true },
  { id: 'gad7', label: 'GAD-7', sortable: true },
  { id: 'audit', label: 'AUDIT', sortable: true },
  { id: 'pressaoArterial', label: 'PA', sortable: true }, // Alterado para ter ordenação
  { id: 'glicemia', label: 'Glicemia', sortable: true },
  { id: 'imc', label: 'IMC', sortable: true },
];

// Presets de colunas para diferentes visualizações
const COLUMN_PRESETS: { [key: string]: string[] } = {
  default: ['prontuario', 'cpf', 'name', 'age', 'sex', 'conditions', 'risk', 'lastVisit', 'doctor', 'nurse'],
  'high-utilizers': ['prontuario', 'cpf', 'name', 'paVisits', 'conditions', 'lastVisit', 'doctor', 'tempoPrograma'],
  'unassisted-risk': ['prontuario', 'cpf', 'name', 'risk', 'conditions', 'lastVisit', 'proximaConsulta', 'doctor', 'nurse'],
  'mental-health': ['prontuario', 'cpf', 'name', 'age', 'phq9', 'gad7', 'audit', 'mentalHealthScreening', 'profileResponse', 'doctor'],
  'oncology-screening': ['prontuario', 'cpf', 'name', 'age', 'sex', 'rastreioOncologico', 'lastVisit', 'proximaConsulta', 'doctor'],
  'chronic-diseases': ['prontuario', 'cpf', 'name', 'conditions', 'pressaoArterial', 'glicemia', 'imc', 'tempoPrograma', 'lastVisit', 'doctor'],
  'no-care-12m': ['prontuario', 'cpf', 'name', 'lastVisit', 'conditions', 'risk', 'proximaConsulta', 'doctor'],
  'coverage': ['prontuario', 'cpf', 'name', 'profileResponse', 'tempoPrograma', 'lastVisit', 'doctor', 'nurse'],
  // Presets baseados em contexto de gráficos
  'diabetes-tipo': ['prontuario', 'cpf', 'name', 'conditions', 'glicemia', 'imc', 'tempoPrograma', 'lastVisit', 'doctor'],
  'diabetes-controle': ['prontuario', 'cpf', 'name', 'glicemia', 'pressaoArterial', 'imc', 'lastVisit', 'proximaConsulta'],
  'hipertensao-controle': ['prontuario', 'cpf', 'name', 'pressaoArterial', 'conditions', 'risk', 'lastVisit', 'doctor'],
  'hipertensao-fatores': ['prontuario', 'cpf', 'name', 'pressaoArterial', 'imc', 'conditions', 'tempoPrograma'],
  'saude-mental-diagnostico': ['prontuario', 'cpf', 'name', 'phq9', 'gad7', 'audit', 'mentalHealthScreening', 'doctor'],
  'saude-mental-risco': ['prontuario', 'cpf', 'name', 'phq9', 'gad7', 'risk', 'lastVisit', 'proximaConsulta'],
  'obesidade-imc': ['prontuario', 'cpf', 'name', 'imc', 'conditions', 'tempoPrograma', 'doctor'],
};

// Mock data generator
const generateMockData = (count: number) => {
  const conditions = ['Hipertensão', 'Diabetes', 'Ansiedade', 'Depressão', 'Obesidade', 'Dislipidemia', 'DPOC', 'Asma'];
  const risks = ['Alto', 'Médio', 'Baixo', 'Crescente'];
  const doctors = ['Dr. Silva', 'Dra. Santos', 'Dr. Costa', 'Dra. Lima', 'Dr. Oliveira', 'Dra. Pereira'];
  const nurses = ['Enf. Maria', 'Enf. João', 'Enf. Ana', 'Enf. Pedro', 'Enf. Paula', 'Enf. Carlos'];
  const rastreioStatus = ['Em dia', 'Pendente', 'Atrasado', 'Não aplicável'];
  const tempoProgramaOptions = ['< 6 meses', '6-12 meses', '1-2 anos', '2-5 anos', '> 5 anos'];
  const mentalStatus = ['Completo', 'Pendente', 'Parcial', 'Agendado'];
  
  // Nomes brasileiros realistas
  const nomes = [
    'Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Costa', 'José Antonio Lima',
    'Francisca Souza', 'Antonio Carlos Pereira', 'Luiza Helena Dias', 'Paulo Roberto Alves',
    'Mariana Santos Rodrigues', 'Carlos Eduardo Ferreira', 'Juliana Costa Silva', 'Roberto Carlos Mendes',
    'Patricia Oliveira Santos', 'Fernando Henrique Dias', 'Camila Rodrigues Lima', 'Rafael Santos Costa',
    'Sandra Maria Pereira', 'Marcos Antonio Silva', 'Beatriz Costa Oliveira', 'Lucas Gabriel Santos'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    prontuario: `PRO${(10000 + i).toString().padStart(5, '0')}`,
    cpf: `${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`,
    name: nomes[Math.floor(Math.random() * nomes.length)],
    age: Math.floor(Math.random() * 60) + 20,
    sex: Math.random() > 0.5 ? 'M' : 'F',
    conditions: conditions.filter(() => Math.random() > 0.6).slice(0, 3),
    risk: risks[Math.floor(Math.random() * risks.length)],
    lastVisit: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    doctor: doctors[Math.floor(Math.random() * doctors.length)],
    nurse: nurses[Math.floor(Math.random() * nurses.length)],
    profileResponse: Math.random() > 0.3,
    mentalHealthScreening: mentalStatus[Math.floor(Math.random() * mentalStatus.length)],
    paVisits: Math.floor(Math.random() * 15),
    tempoPrograma: tempoProgramaOptions[Math.floor(Math.random() * tempoProgramaOptions.length)],
    rastreioOncologico: rastreioStatus[Math.floor(Math.random() * rastreioStatus.length)],
    proximaConsulta: new Date(Date.now() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    phq9: Math.floor(Math.random() * 28), // 0-27
    gad7: Math.floor(Math.random() * 22), // 0-21
    audit: Math.floor(Math.random() * 41), // 0-40
    pressaoArterial: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 70}`,
    glicemia: Math.floor(Math.random() * 100) + 70,
    imc: (Math.random() * 15 + 20).toFixed(1),
  }));
};

export default function MicroTable({ filters, onNavigateToCharts, initialView, tableContext, sourceTab }: MicroTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: any }>({});
  const [quickFilterActive, setQuickFilterActive] = useState<string | null>(null); // Estado para filtro rápido ativo
  const [fixedView, setFixedView] = useState<string[] | null>(null); // Estado para visualização fixada
  
  // Estado para colunas visíveis - considera o contexto da tabela
  const getInitialColumns = () => {
    if (fixedView) {
      return fixedView;
    }
    if (tableContext?.columns) {
      return tableContext.columns;
    }
    if (tableContext?.chartType && COLUMN_PRESETS[tableContext.chartType]) {
      return COLUMN_PRESETS[tableContext.chartType];
    }
    return COLUMN_PRESETS[initialView || 'default'] || COLUMN_PRESETS.default;
  };
  
  const [visibleColumns, setVisibleColumns] = useState<string[]>(getInitialColumns());
  
  // Atualizar colunas quando o contexto mudar (mas não se houver visualização fixada)
  useEffect(() => {
    if (!fixedView) {
      setVisibleColumns(getInitialColumns());
    }
  }, [tableContext, initialView]);
  
  // Generate mock data
  const allData = useMemo(() => generateMockData(250), []);
  
  // Apply filters
  const filteredData = useMemo(() => {
    return allData.filter(patient => {
      // Quick filter application
      if (quickFilterActive) {
        switch(quickFilterActive) {
          case 'altoRisco':
            if (patient.risk !== 'Alto' && patient.risk !== 'Crescente') return false;
            break;
          case 'semPerfil':
            if (patient.profileResponse) return false;
            break;
          case 'rastreioMental':
            if (patient.mentalHealthScreening !== 'Pendente' && patient.mentalHealthScreening !== 'Parcial') return false;
            break;
          case 'cronicos':
            if (!patient.conditions.some(c => ['Hipertensão', 'Diabetes', 'DPOC', 'Obesidade'].includes(c))) return false;
            break;
          case 'semAtendimento':
            const lastVisitDate = new Date(patient.lastVisit);
            const monthsAgo = (Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
            if (monthsAgo <= 12) return false;
            break;
          
          // Novos filtros de crônicos descontrolados ou ausentes
          case 'hipertensaoDescontrolada':
            const paValues = patient.pressaoArterial.split('/');
            const sistolica = parseInt(paValues[0]);
            const diastolica = parseInt(paValues[1]);
            // Inclui: tem HAS no prontuário OU pressão descontrolada
            if (!(patient.conditions.includes('Hipertensão') || 
                  sistolica > 140 || diastolica > 90)) return false;
            break;
            
          case 'diabetesDescontrolado':
            // Inclui: tem DM no prontuário OU glicemia descontrolada
            if (!(patient.conditions.includes('Diabetes') || 
                  patient.glicemia > 126)) return false;
            break;
            
          case 'obesidade':
            // Inclui: IMC > 30
            if (parseFloat(patient.imc) <= 30) return false;
            break;
            
          case 'saudeMentalAlterada':
            // Inclui: escores alterados OU rastreio pendente
            if (!(patient.phq9 >= 10 || patient.gad7 >= 10 || 
                  patient.mentalHealthScreening === 'Pendente')) return false;
            break;
            
          // Rastreios oncológicos pendentes
          case 'mamografiaPendente':
            if (patient.sex !== 'F' || patient.age < 50 || patient.age > 69) return false;
            if (patient.rastreioOncologico !== 'Pendente' && 
                patient.rastreioOncologico !== 'Atrasado') return false;
            break;
            
          case 'citologiaPendente':
            if (patient.sex !== 'F' || patient.age < 25 || patient.age > 64) return false;
            if (patient.rastreioOncologico !== 'Pendente' && 
                patient.rastreioOncologico !== 'Atrasado') return false;
            break;
            
          case 'colonoscopiaPendente':
            if (patient.age < 50) return false;
            if (patient.rastreioOncologico !== 'Pendente' && 
                patient.rastreioOncologico !== 'Atrasado') return false;
            break;
            
          // Hiperutilização
          case 'hiperutilizacaoPA':
            if (patient.paVisitas < 8) return false;
            break;
            
          case 'hiperutilizacaoAPS':
            if (patient.paVisitas < 5) return false; // Usando paVisitas como proxy para APS
            break;
        }
      }
      
      // Search filter - busca por nome, CPF e prontuário
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!patient.name.toLowerCase().includes(searchLower) && 
            !patient.cpf.includes(searchTerm) &&
            !patient.prontuario.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Column filters
      for (const [columnId, filter] of Object.entries(columnFilters)) {
        if (filter && filter.values && filter.values.length > 0) {
          const value = patient[columnId];
          if (Array.isArray(value)) {
            // Para arrays, verifica se algum valor está no filtro
            const hasMatch = value.some(v => filter.values.includes(String(v)));
            if (!hasMatch) return false;
          } else {
            // Para valores simples
            if (!filter.values.includes(String(value))) {
              return false;
            }
          }
        }
      }
      
      // Initial view specific filters (apenas se não houver quickFilter)
      if (initialView && !quickFilterActive) {
        switch (initialView) {
          case 'unassisted-risk':
            return patient.risk === 'Alto' || patient.risk === 'Crescente';
          case 'mental-health':
            return patient.phq9 >= 10 || patient.gad7 >= 10 || patient.audit >= 8;
          case 'no-care-12m':
            return new Date().getTime() - new Date(patient.lastVisit).getTime() > 365 * 24 * 60 * 60 * 1000;
          case 'high-utilizers':
            return patient.paVisits >= 8;
          case 'chronic-diseases':
            return patient.conditions.some(c => 
              ['Hipertensão', 'Diabetes', 'DPOC', 'Obesidade'].includes(c)
            );
          case 'oncology-screening':
            return patient.rastreioOncologico === 'Atrasado' || patient.rastreioOncologico === 'Pendente';
          case 'coverage':
            return !patient.profileResponse;
        }
      }
      
      return true;
    });
  }, [allData, searchTerm, initialView, columnFilters, tableContext, quickFilterActive]);
  
  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredData, sortColumn, sortDirection]);
  
  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleSort = (columnId: string, direction: 'asc' | 'desc' | null) => {
    if (direction === null) {
      setSortColumn(null);
      setSortDirection('asc');
    } else {
      setSortColumn(columnId);
      setSortDirection(direction);
    }
  };
  
  const handleColumnFilter = (columnId: string, filter: any) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      if (filter === null) {
        delete newFilters[columnId];
      } else {
        newFilters[columnId] = filter;
      }
      return newFilters;
    });
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Alto':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Crescente':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Médio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Baixo':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getPHQ9Color = (score: number) => {
    if (score >= 20) return 'text-red-600 font-bold';
    if (score >= 15) return 'text-orange-600 font-semibold';
    if (score >= 10) return 'text-yellow-600';
    if (score >= 5) return 'text-blue-600';
    return 'text-green-600';
  };
  
  const getGAD7Color = (score: number) => {
    if (score >= 15) return 'text-red-600 font-bold';
    if (score >= 10) return 'text-orange-600 font-semibold';
    if (score >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  const getAUDITColor = (score: number) => {
    if (score >= 16) return 'text-red-600 font-bold';
    if (score >= 8) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  const handleColumnToggle = (columnId: string) => {
    const column = ALL_COLUMNS.find(c => c.id === columnId);
    if (column?.required) return; // Não permite ocultar colunas obrigatórias
    
    setVisibleColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };
  
  const handleFixView = () => {
    if (fixedView) {
      // Desafixar visualização
      setFixedView(null);
    } else {
      // Fixar visualização atual
      setFixedView(visibleColumns);
    }
  };
  
  // Filtra apenas as colunas visíveis
  const displayColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));

  // Função para determinar se a coluna deve ter filtro completo ou apenas ordenação
  const shouldHaveFilter = (columnId: string): boolean => {
    // Colunas que devem ter filtro completo (categóricas)
    const filterColumns = ['sex', 'conditions', 'risk', 'doctor', 'nurse', 'profileResponse', 
                          'mentalHealthScreening', 'tempoPrograma', 'rastreioOncologico'];
    return filterColumns.includes(columnId);
  };

  // Estatísticas rápidas com dados totais e filtrados
  const stats = useMemo(() => {
    const total = filteredData.length;
    const altoRisco = allData.filter(p => p.risk === 'Alto' || p.risk === 'Crescente').length;
    const semResposta = allData.filter(p => !p.profileResponse).length;
    const rastreioMentalPendente = allData.filter(p => 
      p.mentalHealthScreening === 'Pendente' || p.mentalHealthScreening === 'Parcial'
    ).length;
    const cronicos = allData.filter(p => 
      p.conditions.some(c => ['Hipertensão', 'Diabetes', 'DPOC', 'Obesidade'].includes(c))
    ).length;
    const semAtendimento12m = allData.filter(p => {
      const lastVisitDate = new Date(p.lastVisit);
      const monthsAgo = (Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsAgo > 12;
    }).length;
    
    // Estatísticas para novos filtros
    const hipertensaoDescontrolada = allData.filter(p => {
      const paValues = p.pressaoArterial.split('/');
      const sistolica = parseInt(paValues[0]);
      const diastolica = parseInt(paValues[1]);
      return p.conditions.includes('Hipertensão') || (sistolica > 140 || diastolica > 90);
    }).length;
    
    const diabetesDescontrolado = allData.filter(p => 
      p.conditions.includes('Diabetes') || p.glicemia > 126
    ).length;
    
    const obesidade = allData.filter(p => parseFloat(p.imc) > 30).length;
    
    const saudeMentalAlterada = allData.filter(p => 
      p.phq9 >= 10 || p.gad7 >= 10 || p.mentalHealthScreening === 'Pendente'
    ).length;
    
    const mamografiaPendente = allData.filter(p => 
      p.sex === 'F' && p.age >= 50 && p.age <= 69 && 
      (p.rastreioOncologico === 'Pendente' || p.rastreioOncologico === 'Atrasado')
    ).length;
    
    const citologiaPendente = allData.filter(p => 
      p.sex === 'F' && p.age >= 25 && p.age <= 64 && 
      (p.rastreioOncologico === 'Pendente' || p.rastreioOncologico === 'Atrasado')
    ).length;
    
    const colonoscopiaPendente = allData.filter(p => 
      p.age >= 50 && 
      (p.rastreioOncologico === 'Pendente' || p.rastreioOncologico === 'Atrasado')
    ).length;
    
    const hiperutilizacaoPA = allData.filter(p => p.paVisitas >= 8).length;
    const hiperutilizacaoAPS = allData.filter(p => p.paVisitas >= 5).length;
    
    return { 
      total, altoRisco, semResposta, rastreioMentalPendente, cronicos, semAtendimento12m,
      hipertensaoDescontrolada, diabetesDescontrolado, obesidade, saudeMentalAlterada,
      mamografiaPendente, citologiaPendente, colonoscopiaPendente,
      hiperutilizacaoPA, hiperutilizacaoAPS
    };
  }, [filteredData, allData]);

  // Função para aplicar filtro rápido
  const handleQuickFilter = (filterType: string) => {
    if (quickFilterActive === filterType) {
      // Desativar filtro
      setQuickFilterActive(null);
      setColumnFilters({});
      setCurrentPage(1);
    } else {
      // Ativar novo filtro
      setQuickFilterActive(filterType);
      setCurrentPage(1);
      
      // Ajustar colunas visíveis baseado no filtro (apenas se não houver visualização fixada)
      if (!fixedView) {
        switch(filterType) {
          case 'altoRisco':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'risk', 'conditions', 'lastVisit', 'proximaConsulta', 'doctor']);
            break;
          case 'semPerfil':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'profileResponse', 'tempoPrograma', 'lastVisit', 'doctor', 'nurse']);
            break;
          case 'rastreioMental':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'phq9', 'gad7', 'audit', 'mentalHealthScreening', 'doctor']);
            break;
          case 'cronicos':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'conditions', 'pressaoArterial', 'glicemia', 'imc', 'doctor']);
            break;
          case 'semAtendimento':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'lastVisit', 'conditions', 'risk', 'proximaConsulta', 'doctor']);
            break;
            
          // Novos filtros
          case 'hipertensaoDescontrolada':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'pressaoArterial', 'conditions', 'lastVisit', 'doctor']);
            break;
          case 'diabetesDescontrolado':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'glicemia', 'conditions', 'imc', 'lastVisit', 'doctor']);
            break;
          case 'obesidade':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'imc', 'conditions', 'tempoPrograma', 'doctor']);
            break;
          case 'saudeMentalAlterada':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'phq9', 'gad7', 'mentalHealthScreening', 'doctor']);
            break;
          case 'mamografiaPendente':
          case 'citologiaPendente':
          case 'colonoscopiaPendente':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'age', 'sex', 'rastreioOncologico', 'lastVisit', 'proximaConsulta', 'doctor']);
            break;
          case 'hiperutilizacaoPA':
          case 'hiperutilizacaoAPS':
            setVisibleColumns(['prontuario', 'cpf', 'name', 'paVisitas', 'conditions', 'lastVisit', 'doctor']);
            break;
        }
      }
    }
  };

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      {/* Header com estatísticas */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Análise Detalhada de Pacientes</h2>
            <p className="text-gray-600">
            {tableContext?.title && `${tableContext.title} • `}
            {initialView && !tableContext && `Visualizando: ${getViewTitle(initialView)} • `}
              {stats.total} pacientes encontrados
          </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onNavigateToCharts}>
              <BarChart3 className="w-4 h-4 mr-2" />
              {sourceTab && sourceTab !== 'visao-geral' ? 
                `Voltar para ${getTabName(sourceTab)}` : 
                'Voltar aos Gráficos'
              }
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
        
        {/* Filtros rápidos - Cards clicáveis */}
        <div className="space-y-2">
          {/* Primeira linha - Filtros gerais */}
          <div className="flex gap-2 flex-wrap">
            <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-gray-600">Total</span>
                <span className="text-sm font-bold text-blue-600">{stats.total}</span>
              </div>
            </div>
          
          <button
            onClick={() => handleQuickFilter('altoRisco')}
            className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
              quickFilterActive === 'altoRisco' 
                ? 'bg-red-600 text-white border-red-700' 
                : 'bg-red-50 border-red-200 hover:bg-red-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-3 h-3 ${quickFilterActive === 'altoRisco' ? 'text-white' : 'text-red-600'}`} />
              <span className={`text-xs ${quickFilterActive === 'altoRisco' ? 'text-white' : 'text-gray-600'}`}>Alto Risco</span>
              <span className={`text-sm font-bold ${quickFilterActive === 'altoRisco' ? 'text-white' : 'text-red-600'}`}>{stats.altoRisco}</span>
            </div>
          </button>
          
          <button
            onClick={() => handleQuickFilter('semPerfil')}
            className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
              quickFilterActive === 'semPerfil' 
                ? 'bg-yellow-600 text-white border-yellow-700' 
                : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserCheck className={`w-3 h-3 ${quickFilterActive === 'semPerfil' ? 'text-white' : 'text-yellow-600'}`} />
              <span className={`text-xs ${quickFilterActive === 'semPerfil' ? 'text-white' : 'text-gray-600'}`}>Sem Perfil</span>
              <span className={`text-sm font-bold ${quickFilterActive === 'semPerfil' ? 'text-white' : 'text-yellow-600'}`}>{stats.semResposta}</span>
            </div>
          </button>
          
          <button
            onClick={() => handleQuickFilter('rastreioMental')}
            className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
              quickFilterActive === 'rastreioMental' 
                ? 'bg-purple-600 text-white border-purple-700' 
                : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Brain className={`w-3 h-3 ${quickFilterActive === 'rastreioMental' ? 'text-white' : 'text-purple-600'}`} />
              <span className={`text-xs ${quickFilterActive === 'rastreioMental' ? 'text-white' : 'text-gray-600'}`}>Rastreio Mental</span>
              <span className={`text-sm font-bold ${quickFilterActive === 'rastreioMental' ? 'text-white' : 'text-purple-600'}`}>{stats.rastreioMentalPendente}</span>
            </div>
          </button>
          
          <button
            onClick={() => handleQuickFilter('cronicos')}
            className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
              quickFilterActive === 'cronicos' 
                ? 'bg-orange-600 text-white border-orange-700' 
                : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-3 h-3 ${quickFilterActive === 'cronicos' ? 'text-white' : 'text-orange-600'}`} />
              <span className={`text-xs ${quickFilterActive === 'cronicos' ? 'text-white' : 'text-gray-600'}`}>Crônicos</span>
              <span className={`text-sm font-bold ${quickFilterActive === 'cronicos' ? 'text-white' : 'text-orange-600'}`}>{stats.cronicos}</span>
            </div>
          </button>
          
          <button
            onClick={() => handleQuickFilter('semAtendimento')}
            className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
              quickFilterActive === 'semAtendimento' 
                ? 'bg-gray-600 text-white border-gray-700' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className={`w-3 h-3 ${quickFilterActive === 'semAtendimento' ? 'text-white' : 'text-gray-600'}`} />
              <span className={`text-xs ${quickFilterActive === 'semAtendimento' ? 'text-white' : 'text-gray-600'}`}>Sem Atend. 12m+</span>
              <span className={`text-sm font-bold ${quickFilterActive === 'semAtendimento' ? 'text-white' : 'text-gray-600'}`}>{stats.semAtendimento12m}</span>
            </div>
          </button>
          </div>
          
          {/* Segunda linha - Crônicos, Rastreios e Hiperutilização */}
          <div className="flex gap-2 flex-wrap">
            {/* Crônicos descontrolados */}
            <button
              onClick={() => handleQuickFilter('hipertensaoDescontrolada')}
              className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
                quickFilterActive === 'hipertensaoDescontrolada' 
                  ? 'bg-red-700 text-white border-red-800' 
                  : 'bg-red-50 border-red-200 hover:bg-red-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${quickFilterActive === 'hipertensaoDescontrolada' ? 'text-white' : 'text-gray-600'}`}>HAS Desc.</span>
                <span className={`text-sm font-bold ${quickFilterActive === 'hipertensaoDescontrolada' ? 'text-white' : 'text-red-700'}`}>{stats.hipertensaoDescontrolada}</span>
              </div>
            </button>
            
            <button
              onClick={() => handleQuickFilter('diabetesDescontrolado')}
              className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
                quickFilterActive === 'diabetesDescontrolado' 
                  ? 'bg-blue-700 text-white border-blue-800' 
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${quickFilterActive === 'diabetesDescontrolado' ? 'text-white' : 'text-gray-600'}`}>DM Desc.</span>
                <span className={`text-sm font-bold ${quickFilterActive === 'diabetesDescontrolado' ? 'text-white' : 'text-blue-700'}`}>{stats.diabetesDescontrolado}</span>
              </div>
            </button>
            
            <button
              onClick={() => handleQuickFilter('obesidade')}
              className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
                quickFilterActive === 'obesidade' 
                  ? 'bg-orange-700 text-white border-orange-800' 
                  : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${quickFilterActive === 'obesidade' ? 'text-white' : 'text-gray-600'}`}>Obesidade</span>
                <span className={`text-sm font-bold ${quickFilterActive === 'obesidade' ? 'text-white' : 'text-orange-700'}`}>{stats.obesidade}</span>
              </div>
            </button>
            
            <button
              onClick={() => handleQuickFilter('saudeMentalAlterada')}
              className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
                quickFilterActive === 'saudeMentalAlterada' 
                  ? 'bg-purple-700 text-white border-purple-800' 
                  : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${quickFilterActive === 'saudeMentalAlterada' ? 'text-white' : 'text-gray-600'}`}>Mental Alt.</span>
                <span className={`text-sm font-bold ${quickFilterActive === 'saudeMentalAlterada' ? 'text-white' : 'text-purple-700'}`}>{stats.saudeMentalAlterada}</span>
              </div>
            </button>
            
            {/* Rastreios oncológicos */}
            <button
              onClick={() => handleQuickFilter('mamografiaPendente')}
              className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
                quickFilterActive === 'mamografiaPendente' 
                  ? 'bg-pink-700 text-white border-pink-800' 
                  : 'bg-pink-50 border-pink-200 hover:bg-pink-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${quickFilterActive === 'mamografiaPendente' ? 'text-white' : 'text-gray-600'}`}>Mamografia</span>
                <span className={`text-sm font-bold ${quickFilterActive === 'mamografiaPendente' ? 'text-white' : 'text-pink-700'}`}>{stats.mamografiaPendente}</span>
              </div>
            </button>
            
            <button
              onClick={() => handleQuickFilter('citologiaPendente')}
              className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
                quickFilterActive === 'citologiaPendente' 
                  ? 'bg-pink-700 text-white border-pink-800' 
                  : 'bg-pink-50 border-pink-200 hover:bg-pink-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${quickFilterActive === 'citologiaPendente' ? 'text-white' : 'text-gray-600'}`}>Citologia</span>
                <span className={`text-sm font-bold ${quickFilterActive === 'citologiaPendente' ? 'text-white' : 'text-pink-700'}`}>{stats.citologiaPendente}</span>
              </div>
            </button>
            
            <button
              onClick={() => handleQuickFilter('colonoscopiaPendente')}
              className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
                quickFilterActive === 'colonoscopiaPendente' 
                  ? 'bg-pink-700 text-white border-pink-800' 
                  : 'bg-pink-50 border-pink-200 hover:bg-pink-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${quickFilterActive === 'colonoscopiaPendente' ? 'text-white' : 'text-gray-600'}`}>Colonoscopia</span>
                <span className={`text-sm font-bold ${quickFilterActive === 'colonoscopiaPendente' ? 'text-white' : 'text-pink-700'}`}>{stats.colonoscopiaPendente}</span>
              </div>
            </button>
            
            {/* Hiperutilização */}
            <button
              onClick={() => handleQuickFilter('hiperutilizacaoPA')}
              className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
                quickFilterActive === 'hiperutilizacaoPA' 
                  ? 'bg-red-800 text-white border-red-900' 
                  : 'bg-red-50 border-red-200 hover:bg-red-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${quickFilterActive === 'hiperutilizacaoPA' ? 'text-white' : 'text-gray-600'}`}>Hiper PA</span>
                <span className={`text-sm font-bold ${quickFilterActive === 'hiperutilizacaoPA' ? 'text-white' : 'text-red-800'}`}>{stats.hiperutilizacaoPA}</span>
              </div>
            </button>
            
            <button
              onClick={() => handleQuickFilter('hiperutilizacaoAPS')}
              className={`rounded-lg px-3 py-2 border transition-all cursor-pointer hover:shadow-md ${
                quickFilterActive === 'hiperutilizacaoAPS' 
                  ? 'bg-blue-800 text-white border-blue-900' 
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs ${quickFilterActive === 'hiperutilizacaoAPS' ? 'text-white' : 'text-gray-600'}`}>Hiper APS</span>
                <span className={`text-sm font-bold ${quickFilterActive === 'hiperutilizacaoAPS' ? 'text-white' : 'text-blue-800'}`}>{stats.hiperutilizacaoAPS}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, CPF ou prontuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          
          {/* Configurador de colunas */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant={fixedView ? 'default' : 'outline'}
                size="sm"
                className="min-w-[140px]"
              >
                {fixedView && <Pin className="w-3 h-3 mr-2" />}
                <Columns className="w-4 h-4 mr-2" />
                Colunas ({visibleColumns.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="font-semibold text-sm">Configurar Colunas Visíveis</h4>
                  <Button 
                    variant={fixedView ? 'default' : 'ghost'}
                    size="sm"
                    onClick={handleFixView}
                    className="h-8"
                  >
                    {fixedView ? (
                      <>
                        <PinOff className="w-3 h-3 mr-1" />
                        Desafixar
                      </>
                    ) : (
                      <>
                        <Pin className="w-3 h-3 mr-1" />
                        Fixar
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                  {ALL_COLUMNS.map(column => (
                    <div key={column.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={column.id}
                        checked={visibleColumns.includes(column.id)}
                        onCheckedChange={() => handleColumnToggle(column.id)}
                        disabled={column.required}
                      />
                      <label
                        htmlFor={column.id}
                        className={`text-sm font-medium leading-none cursor-pointer select-none ${
                          column.required ? 'text-gray-500' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {column.label}
                        {column.required && (
                          <span className="text-xs text-gray-400 ml-1">(obrigatória)</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleColumns(ALL_COLUMNS.map(c => c.id))}
                    className="h-8"
                  >
                    Mostrar todas
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleColumns(ALL_COLUMNS.filter(c => c.required).map(c => c.id))}
                    className="h-8"
                  >
                    Mínimo
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="25">25 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
              <SelectItem value="100">100 por página</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {displayColumns.map(column => (
                  <TableHead 
                    key={column.id}
                    className="font-semibold text-gray-700 px-2"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate">{column.label}</span>
                      {column.sortable && shouldHaveFilter(column.id) ? (
                        <ColumnFilter
                          columnId={column.id}
                          columnLabel={column.label}
                          data={filteredData}
                          onFilterChange={handleColumnFilter}
                          onSortChange={handleSort}
                          currentFilter={columnFilters[column.id]}
                          currentSort={sortColumn === column.id ? sortDirection : null}
                        />
                      ) : column.sortable ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 hover:bg-gray-100"
                          onClick={() => {
                            if (sortColumn === column.id) {
                              if (sortDirection === 'asc') {
                                handleSort(column.id, 'desc');
                              } else {
                                handleSort(column.id, null);
                              }
                            } else {
                              handleSort(column.id, 'asc');
                            }
                          }}
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </Button>
                      ) : null}
                    </div>
                  </TableHead>
                ))}

              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={displayColumns.length} className="text-center py-8 text-gray-500">
                    Nenhum paciente encontrado com os filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-gray-50 transition-colors">
                    {displayColumns.map(column => (
                      <TableCell key={column.id} className="py-3">
                        {renderCellContent(patient, column.id)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} resultados
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8"
            >
              Primeira
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {/* Páginas numeradas */}
            {(() => {
              const pageNumbers = [];
              const maxVisible = 5;
              let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              let end = Math.min(totalPages, start + maxVisible - 1);
              
              if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
              }
              
              for (let i = start; i <= end; i++) {
                pageNumbers.push(
                  <Button
                    key={i}
                    variant={currentPage === i ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(i)}
                    className="h-8 min-w-[32px]"
                  >
                    {i}
                  </Button>
                );
              }
              
              return pageNumbers;
            })()}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8"
            >
              Última
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
  
  // Função auxiliar para renderizar conteúdo das células
  function renderCellContent(patient: any, columnId: string) {
    switch (columnId) {
      case 'prontuario':
        return <span className="font-mono text-sm text-gray-700">{patient.prontuario}</span>;
      case 'cpf':
        return <span className="font-mono text-sm text-gray-600">{patient.cpf}</span>;
      case 'name':
        return <span className="font-medium text-gray-900">{patient.name}</span>;
      case 'age':
        return <span className="text-gray-700">{patient.age} anos</span>;
      case 'sex':
        return (
          <Badge variant="outline" className="text-xs">
            {patient.sex === 'M' ? 'Masculino' : 'Feminino'}
          </Badge>
        );
      case 'conditions':
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {patient.conditions.length > 0 ? (
              patient.conditions.map((condition: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {condition}
                </Badge>
              ))
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        );
      case 'risk':
        return (
          <Badge className={`${getRiskBadgeColor(patient.risk)} border`}>
            {patient.risk}
          </Badge>
        );
      case 'lastVisit':
        return <span className="text-sm text-gray-700">{patient.lastVisit}</span>;
      case 'doctor':
        return <span className="text-sm text-gray-700">{patient.doctor}</span>;
      case 'nurse':
        return <span className="text-sm text-gray-700">{patient.nurse}</span>;
      case 'profileResponse':
        return patient.profileResponse ? (
          <Badge className="bg-green-100 text-green-800 border-green-300 border">
            <Check className="w-3 h-3 mr-1" />
            Respondido
          </Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-600 border-gray-300 border">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'mentalHealthScreening':
        return (
          <Badge className={
            patient.mentalHealthScreening === 'Completo' ? 'bg-green-100 text-green-800 border-green-300' :
            patient.mentalHealthScreening === 'Parcial' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
            patient.mentalHealthScreening === 'Agendado' ? 'bg-blue-100 text-blue-800 border-blue-300' :
            'bg-red-100 text-red-800 border-red-300'
          } variant="outline">
            {patient.mentalHealthScreening}
          </Badge>
        );
      case 'paVisits':
        return (
          <span className={`font-medium ${patient.paVisits > 10 ? 'text-red-600' : patient.paVisits > 5 ? 'text-yellow-600' : 'text-gray-700'}`}>
            {patient.paVisits}
          </span>
        );
      case 'tempoPrograma':
        return <span className="text-sm text-gray-700">{patient.tempoPrograma}</span>;
      case 'rastreioOncologico':
        return (
          <Badge className={
            patient.rastreioOncologico === 'Em dia' ? 'bg-green-100 text-green-800 border-green-300' :
            patient.rastreioOncologico === 'Pendente' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
            patient.rastreioOncologico === 'Atrasado' ? 'bg-red-100 text-red-800 border-red-300' :
            'bg-gray-100 text-gray-600 border-gray-300'
          } variant="outline">
            {patient.rastreioOncologico}
          </Badge>
        );
      case 'proximaConsulta':
        return <span className="text-sm text-gray-700">{patient.proximaConsulta}</span>;
      case 'phq9':
        return <span className={`font-medium ${getPHQ9Color(patient.phq9)}`}>{patient.phq9}</span>;
      case 'gad7':
        return <span className={`font-medium ${getGAD7Color(patient.gad7)}`}>{patient.gad7}</span>;
      case 'audit':
        return <span className={`font-medium ${getAUDITColor(patient.audit)}`}>{patient.audit}</span>;
      case 'pressaoArterial':
        return <span className="font-mono text-sm text-gray-700">{patient.pressaoArterial}</span>;
      case 'glicemia':
        return (
          <span className={`font-medium ${patient.glicemia > 126 ? 'text-red-600' : patient.glicemia > 100 ? 'text-yellow-600' : 'text-gray-700'}`}>
            {patient.glicemia} mg/dL
          </span>
        );
      case 'imc':
        return (
          <span className={`font-medium ${parseFloat(patient.imc) > 30 ? 'text-red-600' : parseFloat(patient.imc) > 25 ? 'text-yellow-600' : 'text-gray-700'}`}>
            {patient.imc}
          </span>
        );
      default:
        return <span className="text-gray-400">-</span>;
    }
  }
}



function getViewTitle(view: string): string {
  const titles: { [key: string]: string } = {
    'coverage': 'Cobertura Populacional',
    'unassisted-risk': 'Pacientes de Alto Risco Desassistidos',
    'mental-health': 'Rastreio de Saúde Mental',
    'pa-resolution': 'Utilização do PA Virtual',
    'oncology-screening': 'Rastreio Oncológico',
    'chronic-diseases': 'Doenças Crônicas',
    'high-utilizers': 'Hiperutilizadores do Sistema',
    'no-care-12m': 'Sem Atendimento há mais de 12 meses'
  };
  return titles[view] || 'Todos os Pacientes';
}

function getTabName(tab: string): string {
  const tabs: { [key: string]: string } = {
    'visao-geral': 'Visão Geral',
    'cronicos': 'Crônicos',
    'rastreios': 'Rastreios',
    'utilizacao': 'Utilização'
  };
  return tabs[tab] || 'Gráficos';
}