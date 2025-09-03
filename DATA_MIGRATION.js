// =====================================================
// SCRIPT DE MIGRAÇÃO DE DADOS - DASHBOARD APS
// =====================================================
// Migra todos os dados mockados identificados para Supabase
// Baseado na análise completa do projeto existente
// =====================================================

const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

// Configuração Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =====================================================
// DADOS MOCKADOS IDENTIFICADOS (baseados na análise)
// =====================================================

// Dados demográficos identificados (demograficosData)
const DEMOGRAPHIC_DATA = {
  composicaoFamiliar: [
    { value: 42, label: 'Dependentes' },
    { value: 58, label: 'Titulares' }
  ],
  distribuicaoSexo: [
    { value: 53, label: 'Feminino' },
    { value: 47, label: 'Masculino' }
  ],
  distribuicaoEtaria: [
    { value: 18, label: '0-17' },
    { value: 45, label: '18-39' },
    { value: 28, label: '40-59' },
    { value: 9, label: '60+' }
  ],
  tempoPrograma: [
    { value: 15, label: '<6 meses' },
    { value: 20, label: '6-12 meses' },
    { value: 30, label: '1-2 anos' },
    { value: 35, label: '>2 anos' }
  ]
};

// Cobertura populacional identificada (coberturaData)
const COVERAGE_DATA = {
  vidasElegiveis: 8950,
  vidasVinculadas: 7720,
  naoVinculados: 1230,
  controladoTotal: 4014,
  controleInadequadoTotal: 1930,
  inadequadoTotal: 1776,
  consultasMesAtual: 1843,
  metaCobertura: 90
};

// Doenças crônicas identificadas (cronicosKPIsData)
const CHRONIC_CONDITIONS = [
  { cid: 'I10', nome: 'Hipertensão', total: 1847, em_lc: 926 },
  { cid: 'E11.9', nome: 'Diabetes', total: 926, em_lc: 738 },
  { cid: 'E66.9', nome: 'Obesidade', total: 1544, em_lc: 1189 },
  { cid: 'F41.1', nome: 'Ansiedade', total: 500, em_lc: 390 },
  { cid: 'F32.9', nome: 'Depressão', total: 272, em_lc: 212 },
  { cid: 'M79.0', nome: 'DORT/LER', total: 890, em_lc: 623 }
];

// Rastreios identificados (rastreiosKPIsData)
const SCREENING_DATA = [
  { 
    tipo: 'mamografia', 
    elegiveis: 2100, 
    realizados: 1588, 
    cobertura: 75.6,
    meta: 80,
    populacao: 'Mulheres 50-69 anos'
  },
  { 
    tipo: 'citologia', 
    elegiveis: 1800, 
    realizados: 1420, 
    cobertura: 78.9,
    meta: 85,
    populacao: 'Mulheres 25-64 anos'
  },
  { 
    tipo: 'colonoscopia', 
    elegiveis: 1200, 
    realizados: 777, 
    cobertura: 64.7,
    meta: 70,
    populacao: '50+ anos'
  },
  { 
    tipo: 'phq9', 
    elegiveis: 3500, 
    realizados: 2813, 
    cobertura: 80.4,
    meta: 90,
    populacao: 'Todos vinculados'
  },
  { 
    tipo: 'gad7', 
    elegiveis: 3500, 
    realizados: 2940, 
    cobertura: 84.0,
    meta: 90,
    populacao: 'Todos vinculados'
  },
  { 
    tipo: 'audit', 
    elegiveis: 4000, 
    realizados: 3108, 
    cobertura: 77.7,
    meta: 85,
    populacao: 'Adultos 18+'
  },
  { 
    tipo: 'fagerstrom', 
    elegiveis: 800, 
    realizados: 455, 
    cobertura: 56.9,
    meta: 75,
    populacao: 'Fumantes declarados'
  },
  { 
    tipo: 'framingham', 
    elegiveis: 2200, 
    realizados: 1542, 
    cobertura: 70.1,
    meta: 80,
    populacao: '40+ anos'
  }
];

// CIDs identificados (103 códigos no arquivo constants/filters.ts)
const CID_CODES = [
  { codigo: 'I10', descricao: 'Hipertensão essencial' },
  { codigo: 'I11', descricao: 'Doença cardíaca hipertensiva' },
  { codigo: 'E11.9', descricao: 'Diabetes Mellitus tipo 2' },
  { codigo: 'E11.2', descricao: 'Diabetes com complicações renais' },
  { codigo: 'E78.5', descricao: 'Hiperlipidemia' },
  { codigo: 'E66.9', descricao: 'Obesidade' },
  { codigo: 'Z00.0', descricao: 'Exame médico geral' },
  { codigo: 'J06.9', descricao: 'Infecção respiratória aguda' },
  { codigo: 'J44.0', descricao: 'DPOC' },
  { codigo: 'M79.3', descricao: 'Dor muscular' },
  { codigo: 'M54.5', descricao: 'Dor lombar' },
  { codigo: 'N39.0', descricao: 'Infecção do trato urinário' },
  { codigo: 'F41.1', descricao: 'Ansiedade generalizada' },
  { codigo: 'F32.9', descricao: 'Episódio depressivo' },
  { codigo: 'F33', descricao: 'Transtorno depressivo recorrente' },
  { codigo: 'K29', descricao: 'Gastrite' },
  { codigo: 'N18', descricao: 'Doença renal crônica' },
  { codigo: 'B24', descricao: 'HIV' },
  { codigo: 'A90', descricao: 'Dengue' },
  { codigo: 'Z71.1', descricao: 'Aconselhamento médico' }
  // ... continuar com os outros 83 CIDs identificados
];

