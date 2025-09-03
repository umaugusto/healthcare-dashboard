// VERSAO GEMINI/hooks/useEpidemiologicalData.ts
import { useMemo } from 'react';
import { LocalFilter } from '../types';

// Simulação da lógica de correlação epidemiológica.
const applyCorrelation = (baseData: any, localFilter: LocalFilter | null) => {
  if (!localFilter) return baseData;

  const filteredData = JSON.parse(JSON.stringify(baseData));

  // Lógica de simulação: reduz os valores de outras categorias quando uma é selecionada.
  // Isso imita o comportamento de re-cálculo da VERSAO C.
  Object.keys(filteredData).forEach(key => {
    const dataArray = filteredData[key];
    if (Array.isArray(dataArray) && dataArray.length > 0 && dataArray[0].quantidade !== undefined) {
      const total = dataArray.reduce((sum: number, item: any) => sum + item.quantidade, 0);
      
      dataArray.forEach((item: any) => {
        if (item.nivel === localFilter.value) {
          item.quantidade = Math.floor(total * 0.75); // 75% do total para o item selecionado
        } else {
          item.quantidade = Math.floor(total * 0.125); // 12.5% para os outros
        }
        item.percentual = parseFloat(((item.quantidade / total) * 100).toFixed(1));
      });
    }
  });

  return filteredData;
};

export function useEpidemiologicalData(baseData: any, localFilter: LocalFilter | null) {
  const filteredData = useMemo(() => {
    return applyCorrelation(baseData, localFilter);
  }, [baseData, localFilter]);

  return filteredData;
}
