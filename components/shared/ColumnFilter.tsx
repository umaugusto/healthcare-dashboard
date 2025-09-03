// components/shared/ColumnFilter.tsx
// Componente de filtro estilo Excel para colunas da tabela

import React, { useState, useMemo } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Filter, ArrowUpDown, ArrowUp, ArrowDown, Search, X } from 'lucide-react';

interface ColumnFilterProps {
  columnId: string;
  columnLabel: string;
  data: any[];
  onFilterChange: (columnId: string, filter: any) => void;
  onSortChange: (columnId: string, direction: 'asc' | 'desc' | null) => void;
  currentFilter?: any;
  currentSort?: 'asc' | 'desc' | null;
}

export function ColumnFilter({
  columnId,
  columnLabel,
  data,
  onFilterChange,
  onSortChange,
  currentFilter,
  currentSort
}: ColumnFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<Set<string>>(
    currentFilter?.values ? new Set(currentFilter.values) : new Set()
  );

  // Extrair valores únicos da coluna
  const uniqueValues = useMemo(() => {
    const values = new Set<string>();
    data.forEach(row => {
      const value = row[columnId];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => values.add(String(v)));
        } else {
          values.add(String(value));
        }
      }
    });
    return Array.from(values).sort();
  }, [data, columnId]);

  // Filtrar valores baseado na busca
  const filteredValues = useMemo(() => {
    if (!searchTerm) return uniqueValues;
    const term = searchTerm.toLowerCase();
    return uniqueValues.filter(value => 
      value.toLowerCase().includes(term)
    );
  }, [uniqueValues, searchTerm]);

  const handleSelectAll = () => {
    if (selectedValues.size === filteredValues.length) {
      setSelectedValues(new Set());
    } else {
      setSelectedValues(new Set(filteredValues));
    }
  };

  const handleValueToggle = (value: string) => {
    const newSelected = new Set(selectedValues);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    setSelectedValues(newSelected);
  };

  const handleApply = () => {
    if (selectedValues.size === 0 || selectedValues.size === uniqueValues.length) {
      onFilterChange(columnId, null);
    } else {
      onFilterChange(columnId, { values: Array.from(selectedValues) });
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedValues(new Set());
    onFilterChange(columnId, null);
    setSearchTerm('');
  };

  const handleSort = (direction: 'asc' | 'desc') => {
    onSortChange(columnId, currentSort === direction ? null : direction);
  };

  const hasActiveFilter = currentFilter && currentFilter.values && currentFilter.values.length > 0;
  const hasActiveSort = currentSort !== null && currentSort !== undefined;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-2 hover:bg-gray-100 ${hasActiveFilter || hasActiveSort ? 'text-blue-600' : 'text-gray-600'}`}
        >
          {hasActiveSort ? (
            currentSort === 'asc' ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )
          ) : (
            <Filter className={`w-4 h-4 ${hasActiveFilter ? 'fill-blue-600' : ''}`} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">{columnLabel}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Opções de ordenação */}
          <div className="flex gap-1 mb-3">
            <Button
              variant={currentSort === 'asc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('asc')}
              className="flex-1 h-8"
            >
              <ArrowUp className="w-3 h-3 mr-1" />
              A-Z
            </Button>
            <Button
              variant={currentSort === 'desc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('desc')}
              className="flex-1 h-8"
            >
              <ArrowDown className="w-3 h-3 mr-1" />
              Z-A
            </Button>
          </div>

          {/* Campo de busca */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar valores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
        </div>

        <div className="p-2 border-b">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedValues.size === filteredValues.length && filteredValues.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Selecionar todos ({filteredValues.length})
            </label>
          </div>
        </div>

        <ScrollArea className="h-64">
          <div className="p-2 space-y-1">
            {filteredValues.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                Nenhum valor encontrado
              </div>
            ) : (
              filteredValues.map(value => (
                <div key={value} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`value-${value}`}
                    checked={selectedValues.has(value)}
                    onCheckedChange={() => handleValueToggle(value)}
                  />
                  <label
                    htmlFor={`value-${value}`}
                    className="text-sm leading-none cursor-pointer flex-1 truncate"
                  >
                    {value}
                  </label>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex-1"
          >
            Limpar
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="flex-1"
          >
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}