// VERSAO D/components/shared/CIDPanelWithSearch.tsx
// Componente: Painel de CIDs com busca integrada no estilo dropdown
"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Check, Search, X, ChevronDown } from 'lucide-react';
import { cidOptions } from '../../constants/filters';

interface CIDPanelWithSearchProps {
  selectedCids: string[];
  onCidsChange: (activeCIDs: string[]) => void;
}

export function CIDPanelWithSearch({ selectedCids, onCidsChange }: CIDPanelWithSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Filtrar CIDs baseado no termo de busca
  const filteredCids = useMemo(() => {
    if (!searchTerm.trim()) {
      return cidOptions;
    }
    const term = searchTerm.toLowerCase();
    return cidOptions.filter(cid =>
      cid.label.toLowerCase().includes(term) ||
      cid.value.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Toggle de CID
  const handleCidToggle = (cidValue: string) => {
    const newSelection = selectedCids.includes(cidValue)
      ? selectedCids.filter(c => c !== cidValue)
      : [...selectedCids, cidValue];
    onCidsChange(newSelection);
  };

  // Selecionar todos os visíveis
  const handleSelectAll = () => {
    const visibleValues = filteredCids.map(cid => cid.value);
    const newSelection = [...new Set([...selectedCids, ...visibleValues])];
    onCidsChange(newSelection);
  };

  // Limpar seleção dos visíveis
  const handleClearAll = () => {
    const visibleValues = filteredCids.map(cid => cid.value);
    const newSelection = selectedCids.filter(val => !visibleValues.includes(val));
    onCidsChange(newSelection);
  };

  // Fechar lista ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsListOpen(false);
      }
    };

    if (isListOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isListOpen]);

  // Toggle da lista
  const handleToggleList = () => {
    setIsListOpen(!isListOpen);
  };

  // Obter labels dos CIDs selecionados
  const selectedCidLabels = useMemo(() => {
    return selectedCids.map(cidValue => {
      const cid = cidOptions.find(c => c.value === cidValue);
      return cid ? cid.label : cidValue;
    });
  }, [selectedCids]);

  // Contar quantos dos itens filtrados estão selecionados
  const filteredSelectedCount = filteredCids.filter(cid => selectedCids.includes(cid.value)).length;

  return (
    <div className="relative space-y-2" ref={containerRef}>
      {/* Campo principal que abre o dropdown */}
      <div 
        ref={triggerRef}
        onClick={handleToggleList}
        className="flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span className={`truncate ${selectedCids.length === 0 ? "text-gray-500" : "text-gray-900"}`}>
          {selectedCids.length === 0
            ? "Buscar CID..."
            : selectedCids.length === 1
              ? selectedCidLabels[0]
              : `${selectedCids.length} CIDs selecionados`}
        </span>
        <ChevronDown className={`ml-2 h-4 w-4 shrink-0 text-gray-500 transition-transform ${isListOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Lista flutuante de CIDs */}
      {isListOpen && (
        <div 
          className="absolute w-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{ maxHeight: '400px', zIndex: 9999 }}
        >
          {/* Campo de busca */}
          <div className="p-2 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por CID ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-8 h-8 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-1 text-xs text-gray-600">
                {filteredCids.length} CID{filteredCids.length !== 1 ? 's' : ''} encontrado{filteredCids.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Lista scrollável de CIDs */}
          <div 
            className="overflow-y-auto p-1"
            style={{ maxHeight: '280px' }}
          >
            {filteredCids.length > 0 ? (
              <div className="space-y-0.5">
                {filteredCids.map(cid => {
                  const isSelected = selectedCids.includes(cid.value);
                  return (
                    <div
                      key={cid.value}
                      className={`
                        flex items-center gap-2 p-2 rounded cursor-pointer transition-colors text-sm
                        ${isSelected 
                          ? 'bg-blue-50 hover:bg-blue-100' 
                          : 'hover:bg-gray-50'
                        }
                      `}
                      onClick={() => handleCidToggle(cid.value)}
                    >
                      <div
                        className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                          isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                        }`}
                      >
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
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">Nenhum CID encontrado</p>
                {searchTerm && (
                  <p className="text-xs mt-1">
                    Tente buscar por outro termo
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Botões de ação */}
          {filteredCids.length > 0 && (
            <div className="flex border-t border-gray-200 bg-gray-50 rounded-b-lg">
              {filteredSelectedCount === 0 || filteredSelectedCount < filteredCids.length ? (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors rounded-bl-lg"
                >
                  Selecionar {searchTerm ? 'Visíveis' : 'Todos'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors rounded-bl-lg"
                >
                  Limpar {searchTerm ? 'Visíveis' : 'Seleção'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}