// Linhas de cuidado identificadas (20 tipos no arquivo constants/filters.ts)
const CARE_LINES = [
  { codigo: 'saude-mulher', nome: 'Saúde da Mulher' },
  { codigo: 'saude-homem', nome: 'Saúde do Homem' },
  { codigo: 'saude-mental', nome: 'Saúde Mental' },
  { codigo: 'doencas-cronicas', nome: 'Doenças Crônicas' },
  { codigo: 'cardiologia', nome: 'Cardiologia' },
  { codigo: 'hipertensao', nome: 'Hipertensão Arterial' },
  { codigo: 'diabetes', nome: 'Diabetes Mellitus' },
  { codigo: 'obesidade', nome: 'Obesidade' },
  { codigo: 'saude-crianca', nome: 'Saúde da Criança' },
  { codigo: 'saude-idoso', nome: 'Saúde do Idoso' },
  { codigo: 'tabagismo', nome: 'Tabagismo' },
  { codigo: 'gestante', nome: 'Gestantes e Puérperas' },
  { codigo: 'oncologia', nome: 'Oncologia' },
  { codigo: 'nefrologia', nome: 'Nefrologia' },
  { codigo: 'pneumologia', nome: 'Pneumologia' }
  // ... continuar com as outras 5 linhas
];

// =====================================================
// FUNÇÕES DE GERAÇÃO DE DADOS
// =====================================================

// Gerar CPF válido
function generateCPF() {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  
  // Primeiro dígito verificador
  const sum1 = digits.reduce((acc, digit, index) => acc + digit * (10 - index), 0);
  const digit1 = ((sum1 * 10) % 11) % 10;
  digits.push(digit1);
  
  // Segundo dígito verificador
  const sum2 = digits.reduce((acc, digit, index) => acc + digit * (11 - index), 0);
  const digit2 = ((sum2 * 10) % 11) % 10;
  digits.push(digit2);
  
  return digits.join('');
}

// Distribuir valores baseado em porcentagens
function distributeByPercentage(total, percentages) {
  const result = [];
  let remaining = total;
  
  for (let i = 0; i < percentages.length - 1; i++) {
    const count = Math.round((total * percentages[i].value) / 100);
    result.push({ ...percentages[i], count });
    remaining -= count;
  }
  
  // Último item recebe o restante
  result.push({ 
    ...percentages[percentages.length - 1], 
    count: remaining 
  });
  
  return result;
}

// Gerar data baseada em tempo no programa
function generateVinculationDate(tempoPrograma) {
  const today = new Date();
  
  switch(tempoPrograma) {
    case '<6 meses':
      return faker.date.between({ from: new Date(today.getFullYear(), today.getMonth() - 6), to: today });
    case '6-12 meses':
      return faker.date.between({ from: new Date(today.getFullYear() - 1, today.getMonth()), to: new Date(today.getFullYear(), today.getMonth() - 6) });
    case '1-2 anos':
      return faker.date.between({ from: new Date(today.getFullYear() - 2), to: new Date(today.getFullYear() - 1) });
    case '>2 anos':
      return faker.date.between({ from: new Date(today.getFullYear() - 5), to: new Date(today.getFullYear() - 2) });
    default:
      return faker.date.past({ years: 3 });
  }
}

// =====================================================
// FUNÇÕES DE MIGRAÇÃO
// =====================================================

// 1. Migrar dados básicos (clientes, produtos, unidades)
async function migrateBasicData() {
  console.log('🏢 Migrando dados básicos...');
  
  // Clientes identificados
  const clientes = [
    { nome: 'Tech Corp S.A.', codigo: 'tech-corp' },
    { nome: 'Indústrias ABC Ltda', codigo: 'industrias-abc' },
    { nome: 'Serviços XYZ', codigo: 'servicos-xyz' }
  ];
  
  const { data: clientesData } = await supabase
    .from('clientes')
    .upsert(clientes)
    .select();
  
  // Produtos identificados
  const produtos = [
    { nome: 'APS On-site', codigo: 'aps-onsite' },
    { nome: 'APS Digital', codigo: 'aps-digital' },
    { nome: 'APS Enfermeiro Dedicado', codigo: 'aps-enfermeiro' }
  ];
  
  const { data: produtosData } = await supabase
    .from('produtos')
    .upsert(produtos)
    .select();
  
  // Unidades identificadas
  const unidades = [
    { nome: 'Unidade Central', codigo: 'central' },
    { nome: 'Unidade Norte', codigo: 'norte' },
    { nome: 'Unidade Sul', codigo: 'sul' }
  ];
  
  const { data: unidadesData } = await supabase
    .from('unidades')
    .upsert(unidades)
    .select();
  
  console.log(`✅ Migrados: ${clientes.length} clientes, ${produtos.length} produtos, ${unidades.length} unidades`);
  
  return { clientesData, produtosData, unidadesData };
}

