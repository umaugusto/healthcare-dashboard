// VERSAO D/components/shared/MultiSelectWithSearch.tsx
// Componente: MultiSelect com funcionalidade de busca integrada
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { SelectOption } from '../../types';

interface MultiSelectWithSearchProps {
  options: SelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  searchPlaceholder?: string;
  showBadges?: boolean;
}

export default function MultiSelectWithSearch({ 
  options, 
  selected, 
  onChange, 
  placeholder,
  searchPlaceholder = "Buscar...",
  showBadges = false 
}: MultiSelectWithSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Filtrar opções baseado no termo de busca
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return options;
    }
    const term = searchTerm.toLowerCase();
    return options.filter(option =>
      option.label.toLowerCase().includes(term) ||
      option.value.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleSelectAll = () => {
    // Selecionar apenas os itens filtrados visíveis
    const visibleValues = filteredOptions.map(opt => opt.value);
    const newSelection = [...new Set([...selected, ...visibleValues])];
    onChange(newSelection);
  };

  const handleClearAll = () => {
    // Limpar apenas os itens filtrados visíveis
    const visibleValues = filteredOptions.map(opt => opt.value);
    const newSelection = selected.filter(val => !visibleValues.includes(val));
    onChange(newSelection);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const selectedLabels = selected.map(
    (value) => options.find((opt) => opt.value === value)?.label || value
  );

  const maxHeight = Math.min(filteredOptions.length * 40 + 120, 400);

  // Contar quantos dos itens filtrados estão selecionados
  const filteredSelectedCount = filteredOptions.filter(opt => selected.includes(opt.value)).length;

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 transition-colors"
      >
        <span className={`truncate ${selected.length === 0 ? "text-gray-500" : "text-gray-900"}`}>
          {selected.length === 0
            ? placeholder
            : selected.length === 1
              ? selectedLabels[0]
              : `${selected.length} selecionados`}
        </span>
        <ChevronDown className={`ml-2 h-4 w-4 shrink-0 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
          style={{ maxHeight: `${maxHeight}px`, zIndex: 9999 }}
        >
          {/* Campo de busca */}
          <div className="p-2 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-8 h-8 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-1 text-xs text-gray-600">
                {filteredOptions.length} {filteredOptions.length === 1 ? 'item encontrado' : 'itens encontrados'}
              </div>
            )}
          </div>

          {/* Lista de opções */}
          <div className="p-1" style={{ maxHeight: `${maxHeight - 120}px`, overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 rounded px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleOption(option.value)}
                  >
                    <div
                      className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                        isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`${isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">Nenhum item encontrado</p>
                {searchTerm && (
                  <p className="text-xs mt-1">
                    Tente buscar por outro termo
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Botões de ação */}
          {filteredOptions.length > 0 && (
            <div className="flex border-t border-gray-200 bg-gray-50 rounded-b-md">
              {filteredSelectedCount === 0 || filteredSelectedCount < filteredOptions.length ? (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors rounded-bl-md"
                >
                  Selecionar {searchTerm ? 'Visíveis' : 'Todos'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors rounded-bl-md"
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