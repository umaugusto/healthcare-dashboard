// =====================================================
// TIPOS TYPESCRIPT CENTRALIZADOS
// =====================================================
// Baseado na análise completa do projeto original

/**
 * Define a estrutura para o objeto de filtros usado em toda a aplicação.
 */
export interface Filters {
  cliente: string;
  produto: string[];
  unidade: string[];
  periodo: { start: string; end: string };
  tempoPrograma: string;
  medicoFamilia: string[];
  enfermeiroFamilia: string[];
  enfermeiroCoord: string[];
  faixaEtaria: string[];
  sexo: string[];
  titularidade: string[];
  linhasCuidado: string[];
  cids: string[];
}

/**
 * Define as opções para os componentes de select e multiselect.
 */
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

/**
 * Define a estrutura para o filtro local interativo entre gráficos.
 */
export interface LocalFilter {
  type: string;  // Ex: 'cobertura', 'riscoAPS', 'perfilSaudeAging'
  value: string; // Ex: 'Vinculados', 'Alto Risco', 'Mais de 9 meses'
  label: string; // Label para exibição
}

/**
 * Define o contexto de navegação para a tabela
 */
export interface TableContext {
  source: string; // Nome do gráfico de origem
  chartType: string; // Tipo de gráfico (diabetes-tipo, hipertensao-controle, etc)
  filters?: any; // Filtros específicos do contexto
  columns?: string[]; // Colunas específicas para exibir
  title?: string; // Título personalizado para a visualização
}

// =====================================================
// TIPOS DE DADOS DO DASHBOARD
// =====================================================

/**
 * Dados demográficos
 */
export interface DemograficosData {
  composicaoFamiliar: { value: number; color: string; label: string }[];
  distribuicaoSexo: { value: number; color: string; label: string }[];
  distribuicaoEtaria: { value: number; color: string; label: string }[];
  tempoPrograma: { value: number; color: string; label: string }[];
}

/**
 * Dados de cobertura populacional
 */
export interface CoberturaData {
  vidasElegiveis: number;
  vidasVinculadas: number;
  naoVinculados: number;
  controladoTotal: number;
  controleInadequadoTotal: number;
  inadequadoTotal: number;
  consultasMesAtual: number;
  novosVinculadosMes: number;
  desvinculadosMes: number;
  metaCobertura: number;
  metaControlado: number;
  taxaVinculacao: number;
}

/**
 * Dados de perfil de saúde
 */
export interface PerfilSaudeData {
  taxaAtual: number;
  totalRespondentes: number;
  incrementoPeriodo: number;
  incrementoAbsoluto: number;
  metaResposta: number;
  semResposta: number;
  vencendoMais12m: number;
  respondentesNoPeriodo: number;
  agingData: {
    label: string;
    percentage: number;
    count: number;
    color: string;
  }[];
}

/**
 * Dados de utilização APS
 */
export interface UtilizacaoAPSData {
  totalAtendimentos: number;
  pacientesUnicos: number;
  taxaRecorrencia: number;
  incrementoMes: number;
  taxaEncaminhamento: number;
  consultasEvitadas: number;
  topMotivos: {
    cid: string;
    descricao: string;
    atendimentos: number;
    percentual: number;
  }[];
  topEncaminhamentos: {
    especialidade: string;
    encaminhamentos: number;
    percentual: number;
  }[];
  distribuicaoRisco: {
    nivel: string;
    quantidade: number;
    percentual: number;
    color: string;
  }[];
}

/**
 * KPIs de doenças crônicas
 */
export interface CronicosKPI {
  id: string;
  label: string;
  cid: string;
  total: number;
  icon: string;
  color: string;
}

/**
 * KPIs de rastreios
 */
export interface RastreioKPI {
  id: string;
  label: string;
  pendentes: number;
  elegiveis: number;
  realizados: number;
  percentualPendente: number;
  percentualCobertura: number;
  meta: number;
  prazo: string;
  populacao: string;
  detalhes?: string;
  icon: string;
  color: string;
}

/**
 * Dados específicos de hipertensão
 */
export interface HipertensaoData {
  totalSemSeguimento: number;
  totalLC: number;
  percentualLC: number;
  taxaControle: number;
  pacientesAltaPA: number;
  rastreioFramingham: number;
  medidasVencidas: number;
  populacaoFiltrada: string;
  
  funilEpidemiologico: {
    nivel: string;
    quantidade: number;
    percentual: number;
    cor: string;
  }[];
  
  controlesPA: {
    nivel: string;
    quantidade: number;
    percentual: number;
    cor: string;
  }[];
  
  comorbidades: {
    cid: string;
    descricao: string;
    pacientes: number;
    percentual: number;
    cor: string;
  }[];
  
  fatoresRisco: {
    fator: string;
    pacientes: number;
    percentual: number;
    cor: string;
  }[];
  
  estagioMotivacional: {
    estagio: string;
    quantidade: number;
    percentual: number;
    cor: string;
  }[];
}

/**
 * Dados de mamografia
 */
export interface MamografiaData {
  populacaoTotal: number;
  elegiveis: number;
  metaBienal: number;
  coberturaAtual: number;
  tempoMedioResultado: number;
  taxaReconvocacao: number;
  
  funilRastreamento: {
    etapa: string;
    valor: number;
    percentual: number;
  }[];
  
  agingExames: {
    periodo: string;
    pacientes: number;
    percentual: number;
    cor: string;
    prioridade: string;
  }[];
  
  estratificacao: {
    faixa: string;
    total: number;
    realizados: number;
    pendentes: number;
    cobertura: number;
    alteracao: number;
    biRads45: number;
  }[];
  
