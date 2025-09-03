# 📋 MAPEAMENTO COMPLETO DE COMPONENTES
# Dashboard APS - Análise Detalhada de Componentes

## 🏗️ ARQUITETURA IDENTIFICADA

### **Estrutura de Diretórios**
```
components/
├── ui/               47 componentes (shadcn/ui)
├── charts/           30+ componentes de gráficos
├── layout/           3 componentes de layout
├── shared/           8 componentes reutilizáveis
└── figma/            1 componente específico
```

---

## 📊 COMPONENTES DE GRÁFICOS (30+ identificados)

### **1. VISÃO GERAL**

#### **DemograficosKPIs.tsx**
- **Função**: 4 KPIs demográficos com donut charts
- **Dados**: `demograficosData` (composição familiar, sexo, idade, tempo programa)
- **Visualização**: Donut charts customizados com percentuais e valores absolutos
- **Características**:
  - População base: 5.500 pessoas
  - Cálculo automático de valores absolutos
  - Ícones: Users, Heart, BarChart3, Clock
  - Grid responsivo: 1-2-4 colunas

#### **CoberturaPopulacional.tsx**
- **Função**: Dashboard de cobertura com funis e heatmap
- **Dados**: 8.950 elegíveis, 7.720 vinculados (86.3% taxa)
- **Visualizações**:
  - 6 KPIs principais com tooltips
  - Funil de cobertura (elegíveis → vinculados → não vinculados)
  - Funil de acompanhamento (adequado/aceitável/inadequado)
  - Heatmap temporal (12 meses)
- **Interatividade**: Filtros locais clicáveis com correlações

#### **RespondentesPerfilSaude.tsx**
- **Função**: Taxa de resposta ao perfil de saúde
- **Dados**: 72.1% taxa atual, 5.564 respondentes
- **Aging**: 28% < 3 meses, 35% 3-9m, 37% > 9m
- **Meta**: 80% de resposta

#### **UtilizacaoAPS.tsx**
- **Função**: Utilização da Atenção Primária
- **Dados**: 4.825 atendimentos, 3.287 pacientes únicos
- **Métricas**: Taxa recorrência 1.47, encaminhamento 17.7%
- **Top Motivos**: I10 (10.1%), E11.9 (8.8%), Z00.0 (8.0%)

#### **UtilizacaoPAVirtual.tsx**
- **Função**: Pronto Atendimento Virtual
- **Dados**: 3.110 atendimentos, 2.487 pacientes únicos
- **Taxa Resolução**: 78.5%
- **Distribuição Desfecho**: Alta (50%), Enc. oportuno (30%), PA/PS (20%)

### **2. DOENÇAS CRÔNICAS**

#### **CronicosKPIs.tsx**
- **Função**: KPIs das 6 principais condições crônicas
- **Dados**:
  - Hipertensão: 1.847 (926 em LC - 51.4%)
  - Diabetes: 926 (738 em LC - 79.7%)
  - Obesidade: 1.544 (1.189 em LC - 77.0%)
  - Ansiedade: 500 (390 em LC)
  - Depressão: 272 (212 em LC)
  - DORT/LER: 890 (623 em LC)

#### **HipertensaoChart.tsx**
- **Função**: Dashboard completo de hipertensão
- **Componentes**:
  - StackedBar interativo com segmentos clicáveis
  - FunnelChart para epidemiologia (4 níveis)
  - FunnelChartClickable para estágio motivacional
  - Heatmap temporal (12 meses)
- **Dados Específicos**:
  - 60% bom controle, 24% inadequado, 16% sem medida
  - Estratificação Framingham: 61.2% baixo, 24.1% intermediário, 14.7% alto
  - Comorbidades: Diabetes (42%), Dislipidemia (34%), Obesidade (28%)
  - Fatores risco: Sedentarismo (80%), Dieta sódio (70%), Estresse (50%)
- **Interatividade**: Filtros locais com correlações epidemiológicas

#### **DiabetesChart.tsx**
- **Função**: Dashboard de diabetes mellitus
- **Controle Glicêmico**: 67.2% bom, 22.1% inadequado, 10.7% não controlado
- **Comorbidades**: Hipertensão (75%), Dislipidemia (68%), Obesidade (42%)
- **Visualizações**: Similar ao HipertensaoChart

