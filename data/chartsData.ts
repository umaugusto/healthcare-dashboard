// VERSAO GEMINI 0.1/data/chartsData.ts

/**
 * Centraliza todos os dados mockados para os gráficos.
 */

// Cores padrão do projeto
export const projectColors = {
  primary: '#3b82f6',
  secondary: '#8b5cf6', 
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  pastelGreen: '#86efac',
  pastelYellow: '#fde047', 
  pastelRed: '#fca5a5',
  pastelBlue: '#93c5fd',
  pastelPurple: '#d8b4fe',
  pastelOrange: '#fed7aa',
  pastelAmber: '#fef3c7',
  gray: '#6b7280',
  lightGray: '#f8fafc',
  mediumGray: '#e2e8f0'
};

// Constantes epidemiológicas
export const TOTAL_COM_CID = 1802;
export const TOTAL_VINCULADOS = 5500;
export const TOTAL_ELEGIVEIS = 6008;

// --- DADOS PARA A ABA VISÃO GERAL ---

export const demograficosData = {
  composicaoFamiliar: [
    { value: 42, color: '#9333ea', label: 'Dependentes' },
    { value: 58, color: '#c4b5fd', label: 'Titulares' }
  ],
  distribuicaoSexo: [
    { value: 53, color: '#db2777', label: 'Feminino' },
    { value: 47, color: '#2563eb', label: 'Masculino' }
  ],
  distribuicaoEtaria: [
    { value: 18, color: '#f59e0b', label: '0-17' },
    { value: 45, color: '#3b82f6', label: '18-39' },
    { value: 28, color: '#1e40af', label: '40-59' },
    { value: 9, color: '#1e3a8a', label: '60+' }
  ],
  tempoPrograma: [
    { value: 15, color: '#f59e0b', label: '<6 meses' },
    { value: 20, color: '#10b981', label: '6-12 meses' },
    { value: 30, color: '#059669', label: '1-2 anos' },
    { value: 35, color: '#047857', label: '>2 anos' }
  ]
};

export const coberturaData = {
  vidasElegiveis: 8950,
  vidasVinculadas: 7720,
  naoVinculados: 1230,
  controladoTotal: 4014,
  controleInadequadoTotal: 1930,
  inadequadoTotal: 1776,
  consultasMesAtual: 1843,
  novosVinculadosMes: 54,
  desvinculadosMes: 12,
  metaCobertura: 90,
  metaControlado: 70,
};

export const perfilSaudeData = {
  taxaAtual: 72.1,
  totalRespondentes: 5564,
  incrementoPeriodo: 4.1,
  incrementoAbsoluto: 316,
  metaResposta: 80,
  semResposta: 2156,
  vencendoMais12m: 852,
  respondentesNoPeriodo: 1543,
  agingData: [
    { label: 'Menos de 3 meses', percentage: 28, count: 2158, color: 'green' },
    { label: '3-9 meses', percentage: 35, count: 2702, color: 'yellow' },
    { label: 'Mais de 9 meses', percentage: 37, count: 2860, color: 'red' }
  ],
};

export const utilizacaoAPSData = {
  totalAtendimentos: 4825,
  pacientesUnicos: 3287,
  taxaRecorrencia: 1.47,
  incrementoMes: 342,
  taxaEncaminhamento: 17.7,
  consultasEvitadas: 3971,
  topMotivos: [
    { cid: 'I10', descricao: 'Hipertensão', atendimentos: 486, percentual: 10.1 },
    { cid: 'E11.9', descricao: 'Diabetes', atendimentos: 423, percentual: 8.8 },
    { cid: 'Z00.0', descricao: 'Exame geral', atendimentos: 387, percentual: 8.0 },
  ],
  topEncaminhamentos: [
    { especialidade: 'Ortopedia', encaminhamentos: 187, percentual: 21.9 },
    { especialidade: 'Cardiologia', encaminhamentos: 154, percentual: 18.0 },
    { especialidade: 'Endocrinologia', encaminhamentos: 128, percentual: 15.0 },
  ],
  distribuicaoRisco: [
    { nivel: 'Habitual', quantidade: 2654, percentual: 55, color: '#22c55e' },
    { nivel: 'Crescente', quantidade: 1448, percentual: 30, color: '#facc15' },
    { nivel: 'Alto Risco', quantidade: 723, percentual: 15, color: '#ef4444' }
  ]
};