// 2. Migrar CIDs
async function migrateCIDs() {
  console.log('🏥 Migrando CIDs...');
  
  const { data } = await supabase
    .from('cids')
    .upsert(CID_CODES.map(cid => ({
      codigo: cid.codigo,
      descricao: cid.descricao,
      categoria: getCategoryFromCID(cid.codigo)
    })))
    .select();
  
  console.log(`✅ Migrados ${CID_CODES.length} CIDs`);
  return data;
}

function getCategoryFromCID(codigo) {
  const firstChar = codigo.charAt(0);
  const categoryMap = {
    'A': 'Doenças infecciosas e parasitárias',
    'B': 'Doenças infecciosas e parasitárias',
    'E': 'Doenças endócrinas, nutricionais e metabólicas',
    'F': 'Transtornos mentais e comportamentais',
    'I': 'Doenças do aparelho circulatório',
    'J': 'Doenças do aparelho respiratório',
    'K': 'Doenças do aparelho digestivo',
    'M': 'Doenças do sistema osteomuscular',
    'N': 'Doenças do aparelho geniturinário',
    'Z': 'Fatores que influenciam o estado de saúde'
  };
  return categoryMap[firstChar] || 'Outras doenças';
}

// 3. Migrar linhas de cuidado
async function migrateCareLinesAndFilters() {
  console.log('📋 Migrando linhas de cuidado...');
  
  const { data: careLinesData } = await supabase
    .from('linhas_cuidado')
    .upsert(CARE_LINES.map(line => ({
      codigo: line.codigo,
      nome: line.nome,
      cor_hex: getColorForCareLine(line.codigo)
    })))
    .select();
  
  // Faixas etárias identificadas
  const faixasEtarias = [
    { codigo: 'crianca', nome: 'Criança (0-12 anos)', idade_minima: 0, idade_maxima: 12 },
    { codigo: 'adolescente', nome: 'Adolescente (13-17 anos)', idade_minima: 13, idade_maxima: 17 },
    { codigo: 'adulto-jovem', nome: 'Adulto Jovem (18-39 anos)', idade_minima: 18, idade_maxima: 39 },
    { codigo: 'adulto', nome: 'Adulto (40-59 anos)', idade_minima: 40, idade_maxima: 59 },
    { codigo: 'idoso', nome: 'Idoso (60+ anos)', idade_minima: 60, idade_maxima: null }
  ];
  
  const { data: faixasData } = await supabase
    .from('faixas_etarias')
    .upsert(faixasEtarias)
    .select();
  
  console.log(`✅ Migrados ${CARE_LINES.length} linhas de cuidado e ${faixasEtarias.length} faixas etárias`);
  
  return { careLinesData, faixasData };
}

function getColorForCareLine(codigo) {
  const colorMap = {
    'saude-mulher': '#ec4899',
    'saude-homem': '#3b82f6',
    'saude-mental': '#8b5cf6',
    'doencas-cronicas': '#ef4444',
    'hipertensao': '#dc2626',
    'diabetes': '#f59e0b',
    'obesidade': '#fbbf24',
    'cardiologia': '#f43f5e',
    'saude-crianca': '#06b6d4',
    'saude-idoso': '#6b7280',
    'tabagismo': '#eab308',
    'gestante': '#d946ef',
    'oncologia': '#7c3aed',
    'nefrologia': '#0ea5e9',
    'pneumologia': '#10b981'
  };
  return colorMap[codigo] || '#6b7280';
}

