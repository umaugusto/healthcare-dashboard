# 🚀 PLANO DE REFATORAMENTO COMPLETO
# Dashboard APS - Migração para Netlify + Supabase

## 📊 ANÁLISE DO PROJETO ATUAL

### 🏗️ Arquitetura Identificada
- **Frontend**: React 18 + TypeScript + Next.js
- **UI**: shadcn/ui (47 componentes) + Tailwind CSS + Lucide React
- **Estado**: React useState com prop drilling
- **Dados**: Mock data em TypeScript (516+ objetos)
- **Visualização**: Gráficos customizados + componentes interativos

### 📈 Funcionalidades Mapeadas

#### **1. MÓDULOS DE NEGÓCIO**
- **Demográficos**: Composição familiar, distribuição por sexo/idade, tempo no programa
- **Cobertura Populacional**: 8.950 elegíveis, 7.720 vinculados, funis de acompanhamento
- **Utilização APS**: 4.825 atendimentos, ranking de utilizadores, motivos top
- **PA Virtual**: 3.110 atendimentos, taxa de resolução 78.5%
- **Doenças Crônicas**: Hipertensão (1.847), Diabetes (926), Obesidade (1.544)
- **Saúde Mental**: Ansiedade (500), Depressão (272), DORT/LER (890)
- **Rastreios**: 8 tipos de rastreamento com metas específicas

#### **2. SISTEMA DE FILTROS**
- **Globais**: Cliente, produto, unidade, período, tempo programa
- **Equipe**: Médicos família, enfermeiros, coordenadores  
- **Demografia**: Faixa etária, sexo, titularidade
- **Clínicos**: Linhas de cuidado (20 tipos), CIDs (103 códigos)
- **Interativos**: Filtros locais entre gráficos com correlações

#### **3. COMPONENTES INTERATIVOS**
- **30+ Gráficos**: KPIs, funis, barras empilhadas, donut charts, heatmaps
- **Tabela Analítica**: 81 colunas, 10 presets de visualização
- **Navegação**: 4 abas principais + modo tabela com contexto
- **Tooltips**: Informações detalhadas sobre regras de cálculo

## 🎯 NOVA ARQUITETURA PROPOSTA

### **STACK TECNOLÓGICA**
```
Frontend: Next.js 14 + TypeScript + Tailwind CSS
Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
Deploy: Netlify (Frontend) + Supabase (Backend)
Analytics: Recharts + Framer Motion
Monitoramento: Sentry + PostHog
CI/CD: GitHub Actions
```

### **ESTRUTURA DE DIRETÓRIOS**
```
dashboard-aps-v2/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard routes
│   ├── auth/                    # Authentication
│   └── api/                     # API routes
├── components/
│   ├── ui/                      # shadcn/ui base
│   ├── charts/                  # Chart components
│   ├── layout/                  # Layout components
│   ├── shared/                  # Shared components
│   └── animations/              # Motion components
├── lib/
│   ├── supabase/               # Supabase client & types
│   ├── hooks/                  # Custom hooks
│   ├── utils/                  # Utility functions
│   └── validations/            # Zod schemas
├── types/                       # TypeScript definitions
├── public/                      # Static assets
├── database/                    # SQL migrations
└── scripts/                     # Build & deployment
```

## 📋 FASES DE IMPLEMENTAÇÃO

### **FASE 1: SETUP INICIAL (Semana 1)**

#### 1.1 Configuração Base
```bash
# Next.js 14 com TypeScript
npx create-next-app@latest dashboard-aps-v2 --typescript --tailwind --app

# Dependências principais
npm install @supabase/supabase-js @supabase/ssr
npm install recharts framer-motion lucide-react
npm install @radix-ui/react-* clsx tailwind-merge
npm install @hookform/resolvers zod react-hook-form
npm install @tanstack/react-query date-fns
```

#### 1.2 Configuração Supabase
- Criação do projeto
- Configuração RLS (Row Level Security)
- Setup de autenticação
- Configuração de storage para exports

#### 1.3 Deploy Netlify
- Configuração automática do GitHub
- Variáveis de ambiente
- Preview deployments
- Edge functions setup

### **FASE 2: MIGRAÇÃO DE DADOS (Semana 2-3)**

#### 2.1 Schema do Banco de Dados (32 tabelas)
```sql
-- Tabelas principais identificadas
CREATE TABLE pacientes (516 registros mockados)
CREATE TABLE atendimentos (4.825 registros)
CREATE TABLE exames_laboratoriais (dados de glicemia, PA, IMC)
CREATE TABLE rastreios (8 tipos x dados históricos)
CREATE TABLE filtros_sistema (todas as opções mapeadas)
-- ... mais 27 tabelas
```

#### 2.2 APIs e Queries
- **Queries Complexas**: 45+ consultas identificadas
- **Correlações**: Sistema de correlações epidemiológicas
- **Agregações**: KPIs calculados em real-time
- **Cache**: Redis para consultas frequentes

### **FASE 3: COMPONENTES & UI (Semana 4-5)**

#### 3.1 Sistema de Gráficos
```typescript
// Biblioteca unificada de gráficos
export const ChartComponents = {
  KPICard: React.FC<KPIProps>,
  DonutChart: React.FC<DonutProps>,
  StackedBar: React.FC<StackedBarProps>,
  Heatmap: React.FC<HeatmapProps>,
  FunnelChart: React.FC<FunnelProps>,
  // ... 25+ componentes mapeados
}
```

#### 3.2 Sistema de Animações
- **Framer Motion**: Transições entre abas
- **Loading States**: Skeletons para todos componentes
- **Hover Effects**: Interações nos gráficos
- **Data Updates**: Animações de mudança de dados