export const utilizacaoPAVirtualData = {
    totalAtendimentos: 3110,
    pacientesUnicos: 2487,
    taxaRecorrencia: 1.25,
    incrementoMes: 186,
    taxaResolucao: 78.5,
    encaminhamentosEvitados: 2433,
    topMotivosGeral: [
      { cid: 'Z71.1', descricao: 'Aconselhamento', atendimentos: 486, percentual: 15.6 },
      { cid: 'J00', descricao: 'Nasofaringite', atendimentos: 342, percentual: 11.0 },
      { cid: 'M79.3', descricao: 'Dor generalizada', atendimentos: 280, percentual: 9.0 },
    ],
    distribuicaoUso: [
      { categoria: 'Adequada', usuarios: 1350, percentual: 54.3, color: '#22c55e' },
      { categoria: 'Moderada', usuarios: 750, percentual: 30.2, color: '#facc15' },
      { categoria: 'Frequente', usuarios: 287, percentual: 11.5, color: '#fb923c' },
      { categoria: 'Hiperutilização', usuarios: 100, percentual: 4.0, color: '#ef4444' }
    ],
    distribuicaoDesfecho: [
      { desfecho: 'Alta pós-teleconsulta', quantidade: 1555, percentual: 50.0, color: '#10b981' },
      { desfecho: 'Alta com enc. oportuno', quantidade: 933, percentual: 30.0, color: '#3b82f6' },
      { desfecho: 'Enc. PA/PS', quantidade: 622, percentual: 20.0, color: '#f59e0b' }
    ]
};


// --- DADOS PARA A ABA CRÔNICOS ---

export const cronicosKPIsData = [
    { id: 'hipertensao', label: 'Hipertensão', cid: 'I10', total: 1847, icon: 'Heart', color: 'rose' },
    { id: 'diabetes', label: 'Diabetes', cid: 'E11.9', total: 926, icon: 'Activity', color: 'orange' },
    { id: 'obesidade', label: 'Obesidade', cid: 'E66.9', total: 1544, icon: 'Scale', color: 'amber' },
    { id: 'ansiedade', label: 'Ansiedade', cid: 'F41.1', total: 500, icon: 'Brain', color: 'violet' },
    { id: 'depressao', label: 'Depressão', cid: 'F32.9', total: 272, icon: 'Brain', color: 'purple' },
    { id: 'dort', label: 'DORT/LER', cid: 'M79.0', total: 890, icon: 'Zap', color: 'stone' }
];

// --- DADOS PARA A ABA RASTREIOS ---