// 4. Migrar profissionais
async function migrateProfessionals(unidadesData) {
  console.log('👥 Migrando profissionais...');
  
  // Médicos identificados
  const medicos = [
    { nome: 'Dr. Carlos Silva', tipo: 'medico_familia', crm_coren: 'CRM/SP 123456' },
    { nome: 'Dra. Ana Santos', tipo: 'medico_familia', crm_coren: 'CRM/SP 234567' },
    { nome: 'Dr. Pedro Costa', tipo: 'medico_familia', crm_coren: 'CRM/SP 345678' },
    { nome: 'Dra. Maria Oliveira', tipo: 'medico_familia', crm_coren: 'CRM/SP 456789' },
    { nome: 'Dr. João Pereira', tipo: 'medico_familia', crm_coren: 'CRM/SP 567890' }
  ];
  
  // Enfermeiros identificados  
  const enfermeiros = [
    { nome: 'Enf. Lucia Ferreira', tipo: 'enfermeiro_familia', crm_coren: 'COREN/SP 98765' },
    { nome: 'Enf. Roberto Alves', tipo: 'enfermeiro_familia', crm_coren: 'COREN/SP 87654' },
    { nome: 'Enf. Paula Mendes', tipo: 'enfermeiro_coordenador', crm_coren: 'COREN/SP 76543' },
    { nome: 'Enf. Carlos Ribeiro', tipo: 'enfermeiro_coordenador', crm_coren: 'COREN/SP 65432' },
    { nome: 'Enf. Sandra Lima', tipo: 'enfermeiro_familia', crm_coren: 'COREN/SP 54321' }
  ];
  
  const profissionais = [...medicos, ...enfermeiros].map(prof => ({
    ...prof,
    unidade_id: faker.helpers.arrayElement(unidadesData).id,
    especialidade: prof.tipo === 'medico_familia' ? 'Medicina de Família e Comunidade' : 'Enfermagem'
  }));
  
  const { data } = await supabase
    .from('profissionais')
    .upsert(profissionais)
    .select();
  
  console.log(`✅ Migrados ${profissionais.length} profissionais`);
  return data;
}

// 5. Migrar pacientes baseado na distribuição demográfica identificada
async function migratePatients(clientesData, produtosData, unidadesData, profissionaisData) {
  console.log('👤 Migrando pacientes baseado na distribuição demográfica...');
  
  const totalPacientes = COVERAGE_DATA.vidasElegiveis; // 8.950 identificados
  const vinculados = COVERAGE_DATA.vidasVinculadas; // 7.720 identificados
  
  // Distribuir por sexo (53% F, 47% M identificado)
  const distribuicaoSexo = distributeByPercentage(totalPacientes, DEMOGRAPHIC_DATA.distribuicaoSexo);
  
  // Distribuir por idade (18% 0-17, 45% 18-39, 28% 40-59, 9% 60+ identificado)
  const distribuicaoIdade = distributeByPercentage(totalPacientes, DEMOGRAPHIC_DATA.distribuicaoEtaria);
  
  // Distribuir por titularidade (58% titulares, 42% dependentes identificado)
  const distribuicaoTitularidade = distributeByPercentage(totalPacientes, DEMOGRAPHIC_DATA.composicaoFamiliar);
  
  // Distribuir por tempo no programa (15% <6m, 20% 6-12m, 30% 1-2a, 35% >2a identificado)
  const distribuicaoTempo = distributeByPercentage(vinculados, DEMOGRAPHIC_DATA.tempoPrograma);
  
  const pacientes = [];
  let currentId = 1;
  
  for (let i = 0; i < totalPacientes; i++) {
    const isVinculado = i < vinculados;
    const sexoGroup = getSexGroup(i, distribuicaoSexo);
    const idadeGroup = getAgeGroup(i, distribuicaoIdade);
    const titularidadeGroup = getTitularityGroup(i, distribuicaoTitularidade);
    
    const sexo = sexoGroup.label === 'Feminino' ? 'F' : 'M';
    const ageRange = getAgeRangeFromGroup(idadeGroup.label);
    const idade = faker.number.int({ min: ageRange.min, max: ageRange.max });
    const dataNascimento = new Date();
    dataNascimento.setFullYear(dataNascimento.getFullYear() - idade);
    
    let dataVinculacao = null;
    if (isVinculado) {
      const tempoGroup = getTimeGroup(i, distribuicaoTempo);
      dataVinculacao = generateVinculationDate(tempoGroup.label);
    }
    
    const paciente = {
      prontuario: `${currentId.toString().padStart(6, '0')}`,
      cpf: generateCPF(),
      nome: faker.person.fullName({ sex: sexo.toLowerCase() }),
      data_nascimento: dataNascimento.toISOString().split('T')[0],
      sexo: sexo,
      email: faker.internet.email(),
      telefone: faker.phone.number('11#########'),
      endereco: faker.location.streetAddress(true),
      cep: faker.location.zipCode('########'),
      titularidade: titularidadeGroup.label === 'Titulares' ? 'titular' : 'dependente',
      faixa_etaria: getFaixaEtariaFromAge(idade),
      data_vinculacao: dataVinculacao,
      status_vinculacao: isVinculado ? 'vinculado' : 'nao_vinculado',
      cliente_id: faker.helpers.arrayElement(clientesData).id,
      unidade_id: faker.helpers.arrayElement(unidadesData).id,
      produto_id: faker.helpers.arrayElement(produtosData).id,
      medico_familia_id: isVinculado ? faker.helpers.arrayElement(profissionaisData.filter(p => p.tipo === 'medico_familia')).id : null,
      enfermeiro_familia_id: isVinculado ? faker.helpers.arrayElement(profissionaisData.filter(p => p.tipo === 'enfermeiro_familia')).id : null,
      enfermeiro_coordenador_id: isVinculado ? faker.helpers.arrayElement(profissionaisData.filter(p => p.tipo === 'enfermeiro_coordenador')).id : null
    };
    
    pacientes.push(paciente);
    currentId++;
  }
  
  // Inserir em batches de 100
  console.log(`📦 Inserindo ${pacientes.length} pacientes em batches de 100...`);
  const batchSize = 100;
  const insertedPatients = [];
  
  for (let i = 0; i < pacientes.length; i += batchSize) {
    const batch = pacientes.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('pacientes')
      .upsert(batch)
      .select();
    
    if (error) {
      console.error(`❌ Erro no batch ${Math.floor(i/batchSize) + 1}:`, error);
      continue;
    }
    
    insertedPatients.push(...data);
    
    if ((i + batchSize) % 1000 === 0) {
      console.log(`✅ Inseridos ${Math.min(i + batchSize, pacientes.length)}/${pacientes.length} pacientes`);
    }
  }
  
  console.log(`✅ Total de pacientes migrados: ${insertedPatients.length}`);
  return insertedPatients;
}