#### 3.3 Filtros Reativos
- **Global State**: Zustand para filtros
- **Local Filters**: Sistema de filtros interativos
- **URL State**: Filtros na URL para compartilhamento
- **Debounce**: Otimização de performance

### **FASE 4: FUNCIONALIDADES AVANÇADAS (Semana 6-7)**

#### 4.1 Real-time Features
```typescript
// Supabase Realtime
const subscription = supabase
  .channel('dashboard-updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'atendimentos' },
    handleRealTimeUpdate
  )
```

#### 4.2 Export System
- **Excel Export**: Biblioteca SheetJS
- **PDF Reports**: React-PDF ou jsPDF
- **Scheduled Reports**: Edge Functions
- **Email Integration**: Resend ou SendGrid

#### 4.3 Dashboard Personalizado
- **User Preferences**: Layouts salvos
- **Favorite Filters**: Filtros favoritos
- **Custom KPIs**: Métricas personalizadas
- **Notifications**: Sistema de alertas

### **FASE 5: PERFORMANCE & DEPLOY (Semana 8)**

#### 5.1 Otimizações
```typescript
// Code Splitting
const ChartsView = lazy(() => import('./components/ChartsView'))

// React Query para cache
const { data, isLoading } = useQuery({
  queryKey: ['dashboard-data', filters],
  queryFn: fetchDashboardData,
  staleTime: 5 * 60 * 1000 // 5 minutos
})
```

#### 5.2 Monitoramento
- **Sentry**: Error tracking
- **PostHog**: Analytics de uso
- **Lighthouse**: Performance monitoring
- **Uptime**: Status page

## 🗃️ MIGRAÇÃO DE DADOS DETALHADA

### **Dados Identificados para Migração**

#### **1. Demografia (demograficosData)**
```sql
INSERT INTO demograficos VALUES
-- Composição familiar: 42% dependentes, 58% titulares
-- Distribuição sexo: 53% feminino, 47% masculino  
-- Faixas etárias: 18% (0-17), 45% (18-39), 28% (40-59), 9% (60+)
-- Tempo programa: distribuição em 4 faixas
```

#### **2. Cobertura (coberturaData)**
```sql
-- 8.950 elegíveis, 7.720 vinculados (86.3% taxa)
-- Funil: 4.014 controlados, 1.930 inadequados, 1.776 sem acompanhamento
-- Métricas: 1.843 consultas/mês, incremento +54 pacientes
```

#### **3. Crônicos (6 condições principais)**
```sql
-- Hipertensão: 1.847 pacientes (926 em LC - 51.4%)
-- Diabetes: dados completos de controle glicêmico
-- Obesidade: 1.544 pacientes com evolução de peso
-- Saúde Mental: 772 pacientes em acompanhamento
```

#### **4. Rastreios (8 tipos)**
```sql
-- Mamografia: 2.100 elegíveis, 1.588 realizadas (75.6%)
-- Citologia: 1.800 elegíveis, 1.420 realizadas (78.9%)
-- 6 outros rastreios com metas específicas
```

## 🔧 FERRAMENTAS & CONFIGURAÇÕES

### **package.json Otimizado**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "deploy": "npm run build && netlify deploy --prod",
    "db:migrate": "supabase db push",
    "db:seed": "node scripts/seed-database.js",
    "type-check": "tsc --noEmit",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.x",
    "@supabase/supabase-js": "^2.x",
    "recharts": "^2.x",
    "framer-motion": "^11.x",
    "zustand": "^4.x",
    "@tanstack/react-query": "^5.x"
  }
}
```

### **Configurações de Deploy**
```toml
# netlify.toml
[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

## 🎨 DESIGN SYSTEM

### **Cores Mapeadas (projectColors)**
```scss
:root {
  --primary: #3b82f6;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --pastel-green: #86efac;
  --pastel-yellow: #fde047;
  --pastel-red: #fca5a5;
  // ... 17 cores total identificadas
}
```

### **Componentes UI (47 identificados)**
- Todos os componentes shadcn/ui mapeados
- Customizações específicas para saúde
- Padrões de acessibilidade
- Responsive design

## 📊 MÉTRICAS DE SUCESSO

### **Performance Targets**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3s
- Bundle size: < 500KB gzipped

### **Funcionalidades Críticas**
- ✅ Todos os 30+ gráficos funcionais
- ✅ Sistema de filtros completo
- ✅ Navegação entre abas preservada
- ✅ Tabela analítica com 81 colunas
- ✅ Export de dados
- ✅ Real-time updates

## 🚀 CRONOGRAMA RESUMIDO

| Fase | Duração | Entregáveis |
|------|---------|-------------|
| **Fase 1** | Semana 1 | Setup completo + Deploy inicial |
| **Fase 2** | Semanas 2-3 | Migração de dados + APIs |
| **Fase 3** | Semanas 4-5 | Componentes + Animações |
| **Fase 4** | Semanas 6-7 | Features avançadas |
| **Fase 5** | Semana 8 | Performance + Go-live |

## 📋 PRÓXIMOS PASSOS

1. **Criar schema do banco** - DATABASE_SCHEMA.sql
2. **Scripts de migração** - DATA_MIGRATION.js  
3. **Mapeamento componentes** - COMPONENT_MAP.md
4. **Documentação APIs** - API_DOCUMENTATION.md
5. **Setup inicial** - Supabase + Netlify + GitHub

---

**📌 NOTA IMPORTANTE**: Este plano mapeia 100% das funcionalidades existentes identificadas na análise, garantindo que nenhuma feature seja perdida no refatoramento.