export const rastreiosKPIsData = [
    { 
      id: 'mamografia', 
      label: 'CA Mama', 
      pendentes: 512,
      elegíveis: 2100,
      realizados: 1588,
      percentualPendente: 24.4,
      percentualCobertura: 75.6,
      meta: 80,
      prazo: '3 meses',
      populacao: 'Mulheres 50-69 anos',
      icon: 'Users', 
      color: 'pink'
    },
    { 
      id: 'citologia', 
      label: 'CA Colo de Útero', 
      pendentes: 380,
      elegíveis: 1800,
      realizados: 1420,
      percentualPendente: 21.1,
      percentualCobertura: 78.9,
      meta: 85,
      prazo: '6 meses',
      populacao: 'Mulheres 25-64 anos',
      icon: 'Microscope', 
      color: 'rose'
    },
    { 
      id: 'colonoscopia', 
      label: 'CA Colorretal', 
      pendentes: 423,
      elegíveis: 1200,
      realizados: 777,
      percentualPendente: 35.3,
      percentualCobertura: 64.7,
      meta: 70,
      prazo: 'SOF: 2 anos | Colonoscopia: 10 anos',
      populacao: '50+ anos',
      detalhes: 'Considera Sangue Oculto nas Fezes (últimos 2 anos) ou Colonoscopia (últimos 10 anos)',
      icon: 'Stethoscope', 
      color: 'indigo'
    },
    { 
      id: 'phq9', 
      label: 'PHQ-9', 
      pendentes: 687,
      elegíveis: 3500,
      realizados: 2813,
      percentualPendente: 19.6,
      percentualCobertura: 80.4,
      meta: 90,
      prazo: '2 meses',
      populacao: 'Todos vinculados',
      icon: 'Brain', 
      color: 'purple'
    },
    { 
      id: 'gad7', 
      label: 'GAD-7', 
      pendentes: 560,
      elegíveis: 3500,
      realizados: 2940,
      percentualPendente: 16.0,
      percentualCobertura: 84.0,
      meta: 90,
      prazo: '2 meses',
      populacao: 'Todos vinculados',
      icon: 'Heart', 
      color: 'violet'
    },
    { 
      id: 'audit', 
      label: 'AUDIT', 
      pendentes: 892,
      elegíveis: 4000,
      realizados: 3108,
      percentualPendente: 22.3,
      percentualCobertura: 77.7,
      meta: 85,
      prazo: '6 meses',
      populacao: 'Adultos 18+',
      icon: 'Wine', 
      color: 'amber'
    },
    { 
      id: 'fagerstrom', 
      label: 'Fagerstrom', 
      pendentes: 345,
      elegíveis: 800,
      realizados: 455,
      percentualPendente: 43.1,
      percentualCobertura: 56.9,
      meta: 75,
      prazo: '3 meses',
      populacao: 'Fumantes declarados',
      icon: 'Cigarette', 
      color: 'orange'
    },
    { 
      id: 'framingham', 
      label: 'Framingham', 
      pendentes: 658,
      elegíveis: 2200,
      realizados: 1542,
      percentualPendente: 29.9,
      percentualCobertura: 70.1,
      meta: 80,
      prazo: '6 meses',
      populacao: '40+ anos',
      icon: 'Activity', 
      color: 'red'
    }
];