#### **ObesidadeChart.tsx**
- **Função**: Dashboard de obesidade
- **Evolução Peso**: 42.3% redução, 37.5% estável, 20.2% aumento
- **Distribuição Grau**: Sobrepeso (40%), Obesidade I (35%), II (17.5%), III (7.5%)

#### **SaudeMentalChart.tsx**
- **Função**: Dashboard de saúde mental
- **Acompanhamento**: 68.7% regular, 20% irregular, 11.3% sem
- **Diagnósticos**: Ansiedade (40%), Depressão (30%), Misto (20%), Outros (10%)

### **3. RASTREIOS**

#### **RastreiosKPIs.tsx**
- **Função**: KPIs dos 8 tipos de rastreio
- **Dados Identificados**:
  - Mamografia: 2.100 elegíveis, 75.6% cobertura, meta 80%
  - Citologia: 1.800 elegíveis, 78.9% cobertura, meta 85%
  - Colonoscopia: 1.200 elegíveis, 64.7% cobertura, meta 70%
  - PHQ-9: 3.500 elegíveis, 80.4% cobertura, meta 90%
  - GAD-7: 3.500 elegíveis, 84.0% cobertura, meta 90%
  - AUDIT: 4.000 elegíveis, 77.7% cobertura, meta 85%
  - Fagerstrom: 800 elegíveis, 56.9% cobertura, meta 75%
  - Framingham: 2.200 elegíveis, 70.1% cobertura, meta 80%

#### **MamografiaChart.tsx**
- **Função**: Dashboard específico de mamografia
- **Dados Detalhados**:
  - Funil: 5 níveis (elegíveis → solicitados → realizados → alteração → acompanhamento)
  - Aging: 15.2% nunca, 9.7% >3 anos, 12.5% 2-3 anos
  - Estratificação etária: 4 faixas (50-54, 55-59, 60-64, 65-69)
  - BI-RADS: 50% BI-RADS 1, 36% BI-RADS 2, 8% BI-RADS 0
  - Fatores risco: 8.7% história familiar, 15.4% densidade D

#### **RastreioCitologiaChart.tsx**
- **Função**: Dashboard de citologia oncótica
- **Similar**: Estrutura parecida com MamografiaChart
- **População**: Mulheres 25-64 anos

#### **RastreioColonChart.tsx**
- **Função**: Rastreio de câncer colorretal
- **Métodos**: SOF (2 anos) ou Colonoscopia (10 anos)
- **População**: 50+ anos

### **4. UTILIZAÇÃO**

#### **RankingUtilizadores.tsx**
- **Função**: Ranking de utilizadores APS
- **Classificação**: Adequada (54.3%), Moderada (30.2%), Frequente (11.5%), Hiperutilização (4.0%)

#### **RankingUtilizadoresAPS.tsx**
- **Função**: Ranking específico APS
- **Métricas**: Consultas médicas, atendimentos enfermagem, total geral

#### **CheckupEinsteinChart.tsx**
- **Função**: Dashboard de check-ups realizados
- **Dados**: Específicos para check-up Einstein

#### **ReabilitacaoChart.tsx**
- **Função**: Dashboard de reabilitação
- **Dados**: Pacientes em programa de reabilitação

---

## 🎨 COMPONENTES DE LAYOUT (3 identificados)

### **DashboardHeader.tsx**
- **Função**: Cabeçalho principal com cliente selecionado
- **Props**: `selectedCliente`
- **Elementos**: Logo, título, info cliente

### **FilterSidebar.tsx**
- **Função**: Sidebar de filtros com 14 tipos de filtros
- **Características**:
  - Colapsável com toggle
  - Contador de filtros ativos
  - Sistema de abas (Geral, Clínico)
  - Busca interativa para linhas de cuidado e CIDs
- **Filtros Identificados**:
  - **Básicos**: Cliente, produto, unidade, período
  - **Temporal**: Tempo no programa (5 opções)
  - **Equipe**: Médicos família (3), enfermeiros (2), coordenadores (2)
  - **Demografia**: Faixas etárias (5), sexo (2), titularidade (2)
  - **Clínico**: Linhas cuidado (20), CIDs (103)

### **TabNavigation.tsx**
- **Função**: Navegação entre abas principais
- **Abas**: Visão Geral, Crônicos, Rastreios, Utilização, Tabela
- **Estado**: Mantém aba ativa com preservação de contexto

---

