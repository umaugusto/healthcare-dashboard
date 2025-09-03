// VERSAO C/components/shared/MultiSelect.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { SelectOption } from '../../types';

interface MultiSelectProps {
  options: SelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export default function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
    onChange(options.map(opt => opt.value));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedLabels = selected.map(
    (value) => options.find((opt) => opt.value === value)?.label || value
  );

  const maxHeight = Math.min(options.length * 40 + 60, 400);

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={`truncate ${selected.length === 0 ? "text-gray-500" : "text-gray-900"}`}>
          {selected.length === 0
            ? placeholder
            : selected.length === 1
              ? selectedLabels[0]
              : `${selected.length} selecionados`}
        </span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
          style={{ maxHeight: `${maxHeight}px`, zIndex: 9999 }}
        >
          <div className="p-1" style={{ maxHeight: `${maxHeight - 40}px`, overflowY: 'auto' }}>
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 rounded px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleOption(option.value)}
                >
                  <div
                    className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-gray-700">{option.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex border-t border-gray-200 bg-white rounded-b-md">
            {selected.length === 0 || selected.length < options.length ? (
              <button
                type="button"
                onClick={handleSelectAll}
                className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors rounded-bl-md"
              >
                Selecionar Todos
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors rounded-bl-md"
              >
                Limpar seleção
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
