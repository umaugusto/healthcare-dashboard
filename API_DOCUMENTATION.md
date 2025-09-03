# 🔌 DOCUMENTAÇÃO COMPLETA DE APIs
# Dashboard APS - Supabase REST API

## 🏗️ ARQUITETURA DA API

### **Base URL**
```
https://[projeto-id].supabase.co/rest/v1/
```

### **Autenticação**
```typescript
// Headers obrigatórios
{
  "Authorization": "Bearer [JWT_TOKEN]",
  "apikey": "[ANON_KEY]",
  "Content-Type": "application/json"
}
```

### **RLS (Row Level Security)**
- Todas as tabelas têm RLS habilitado
- Políticas baseadas em unidade/cliente do usuário
- Filtros automáticos por permissões

---

## 📊 ENDPOINTS PRINCIPAIS

### **1. DASHBOARD PRINCIPAL**

#### `GET /dashboard/overview`
Retorna dados para a visão geral do dashboard

**Query Parameters:**
```typescript
interface OverviewFilters {
  cliente_id?: string;
  unidade_ids?: string[];
  produto_ids?: string[];
  periodo_inicio?: string; // YYYY-MM-DD
  periodo_fim?: string;
  tempo_programa?: string; // 'ate6m' | '6a12m' | '12a24m' | 'mais24m'
  medico_familia_ids?: string[];
  enfermeiro_familia_ids?: string[];
  faixa_etaria?: string[];
  sexo?: 'M' | 'F';
  titularidade?: 'titular' | 'dependente';
  linhas_cuidado?: string[];
  cids?: string[];
}
```

**Response:**
```typescript
interface DashboardOverview {
  demograficos: {
    total_pacientes: number;
    composicao_familiar: { label: string; count: number; percentage: number }[];
    distribuicao_sexo: { label: string; count: number; percentage: number }[];
    distribuicao_etaria: { label: string; count: number; percentage: number }[];
    tempo_programa: { label: string; count: number; percentage: number }[];
  };
  cobertura: {
    vidas_elegiveis: number;
    vidas_vinculadas: number;
    nao_vinculados: number;
    taxa_vinculacao: number;
    controlado_total: number;
    controle_inadequado_total: number;
    inadequado_total: number;
    consultas_mes_atual: number;
    incremento_mes: number;
    meta_cobertura: number;
  };
  utilizacao_aps: {
    total_atendimentos: number;
    pacientes_unicos: number;
    taxa_recorrencia: number;
    taxa_encaminhamento: number;
    top_motivos: { cid: string; descricao: string; atendimentos: number; percentual: number }[];
    distribuicao_risco: { nivel: string; quantidade: number; percentual: number }[];
  };
  utilizacao_pa_virtual: {
    total_atendimentos: number;
    pacientes_unicos: number;
    taxa_resolucao: number;
    distribuicao_desfecho: { desfecho: string; quantidade: number; percentual: number }[];
  };
}
```

**Exemplo de uso:**
```typescript
const response = await fetch('/dashboard/overview?cliente_id=123&periodo_inicio=2024-01-01&periodo_fim=2024-12-31');
const data: DashboardOverview = await response.json();
```

---

### **2. DOENÇAS CRÔNICAS**

#### `GET /dashboard/cronicos`
Dados das doenças crônicas

**Query Parameters:** (mesmo que overview)

**Response:**
```typescript
interface CronicosData {
  kpis: {
    cid_codigo: string;
    descricao: string;
    total_pacientes: number;
    em_linha_cuidado: number;
    percentual_lc: number;
  }[];
  hipertensao: {
    total_sem_seguimento: number;
    total_lc: number;
    percentual_lc: number;
    taxa_controle: number;
    controles_pa: { nivel: string; quantidade: number; percentual: number }[];
    comorbidades: { cid: string; descricao: string; pacientes: number; percentual: number }[];
    fatores_risco: { fator: string; pacientes: number; percentual: number }[];
    estagio_motivacional: { estagio: string; quantidade: number; percentual: number }[];
    estratificacao_framingham: { label: string; value: number; percentage: number }[];
  };
  diabetes: {
    total_lc: number;
    percentual_lc: number;
    controles_glicemico: { nivel: string; quantidade: number; percentual: number }[];
    comorbidades: { cid: string; descricao: string; pacientes: number; percentual: number }[];
  };
  obesidade: {
    total_lc: number;
    percentual_lc: number;
    distribuicao_evolucao: { nivel: string; quantidade: number; percentual: number }[];
    distribuicao_grau: { label: string; value: number; percentage: number }[];
  };
  saude_mental: {
    total_lc: number;
    percentual_lc: number;
    distribuicao_tratamento: { nivel: string; quantidade: number; percentual: number }[];
    distribuicao_diagnostico: { label: string; value: number; percentage: number }[];
  };
}
```