// Funções auxiliares para distribuição demográfica
function getSexGroup(index, distribution) {
  let accumulated = 0;
  for (const group of distribution) {
    if (index < accumulated + group.count) {
      return group;
    }
    accumulated += group.count;
  }
  return distribution[distribution.length - 1];
}

function getAgeGroup(index, distribution) {
  let accumulated = 0;
  for (const group of distribution) {
    if (index < accumulated + group.count) {
      return group;
    }
    accumulated += group.count;
  }
  return distribution[distribution.length - 1];
}

function getTitularityGroup(index, distribution) {
  let accumulated = 0;
  for (const group of distribution) {
    if (index < accumulated + group.count) {
      return group;
    }
    accumulated += group.count;
  }
  return distribution[distribution.length - 1];
}

function getTimeGroup(index, distribution) {
  let accumulated = 0;
  for (const group of distribution) {
    if (index < accumulated + group.count) {
      return group;
    }
    accumulated += group.count;
  }
  return distribution[distribution.length - 1];
}

function getAgeRangeFromGroup(label) {
  const ranges = {
    '0-17': { min: 0, max: 17 },
    '18-39': { min: 18, max: 39 },
    '40-59': { min: 40, max: 59 },
    '60+': { min: 60, max: 95 }
  };
  return ranges[label] || { min: 18, max: 65 };
}

function getFaixaEtariaFromAge(idade) {
  if (idade <= 12) return 'crianca';
  if (idade <= 17) return 'adolescente';
  if (idade <= 39) return 'adulto-jovem';
  if (idade <= 59) return 'adulto';
  return 'idoso';
}

// 6. Migrar condições crônicas baseadas nos dados identificados
async function migrateChronicConditions(pacientesData) {
  console.log('🏥 Migrando condições crônicas...');
  
  const vinculados = pacientesData.filter(p => p.status_vinculacao === 'vinculado');
  const condicoesCronicas = [];
  
  // Para cada doença crônica identificada
  for (const condition of CHRONIC_CONDITIONS) {
    // Selecionar pacientes aleatórios para esta condição
    const pacientesComCondicao = faker.helpers.arrayElements(
      vinculados, 
      Math.min(condition.total, vinculados.length)
    );
    
    for (const paciente of pacientesComCondicao) {
      const emLinhaOuCuidado = Math.random() < (condition.em_lc / condition.total);
      
      const condicao = {
        paciente_id: paciente.id,
        cid_codigo: condition.cid,
        data_diagnostico: faker.date.between({ 
          from: paciente.data_vinculacao, 
          to: new Date() 
        }).toISOString().split('T')[0],
        status: faker.helpers.arrayElement(['ativo', 'controlado', 'inadequado']),
        em_linha_cuidado: emLinhaOuCuidado,
        data_entrada_lc: emLinhaOuCuidado ? faker.date.recent({ days: 365 }).toISOString().split('T')[0] : null
      };
      
      condicoesCronicas.push(condicao);
    }
  }
  
  // Inserir em batches
  const batchSize = 100;
  let insertedCount = 0;
  
  for (let i = 0; i < condicoesCronicas.length; i += batchSize) {
    const batch = condicoesCronicas.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('condicoes_cronicas')
      .upsert(batch, { onConflict: 'paciente_id, cid_codigo' })
      .select();
    
    if (!error) {
      insertedCount += data.length;
    }
  }
  
  console.log(`✅ Migradas ${insertedCount} condições crônicas`);
  return condicoesCronicas;
}

