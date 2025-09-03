# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Healthcare Dashboard application built with React/TypeScript and Next.js, designed for visualizing and analyzing population health data with focus on Primary Health Care (APS) programs.

## Tech Stack

- **Framework**: React with TypeScript, Next.js (using "use client" directive)
- **UI Library**: shadcn/ui components (based on Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: React useState with prop drilling
- **Icons**: Lucide React
- **Utilities**: clsx + tailwind-merge for className management

## Architecture

### Core Components Structure
- `app/page.tsx` - Main dashboard page with state management
- `components/ChartsView.tsx` - Charts orchestrator component
- `components/layout/` - Layout components (FilterSidebar, DashboardHeader, TabNavigation)
- `components/charts/` - Individual chart components for different health metrics
- `components/shared/` - Reusable components (MultiSelect, MicroTable, DateRangePicker)
- `components/ui/` - shadcn/ui base components

### Data Flow
1. Global filters state managed in `app/page.tsx`
2. Filters passed down to chart components via props
3. Mock data centralized in `data/chartsData.ts`
4. Constants and filter options in `constants/filters.ts`

### Key Business Modules
- **Demographics** (DemograficosKPIs)
- **Population Coverage** (CoberturaPopulacional)
- **Chronic Diseases** (Hipertensao, Diabetes, Obesidade, SaudeMental)
- **Screenings** (Mamografia, Citologia, Colonoscopia)
- **Healthcare Utilization** (UtilizacaoAPS, UtilizacaoPAVirtual)

## Development Guidelines

### Component Patterns
- All chart components follow similar structure with filters props
- Use `"use client"` directive for client-side components
- Components use Portuguese naming for business logic alignment

### Styling Conventions
- Use Tailwind CSS classes via `cn()` utility function
- Follow shadcn/ui component patterns
- Color palette defined in `data/chartsData.ts` as `projectColors`

### State Management
- Filters interface defined in `types/index.ts`
- Local filter state for inter-chart interactions
- Table navigation with context preservation

### Data Structure
- Mock data stored in TypeScript files
- Epidemiological constants: TOTAL_COM_CID, TOTAL_VINCULADOS, TOTAL_ELEGIVEIS
- Portuguese language for UI labels and data

## Common Tasks

Since this appears to be a standalone frontend without package.json, common development involves:
- Modifying chart components in `components/charts/`
- Updating mock data in `data/chartsData.ts`
- Adding new filters in `constants/filters.ts`
- Creating new visualizations following existing chart patterns

## Important Notes

- Project uses Portuguese language throughout (Brazilian healthcare context)
- No build configuration files present - likely part of a larger workspace
- Mock data suggests integration with healthcare management systems
- Focus on APS (Atenção Primária à Saúde) metrics and KPIs
- siga o planejamento em REFACTORING_PLAN.md
- supabase url https://bgivemisrbkdtmbxojlu.supabase.co
- supabase anon key eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5Mjg0NDIsImV4cCI6MjA3MjUwNDQ0Mn0.RjpXo32Es271mQEa2gCgegupvP0iuP1Ve1BEZf2WKO8
- supabase service_role eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkyODQ0MiwiZXhwIjoyMDcyNTA0NDQyfQ.ZAVpzi6Qe8zuzTfIvsGCfjORY4EBi5iJqrFYe7YMZgA