// VERSAO C/components/layout/DashboardHeader.tsx
import React from 'react';
import { clienteOptions } from '../../constants/filters';

interface DashboardHeaderProps {
  selectedCliente?: string;
}

export default function DashboardHeader({ selectedCliente }: DashboardHeaderProps) {
  const clienteLabel = clienteOptions.find(opt => opt.value === selectedCliente)?.label;

  return (
    <div className="px-6 py-3 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900">Painel APS Operacional</h1>
            {clienteLabel && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-base font-bold text-gray-800">{clienteLabel}</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-600">Análise populacional integrada</p>
        </div>
      </div>
    </div>
  );
}