#### `GET /dashboard/cronicos/hipertensao`
Dados detalhados de hipertensão

**Response:**
```typescript
interface HipertensaoDetalhada {
  pacientes: {
    total: number;
    em_lc: number;
    sem_seguimento: number;
  };
  controle: {
    bom_controle: number;
    controle_inadequado: number;
    sem_medida_recente: number;
  };
  distribuicao_temporal_medidas: {
    periodo: string;
    quantidade: number;
    percentual: number;
  }[];
  exames_acompanhamento: {
    exame: string;
    em_dia: number;
    total: number;
    percentual: number;
  }[];
  heatmap_temporal: {
    mes: string;
    valor: number;
    intensidade: number;
    incremento: number;
  }[];
}
```

---

### **3. RASTREIOS**

#### `GET /dashboard/rastreios`
Dados dos rastreios preventivos

**Response:**
```typescript
interface RastreiosData {
  kpis: {
    tipo: string;
    label: string;
    pendentes: number;
    elegiveis: number;
    realizados: number;
    percentual_cobertura: number;
    meta: number;
    populacao: string;
  }[];
  mamografia: {
    populacao_total: number;
    elegiveis: number;
    cobertura_atual: number;
    meta_bienal: number;
    funil_rastreamento: {
      etapa: string;
      valor: number;
      percentual: number;
    }[];
    aging_exames: {
      periodo: string;
      pacientes: number;
      percentual: number;
      prioridade: string;
    }[];
    estratificacao: {
      faixa: string;
      total: number;
      realizados: number;
      cobertura: number;
    }[];
    evolucao_temporal: {
      mes: string;
      cobertura: number;
      meta: number;
      realizados: number;
    }[];
    classificacao_birads: {
      categoria: string;
      quantidade: number;
      percentual: number;
      descricao: string;
    }[];
  };
}
```

---

### **4. PACIENTES**

#### `GET /pacientes`
Lista de pacientes com filtros

**Query Parameters:**
```typescript
interface PacientesFilters extends OverviewFilters {
  search?: string;
  status_vinculacao?: 'vinculado' | 'nao_vinculado' | 'desvinculado';
  limit?: number;
  offset?: number;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}
```

**Response:**
```typescript
interface PacientesResponse {
  data: {
    id: string;
    prontuario: string;
    cpf: string;
    nome: string;
    data_nascimento: string;
    sexo: 'M' | 'F';
    idade: number;
    faixa_etaria: string;
    titularidade: 'titular' | 'dependente';
    data_vinculacao: string;
    status_vinculacao: string;
    tempo_programa_meses: number;
    cliente: { nome: string; codigo: string };
    unidade: { nome: string; codigo: string };
    produto: { nome: string; codigo: string };
    medico_familia: { nome: string; crm_coren: string };
    enfermeiro_familia: { nome: string; crm_coren: string };
    // ... outros campos
  }[];
  count: number;
  total_pages: number;
}
```

#### `GET /pacientes/{id}`
Detalhes de um paciente específico

**Response:**
```typescript
interface PacienteDetalhado {
  dados_basicos: {
    id: string;
    prontuario: string;
    nome: string;
    data_nascimento: string;
    sexo: 'M' | 'F';
    cpf: string;
    email: string;
    telefone: string;
    endereco: string;
    // ... outros campos básicos
  };
  condicoes_cronicas: {
    cid_codigo: string;
    descricao: string;
    data_diagnostico: string;
    status: string;
    em_linha_cuidado: boolean;
  }[];
  atendimentos_recentes: {
    data_atendimento: string;
    tipo_atendimento: string;
    profissional: string;
    cid_principal: string;
    motivo_consulta: string;
    desfecho: string;
  }[];
  rastreios: {
    tipo_rastreio: string;
    status: string;
    data_realizacao?: string;
    resultado?: string;
    data_proximo_rastreio?: string;
  }[];
  sinais_vitais_recentes: {
    data_medicao: string;
    pressao_sistolica?: number;
    pressao_diastolica?: number;
    peso?: number;
    imc?: number;
  }[];
  perfil_saude: {
    data_resposta: string;
    status: string;
    aging_categoria: string;
    respostas: Record<string, any>;
  };
}
```

---

### **5. ATENDIMENTOS**

#### `GET /atendimentos`
Lista de atendimentos

**Query Parameters:**
```typescript
interface AtendimentosFilters {
  paciente_id?: string;
  profissional_id?: string;
  tipo_atendimento?: 'aps' | 'pa_virtual' | 'consulta_agendada';
  data_inicio?: string;
  data_fim?: string;
  cid_principal?: string;
  status?: 'agendada' | 'realizada' | 'cancelada' | 'faltou';
  limit?: number;
  offset?: number;
}
```