  evolucaoTemporal: {
    mes: string;
    cobertura: number;
    meta: number;
    realizados: number;
  }[];
  
  classificacaoBiRads: {
    categoria: string;
    quantidade: number;
    percentual: number;
    descricao: string;
  }[];
}

// =====================================================
// TIPOS DE COMPONENTES
// =====================================================

/**
 * Props padrão para componentes de gráficos
 */
export interface ChartProps {
  filters?: Filters;
  onNavigateToTable?: (type: string, context?: TableContext) => void;
  localFilter?: LocalFilter | null;
  onLocalFilterChange?: (filter: LocalFilter | null) => void;
}

/**
 * Props para KPIs
 */
export interface KPIProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

/**
 * Dados para gráfico de donut
 */
export interface DonutChartData {
  segments: {
    value: number;
    percentage: number;
    color: string;
    label: string;
    absoluteValue?: number;
  }[];
}

/**
 * Dados para gráfico de barras empilhadas
 */
export interface StackedBarData {
  segments: {
    label: string;
    value: number;
    percentage: number;
    color: string;
  }[];
}

/**
 * Dados para funil
 */
export interface FunnelData {
  data: {
    nivel: string;
    quantidade: number;
    percentual?: number;
    cor: string;
  }[];
  title: string;
  icon: React.ComponentType;
}

/**
 * Props para tabela
 */
export interface TableProps {
  filters?: Filters;
  onNavigateToCharts: () => void;
  initialView?: string | null;
  tableContext?: TableContext | null;
  sourceTab?: string;
}

/**
 * Definição de coluna da tabela
 */
export interface Column {
  id: string;
  label: string;
  width?: string;
  sortable?: boolean;
  required?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'select';
}

/**
 * Props para filtros
 */
export interface FilterProps {
  filters: Filters;
  onFilterChange: (field: keyof Filters, value: any) => void;
  activeFiltersCount?: number;
  isOpen?: boolean;
  onToggle?: () => void;
}

// =====================================================
// TIPOS DE API
// =====================================================

/**
 * Response padrão da API
 */
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Response paginada
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}

/**
 * Parâmetros de filtro para API
 */
export interface ApiFilters extends Filters {
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// =====================================================
// TIPOS DE ENTIDADES DO BANCO
// =====================================================

/**
 * Paciente
 */
export interface Paciente {
  id: string;
  prontuario: string;
  cpf: string;
  nome: string;
  data_nascimento: string;
  sexo: 'M' | 'F';
  email?: string;
  telefone?: string;
  endereco?: string;
  cep?: string;
  titularidade: 'titular' | 'dependente';
  faixa_etaria: string;
  data_vinculacao?: string;
  status_vinculacao: 'vinculado' | 'nao_vinculado' | 'desvinculado';
  tempo_programa_meses?: number;
  cliente_id?: string;
  unidade_id?: string;
  produto_id?: string;
  medico_familia_id?: string;
  enfermeiro_familia_id?: string;
  enfermeiro_coordenador_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Atendimento
 */
export interface Atendimento {
  id: string;
  paciente_id: string;
  data_atendimento: string;
  tipo_atendimento: 'aps' | 'pa_virtual' | 'consulta_agendada';
  profissional_id?: string;
  cid_principal?: string;
  cid_secundarios?: string[];
  motivo_consulta?: string;
  descricao?: string;
  desfecho?: 'alta' | 'encaminhamento' | 'retorno_agendado';
  especialidade_encaminhada?: string;
  status: 'agendada' | 'realizada' | 'cancelada' | 'faltou';
  created_at: string;
}

/**
 * Cliente
 */
export interface Cliente {
  id: string;
  nome: string;
  codigo: string;
  ativo: boolean;
  created_at: string;
}

/**
 * Unidade
 */
export interface Unidade {
  id: string;
  nome: string;
  codigo: string;
  endereco?: string;
  ativo: boolean;
  created_at: string;
}

/**
 * Profissional
 */
export interface Profissional {
  id: string;
  nome: string;
  tipo: 'medico_familia' | 'enfermeiro_familia' | 'enfermeiro_coordenador';
  crm_coren?: string;
  especialidade?: string;
  unidade_id?: string;
  ativo: boolean;
  created_at: string;
}

/**
 * CID
 */
export interface CID {
  codigo: string;
  descricao: string;
  categoria?: string;
  subcategoria?: string;
  ativo: boolean;
}

/**
 * Linha de Cuidado
 */
export interface LinhaCuidado {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  ativa: boolean;
  cor_hex?: string;
  icone?: string;
  created_at: string;
}

// =====================================================
// TIPOS DE ESTADO
// =====================================================

/**
 * Estado de loading
 */
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

/**
 * Estado da aplicação
 */
export interface AppState {
  user: {
    id?: string;
    name?: string;
    email?: string;
    permissions?: string[];
  } | null;
  theme: 'light' | 'dark';
  notifications: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }[];
}

// =====================================================
// UTILITÁRIOS DE TIPO
// =====================================================

/**
 * Torna todas as propriedades opcionais
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
}

/**
 * Torna todas as propriedades obrigatórias
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
}

/**
 * Extrai o tipo de um array
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Tipos de cores do projeto
 */
export type ProjectColor = 
  | 'primary'
  | 'success' 
  | 'warning'
  | 'danger'
  | 'pastel-green'
  | 'pastel-yellow'
  | 'pastel-red'
  | 'pastel-blue'
  | 'pastel-purple'
  | 'pastel-orange'
  | 'pastel-amber'
  | 'gray'
  | 'light-gray'
  | 'medium-gray';