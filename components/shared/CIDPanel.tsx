// VERSAO GEMINI 0.1/components/shared/CIDPanel.tsx
// Componente: Painel de seleção de CIDs com busca e lista flutuante
// Otimização: Lista permanece aberta durante seleção e flutua sobre conteúdo
"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cidOptions } from '../../constants/filters';

interface CIDPanelProps {
  selectedCids: string[];
  onCidsChange: (activeCIDs: string[]) => void;
}

export function CIDPanel({ selectedCids, onCidsChange }: CIDPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Obter labels dos CIDs selecionados
  const selectedCidLabels = useMemo(() => {
    return selectedCids.map(cidValue => {
      const cid = cidOptions.find(c => c.value === cidValue);
      return cid ? { value: cidValue, label: cid.label } : null;
    }).filter(Boolean);
  }, [selectedCids]);

  // Toggle de CID
  const handleCidToggle = (cidValue: string) => {
    const newSelection = selectedCids.includes(cidValue)
      ? selectedCids.filter(c => c !== cidValue)
      : [...selectedCids, cidValue];
    onCidsChange(newSelection);
  };

  // Remover CID específico
  const handleRemoveCid = (cidValue: string) => {
    onCidsChange(selectedCids.filter(c => c !== cidValue));
  };

  // Limpar todos os CIDs
  const handleClearAll = () => {
    onCidsChange([]);
    setSearchTerm('');
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
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isListOpen]);

  // Abrir lista ao focar no input
  const handleInputFocus = () => {
    setIsListOpen(true);
  };

  // Toggle da lista
  const toggleList = () => {
    setIsListOpen(!isListOpen);
    if (!isListOpen && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* CIDs selecionados como badges */}
      {selectedCidLabels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCidLabels.map((cid) => cid && (
            <Badge
              key={cid.value}
              variant="secondary"
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
            >
              <span className="text-xs">{cid.value}</span>
              <button
                onClick={() => handleRemoveCid(cid.value)}
                className="ml-1 hover:text-blue-900"
                aria-label={`Remover ${cid.value}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Limpar todos
          </Button>
        </div>
      )}

      {/* Container de busca e lista */}
      <div className="relative">
        {/* Input de busca com botão toggle */}
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              ref={inputRef}
              placeholder="Buscar por CID ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleInputFocus}
              className="pl-10 pr-4"
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
          <Button
            variant="outline"
            size="icon"
            onClick={toggleList}
            className="flex-shrink-0"
            aria-label={isListOpen ? "Fechar lista" : "Abrir lista"}
          >
            {isListOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Lista flutuante de CIDs */}
        {isListOpen && (
          <div 
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
            style={{ maxHeight: '320px' }}
          >
            {/* Header da lista */}
            <div className="sticky top-0 bg-gray-50 px-3 py-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {filteredCids.length} CID{filteredCids.length !== 1 ? 's' : ''} encontrado{filteredCids.length !== 1 ? 's' : ''}
                </span>
                {selectedCids.length > 0 && (
                  <span className="text-xs text-blue-600 font-medium">
                    {selectedCids.length} selecionado{selectedCids.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Lista scrollável de CIDs */}
            <div 
              className="overflow-y-auto p-2"
              style={{ maxHeight: '260px' }}
            >
              {filteredCids.length > 0 ? (
                <div className="space-y-1">
                  {filteredCids.map(cid => {
                    const isSelected = selectedCids.includes(cid.value);
                    return (
                      <label
                        key={cid.value}
                        className={`
                          flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors
                          ${isSelected 
                            ? 'bg-blue-50 hover:bg-blue-100' 
                            : 'hover:bg-gray-50'
                          }
                        `}
                      >
                        <Checkbox
                          id={`cid-${cid.value}`}
                          checked={isSelected}
                          onCheckedChange={() => handleCidToggle(cid.value)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <div className="flex-1 text-sm">
                          <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                            {cid.value}
                          </span>
                          <span className={`ml-2 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                            {cid.label.replace(cid.value + ' - ', '')}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Nenhum CID encontrado</p>
                  {searchTerm && (
                    <p className="text-xs mt-1">
                      Tente buscar por outro termo
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer com informações úteis */}
            {filteredCids.length > 10 && (
              <div className="sticky bottom-0 bg-gray-50 px-3 py-2 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  Role para ver mais opções
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Texto de ajuda */}
      {!isListOpen && selectedCids.length === 0 && (
        <p className="text-xs text-gray-500">
          Clique no campo acima para buscar e selecionar CIDs
        </p>
      )}
    </div>
  );
}