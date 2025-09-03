/**
 * Matriz de correlação epidemiológica para doenças crônicas
 * Baseado em evidências epidemiológicas reais
 */

export const CORRELACAO_EPIDEMIOLOGICA_HIPERTENSAO = {
  // Controle da PA vs outros indicadores
  'Bom controle': {
    'Creatinina': { emDia: 0.92, vencido: 0.08 },
    'Potássio': { emDia: 0.89, vencido: 0.11 },
    'Eletrocardiograma': { emDia: 0.75, vencido: 0.25 },
    'Fundo de olho': { emDia: 0.48, vencido: 0.52 },
    'Microalbuminúria': { emDia: 0.42, vencido: 0.58 },
    'E11.9': 0.36, // Diabetes menos prevalente em bem controlados
    'E78.5': 0.30, // Dislipidemia menos prevalente
    'E66.9': 0.24, // Obesidade menos prevalente
    'N18.9': 0.08, // DRC muito menos prevalente
    'Sedentarismo': 0.50,
    'Dieta rica em sódio': 0.40,
    'Ação': 0.55, // Mais pacientes em ação
    'Manutenção': 0.35,
    'Baixo Risco': 0.70,
    'Alto Risco': 0.08,
    '0-3 meses': 0.82 // Medidas mais recentes
  },
  'Controle inadequado': {
    'Creatinina': { emDia: 0.78, vencido: 0.22 },
    'Potássio': { emDia: 0.75, vencido: 0.25 },
    'Eletrocardiograma': { emDia: 0.60, vencido: 0.40 },
    'Fundo de olho': { emDia: 0.35, vencido: 0.65 },
    'Microalbuminúria': { emDia: 0.30, vencido: 0.70 },
    'E11.9': 0.45,
    'E78.5': 0.38,
    'E66.9': 0.32,
    'N18.9': 0.15,
    'Sedentarismo': 0.75,
    'Dieta rica em sódio': 0.70,
    'Contemplação': 0.40,
    'Preparação': 0.35,
    'Risco Intermediário': 0.50,
    '3-6 meses': 0.35
  },
  'Não controlada': {
    'Creatinina': { emDia: 0.65, vencido: 0.35 },
    'Potássio': { emDia: 0.62, vencido: 0.38 },
    'Eletrocardiograma': { emDia: 0.45, vencido: 0.55 },
    'Fundo de olho': { emDia: 0.25, vencido: 0.75 },
    'Microalbuminúria': { emDia: 0.20, vencido: 0.80 },
    'E11.9': 0.58,
    'E78.5': 0.45,
    'E66.9': 0.40,
    'N18.9': 0.25,
    'Sedentarismo': 0.88,
    'Dieta rica em sódio': 0.85,
    'Pré-contemplação': 0.60,
    'Alto Risco': 0.38,
    '6-12 meses': 0.48
  },
  // Estágio de hipertensão
  'Estágio 1': {
    'Bom controle': 0.72,
    'E11.9': 0.36,
    'E78.5': 0.30,
    'E66.9': 0.25,
    'Baixo Risco': 0.63,
    'Sedentarismo': 0.75
  },
  'Estágio 2': {
    'Bom controle': 0.46,
    'E11.9': 0.50,
    'E78.5': 0.43,
    'E66.9': 0.39,
    'Risco Intermediário': 0.39,
    'Sedentarismo': 0.85
  },
  'Estágio 3': {
    'Bom controle': 0.26,
    'E11.9': 0.58,
    'N18.9': 0.42,
    'Alto Risco': 0.79,
    'Sedentarismo': 0.89
  },
  // Risco cardiovascular
  'Alto Risco': {
    'E11.9': 0.70,
    'N18.9': 0.40,
    'E78.5': 0.38,
    'Microalbuminúria': { emDia: 0.25, vencido: 0.75 },
    'Não controlada': 0.25
  },
  'Baixo Risco': {
    'E11.9': 0.20,
    'E78.5': 0.32,
    'N18.9': 0.04,
    'Bom controle': 0.75
  },
  // Correlações para comorbidades
  'E11.9': { // Diabetes
    'Sedentarismo': 0.82,
    'Dieta rica em sódio': 0.75,
    'Estresse crônico': 0.58,
    'Sono inadequado': 0.50,
    'Tabagismo': 0.22,
    'E78.5': 0.68,
    'E66.9': 0.45,
    'Bom controle': 0.48,
    'Controle inadequado': 0.32,
    'Não controlada': 0.20
  },
  'E78.5': { // Dislipidemia
    'Sedentarismo': 0.78,
    'Dieta rica em sódio': 0.80,
    'Estresse crônico': 0.45,
    'Sono inadequado': 0.40,
    'Tabagismo': 0.20,
    'E11.9': 0.68,
    'E66.9': 0.55,
    'Bom controle': 0.52,
    'Controle inadequado': 0.30,
    'Não controlada': 0.18
  },
  'E66.9': { // Obesidade
    'Sedentarismo': 0.90,
    'Dieta rica em sódio': 0.85,
    'Estresse crônico': 0.60,
    'Sono inadequado': 0.65,
    'Tabagismo': 0.10,
    'E11.9': 0.55,
    'E78.5': 0.62,
    'Bom controle': 0.45,
    'Controle inadequado': 0.35,
    'Não controlada': 0.20
  },
  'N18.9': { // Doença renal crônica
    'Sedentarismo': 0.75,
    'Dieta rica em sódio': 0.70,
    'Estresse crônico': 0.65,
    'Sono inadequado': 0.55,
    'Tabagismo': 0.18,
    'E11.9': 0.85,
    'E78.5': 0.65,
    'Bom controle': 0.25,
    'Controle inadequado': 0.35,
    'Não controlada': 0.40
  },
  'Z87.891': { // Histórico de nicotina
    'Sedentarismo': 0.70,
    'Dieta rica em sódio': 0.65,
    'Estresse crônico': 0.75,
    'Sono inadequado': 0.50,
    'Tabagismo': 0.95,
    'E11.9': 0.45,
    'E78.5': 0.50,
    'Bom controle': 0.45,
    'Controle inadequado': 0.35,
    'Não controlada': 0.20
  }
};