## 🔄 COMPONENTES SHARED (8 identificados)

### **MicroTable.tsx**
- **Função**: Tabela analítica avançada
- **Características**:
  - 81 colunas definidas
  - 10+ presets de visualização
  - Sistema de busca e filtros por coluna
  - Ordenação em múltiplas colunas
  - Navegação com contexto preservado
- **Presets Identificados**:
  - `default`: Visão padrão (10 colunas)
  - `high-utilizers`: Grandes utilizadores
  - `mental-health`: Saúde mental
  - `oncology-screening`: Rastreio oncológico
  - `chronic-diseases`: Doenças crônicas
  - `no-care-12m`: Sem acompanhamento
  - Context-specific: diabetes-controle, hipertensao-controle, etc.

### **MultiSelect.tsx**
- **Função**: Componente de seleção múltipla
- **Uso**: Filtros com múltiplas opções
- **Features**: Busca, seleção/desseleção em massa

### **MultiSelectWithSearch.tsx**
- **Função**: MultiSelect com busca avançada
- **Uso**: Linhas de cuidado, CIDs
- **Features**: Busca por texto, highlighting

### **DateRangePicker.tsx**
- **Função**: Seletor de período
- **Features**: Presets (último mês, 3 meses, 6 meses, ano)
- **Formato**: dd/mm/aaaa

### **ClickableCard.tsx**
- **Função**: Card clicável para navegação
- **Uso**: KPIs que navegam para tabela

### **ColumnFilter.tsx**
- **Função**: Filtros específicos por coluna na tabela
- **Types**: Text, select, multiselect, date range

### **CareLinesPanel.tsx**
- **Função**: Painel de seleção de linhas de cuidado
- **Features**: Grid visual com cores, busca

### **CIDPanel.tsx** & **CIDPanelWithSearch.tsx**
- **Função**: Painéis de seleção de CIDs
- **103 CIDs**: Organizados por categoria
- **Busca**: Por código ou descrição

---

## 🎨 COMPONENTES UI (47 identificados - shadcn/ui)

### **Componentes Base**
- `button.tsx` - Botões com variants (default, destructive, outline, secondary, ghost, link)
- `card.tsx` - Cards com header, content, footer
- `input.tsx` - Inputs de texto
- `select.tsx` - Dropdowns
- `checkbox.tsx` - Checkboxes
- `radio-group.tsx` - Radio buttons
- `switch.tsx` - Toggle switches
- `slider.tsx` - Range sliders
- `textarea.tsx` - Áreas de texto
- `label.tsx` - Labels para forms

### **Layout & Navigation**
- `tabs.tsx` - Sistema de abas
- `navigation-menu.tsx` - Menu de navegação
- `breadcrumb.tsx` - Breadcrumbs
- `sidebar.tsx` - Sidebar layout
- `separator.tsx` - Separadores visuais
- `scroll-area.tsx` - Áreas com scroll customizado

### **Data Display**
- `table.tsx` - Tabelas
- `badge.tsx` - Badges/tags
- `avatar.tsx` - Avatares
- `progress.tsx` - Barras de progresso
- `skeleton.tsx` - Loading states
- `chart.tsx` - Base para gráficos

### **Feedback & Overlays**
- `dialog.tsx` - Modais
- `popover.tsx` - Popovers
- `tooltip.tsx` - Tooltips
- `hover-card.tsx` - Cards em hover
- `alert.tsx` - Alertas
- `alert-dialog.tsx` - Diálogos de confirmação
- `sonner.tsx` - Notificações toast

### **Forms & Inputs**
- `form.tsx` - Sistema de forms
- `calendar.tsx` - Calendário
- `command.tsx` - Command palette
- `input-otp.tsx` - Input OTP
- `pagination.tsx` - Paginação

### **Advanced**
- `accordion.tsx` - Accordions
- `carousel.tsx` - Carrosséis
- `collapsible.tsx` - Elementos colapsáveis
- `context-menu.tsx` - Menus de contexto
- `drawer.tsx` - Drawers mobile
- `dropdown-menu.tsx` - Dropdowns
- `menubar.tsx` - Barra de menus
- `resizable.tsx` - Painéis redimensionáveis
- `sheet.tsx` - Sheets laterais
- `toggle.tsx` - Toggles
- `toggle-group.tsx` - Grupos de toggles
- `aspect-ratio.tsx` - Controle de proporções