// Dados detalhados para Mamografia
export const dadosMamografia = {
  populacaoTotal: 2100,
  elegiveis: 2050,
  metaBienal: 80,
  coberturaAtual: 75.6,
  tempoMedioResultado: 15, // dias
  taxaReconvocacao: 8.2, // % que precisa repetir
  
  // Funil de rastreamento - 5 níveis como no padrão citologia
  funilRastreamento: [
    { etapa: 'Elegíveis ao rastreio', valor: 2050, percentual: 100 },
    { etapa: 'Exames solicitados', valor: 1780, percentual: 86.8 },
    { etapa: 'Exames realizados', valor: 1588, percentual: 77.5 },
    { etapa: 'Com alteração', valor: 142, percentual: 8.9 },
    { etapa: 'Em acompanhamento', valor: 138, percentual: 97.2 }
  ],
  
  // Aging dos exames
  agingExames: [
    { periodo: 'Nunca realizou', pacientes: 312, percentual: 15.2, cor: '#ef4444', prioridade: 'crítica' },
    { periodo: '> 3 anos', pacientes: 198, percentual: 9.7, cor: '#f59e0b', prioridade: 'alta' },
    { periodo: '2-3 anos', pacientes: 256, percentual: 12.5, cor: '#fbbf24', prioridade: 'média' },
    { periodo: '1-2 anos', pacientes: 742, percentual: 36.2, cor: '#86efac', prioridade: 'baixa' },
    { periodo: '< 1 ano', pacientes: 542, percentual: 26.4, cor: '#22c55e', prioridade: 'adequada' }
  ],
  
  // Estratificação por faixa etária
  estratificacao: [
    { 
      faixa: '50-54 anos', 
      total: 580, 
      realizados: 425, 
      pendentes: 155,
      cobertura: 73.3,
      alteracao: 4.2,
      biRads45: 18 
    },
    { 
      faixa: '55-59 anos', 
      total: 620, 
      realizados: 478, 
      pendentes: 142,
      cobertura: 77.1,
      alteracao: 5.8,
      biRads45: 28 
    },
    { 
      faixa: '60-64 anos', 
      total: 540, 
      realizados: 415, 
      pendentes: 125,
      cobertura: 76.9,
      alteracao: 7.1,
      biRads45: 29 
    },
    { 
      faixa: '65-69 anos', 
      total: 360, 
      realizados: 270, 
      pendentes: 90,
      cobertura: 75.0,
      alteracao: 8.3,
      biRads45: 22 
    }
  ],
  
  // Evolução temporal (últimos 12 meses)
  evolucaoTemporal: [
    { mes: 'Jan', cobertura: 68.2, meta: 80, realizados: 42 },
    { mes: 'Fev', cobertura: 69.5, meta: 80, realizados: 38 },
    { mes: 'Mar', cobertura: 70.8, meta: 80, realizados: 45 },
    { mes: 'Abr', cobertura: 71.2, meta: 80, realizados: 35 },
    { mes: 'Mai', cobertura: 72.1, meta: 80, realizados: 48 },
    { mes: 'Jun', cobertura: 72.8, meta: 80, realizados: 52 },
    { mes: 'Jul', cobertura: 73.4, meta: 80, realizados: 41 },
    { mes: 'Ago', cobertura: 74.0, meta: 80, realizados: 44 },
    { mes: 'Set', cobertura: 74.5, meta: 80, realizados: 38 },
    { mes: 'Out', cobertura: 75.1, meta: 80, realizados: 46 },
    { mes: 'Nov', cobertura: 75.4, meta: 80, realizados: 32 },
    { mes: 'Dez', cobertura: 75.6, meta: 80, realizados: 28 }
  ],
  
  // Fatores de risco identificados
  fatoresRisco: [
    { fator: 'História familiar', pacientes: 178, percentual: 8.7 },
    { fator: 'Mutação BRCA', pacientes: 12, percentual: 0.6 },
    { fator: 'Radioterapia prévia', pacientes: 23, percentual: 1.1 },
    { fator: 'Densidade mamária D', pacientes: 315, percentual: 15.4 },
    { fator: 'Sem fatores conhecidos', pacientes: 1572, percentual: 76.7 }
  ],
  
  // Classificação BI-RADS dos exames realizados
  classificacaoBiRads: [
    { categoria: 'BI-RADS 0', quantidade: 127, percentual: 8.0, descricao: 'Inconclusivo' },
    { categoria: 'BI-RADS 1', quantidade: 794, percentual: 50.0, descricao: 'Negativo' },
    { categoria: 'BI-RADS 2', quantidade: 572, percentual: 36.0, descricao: 'Benigno' },
    { categoria: 'BI-RADS 3', quantidade: 48, percentual: 3.0, descricao: 'Provavelmente benigno' },
    { categoria: 'BI-RADS 4', quantidade: 32, percentual: 2.0, descricao: 'Suspeito' },
    { categoria: 'BI-RADS 5', quantidade: 15, percentual: 1.0, descricao: 'Altamente suspeito' }
  ]
};