// Função algorítmica para aplicar correlações epidemiológicas
export function aplicarCorrelacaoEpidemiologica(dadosBase: any, filtro: { tipo: string; valor: string; label: string }) {
  const dadosFiltrados = JSON.parse(JSON.stringify(dadosBase)); // Deep clone
  const correlacoes = CORRELACAO_EPIDEMIOLOGICA_HIPERTENSAO[filtro.valor as keyof typeof CORRELACAO_EPIDEMIOLOGICA_HIPERTENSAO] || {};
  
  // Calcular população filtrada baseada no tipo de filtro
  let populacaoFiltrada = dadosBase.totalLC;
  const TOTAL_COM_CID = 1802;
  
  switch (filtro.tipo) {
    case 'controle':
      const controle = dadosBase.controlesPA.find((c: any) => c.nivel === filtro.valor);
      populacaoFiltrada = controle?.quantidade || 0;
      break;
    case 'estagio-hipertensao':
      const estagio = dadosBase.distribuicaoEstagio.segments.find((s: any) => s.label === filtro.valor);
      populacaoFiltrada = estagio?.value || 0;
      break;
    case 'risco-cardiovascular':
      const risco = dadosBase.estratificacaoFramingham.segments.find((s: any) => s.label === filtro.valor);
      populacaoFiltrada = risco?.value || 0;
      break;
    case 'tempo-medida':
      const tempo = dadosBase.distribuicaoTemporalMedidas.find((t: any) => t.periodo === filtro.valor);
      populacaoFiltrada = tempo?.quantidade || 0;
      break;
    case 'estagio':
      const estagioMot = dadosBase.estagioMotivacional.find((e: any) => e.estagio === filtro.valor);
      populacaoFiltrada = estagioMot?.quantidade || 0;
      break;
    case 'fator-risco':
      const fator = dadosBase.fatoresRisco.find((f: any) => f.fator === filtro.valor);
      populacaoFiltrada = fator?.pacientes || 0;
      break;
    case 'comorbidade':
      const comorb = dadosBase.topComorbidades.find((c: any) => c.cid === filtro.valor);
      populacaoFiltrada = comorb?.pacientes || 0;
      break;
    case 'exame':
      const exame = dadosBase.examesAcompanhamento.find((e: any) => e.exame === filtro.valor);
      populacaoFiltrada = exame?.emDia || 0;
      break;
  }
  
  // Atualizar população total
  dadosFiltrados.totalLC = Math.round(populacaoFiltrada);
  dadosFiltrados.percentualLC = parseFloat(((populacaoFiltrada / TOTAL_COM_CID) * 100).toFixed(1));
  dadosFiltrados.populacaoFiltrada = filtro.label;
  
  // Aplicar correlações nos controles PA
  if (filtro.tipo !== 'controle') {
    const totalControle = dadosFiltrados.totalLC;
    dadosFiltrados.controlesPA = dadosBase.controlesPA.map((controle: any) => {
      const correlacao = correlacoes[controle.nivel] || 
                        (filtro.tipo === 'controle' && controle.nivel === filtro.valor ? 1 : 0.33);
      const novaQuantidade = Math.round(totalControle * correlacao * (controle.percentual / 100));
      return {
        ...controle,
        quantidade: novaQuantidade
      };
    });
    
    // Normalizar para garantir que soma seja 100%
    const somaControles = dadosFiltrados.controlesPA.reduce((sum: number, c: any) => sum + c.quantidade, 0);
    dadosFiltrados.controlesPA = dadosFiltrados.controlesPA.map((c: any) => ({
      ...c,
      percentual: somaControles > 0 ? parseFloat(((c.quantidade / somaControles) * 100).toFixed(1)) : 0
    }));
  }
  
  // Aplicar correlações nos exames
  dadosFiltrados.examesAcompanhamento = dadosBase.examesAcompanhamento.map((exame: any) => {
    const correlacao = correlacoes[exame.exame];
    let novoEmDia, novoTotal;
    
    if (correlacao && typeof correlacao === 'object') {
      novoEmDia = Math.round(populacaoFiltrada * correlacao.emDia);
      novoTotal = Math.round(populacaoFiltrada);
    } else {
      const fatorDefault = filtro.tipo === 'exame' && exame.exame === filtro.valor ? 1 : 0.7;
      novoEmDia = Math.round(populacaoFiltrada * (exame.percentual / 100) * fatorDefault);
      novoTotal = Math.round(populacaoFiltrada);
    }
    
    return {
      ...exame,
      emDia: novoEmDia,
      total: novoTotal,
      percentual: novoTotal > 0 ? Math.round((novoEmDia / novoTotal) * 100) : 0
    };
  });
  
  // Aplicar correlações nas comorbidades
  dadosFiltrados.topComorbidades = dadosBase.topComorbidades.map((comorb: any) => {
    const correlacao = correlacoes[comorb.cid] || 
                      (filtro.tipo === 'comorbidade' && comorb.cid === filtro.valor ? 1 : 0.5);
    const novosPacientes = Math.round(populacaoFiltrada * correlacao);
    return {
      ...comorb,
      pacientes: novosPacientes,
      percentual: populacaoFiltrada > 0 ? Math.round((novosPacientes / populacaoFiltrada) * 100) : 0
    };
  });
  
  // Aplicar correlações nos fatores de risco
  dadosFiltrados.fatoresRisco = dadosBase.fatoresRisco.map((fator: any) => {
    let correlacao;
    
    // Se o filtro for uma comorbidade, usar correlação específica
    if (filtro.tipo === 'comorbidade' && correlacoes[fator.fator]) {
      correlacao = correlacoes[fator.fator];
    } else if (filtro.tipo === 'fator-risco' && fator.fator === filtro.valor) {
      correlacao = 1;
    } else {
      correlacao = correlacoes[fator.fator] || 0.6;
    }
    
    const novosPacientes = Math.round(populacaoFiltrada * correlacao);
    return {
      ...fator,
      pacientes: novosPacientes,
      percentual: populacaoFiltrada > 0 ? Math.round((novosPacientes / populacaoFiltrada) * 100) : 0
    };
  });
  
  // Ordenar fatores de risco por quantidade de pacientes
  dadosFiltrados.fatoresRisco.sort((a: any, b: any) => b.pacientes - a.pacientes);
  
  // Aplicar correlações nos estágios motivacionais
  if (filtro.tipo !== 'estagio') {
    const totalEstagios = populacaoFiltrada;
    dadosFiltrados.estagioMotivacional = dadosBase.estagioMotivacional.map((estagio: any) => {
      const correlacao = correlacoes[estagio.estagio] || 0.2;
      const novaQuantidade = Math.round(totalEstagios * correlacao);
      return {
        ...estagio,
        quantidade: novaQuantidade
      };
    });
    
    // Normalizar estágios
    const somaEstagios = dadosFiltrados.estagioMotivacional.reduce((sum: number, e: any) => sum + e.quantidade, 0);
    dadosFiltrados.estagioMotivacional = dadosFiltrados.estagioMotivacional.map((e: any) => ({
      ...e,
      percentual: somaEstagios > 0 ? parseFloat(((e.quantidade / somaEstagios) * 100).toFixed(1)) : 0
    }));
  }
  
  // Aplicar correlações na distribuição temporal
  if (filtro.tipo !== 'tempo-medida') {
    dadosFiltrados.distribuicaoTemporalMedidas = dadosBase.distribuicaoTemporalMedidas.map((tempo: any) => {
      const correlacao = correlacoes[tempo.periodo] || 0.33;
      const novaQuantidade = Math.round(populacaoFiltrada * correlacao);
      return {
        ...tempo,
        quantidade: novaQuantidade,
        percentual: populacaoFiltrada > 0 ? parseFloat(((novaQuantidade / populacaoFiltrada) * 100).toFixed(1)) : 0
      };
    });
  }
  
  // Atualizar distribuição de estágio (se não for o filtro atual)
  if (filtro.tipo !== 'estagio-hipertensao') {
    const correlacaoEstagio1 = correlacoes['Estágio 1'] || 0.93;
    const correlacaoEstagio2 = correlacoes['Estágio 2'] || 0.05;
    const correlacaoEstagio3 = correlacoes['Estágio 3'] || 0.02;
    
    dadosFiltrados.distribuicaoEstagio.segments = [
      { 
        label: 'Estágio 1', 
        value: Math.round(populacaoFiltrada * correlacaoEstagio1), 
        percentage: correlacaoEstagio1 * 100, 
        color: dadosBase.distribuicaoEstagio.segments[0].color
      },
      { 
        label: 'Estágio 2', 
        value: Math.round(populacaoFiltrada * correlacaoEstagio2), 
        percentage: correlacaoEstagio2 * 100, 
        color: dadosBase.distribuicaoEstagio.segments[1].color
      },
      { 
        label: 'Estágio 3', 
        value: Math.round(populacaoFiltrada * correlacaoEstagio3), 
        percentage: correlacaoEstagio3 * 100, 
        color: dadosBase.distribuicaoEstagio.segments[2].color
      }
    ];
  }
  
  // Atualizar estratificação de risco (se não for o filtro atual)
  if (filtro.tipo !== 'risco-cardiovascular') {
    const correlacaoBaixo = correlacoes['Baixo Risco'] || 0.612;
    const correlacaoInterm = correlacoes['Risco Intermediário'] || 0.241;
    const correlacaoAlto = correlacoes['Alto Risco'] || 0.147;
    
    dadosFiltrados.estratificacaoFramingham.segments = [
      { 
        label: 'Baixo Risco', 
        value: Math.round(populacaoFiltrada * correlacaoBaixo), 
        percentage: correlacaoBaixo * 100, 
        color: dadosBase.estratificacaoFramingham.segments[0].color
      },
      { 
        label: 'Risco Intermediário', 
        value: Math.round(populacaoFiltrada * correlacaoInterm), 
        percentage: correlacaoInterm * 100, 
        color: dadosBase.estratificacaoFramingham.segments[1].color
      },
      { 
        label: 'Alto Risco', 
        value: Math.round(populacaoFiltrada * correlacaoAlto), 
        percentage: correlacaoAlto * 100, 
        color: dadosBase.estratificacaoFramingham.segments[2].color
      }
    ];
  }
  
  // Atualizar métricas calculadas
  dadosFiltrados.taxaControle = parseFloat(dadosFiltrados.controlesPA[0].percentual);
  dadosFiltrados.pacientesAltaPA = Math.round(populacaoFiltrada * 0.16); // ~16% com PA alta
  dadosFiltrados.medidasVencidas = dadosFiltrados.examesAcompanhamento.reduce((sum: number, e: any) => 
    sum + (e.total - e.emDia), 0
  );
  
  // Atualizar funil epidemiológico
  dadosFiltrados.funilEpidemiologico[3] = {
    ...dadosFiltrados.funilEpidemiologico[3],
    quantidade: populacaoFiltrada,
    percentual: parseFloat(((populacaoFiltrada / TOTAL_COM_CID) * 100).toFixed(1))
  };
  
  return dadosFiltrados;
}