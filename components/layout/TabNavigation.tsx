// VERSAO C/components/layout/TabNavigation.tsx
import React from 'react';
import { Plus } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'visao-geral', label: 'Visão Geral', icon: '📊' },
    { id: 'cronicos', label: 'Crônicos', icon: '🏥' },
    { id: 'rastreios', label: 'Rastreios', icon: '🔍' },
    { id: 'utilizacao', label: 'Utilização', icon: '📈' },
    { id: 'tabela', label: 'Tabela', icon: '📋' }
  ];

  return (
    <div className="bg-gray-100 border-t border-gray-200 px-4 py-2">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-blue-600 border-t-2 border-x border-blue-500 shadow-sm -mb-[1px]' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
        <button disabled className="px-3 py-2 rounded-t-lg text-gray-400 bg-gray-200 cursor-not-allowed opacity-50 ml-2" title="Em breve">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