// Dados completos de Hipertensão
export const dadosBaseHipertensao = {
  totalSemSeguimento: 876,
  totalLC: 926,
  percentualLC: 51.4,
  taxaControle: 60.0,
  pacientesAltaPA: 148,
  rastreioFramingham: 34.2,
  medidasVencidas: 148,
  populacaoFiltrada: 'Todos os hipertensos',
  
  funilEpidemiologico: [
    { nivel: 'Elegíveis', quantidade: TOTAL_ELEGIVEIS, percentual: 100.0, cor: projectColors.pastelBlue },
    { nivel: 'Vinculados', quantidade: TOTAL_VINCULADOS, percentual: 91.5, cor: projectColors.pastelPurple },
    { nivel: 'Com CID', quantidade: TOTAL_COM_CID, percentual: 32.8, cor: '#c084fc' },
    { nivel: 'Em linha de cuidado', quantidade: 926, percentual: 51.4, cor: '#a855f7' }
  ],
  
  controlesPA: [
    { nivel: 'Bom controle', quantidade: 556, percentual: 60.0, cor: projectColors.pastelGreen },
    { nivel: 'Controle inadequado', quantidade: 222, percentual: 24.0, cor: projectColors.pastelYellow },
    { nivel: 'Sem medida recente', quantidade: 148, percentual: 16.0, cor: projectColors.pastelRed }
  ],
  
  distribuicaoTemporalMedidas: [
    { periodo: '0-3 meses', quantidade: 667, percentual: 72.0, cor: projectColors.pastelGreen },
    { periodo: '3-6 meses', quantidade: 87, percentual: 9.4, cor: projectColors.pastelYellow },
    { periodo: '6-12 meses', quantidade: 172, percentual: 18.6, cor: projectColors.pastelRed }
  ],
  
  examesAcompanhamento: [
    { exame: 'Creatinina', emDia: 742, total: 926, percentual: 80.1, cor: '#fca5a5' },
    { exame: 'Potássio', emDia: 713, total: 926, percentual: 77, cor: '#f87171' },
    { exame: 'Eletrocardiograma', emDia: 556, total: 926, percentual: 60, cor: '#ef4444' },
    { exame: 'Fundo de olho', emDia: 324, total: 926, percentual: 35, cor: '#dc2626' },
    { exame: 'Microalbuminúria', emDia: 278, total: 926, percentual: 30, cor: '#b91c1c' }
  ],
  
  topComorbidades: [
    { cid: 'E11.9', descricao: 'Diabetes mellitus tipo 2', pacientes: 389, percentual: 42, cor: projectColors.pastelRed },
    { cid: 'E78.5', descricao: 'Dislipidemia', pacientes: 315, percentual: 34, cor: projectColors.pastelBlue },
    { cid: 'E66.9', descricao: 'Obesidade', pacientes: 259, percentual: 28, cor: projectColors.pastelYellow },
    { cid: 'N18.9', descricao: 'Doença renal crônica', pacientes: 111, percentual: 12, cor: projectColors.pastelPurple },
    { cid: 'Z87.891', descricao: 'Hist. pessoal de nicotina', pacientes: 85, percentual: 9, cor: '#a78bfa' }
  ],
  
  fatoresRisco: [
    { fator: 'Sedentarismo', pacientes: 741, percentual: 80, cor: '#f87171' },
    { fator: 'Dieta rica em sódio', pacientes: 649, percentual: 70, cor: '#fb923c' },
    { fator: 'Estresse crônico', pacientes: 463, percentual: 50, cor: '#a3a3a3' },
    { fator: 'Sono inadequado', pacientes: 426, percentual: 46, cor: '#c084fc' },
    { fator: 'Tabagismo', pacientes: 278, percentual: 30, cor: '#fbbf24' }
  ],
  
  estagioMotivacional: [
    { estagio: 'Pré-contemplação', quantidade: 370, percentual: 40.0, cor: '#ef4444' },
    { estagio: 'Contemplação', quantidade: 278, percentual: 30.0, cor: '#f59e0b' },
    { estagio: 'Preparação', quantidade: 185, percentual: 20.0, cor: '#eab308' },
    { estagio: 'Ação', quantidade: 65, percentual: 7.0, cor: '#22c55e' },
    { estagio: 'Manutenção', quantidade: 28, percentual: 3.0, cor: '#16a34a' }
  ],
  
  distribuicaoEstagio: {
    segments: [
      { label: 'Estágio 1', value: 861, percentage: 93.0, color: projectColors.pastelGreen },
      { label: 'Estágio 2', value: 46, percentage: 5.0, color: projectColors.pastelYellow },
      { label: 'Estágio 3', value: 19, percentage: 2.0, color: projectColors.pastelRed }
    ]
  },
  
  estratificacaoFramingham: {
    segments: [
      { label: 'Baixo Risco', value: 565, percentage: 61.2, color: projectColors.pastelGreen },
      { label: 'Risco Intermediário', value: 223, percentage: 24.1, color: projectColors.pastelYellow },
      { label: 'Alto Risco', value: 138, percentage: 14.7, color: projectColors.pastelRed }
    ]
  }
};

