// VERSAO GEMINI 0.1/components/layout/FilterSidebar.tsx
// Componente: Sidebar de filtros otimizado com melhor gerenciamento de overflow
// Otimização: Permite que dropdowns flutuem sobre o conteúdo sem serem cortados
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RotateCcw, CalendarDays, PanelLeftClose, PanelLeft, Filter, Search, X, Check } from "lucide-react";
import MultiSelect from "../shared/MultiSelect";
import { Filters } from "../../types";
import {
  clienteOptions,
  produtoOptions,
  unidadeOptions,
  temposPrograma,
  medicosFamiliaOptions,
  enfermeirosFamiliaOptions,
  coordenadoresOptions,
  faixasEtariasAPS,
  sexoOptions,
  titularidadeOptions,
  careLinesOptions,
  cidOptions,
} from "../../constants/filters";

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (field: keyof Filters, value: any) => void;
  activeFiltersCount?: number;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  activeFiltersCount = 0,
  isOpen = true,
  onToggle,
}: FilterSidebarProps) {
  const [periodStart, setPeriodStart] = useState(filters.periodo.start);
  const [periodEnd, setPeriodEnd] = useState(filters.periodo.end);
  const [activeTab, setActiveTab] = useState("geral");
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  
  // Estados para campos de busca
  const [careLineSearch, setCareLineSearch] = useState('');
  const [careLineOpen, setCareLineOpen] = useState(false);
  const [cidSearch, setCidSearch] = useState('');
  const [cidOpen, setCidOpen] = useState(false);
  const careLineRef = React.useRef<HTMLDivElement>(null);
  const cidRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPeriodStart(filters.periodo.start);
    setPeriodEnd(filters.periodo.end);
  }, [filters.periodo]);

  // Função para lidar com os botões de período rápido
  const handlePresetPeriod = (months: number) => {
    const endDate = new Date();
    const startDate = new Date();
    
    if (months === -1) { // Mês anterior
      const currentMonth = new Date();
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      startDate.setDate(1);
      startDate.setMonth(currentMonth.getMonth());
      startDate.setFullYear(currentMonth.getFullYear());
      endDate.setMonth(currentMonth.getMonth() + 1);
      endDate.setDate(0);
    } else { // Últimos X meses
      startDate.setMonth(startDate.getMonth() - months);
    }

    const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');
    const newPeriod = { start: formatDate(startDate), end: formatDate(endDate) };
    
    setPeriodStart(newPeriod.start);
    setPeriodEnd(newPeriod.end);
    onFilterChange("periodo", newPeriod);
  };

  const handleApplyPeriod = () => {
    onFilterChange("periodo", { start: periodStart, end: periodEnd });
    setIsDatePopoverOpen(false);
  };
  
  const handleClearAllFilters = () => {
    const initialFilters: Filters = {
      cliente: '', produto: [], unidade: [], periodo: { start: '', end: '' },
      tempoPrograma: 'todos', medicoFamilia: [], enfermeiroFamilia: [],
      enfermeiroCoord: [], faixaEtaria: [], sexo: [], titularidade: [],
      linhasCuidado: [], cids: []
    };
    Object.keys(initialFilters).forEach(key => {
      onFilterChange(key as keyof Filters, initialFilters[key as keyof Filters]);
    });
  };

  const toggleSelection = (field: keyof Filters, id: string) => {
    const currentSelection = filters[field] as string[];
    const newSelection = currentSelection.includes(id)
      ? currentSelection.filter(item => item !== id)
      : [...currentSelection, id];
    onFilterChange(field, newSelection);
  };

  // Filtrar opções baseado na busca
  const filteredCareLines = React.useMemo(() => {
    if (!careLineSearch.trim()) return careLinesOptions;
    const term = careLineSearch.toLowerCase();
    return careLinesOptions.filter(option =>
      option.label.toLowerCase().includes(term)
    );
  }, [careLineSearch]);

  const filteredCids = React.useMemo(() => {
    if (!cidSearch.trim()) return cidOptions;
    const term = cidSearch.toLowerCase();
    return cidOptions.filter(option =>
      option.label.toLowerCase().includes(term) ||
      option.value.toLowerCase().includes(term)
    );
  }, [cidSearch]);

  // Fechar dropdowns ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (careLineRef.current && !careLineRef.current.contains(event.target as Node)) {
        setCareLineOpen(false);
      }
      if (cidRef.current && !cidRef.current.contains(event.target as Node)) {
        setCidOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header fixo */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="p-1.5 hover:bg-white border-gray-300 shadow-sm"
              title={isOpen ? "Fechar filtros" : "Abrir filtros"}
            >
              {isOpen ? <PanelLeftClose className="w-4 h-4 text-gray-700" /> : <PanelLeft className="w-4 h-4 text-gray-700" />}
            </Button>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <h2 className="font-semibold text-gray-900 text-base">Filtros</h2>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center text-xs bg-blue-600 text-white px-2.5 py-1.5 rounded-full font-bold min-w-[24px] h-[24px]">
                {activeFiltersCount}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAllFilters}
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                title="Limpar todos os filtros"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Container das abas */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
          {/* Tabs header */}
          <div className="px-4 pt-4 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100">
              <TabsTrigger value="geral" className="data-[state=active]:bg-white">
                Geral
              </TabsTrigger>
              <TabsTrigger value="clinico" className="data-[state=active]:bg-white">
                Clínico
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Geral */}
          <TabsContent 
            value="geral" 
            className="flex-1 overflow-y-auto"
            style={{ 
              padding: '24px',
              paddingBottom: '60px'
            }}
          >
            <div className="space-y-5">
              {/* Seção Organizacional */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Organizacional
              </h3>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Cliente</label>
                <Select value={filters.cliente} onValueChange={(value) => onFilterChange("cliente", value)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Selecionar cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clienteOptions.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Produtos</label>
                <MultiSelect 
                  options={produtoOptions} 
                  selected={filters.produto} 
                  onChange={v => onFilterChange('produto', v)} 
                  placeholder="Selecionar produtos..." 
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Unidades</label>
                <MultiSelect 
                  options={unidadeOptions} 
                  selected={filters.unidade} 
                  onChange={v => onFilterChange('unidade', v)} 
                  placeholder="Selecionar unidades..." 
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Período de Análise</label>
                <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="h-9 justify-start text-left font-normal w-full hover:bg-gray-50" 
                      size="sm"
                    >
                      <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">
                        {filters.periodo.start && filters.periodo.end 
                          ? `${filters.periodo.start} - ${filters.periodo.end}` 
                          : "Selecione período..."}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Períodos rápidos</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" onClick={() => handlePresetPeriod(-1)} className="justify-start text-xs">
                            Mês anterior
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handlePresetPeriod(6)} className="justify-start text-xs">
                            Últimos 6 meses
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handlePresetPeriod(12)} className="justify-start text-xs col-span-2">
                            Últimos 12 meses
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Período customizado</h4>
                        <Input 
                          type="text" 
                          placeholder="Data início (DD/MM/AAAA)" 
                          value={periodStart} 
                          onChange={e => setPeriodStart(e.target.value)} 
                        />
                        <Input 
                          type="text" 
                          placeholder="Data fim (DD/MM/AAAA)" 
                          value={periodEnd} 
                          onChange={e => setPeriodEnd(e.target.value)} 
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            onFilterChange('periodo', {start: '', end: ''});
                            setPeriodStart('');
                            setPeriodEnd('');
                          }} 
                          className="flex-1"
                        >
                          Limpar
                        </Button>
                        <Button size="sm" onClick={handleApplyPeriod} className="flex-1">
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Tempo em Programa</label>
                <Select value={filters.tempoPrograma} onValueChange={v => onFilterChange('tempoPrograma', v)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {temposPrograma.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Seção Equipe */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Equipe de Cuidado
              </h3>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Médicos de Família</label>
                <MultiSelect 
                  options={medicosFamiliaOptions} 
                  selected={filters.medicoFamilia} 
                  onChange={v => onFilterChange('medicoFamilia', v)} 
                  placeholder="Selecionar médicos..." 
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Enfermeiros de Família</label>
                <MultiSelect 
                  options={enfermeirosFamiliaOptions} 
                  selected={filters.enfermeiroFamilia} 
                  onChange={v => onFilterChange('enfermeiroFamilia', v)} 
                  placeholder="Selecionar enfermeiros..." 
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Coordenadores</label>
                <MultiSelect 
                  options={coordenadoresOptions} 
                  selected={filters.enfermeiroCoord} 
                  onChange={v => onFilterChange('enfermeiroCoord', v)} 
                  placeholder="Selecionar coordenadores..." 
                />
              </div>
            </div>

            {/* Espaço extra para garantir scroll completo */}
            <div className="h-12" />
          </div>
          </TabsContent>

          {/* Tab Clínico */}
          <TabsContent 
            value="clinico" 
            className="flex-1 overflow-y-auto"
            style={{ 
              padding: '24px',
              paddingBottom: '100px'
            }}
          >
            <div className="space-y-5">
            {/* Seção Demografia */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Demografia
              </h3>
              
              <div>
                <label className="block text-xs text-gray-600 mb-2 font-medium">Titularidade</label>
                <div className="grid grid-cols-1 gap-2">
                  {titularidadeOptions.map((titular) => (
                    <button 
                      key={titular.id} 
                      onClick={() => toggleSelection('titularidade', titular.id)}
                      className={`
                        flex flex-col gap-0.5 p-3 rounded-lg border-2 transition-all text-left
                        ${filters.titularidade.includes(titular.id) 
                          ? "border-purple-500 bg-purple-50 text-purple-900 shadow-sm" 
                          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                        }
                      `}
                    >
                      <span className="font-medium text-sm">{titular.label}</span>
                      <span className="text-xs opacity-70">{titular.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-2 font-medium">Faixa Etária</label>
                <div className="space-y-2">
                  {faixasEtariasAPS.map((faixa) => (
                    <button 
                      key={faixa.id} 
                      onClick={() => toggleSelection('faixaEtaria', faixa.id)}
                      className={`
                        w-full text-left p-3 rounded-lg border-2 transition-all
                        ${filters.faixaEtaria.includes(faixa.id) 
                          ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm" 
                          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="font-medium text-sm">{faixa.label}</div>
                      <div className="text-xs opacity-70 mt-0.5">{faixa.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-2 font-medium">Sexo</label>
                <div className="grid grid-cols-1 gap-2">
                  {sexoOptions.map((sexo) => (
                    <button 
                      key={sexo.id} 
                      onClick={() => toggleSelection('sexo', sexo.id)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                        ${filters.sexo.includes(sexo.id) 
                          ? "border-green-500 bg-green-50 text-green-900 shadow-sm" 
                          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                        }
                      `}
                    >
                      <span className="text-lg">{sexo.icon}</span>
                      <span className="font-medium text-sm">{sexo.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Seção Clínica */}
            <div className="space-y-4 pt-4 border-t mb-12">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Informações Clínicas
              </h3>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Linhas de Cuidado</label>
                <div className="relative" ref={careLineRef}>
                  {/* Campo de busca para Linhas de Cuidado */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={careLineSearch}
                      onChange={(e) => setCareLineSearch(e.target.value)}
                      onFocus={() => setCareLineOpen(true)}
                      placeholder={filters.linhasCuidado.length > 0 
                        ? `${filters.linhasCuidado.length} selecionado${filters.linhasCuidado.length > 1 ? 's' : ''}` 
                        : "Buscar linha de cuidado..."}
                      className="w-full h-9 pl-9 pr-9 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {(careLineSearch || filters.linhasCuidado.length > 0) && (
                      <button
                        onClick={() => {
                          setCareLineSearch('');
                          if (filters.linhasCuidado.length > 0) {
                            onFilterChange('linhasCuidado', []);
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Lista de opções de Linhas de Cuidado */}
                  {careLineOpen && (
                    <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[250px] overflow-y-auto">
                      {filteredCareLines.length > 0 ? (
                        <div className="py-1">
                          {filteredCareLines.map(option => {
                            const isSelected = filters.linhasCuidado.includes(option.value);
                            return (
                              <div
                                key={option.value}
                                onClick={() => toggleSelection('linhasCuidado', option.value)}
                                className={`
                                  flex items-center gap-2 px-3 py-2 text-sm cursor-pointer
                                  ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                `}
                              >
                                <div className={`
                                  w-4 h-4 border rounded flex items-center justify-center
                                  ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
                                `}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className={isSelected ? 'font-medium' : ''}>
                                  {option.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="px-3 py-6 text-center text-gray-500 text-sm">
                          Nenhuma linha de cuidado encontrada
                        </div>
                      )}
                      
                      <div className="border-t px-3 py-2 flex gap-2 text-xs">
                        <button
                          onClick={() => {
                            const allValues = filteredCareLines.map(o => o.value);
                            const newSelection = [...new Set([...filters.linhasCuidado, ...allValues])];
                            onFilterChange('linhasCuidado', newSelection);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Selecionar todos
                        </button>
                        {filters.linhasCuidado.length > 0 && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => onFilterChange('linhasCuidado', [])}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              Limpar seleção
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">
                  CIDs (Classificação Internacional de Doenças)
                </label>
                <div className="relative" ref={cidRef}>
                  {/* Campo de busca para CIDs */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={cidSearch}
                      onChange={(e) => setCidSearch(e.target.value)}
                      onFocus={() => setCidOpen(true)}
                      placeholder={filters.cids.length > 0 
                        ? `${filters.cids.length} CID${filters.cids.length > 1 ? 's' : ''} selecionado${filters.cids.length > 1 ? 's' : ''}` 
                        : "Buscar CID..."}
                      className="w-full h-9 pl-9 pr-9 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {(cidSearch || filters.cids.length > 0) && (
                      <button
                        onClick={() => {
                          setCidSearch('');
                          if (filters.cids.length > 0) {
                            onFilterChange('cids', []);
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Lista de opções de CIDs */}
                  {cidOpen && (
                    <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[250px] overflow-y-auto">
                      {filteredCids.length > 0 ? (
                        <div className="py-1">
                          {filteredCids.map(cid => {
                            const isSelected = filters.cids.includes(cid.value);
                            return (
                              <div
                                key={cid.value}
                                onClick={() => toggleSelection('cids', cid.value)}
                                className={`
                                  flex items-center gap-2 px-3 py-2 text-sm cursor-pointer
                                  ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                `}
                              >
                                <div className={`
                                  w-4 h-4 border rounded flex items-center justify-center
                                  ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
                                `}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div className="flex-1">
                                  <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                                    {cid.value}
                                  </span>
                                  <span className={`ml-2 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                                    {cid.label.replace(cid.value + ' - ', '')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="px-3 py-6 text-center text-gray-500 text-sm">
                          Nenhum CID encontrado
                        </div>
                      )}
                      
                      <div className="border-t px-3 py-2 flex gap-2 text-xs">
                        <button
                          onClick={() => {
                            const allValues = filteredCids.map(c => c.value);
                            const newSelection = [...new Set([...filters.cids, ...allValues])];
                            onFilterChange('cids', newSelection);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Selecionar todos
                        </button>
                        {filters.cids.length > 0 && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => onFilterChange('cids', [])}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              Limpar seleção
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Espaço extra para garantir visão completa do campo CID */}
              <div className="h-24" />
            </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}