#### `POST /atendimentos`
Criar novo atendimento

**Body:**
```typescript
interface NovoAtendimento {
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
}
```

---

### **6. EXAMES E SINAIS VITAIS**

#### `GET /sinais-vitais`
Sinais vitais dos pacientes

**Query Parameters:**
```typescript
interface SinaisVitaisFilters {
  paciente_id?: string;
  data_inicio?: string;
  data_fim?: string;
  tipo_medicao?: 'pressao' | 'peso' | 'completo';
  limit?: number;
  offset?: number;
}
```

#### `POST /sinais-vitais`
Registrar novos sinais vitais

**Body:**
```typescript
interface NovosSinaisVitais {
  paciente_id: string;
  data_medicao: string;
  atendimento_id?: string;
  pressao_sistolica?: number;
  pressao_diastolica?: number;
  peso?: number;
  altura?: number;
  circunferencia_abdominal?: number;
  temperatura?: number;
  frequencia_cardiaca?: number;
  frequencia_respiratoria?: number;
  saturacao_o2?: number;
}
```

---

### **7. RASTREIOS ESPECÍFICOS**

#### `GET /rastreios`
Lista de rastreios

**Query Parameters:**
```typescript
interface RastreiosFilters {
  paciente_id?: string;
  tipo_rastreio?: 'mamografia' | 'citologia' | 'colonoscopia' | 'phq9' | 'gad7' | 'audit' | 'fagerstrom' | 'framingham';
  status?: 'elegivel' | 'solicitado' | 'realizado' | 'com_alteracao' | 'em_acompanhamento';
  data_inicio?: string;
  data_fim?: string;
  limit?: number;
  offset?: number;
}
```

#### `POST /rastreios`
Registrar novo rastreio

**Body:**
```typescript
interface NovoRastreio {
  paciente_id: string;
  tipo_rastreio: string;
  status: string;
  data_solicitacao?: string;
  data_realizacao?: string;
  resultado?: string;
  alteracoes_encontradas?: boolean;
  necessita_seguimento?: boolean;
  dados_especificos?: Record<string, any>;
}
```

---

### **8. PERFIL DE SAÚDE**

#### `GET /perfil-saude`
Respostas ao perfil de saúde

**Query Parameters:**
```typescript
interface PerfilSaudeFilters {
  paciente_id?: string;
  status?: 'completa' | 'incompleta' | 'expirada';
  aging_categoria?: 'recente' | 'intermediario' | 'vencido';
  data_inicio?: string;
  data_fim?: string;
  limit?: number;
  offset?: number;
}
```

#### `POST /perfil-saude`
Registrar nova resposta ao perfil

**Body:**
```typescript
interface NovaRespostaPerfil {
  paciente_id: string;
  data_resposta: string;
  status: 'completa' | 'incompleta';
  percentual_completude: number;
  respostas: {
    exercicio_fisico: string;
    alimentacao: string;
    sono: number;
    stress: number;
    satisfacao_vida: number;
    tabagismo: string;
    alcool: string;
    historico_familiar: string[];
    // ... outras questões
  };
}
```

---

### **9. RELATÓRIOS E EXPORTS**

#### `GET /relatorios/dashboard`
Gerar relatório do dashboard

**Query Parameters:** (mesmo que overview + formato)
```typescript
interface RelatorioParams extends OverviewFilters {
  formato: 'pdf' | 'excel' | 'csv';
  template?: 'completo' | 'executivo' | 'detalhado';
}
```

**Response:** File download

#### `GET /export/pacientes`
Exportar lista de pacientes

**Query Parameters:** (mesmo que pacientes + formato)

#### `GET /export/atendimentos`
Exportar atendimentos

---

### **10. CONFIGURAÇÕES**

#### `GET /configuracoes/filtros`
Opções para filtros

**Response:**
```typescript
interface FiltrosOpcoes {
  clientes: { id: string; nome: string; codigo: string }[];
  produtos: { id: string; nome: string; codigo: string }[];
  unidades: { id: string; nome: string; codigo: string }[];
  profissionais: {
    id: string;
    nome: string;
    tipo: string;
    unidade: string;
  }[];
  linhas_cuidado: {
    id: string;
    codigo: string;
    nome: string;
    cor_hex: string;
  }[];
  cids: {
    codigo: string;
    descricao: string;
    categoria: string;
  }[];
  faixas_etarias: {
    codigo: string;
    nome: string;
    idade_minima: number;
    idade_maxima: number;
  }[];
}
```

#### `GET /configuracoes/sistema`
Configurações gerais do sistema

**Response:**
```typescript
interface ConfiguracoesSistema {
  total_elegiveis: number;
  total_vinculados: number;
  meta_cobertura: number;
  meta_resposta_perfil: number;
  data_ultima_atualizacao: string;
  versao_sistema: string;
}
```