// Heatmap mensal de taxa de controle
export const heatmapTaxaControle = [
  { mes: 'Jan', valor: 58, intensidade: 0.58, incremento: 0 },
  { mes: 'Fev', valor: 62, intensidade: 0.62, incremento: 4 },
  { mes: 'Mar', valor: 65, intensidade: 0.65, incremento: 3 },
  { mes: 'Abr', valor: 63, intensidade: 0.63, incremento: -2 },
  { mes: 'Mai', valor: 68, intensidade: 0.68, incremento: 5 },
  { mes: 'Jun', valor: 71, intensidade: 0.71, incremento: 3 },
  { mes: 'Jul', valor: 69, intensidade: 0.69, incremento: -2 },
  { mes: 'Ago', valor: 72, intensidade: 0.72, incremento: 3 },
  { mes: 'Set', valor: 70, intensidade: 0.70, incremento: -2 },
  { mes: 'Out', valor: 74, intensidade: 0.74, incremento: 4 },
  { mes: 'Nov', valor: 73, intensidade: 0.73, incremento: -1 },
  { mes: 'Dez', valor: 68.5, intensidade: 0.685, incremento: -4.5 }
];

export const dadosBaseDiabetes = {
  totalSemAcompanhamento: 295,
  totalLC: 1158,
  percentualLC: 79.7,
  controlesGlicemico: [
    { nivel: 'Bom controle', quantidade: 778, percentual: 67.2, cor: '#86efac' },
    { nivel: 'Controle inadequado', quantidade: 256, percentual: 22.1, cor: '#fde047' },
    { nivel: 'Não controlado', quantidade: 124, percentual: 10.7, cor: '#fca5a5' }
  ],
  topComorbidades: [
    { cid: 'I10', descricao: 'Hipertensão', pacientes: 869, percentual: 75, cor: '#fca5a5' },
    { cid: 'E78.5', descricao: 'Dislipidemia', pacientes: 787, percentual: 68, cor: '#93c5fd' },
    { cid: 'E66.9', descricao: 'Obesidade', pacientes: 486, percentual: 42, cor: '#fde047' },
  ],
};

export const dadosBaseObesidade = {
    totalSemAcompanhamento: 463,
    totalLC: 1544,
    percentualLC: 77.0,
    distribuicaoEvolucao: [
        { nivel: 'Redução (>5%)', quantidade: 653, percentual: 42.3, cor: '#86efac' },
        { nivel: 'Estável (±5%)', quantidade: 579, percentual: 37.5, cor: '#fde047' },
        { nivel: 'Aumento (>5%)', quantidade: 312, percentual: 20.2, cor: '#fca5a5' }
    ],
    distribuicaoGrau: {
        segments: [
          { label: 'Sobrepeso', value: 618, percentage: 40.0, color: '#fed7aa' },
          { label: 'Obesidade I', value: 541, percentage: 35.0, color: '#fbbf24' },
          { label: 'Obesidade II', value: 270, percentage: 17.5, color: '#f59e0b' },
          { label: 'Obesidade III', value: 115, percentage: 7.5, color: '#ea580c' }
        ]
    },
};

export const dadosBaseSaudeMental = {
    totalSemAcompanhamento: 290,
    totalLC: 966,
    percentualLC: 78.1,
    distribuicaoTratamento: [
        { nivel: 'Em acompanhamento regular', quantidade: 664, percentual: 68.7, cor: '#86efac' },
        { nivel: 'Acompanhamento irregular', quantidade: 193, percentual: 20.0, cor: '#fde047' },
        { nivel: 'Sem acompanhamento', quantidade: 109, percentual: 11.3, cor: '#fca5a5' }
    ],
    distribuicaoDiagnostico: {
        segments: [
          { label: 'Ansiedade', value: 386, percentage: 40.0, color: '#ddd6fe' },
          { label: 'Depressão', value: 290, percentage: 30.0, color: '#c084fc' },
          { label: 'Misto', value: 193, percentage: 20.0, color: '#a78bfa' },
          { label: 'Outros', value: 97, percentage: 10.0, color: '#e5e7eb' }
        ]
    },
};
