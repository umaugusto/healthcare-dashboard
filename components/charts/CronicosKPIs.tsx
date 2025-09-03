// VERSAO GEMINI/components/charts/CronicosKPIs.tsx
import React from 'react';
import { Card } from '../ui/card';
import { Heart, Activity, Scale, Brain, Pill, Stethoscope, Zap } from 'lucide-react';
import { cronicosKPIsData } from '../../data/chartsData';

const iconMap: { [key: string]: React.ElementType } = {
  Heart, Activity, Scale, Brain, Pill, Zap
};

export default function CronicosKPIs() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cronicosKPIsData.map((condition) => {
        const Icon = iconMap[condition.icon] || Stethoscope;
        const colors: { [key: string]: string } = {
          rose: 'bg-rose-50 text-rose-600 border-rose-200',
          orange: 'bg-orange-50 text-orange-600 border-orange-200',
          amber: 'bg-amber-50 text-amber-600 border-amber-200',
          violet: 'bg-violet-50 text-violet-600 border-violet-200',
          purple: 'bg-purple-50 text-purple-600 border-purple-200',
          stone: 'bg-stone-50 text-stone-600 border-stone-200',
        };
        const colorClasses = colors[condition.color] || 'bg-gray-50 text-gray-600 border-gray-200';

        return (
          <Card 
            key={condition.id}
            className={`cursor-pointer hover:shadow-md transition-all border ${colorClasses.split(' ')[2]}`}
          >
            <div className={`p-3 ${colorClasses.split(' ')[0]}`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full bg-white border ${colorClasses.split(' ')[2]} flex-shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${colorClasses.split(' ')[1]}`} />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="text-xs font-semibold text-gray-800 leading-tight truncate">{condition.label}</h3>
                  <div className="text-xs text-gray-600 font-medium">CID: {condition.cid}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg font-bold ${colorClasses.split(' ')[1]} leading-tight`}>
                    {condition.total.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