---

## 🚀 CUSTOM HOOKS REACT QUERY

### **useDashboardOverview**
```typescript
export const useDashboardOverview = (filters: OverviewFilters) => {
  return useQuery({
    queryKey: ['dashboard', 'overview', filters],
    queryFn: () => fetchDashboardOverview(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
```

### **usePacientes**
```typescript
export const usePacientes = (filters: PacientesFilters) => {
  return useQuery({
    queryKey: ['pacientes', filters],
    queryFn: () => fetchPacientes(filters),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
```

### **useCronicos**
```typescript
export const useCronicos = (filters: OverviewFilters) => {
  return useQuery({
    queryKey: ['dashboard', 'cronicos', filters],
    queryFn: () => fetchCronicosData(filters),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};
```

---

## 📊 REAL-TIME SUBSCRIPTIONS

### **Pacientes Updates**
```typescript
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const channel = supabase
  .channel('dashboard-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'pacientes',
      filter: 'unidade_id=eq.123'
    },
    (payload) => {
      console.log('Paciente atualizado:', payload);
      // Invalidar cache do React Query
      queryClient.invalidateQueries(['pacientes']);
    }
  )
  .subscribe();
```

### **Atendimentos Real-time**
```typescript
const channel = supabase
  .channel('atendimentos-realtime')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'atendimentos'
    },
    (payload) => {
      // Atualizar dashboard em tempo real
      queryClient.invalidateQueries(['dashboard']);
    }
  )
  .subscribe();
```

---

## 🔐 POLÍTICAS RLS (Row Level Security)

### **Política de Pacientes**
```sql
-- Usuários veem apenas pacientes de suas unidades
CREATE POLICY "users_see_own_unit_patients" ON pacientes
  FOR SELECT USING (
    unidade_id IN (
      SELECT unidade_id 
      FROM user_permissions 
      WHERE user_id = auth.uid()
    )
  );
```

### **Política de Atendimentos**
```sql
-- Usuários veem atendimentos de pacientes de suas unidades
CREATE POLICY "users_see_own_unit_appointments" ON atendimentos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pacientes p
      JOIN user_permissions up ON p.unidade_id = up.unidade_id
      WHERE p.id = atendimentos.paciente_id
      AND up.user_id = auth.uid()
    )
  );
```

---

## ⚡ PERFORMANCE & CACHE

### **Estratégia de Cache**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 15 * 60 * 1000, // 15 minutos
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});
```

### **Invalidação Inteligente**
```typescript
// Invalidar apenas dados relacionados
const invalidateRelatedData = (entity: string, id: string) => {
  switch (entity) {
    case 'paciente':
      queryClient.invalidateQueries(['pacientes']);
      queryClient.invalidateQueries(['dashboard']);
      break;
    case 'atendimento':
      queryClient.invalidateQueries(['atendimentos']);
      queryClient.invalidateQueries(['dashboard', 'overview']);
      break;
  }
};
```

---

## 📈 MONITORING & ANALYTICS

### **API Analytics**
- Tempo de resposta por endpoint
- Cache hit ratio
- Queries mais frequentes
- Erros por endpoint

### **Performance Metrics**
```typescript
// Track API performance
export const trackAPICall = (endpoint: string, duration: number, success: boolean) => {
  posthog.capture('api_call', {
    endpoint,
    duration,
    success,
    timestamp: Date.now()
  });
};
```

---

## 🚨 ERROR HANDLING

### **Códigos de Erro**
```typescript
enum APIErrorCodes {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  RATE_LIMITED = 429,
  SERVER_ERROR = 500,
  DATABASE_ERROR = 503
}
```

### **Error Responses**
```typescript
interface APIError {
  code: number;
  message: string;
  details?: any;
  timestamp: string;
}
```

### **Client Error Handling**
```typescript
const handleAPIError = (error: any) => {
  switch (error.status) {
    case 401:
      redirectToLogin();
      break;
    case 403:
      showErrorToast('Acesso negado');
      break;
    case 422:
      showValidationErrors(error.details);
      break;
    default:
      showErrorToast('Erro interno do sistema');
  }
};
```

---

## 📋 TESTING

### **API Tests**
```typescript
describe('Dashboard API', () => {
  test('should return overview data', async () => {
    const response = await fetch('/api/dashboard/overview');
    const data = await response.json();
    
    expect(data.demograficos).toBeDefined();
    expect(data.cobertura.vidas_elegiveis).toBeGreaterThan(0);
  });
});
```

---

**📌 NOTA IMPORTANTE**: Esta documentação mapeia todas as funcionalidades identificadas no projeto atual, garantindo API completa para o refatoramento.