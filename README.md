# 🏥 Dashboard APS v2.0

Sistema completo de monitoramento de indicadores de Atenção Primária à Saúde com arquitetura moderna.

## 🚀 Tecnologias

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **UI**: shadcn/ui + Radix UI + Framer Motion
- **State**: Zustand + TanStack Query
- **Deploy**: Netlify + Supabase

## 📊 Funcionalidades

### Dashboard Principal
- **4 Abas**: Visão Geral, Crônicos, Rastreios, Utilização
- **30+ Gráficos** interativos com animações
- **Sistema de Filtros**: 14 tipos de filtros com correlações
- **Tabela Analítica**: 81 colunas com presets personalizados

### Dados de Saúde
- **8.950 pacientes** elegíveis, 7.720 vinculados
- **6 Doenças Crônicas**: Hipertensão, Diabetes, Obesidade, etc.
- **8 Tipos de Rastreio**: Mamografia, Citologia, PHQ-9, GAD-7, etc.
- **Real-time Updates** via Supabase

## 🏗️ Arquitetura

```
app/                          # Next.js App Router
├── dashboard/               # Dashboard routes
├── auth/                    # Authentication
└── api/                     # API routes

components/
├── ui/                      # shadcn/ui components (47)
├── charts/                  # Chart components (30+)
├── layout/                  # Layout components
├── shared/                  # Shared components
└── animations/              # Motion components

lib/
├── supabase/               # Supabase client & types
├── hooks/                  # Custom hooks
├── utils/                  # Utility functions
└── validations/            # Zod schemas
```

## 🔧 Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
# Editar .env.local com suas credenciais
```

### 3. Configurar Supabase
```bash
# Aplicar schema
npm run db:migrate

# Popular com dados
npm run db:seed

# Gerar tipos TypeScript
npm run db:types
```

### 4. Executar em desenvolvimento
```bash
npm run dev
```

## 📊 Dados do Projeto

### Demografia
- **Composição**: 58% titulares, 42% dependentes
- **Sexo**: 53% feminino, 47% masculino
- **Idade**: 45% adultos jovens (18-39), 28% adultos (40-59)

### Cobertura
- **Taxa Vinculação**: 86.3%
- **Acompanhamento**: 52% controlado, 25% inadequado, 23% sem acompanhamento

### Utilização
- **APS**: 4.825 atendimentos, taxa recorrência 1.47
- **PA Virtual**: 3.110 atendimentos, 78.5% resolução

## 🎨 Componentes

### Gráficos Principais
- `DemograficosKPIs` - 4 KPIs com donut charts
- `CoberturaPopulacional` - Funis + heatmap temporal
- `HipertensaoChart` - Dashboard completo de hipertensão
- `MamografiaChart` - Rastreio de câncer de mama
- 26+ outros componentes

### UI Components
- 47 componentes shadcn/ui customizados
- Sistema de cores baseado no projeto original
- Animações com Framer Motion

## 📱 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build para produção
npm run start           # Servidor de produção

# Database
npm run db:migrate      # Aplicar migrações
npm run db:seed         # Popular dados
npm run db:types        # Gerar tipos TS

# Deploy
npm run deploy          # Deploy no Netlify
npm run preview         # Preview do deploy

# Qualidade
npm run lint            # ESLint
npm run type-check      # TypeScript check
npm test                # Testes
```

## 🚀 Deploy

### Netlify
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático a cada push

### Supabase
- Projeto já configurado: `bgivemisrbkdtmbxojlu`
- RLS habilitado
- Real-time configurado

## 📈 Performance

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Bundle Size**: < 500KB gzipped
- **Cache Strategy**: React Query + Supabase

## 🔐 Segurança

- **Row Level Security (RLS)** habilitado
- **Políticas de acesso** por unidade
- **Validação** com Zod schemas
- **Rate limiting** configurado

## 📚 Documentação

- `REFACTORING_PLAN.md` - Plano completo de refatoramento
- `DATABASE_SCHEMA.sql` - Schema do banco de dados
- `COMPONENT_MAP.md` - Mapeamento de componentes
- `API_DOCUMENTATION.md` - APIs e endpoints

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**🎯 Migração completa do projeto original mantendo 100% das funcionalidades com stack moderna!**