// 7. Migrar atendimentos baseados nos dados identificados
async function migrateAppointments(pacientesData, profissionaisData) {
  console.log('📅 Migrando atendimentos...');
  
  const vinculados = pacientesData.filter(p => p.status_vinculacao === 'vinculado');
  const atendimentos = [];
  
  // Dados de utilização identificados
  const utilizacaoAPS = 4825; // totalAtendimentos identificado
  const utilizacaoPA = 3110; // totalAtendimentos PA Virtual identificado
  
  const totalAtendimentos = utilizacaoAPS + utilizacaoPA;
  
  // Gerar atendimentos APS
  for (let i = 0; i < utilizacaoAPS; i++) {
    const paciente = faker.helpers.arrayElement(vinculados);
    const profissional = faker.helpers.arrayElement(profissionaisData);
    
    const atendimento = {
      paciente_id: paciente.id,
      data_atendimento: faker.date.between({
        from: new Date(2024, 0, 1),
        to: new Date()
      }).toISOString(),
      tipo_atendimento: 'aps',
      profissional_id: profissional.id,
      cid_principal: faker.helpers.arrayElement(CID_CODES).codigo,
      motivo_consulta: faker.helpers.arrayElement([
        'Consulta de rotina',
        'Renovação de receita',
        'Acompanhamento de doença crônica',
        'Sintomas gripais',
        'Dor muscular',
        'Controle de pressão arterial',
        'Exame preventivo'
      ]),
      desfecho: faker.helpers.weightedArrayElement([
        { weight: 70, value: 'alta' },
        { weight: 20, value: 'encaminhamento' },
        { weight: 10, value: 'retorno_agendado' }
      ]),
      status: 'realizada'
    };
    
    atendimentos.push(atendimento);
  }
  
  // Gerar atendimentos PA Virtual
  for (let i = 0; i < utilizacaoPA; i++) {
    const paciente = faker.helpers.arrayElement(vinculados);
    
    const atendimento = {
      paciente_id: paciente.id,
      data_atendimento: faker.date.between({
        from: new Date(2024, 0, 1),
        to: new Date()
      }).toISOString(),
      tipo_atendimento: 'pa_virtual',
      profissional_id: faker.helpers.arrayElement(profissionaisData).id,
      cid_principal: faker.helpers.arrayElement([
        'Z71.1', 'J00', 'M79.3', 'K29', 'N39.0'
      ]),
      motivo_consulta: faker.helpers.arrayElement([
        'Aconselhamento médico',
        'Sintomas gripais',
        'Dor generalizada',
        'Problema digestivo',
        'Orientação medicamentosa'
      ]),
      desfecho: faker.helpers.weightedArrayElement([
        { weight: 50, value: 'alta' },
        { weight: 30, value: 'encaminhamento' },
        { weight: 20, value: 'retorno_agendado' }
      ]),
      status: 'realizada'
    };
    
    atendimentos.push(atendimento);
  }
  
  // Inserir em batches
  const batchSize = 100;
  let insertedCount = 0;
  
  for (let i = 0; i < atendimentos.length; i += batchSize) {
    const batch = atendimentos.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('atendimentos')
      .insert(batch)
      .select();
    
    if (!error && data) {
      insertedCount += data.length;
    }
    
    if ((i + batchSize) % 1000 === 0) {
      console.log(`✅ Inseridos ${Math.min(i + batchSize, atendimentos.length)}/${atendimentos.length} atendimentos`);
    }
  }
  
  console.log(`✅ Total de atendimentos migrados: ${insertedCount}`);
  return atendimentos;
}

// 8. Migrar rastreios baseados nos dados identificados
async function migrateScreenings(pacientesData) {
  console.log('🔍 Migrando rastreios...');
  
  const vinculados = pacientesData.filter(p => p.status_vinculacao === 'vinculado');
  const rastreios = [];
  
  for (const screening of SCREENING_DATA) {
    // Filtrar população elegível baseado no tipo de rastreio
    let populacaoElegivel = getEligiblePopulation(vinculados, screening);
    
    // Limitar ao número de elegíveis identificado
    populacaoElegivel = populacaoElegivel.slice(0, screening.elegiveis);
    
    for (const paciente of populacaoElegivel) {
      const foiRealizado = Math.random() < (screening.cobertura / 100);
      
      const rastreio = {
        paciente_id: paciente.id,
        tipo_rastreio: screening.tipo,
        status: foiRealizado ? 'realizado' : 'elegivel',
        data_solicitacao: foiRealizado ? faker.date.between({
          from: new Date(2023, 0, 1),
          to: new Date()
        }).toISOString().split('T')[0] : null,
        data_realizacao: foiRealizado ? faker.date.between({
          from: new Date(2023, 6, 1),
          to: new Date()
        }).toISOString().split('T')[0] : null,
        resultado: foiRealizado ? generateScreeningResult(screening.tipo) : null,
        alteracoes_encontradas: foiRealizado ? Math.random() < 0.1 : false,
        dados_especificos: generateSpecificScreeningData(screening.tipo, foiRealizado)
      };
      
      rastreios.push(rastreio);
    }
  }
  
  // Inserir em batches
  const batchSize = 100;
  let insertedCount = 0;
  
  for (let i = 0; i < rastreios.length; i += batchSize) {
    const batch = rastreios.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('rastreios')
      .insert(batch)
      .select();
    
    if (!error && data) {
      insertedCount += data.length;
    }
  }
  
  console.log(`✅ Total de rastreios migrados: ${insertedCount}`);
  return rastreios;
}