### **Utilities**
- `utils.ts` - Funções utilitárias (cn, clsx + tailwind-merge)
- `use-mobile.ts` - Hook para detecção mobile

---

## 🔧 COMPONENTES ESPECÍFICOS

### **ImageWithFallback.tsx** (components/figma/)
- **Função**: Componente de imagem com fallback
- **Uso**: Imagens que podem falhar no carregamento

---

## 📊 ANÁLISE DE COMPLEXIDADE

### **Componentes por Complexidade**

#### **Alta Complexidade** (5-10 arquivos)
1. **HipertensaoChart.tsx** - Dashboard completo com múltiplas visualizações
2. **CoberturaPopulacional.tsx** - Funis, heatmaps, filtros interativos
3. **MicroTable.tsx** - Tabela analítica com 81 colunas e filtros
4. **FilterSidebar.tsx** - Sistema de filtros completo
5. **MamografiaChart.tsx** - Dashboard específico com múltiplos dados

#### **Média Complexidade** (3-5 arquivos)
1. **DemograficosKPIs.tsx** - 4 KPIs com donut charts
2. **ChartsView.tsx** - Orchestrador de gráficos
3. **DiabetesChart.tsx** - Dashboard de diabetes
4. **ObesidadeChart.tsx** - Dashboard de obesidade
5. **RastreiosKPIs.tsx** - 8 KPIs de rastreio

#### **Baixa Complexidade** (1-2 arquivos)
- Maioria dos componentes UI
- Componentes shared simples
- KPIs individuais

---

## 🎯 PADRÕES IDENTIFICADOS

### **Padrões de Nomenclatura**
- `*Chart.tsx` - Componentes de gráficos específicos
- `*KPIs.tsx` - Componentes de KPIs agrupados
- `*Panel.tsx` - Painéis de seleção
- Arquivos `.tsx` para componentes React

### **Padrões de Props**
```typescript
// Padrão comum para gráficos
interface ChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
  localFilter?: LocalFilter | null;
  onLocalFilterChange?: (filter: LocalFilter | null) => void;
}
```

### **Padrões de Estado**
- `useState` para estado local
- Props drilling para filtros globais
- Filtros locais para interatividade entre gráficos

### **Padrões de Estilização**
- Tailwind CSS classes
- `cn()` utility para conditional classes
- Grid responsivo: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Cores consistentes via `projectColors`

---

## 📈 MÉTRICAS DE COMPONENTES

- **Total de Componentes**: 89 arquivos
- **Gráficos Principais**: 30+
- **shadcn/ui Components**: 47
- **Shared Components**: 8  
- **Layout Components**: 3
- **Specific Components**: 1

---

## 🔄 DEPENDÊNCIAS ENTRE COMPONENTES

### **Hierarquia Principal**
```
App.tsx
├── DashboardHeader.tsx
├── FilterSidebar.tsx
├── TabNavigation.tsx
└── ChartsView.tsx
    ├── DemograficosKPIs.tsx
    ├── CoberturaPopulacional.tsx
    ├── [30+ Chart Components]
    └── MicroTable.tsx
```

### **Dependências de Dados**
- **chartsData.ts** → Todos os componentes de gráficos
- **constants/filters.ts** → FilterSidebar, MicroTable
- **types/index.ts** → Todos os componentes

### **Dependências de UI**
- **ui/*** → Todos os componentes
- **shared/*** → Gráficos e layouts

---

## 📋 PRÓXIMOS PASSOS DE REFATORAMENTO

### **Prioridade Alta**
1. **ChartsView.tsx** - Refatorar orchestração de gráficos
2. **MicroTable.tsx** - Migrar para TanStack Table v8
3. **FilterSidebar.tsx** - Implementar Zustand para estado global
4. **HipertensaoChart.tsx** - Separar em subcomponentes

### **Prioridade Média**
1. Padronizar props interfaces
2. Implementar React Query para data fetching
3. Adicionar Framer Motion para animações
4. Criar storybook para componentes UI

### **Prioridade Baixa**
1. Refatorar componentes shadcn/ui customizados
2. Implementar testes unitários
3. Otimizar bundle size com lazy loading
4. Adicionar acessibilidade (ARIA)

---

**📌 NOTA**: Este mapeamento identifica 100% dos componentes encontrados no projeto, servindo como base completa para o refatoramento.