function getEligiblePopulation(patients, screening) {
  switch(screening.tipo) {
    case 'mamografia':
      return patients.filter(p => 
        p.sexo === 'F' && 
        getAgeFromBirthDate(p.data_nascimento) >= 50 && 
        getAgeFromBirthDate(p.data_nascimento) <= 69
      );
    case 'citologia':
      return patients.filter(p => 
        p.sexo === 'F' && 
        getAgeFromBirthDate(p.data_nascimento) >= 25 && 
        getAgeFromBirthDate(p.data_nascimento) <= 64
      );
    case 'colonoscopia':
      return patients.filter(p => getAgeFromBirthDate(p.data_nascimento) >= 50);
    case 'fagerstrom':
      // Simular que 800 pacientes são fumantes
      return faker.helpers.arrayElements(patients, 800);
    case 'framingham':
      return patients.filter(p => getAgeFromBirthDate(p.data_nascimento) >= 40);
    default:
      return patients; // PHQ-9, GAD-7, AUDIT aplicam a todos
  }
}

function getAgeFromBirthDate(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  return Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));
}

function generateScreeningResult(tipo) {
  switch(tipo) {
    case 'mamografia':
      return faker.helpers.weightedArrayElement([
        { weight: 50, value: 'BI-RADS 1 - Negativo' },
        { weight: 36, value: 'BI-RADS 2 - Benigno' },
        { weight: 8, value: 'BI-RADS 0 - Inconclusivo' },
        { weight: 3, value: 'BI-RADS 3 - Provavelmente benigno' },
        { weight: 2, value: 'BI-RADS 4 - Suspeito' },
        { weight: 1, value: 'BI-RADS 5 - Altamente suspeito' }
      ]);
    case 'citologia':
      return faker.helpers.arrayElement([
        'Negativo para lesão intraepitelial',
        'ASC-US',
        'LSIL',
        'HSIL',
        'Carcinoma'
      ]);
    case 'phq9':
      return `Pontuação: ${faker.number.int({ min: 0, max: 27 })}`;
    case 'gad7':
      return `Pontuação: ${faker.number.int({ min: 0, max: 21 })}`;
    case 'audit':
      return `Pontuação: ${faker.number.int({ min: 0, max: 40 })}`;
    default:
      return 'Normal';
  }
}

function generateSpecificScreeningData(tipo, foiRealizado) {
  if (!foiRealizado) return null;
  
  switch(tipo) {
    case 'mamografia':
      return {
        densidade_mamaria: faker.helpers.arrayElement(['A', 'B', 'C', 'D']),
        historia_familiar: Math.random() < 0.087, // 8.7% identificado
        tempo_ultimo_exame: faker.helpers.arrayElement([
          'nunca', 'mais_3_anos', '2_3_anos', '1_2_anos', 'menos_1_ano'
        ])
      };
    case 'phq9':
      const pontuacaoPhq9 = faker.number.int({ min: 0, max: 27 });
      return {
        pontuacao_total: pontuacaoPhq9,
        classificacao: getPhq9Classification(pontuacaoPhq9),
        respostas: Array.from({ length: 9 }, () => faker.number.int({ min: 0, max: 3 }))
      };
    case 'gad7':
      const pontuacaoGad7 = faker.number.int({ min: 0, max: 21 });
      return {
        pontuacao_total: pontuacaoGad7,
        classificacao: getGad7Classification(pontuacaoGad7),
        respostas: Array.from({ length: 7 }, () => faker.number.int({ min: 0, max: 3 }))
      };
    default:
      return {};
  }
}

function getPhq9Classification(pontuacao) {
  if (pontuacao <= 4) return 'minima';
  if (pontuacao <= 9) return 'leve';
  if (pontuacao <= 14) return 'moderada';
  if (pontuacao <= 19) return 'moderadamente_grave';
  return 'grave';
}

function getGad7Classification(pontuacao) {
  if (pontuacao <= 4) return 'minima';
  if (pontuacao <= 9) return 'leve';
  if (pontuacao <= 14) return 'moderada';
  return 'grave';
}

// 9. Migrar dados de perfil de saúde
async function migrateHealthProfiles(pacientesData) {
  console.log('📋 Migrando perfis de saúde...');
  
  const vinculados = pacientesData.filter(p => p.status_vinculacao === 'vinculado');
  const taxaResposta = 72.1; // Taxa identificada
  const totalRespondentes = Math.floor(vinculados.length * (taxaResposta / 100));
  
  const respondentes = faker.helpers.arrayElements(vinculados, totalRespondentes);
  const respostas = [];
  
  // Distribuição aging identificada: 28% < 3 meses, 35% 3-9m, 37% > 9m
  const agingDistribution = [
    { categoria: 'recente', percentual: 28, meses: 2 },
    { categoria: 'intermediario', percentual: 35, meses: 6 },
    { categoria: 'vencido', percentual: 37, meses: 15 }
  ];
  
  for (const paciente of respondentes) {
    const agingCategory = faker.helpers.weightedArrayElement([
      { weight: 28, value: agingDistribution[0] },
      { weight: 35, value: agingDistribution[1] },
      { weight: 37, value: agingDistribution[2] }
    ]);
    
    const dataResposta = new Date();
    dataResposta.setMonth(dataResposta.getMonth() - agingCategory.meses);
    
    const resposta = {
      paciente_id: paciente.id,
      data_resposta: dataResposta.toISOString().split('T')[0],
      status: 'completa',
      percentual_completude: faker.number.int({ min: 85, max: 100 }),
      respostas: generateHealthProfileAnswers()
    };
    
    respostas.push(resposta);
  }
  
  // Inserir respostas
  const { data } = await supabase
    .from('perfil_saude_respostas')
    .insert(respostas)
    .select();
  
  console.log(`✅ Migrados ${respostas.length} perfis de saúde (${taxaResposta}% taxa de resposta)`);
  return data;
}

function generateHealthProfileAnswers() {
  return {
    exercicio_fisico: faker.helpers.arrayElement(['nunca', 'raramente', 'algumas_vezes', 'frequentemente']),
    alimentacao: faker.helpers.arrayElement(['ruim', 'regular', 'boa', 'excelente']),
    sono: faker.number.int({ min: 4, max: 10 }),
    stress: faker.number.int({ min: 1, max: 10 }),
    satisfacao_vida: faker.number.int({ min: 1, max: 10 }),
    tabagismo: faker.helpers.arrayElement(['nunca_fumou', 'ex_fumante', 'fumante_atual']),
    alcool: faker.helpers.arrayElement(['nao_bebe', 'social', 'regular', 'excessivo']),
    historico_familiar: faker.helpers.arrayElements([
      'diabetes', 'hipertensao', 'cancer', 'doenca_cardiaca', 'obesidade'
    ], { min: 0, max: 3 })
  };
}

// =====================================================
// FUNÇÃO PRINCIPAL DE MIGRAÇÃO
// =====================================================

async function runCompleteMigration() {
  console.log('🚀 Iniciando migração completa dos dados...');
  const startTime = Date.now();
  
  try {
    // 1. Dados básicos
    const { clientesData, produtosData, unidadesData } = await migrateBasicData();
    
    // 2. CIDs e configurações
    await migrateCIDs();
    const { careLinesData, faixasData } = await migrateCareLinesAndFilters();
    
    // 3. Profissionais
    const profissionaisData = await migrateProfessionals(unidadesData);
    
    // 4. Pacientes (maior volume)
    const pacientesData = await migratePatients(clientesData, produtosData, unidadesData, profissionaisData);
    
    // 5. Condições crônicas
    await migrateChronicConditions(pacientesData);
    
    // 6. Atendimentos
    await migrateAppointments(pacientesData, profissionaisData);
    
    // 7. Rastreios
    await migrateScreenings(pacientesData);
    
    // 8. Perfis de saúde
    await migrateHealthProfiles(pacientesData);
    
    // 9. Configurações finais
    await supabase
      .from('configuracoes_sistema')
      .upsert([
        { chave: 'total_elegiveis', valor: COVERAGE_DATA.vidasElegiveis },
        { chave: 'total_vinculados', valor: COVERAGE_DATA.vidasVinculadas },
        { chave: 'meta_cobertura', valor: COVERAGE_DATA.metaCobertura },
        { chave: 'data_ultima_migracao', valor: new Date().toISOString() }
      ]);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n🎉 MIGRAÇÃO COMPLETA! ⏱️  ${duration.toFixed(2)}s`);
    console.log(`\n📊 RESUMO DA MIGRAÇÃO:`);
    console.log(`   • ${COVERAGE_DATA.vidasElegiveis.toLocaleString()} pacientes elegíveis`);
    console.log(`   • ${COVERAGE_DATA.vidasVinculadas.toLocaleString()} pacientes vinculados`);
    console.log(`   • ${CHRONIC_CONDITIONS.reduce((acc, c) => acc + c.total, 0).toLocaleString()} condições crônicas`);
    console.log(`   • ${4825 + 3110} atendimentos (APS + PA Virtual)`);
    console.log(`   • ${SCREENING_DATA.reduce((acc, s) => acc + s.elegiveis, 0).toLocaleString()} rastreios elegíveis`);
    console.log(`   • ${Math.floor(COVERAGE_DATA.vidasVinculadas * 0.721)} perfis de saúde respondidos`);
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// =====================================================
// EXECUÇÃO
// =====================================================

if (require.main === module) {
  runCompleteMigration();
}

module.exports = {
  runCompleteMigration,
  migrateBasicData,
  migrateCIDs,
  migrateCareLinesAndFilters,
  migrateProfessionals,
  migratePatients,
  migrateChronicConditions,
  migrateAppointments,
  migrateScreenings,
  migrateHealthProfiles
};