// Arquivo: components/charts/RastreioAuditChart.tsx
// Componente: Dashboard de rastreamento AUDIT com filtros interativos
// Contexto: Dashboard APS - Análise detalhada do rastreio de uso nocivo de álcool
// Padrão: Baseado em MamografiaChart com dados específicos do AUDIT

"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Info, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Calendar, 
  Clock, 
  FileText, 
  Target, 
  BarChart3, 
  ChevronDown,
  Wine,
  AlertOctagon,
  ShieldAlert
} from 'lucide-react';

interface RastreioAuditChartProps {
  filters?: any;
  onNavigateToTable?: (type: string) => void;
}

// Dados mockados específicos para AUDIT
const dadosAudit = {
  elegiveis: 4850,
  coberturaAtual: 77.7,
  metaAnual: 85,
  
  funilRastreamento: [
    { etapa: 'Adultos ≥18 anos', valor: 4850, percentual: 100 },
    { etapa: 'Elegíveis p/ rastreio', valor: 4650, percentual: 95.9 },
    { etapa: 'Questionários aplicados', valor: 3770, percentual: 77.7 },
    { etapa: 'Risco identificado', valor: 945, percentual: 25.1 },
    { etapa: 'Intervenção realizada', valor: 812, percentual: 85.9 },
    { etapa: 'Em acompanhamento', valor: 623, percentual: 76.7 }
  ],
  
  // Classificação AUDIT por níveis de risco
  classificacaoAudit: [
    { categoria: 'Baixo risco (0-7)', quantidade: 2825, percentual: 74.9, descricao: 'Consumo de baixo risco', cor: '#22c55e', intervencao: 'Educação em saúde' },
    { categoria: 'Risco moderado (8-15)', quantidade: 642, percentual: 17.0, descricao: 'Consumo de risco', cor: '#fbbf24', intervencao: 'Intervenção breve' },
    { categoria: 'Alto risco (16-19)', quantidade: 189, percentual: 5.0, descricao: 'Consumo nocivo', cor: '#f59e0b', intervencao: 'Intervenção breve + acompanhamento' },
    { categoria: 'Muito alto (20+)', quantidade: 114, percentual: 3.0, descricao: 'Possível dependência', cor: '#ef4444', intervencao: 'Encaminhamento especializado' }
  ],
  
  // Padrões de consumo por domínio do AUDIT
  dominiosAudit: [
    { dominio: 'Frequência de consumo', alterado: 756, total: 3770, percentual: 20.1, cor: '#3b82f6' },
    { dominio: 'Quantidade típica', alterado: 642, total: 3770, percentual: 17.0, cor: '#10b981' },
    { dominio: 'Consumo de risco', alterado: 491, total: 3770, percentual: 13.0, cor: '#f59e0b' },
    { dominio: 'Sinais de dependência', alterado: 303, total: 3770, percentual: 8.0, cor: '#ef4444' }
  ],
  
  // Distribuição por gênero e idade
  distribuicaoGeneroIdade: [
    { grupo: 'Homens 18-29', riscoBaixo: 245, riscoModerado: 85, riscoAlto: 42, percentualRisco: 34.1 },
    { grupo: 'Homens 30-49', riscoBaixo: 468, riscoModerado: 156, riscoAlto: 78, percentualRisco: 33.3 },
    { grupo: 'Homens 50+', riscoBaixo: 385, riscoModerado: 98, riscoAlto: 35, percentualRisco: 25.7 },
    { grupo: 'Mulheres 18-29', riscoBaixo: 425, riscoModerado: 68, riscoAlto: 25, percentualRisco: 17.6 },
    { grupo: 'Mulheres 30-49', riscoBaixo: 678, riscoModerado: 142, riscoAlto: 52, percentualRisco: 22.2 },
    { grupo: 'Mulheres 50+', riscoBaixo: 624, riscoModerado: 93, riscoAlto: 21, percentualRisco: 15.3 }
  ],
  
  // Comorbidades associadas
  comorbidadesAssociadas: [
    { condicao: 'Depressão', pacientes: 378, percentual: 40.0, cor: '#8b5cf6' },
    { condicao: 'Ansiedade', pacientes: 321, percentual: 34.0, cor: '#3b82f6' },
    { condicao: 'Tabagismo', pacientes: 283, percentual: 30.0, cor: '#f59e0b' },
    { condicao: 'Hipertensão', pacientes: 245, percentual: 26.0, cor: '#ef4444' },
    { condicao: 'Diabetes', pacientes: 189, percentual: 20.0, cor: '#fb923c' }
  ],
  
  // Tempo desde último rastreio
  agingRastreios: [
    { periodo: 'Nunca responderam', pacientes: 1080, percentual: 22.3 },
    { periodo: '> 12 meses', pacientes: 825, percentual: 17.0 },
    { periodo: '6-12 meses', pacientes: 945, percentual: 19.5 },
    { periodo: '3-6 meses', pacientes: 1250, percentual: 25.8 },
    { periodo: '< 3 meses', pacientes: 750, percentual: 15.5 }
  ],
  
  // Tipos de intervenção realizadas
  intervencoes: {
    educacaoSaude: { quantidade: 2825, percentual: 74.9 },
    intervencaoBreve: { quantidade: 642, percentual: 17.0 },
    acompanhamentoAPS: { quantidade: 189, percentual: 5.0 },
    encaminhamentoCAPSad: { quantidade: 114, percentual: 3.0 }
  },
  
  // Evolução temporal (últimos 12 meses)
  evolucaoTemporal: [
    { mes: 'Jan', cobertura: 72.5, aplicados: 285, meta: 85 },
    { mes: 'Fev', cobertura: 73.2, aplicados: 312, meta: 85 },
    { mes: 'Mar', cobertura: 74.1, aplicados: 345, meta: 85 },
    { mes: 'Abr', cobertura: 74.8, aplicados: 298, meta: 85 },
    { mes: 'Mai', cobertura: 75.5, aplicados: 367, meta: 85 },
    { mes: 'Jun', cobertura: 76.0, aplicados: 325, meta: 85 },
    { mes: 'Jul', cobertura: 76.8, aplicados: 389, meta: 85 },
    { mes: 'Ago', cobertura: 77.2, aplicados: 315, meta: 85 },
    { mes: 'Set', cobertura: 77.5, aplicados: 298, meta: 85 },
    { mes: 'Out', cobertura: 77.6, aplicados: 342, meta: 85 },
    { mes: 'Nov', cobertura: 77.7, aplicados: 358, meta: 85 },
    { mes: 'Dez', cobertura: 77.7, aplicados: 325, meta: 85 }
  ]
};

// Componente de Funil Visual Vertical
const FunnelChart = ({ data, title, icon: Icon, onItemClick, tipoFiltro, filtroAtivo }: {
  data: any[],
  title: string,
  icon: React.ElementType,
  onItemClick?: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro?: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null
}) => {
  const coresIntuitivas = ['#86efac', '#a7f3d0', '#fde047', '#fb923c', '#ef4444', '#dc2626'];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>

      <div className="space-y-1">
        {data.map((item, index) => {
          const isActive = filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === item.etapa;
          const backgroundColor = coresIntuitivas[index] || item.cor;
          const textColor = ['#fb923c', '#ef4444', '#dc2626'].includes(backgroundColor) ? 'white' : '#1f2937';
          
          return (
            <React.Fragment key={index}>
              <div
                className={`relative rounded-md p-2 transition-all duration-300 ${
                  onItemClick ? 'cursor-pointer hover:shadow-md' : ''
                }`}
                style={{ 
                  backgroundColor: backgroundColor,
                  opacity: filtroAtivo && !isActive ? 0.4 : 1,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  border: isActive ? '2px solid #db2777' : 'none'
                }}
                onClick={onItemClick ? (e) => onItemClick(tipoFiltro || 'funil', item.etapa, `${title}: ${item.etapa}`, e) : undefined}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: textColor }}>
                    {item.etapa}
                  </span>
                  <span className="text-xs font-bold" style={{ color: textColor }}>
                    {item.valor.toLocaleString()}
                    {item.percentual && (
                      <span className="ml-1 font-normal" style={{ color: textColor, opacity: 0.8 }}>
                        ({item.percentual}%)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {index < data.length - 1 && (
                <div className="flex justify-center">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Componente de Classificação AUDIT
const ClassificacaoAudit = ({ data, title, onItemClick, tipoFiltro, filtroAtivo }: {
  data: any[],
  title: string,
  onItemClick: (tipo: string, valor: string, label: string, event: React.MouseEvent) => void,
  tipoFiltro: string,
  filtroAtivo?: { tipo: string; valor: string; label: string } | null
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg p-2 border cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={(e) => onItemClick(tipoFiltro, item.categoria, `AUDIT: ${item.categoria}`, e)}
            style={{
              opacity: filtroAtivo && filtroAtivo.tipo !== tipoFiltro || (filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor !== item.categoria) ? 0.4 : 1,
              transform: filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === item.categoria ? 'scale(1.02)' : 'scale(1)',
              borderColor: filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === item.categoria ? '#db2777' : '#e5e7eb',
              borderWidth: filtroAtivo?.tipo === tipoFiltro && filtroAtivo?.valor === item.categoria ? '2px' : '1px'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 text-center">
                <div className="text-xl font-bold" style={{ color: item.cor }}>
                  {item.quantidade}
                </div>
                <div className="text-[10px] text-gray-500">pessoas</div>
              </div>
              
              <div className="flex-1">
                <div className="text-xs font-bold text-gray-700">{item.categoria}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{item.descricao}</div>
                <div className="relative w-full bg-gray-200 rounded h-2 mt-1">
                  <div 
                    className="absolute inset-0 rounded transition-all duration-300" 
                    style={{ 
                      width: `${item.percentual}%`,
                      backgroundColor: item.cor
                    }} 
                  />
                </div>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-semibold text-gray-600">{item.percentual}%</div>
                <div className="text-[10px] text-gray-500">{item.intervencao}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function RastreioAuditChart({ filters, onNavigateToTable }: RastreioAuditChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [filtroInterativo, setFiltroInterativo] = useState<{
    tipo: string;
    valor: string;
    label: string;
  } | null>(null);
  const [cardsClicados, setCardsClicados] = useState<Set<string>>(new Set());

  // Aplicar filtro local nos dados
  const dados = useMemo(() => {
    if (!filtroInterativo) return dadosAudit;
    
    // Simular impacto do filtro nos dados
    const fator = Math.random() * 0.3 + 0.7; // Variação de 70-100%
    
    return {
      ...dadosAudit,
      funilRastreamento: dadosAudit.funilRastreamento.map(item => ({
        ...item,
        valor: Math.round(item.valor * fator)
      })),
      classificacaoAudit: dadosAudit.classificacaoAudit.map(item => ({
        ...item,
        quantidade: Math.round(item.quantidade * fator)
      }))
    };
  }, [filtroInterativo]);

  const handleFiltroInterativo = (tipo: string, valor: string, label: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (filtroInterativo?.tipo === tipo && filtroInterativo?.valor === valor) {
      setFiltroInterativo(null);
    } else {
      setFiltroInterativo({ tipo, valor, label });
    }
  };

  const handleCardClick = (cardId: string) => {
    const newSet = new Set(cardsClicados);
    if (newSet.has(cardId)) {
      newSet.delete(cardId);
    } else {
      newSet.add(cardId);
    }
    setCardsClicados(newSet);
  };

  // Cálculos derivados
  const taxaNuncaRespondeu = (dados.agingRastreios[0].pacientes / dados.elegiveis * 100).toFixed(1);
  const rastreiosVencidos = dados.agingRastreios[1].pacientes + dados.agingRastreios[2].pacientes;
  const riscoIdentificado = dados.funilRastreamento[3].valor;
  const dependenciaPossivel = dados.classificacaoAudit[3].quantidade;
  const riscoModeradoAlto = dados.classificacaoAudit[1].quantidade + dados.classificacaoAudit[2].quantidade + dados.classificacaoAudit[3].quantidade;

  // Top 5 fatores de risco para uso nocivo
  const top5FatoresRisco = [
    { fator: 'Depressão/ansiedade', pacientes: 485, percentual: 51.3, cor: '#dc2626' },
    { fator: 'Histórico familiar', pacientes: 325, percentual: 34.4, cor: '#ef4444' },
    { fator: 'Estresse laboral', pacientes: 285, percentual: 30.2, cor: '#f59e0b' },
    { fator: 'Isolamento social', pacientes: 198, percentual: 20.9, cor: '#fbbf24' },
    { fator: 'Trauma/TEPT', pacientes: 156, percentual: 16.5, cor: '#fb923c' }
  ];

  // Estratificação por faixa etária e gênero
  const estratificacao5Grupos = [
    { grupo: 'Homens 18-39', aplicados: 842, total: 1050, cobertura: 80.2, riscoAlto: 22.3, cor: '#86efac' },
    { grupo: 'Homens 40-59', aplicados: 625, total: 850, cobertura: 73.5, riscoAlto: 28.5, cor: '#fbbf24' },
    { grupo: 'Homens 60+', aplicados: 385, total: 550, cobertura: 70.0, riscoAlto: 18.2, cor: '#fbbf24' },
    { grupo: 'Mulheres 18-39', aplicados: 956, total: 1200, cobertura: 79.7, riscoAlto: 12.5, cor: '#86efac' },
    { grupo: 'Mulheres 40-59', aplicados: 685, total: 900, cobertura: 76.1, riscoAlto: 15.8, cor: '#86efac' },
    { grupo: 'Mulheres 60+', aplicados: 277, total: 450, cobertura: 61.6, riscoAlto: 8.7, cor: '#f87171' }
  ];

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1 bg-amber-50 rounded">
              <Wine className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <span>Rastreio AUDIT</span>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">Uso de Álcool - Adultos ≥18 anos</p>
            </div>
          </CardTitle>

          <div
            className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            {showTooltip && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl z-50">
                <h4 className="font-semibold mb-2 text-sm">Protocolo AUDIT - MS</h4>
                <div className="space-y-2">
                  <p>População-alvo: Adultos ≥18 anos</p>
                  <p>Periodicidade: Anual ou conforme risco</p>
                  <p>Meta de cobertura: 85% da população elegível</p>
                  <div className="mt-3">
                    <span className="font-medium">Classificação de Risco:</span>
                    <ul className="ml-3 mt-1 space-y-0.5">
                      <li>• 0-7: Baixo risco - Educação em saúde</li>
                      <li>• 8-15: Risco moderado - Intervenção breve</li>
                      <li>• 16-19: Alto risco - IB + acompanhamento</li>
                      <li>• 20+: Muito alto - Encaminhamento CAPS-AD</li>
                    </ul>
                  </div>
                  <p className="mt-2 text-[10px] text-gray-300">AUDIT: Alcohol Use Disorders Identification Test</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {filtroInterativo && (
          <div className="absolute top-1 right-1 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
            Filtrado: {filtroInterativo.label}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5 px-6">
        {/* Cards de Métricas - 6 cards com click para inverter */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            className="bg-amber-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('nunca-responderam')}
          >
            <p className="text-xs font-medium text-gray-600">Nunca Responderam</p>
            {cardsClicados.has('nunca-responderam') ? (
              <>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {taxaNuncaRespondeu}%
                </p>
                <p className="text-[11px] text-gray-500">
                  {dados.agingRastreios[0].pacientes} pessoas
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {dados.agingRastreios[0].pacientes}
                </p>
                <p className="text-[11px] text-gray-500">
                  {taxaNuncaRespondeu}%
                </p>
              </>
            )}
          </div>
          
          <div 
            className="bg-yellow-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('rastreio-vencido')}
          >
            <p className="text-xs font-medium text-gray-600">Rastreio Vencido</p>
            {cardsClicados.has('rastreio-vencido') ? (
              <>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {((rastreiosVencidos) / dados.elegiveis * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-gray-500">
                  {rastreiosVencidos} pessoas
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {rastreiosVencidos}
                </p>
                <p className="text-[11px] text-gray-500">
                  &gt; 6 meses
                </p>
              </>
            )}
          </div>
          
          <div 
            className="bg-red-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('risco-identificado')}
          >
            <p className="text-xs font-medium text-gray-600">Risco Identificado</p>
            {cardsClicados.has('risco-identificado') ? (
              <>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {(riscoIdentificado / dados.funilRastreamento[2].valor * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-gray-500">
                  {riscoIdentificado} casos
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {riscoIdentificado}
                </p>
                <p className="text-[11px] text-gray-500">
                  AUDIT ≥8
                </p>
              </>
            )}
          </div>

          <div 
            className="bg-orange-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('cobertura-atual')}
          >
            <p className="text-xs font-medium text-gray-600">Cobertura Atual</p>
            {cardsClicados.has('cobertura-atual') ? (
              <>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {dados.funilRastreamento[2].valor}
                </p>
                <p className="text-[11px] text-gray-500">
                  {dados.coberturaAtual}% da meta
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {dados.coberturaAtual}%
                </p>
                <p className="text-[11px] text-gray-500">
                  Meta: {dados.metaAnual}%
                </p>
              </>
            )}
          </div>
          
          <div 
            className="bg-purple-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('possivel-dependencia')}
          >
            <p className="text-xs font-medium text-gray-600">Possível Dependência</p>
            {cardsClicados.has('possivel-dependencia') ? (
              <>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {(dependenciaPossivel / dados.funilRastreamento[2].valor * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-gray-500">
                  {dependenciaPossivel} casos
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {dependenciaPossivel}
                </p>
                <p className="text-[11px] text-gray-500">
                  AUDIT ≥20
                </p>
              </>
            )}
          </div>
          
          <div 
            className="bg-green-50 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleCardClick('em-intervencao')}
          >
            <p className="text-xs font-medium text-gray-600">Em Intervenção</p>
            {cardsClicados.has('em-intervencao') ? (
              <>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {dados.funilRastreamento[5].percentual}%
                </p>
                <p className="text-[11px] text-gray-500">
                  {dados.funilRastreamento[5].valor} pessoas
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {dados.funilRastreamento[5].valor}
                </p>
                <p className="text-[11px] text-gray-500">
                  {dados.funilRastreamento[5].percentual}%
                </p>
              </>
            )}
          </div>
        </div>

        {/* Funil de Rastreamento + Classificação AUDIT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FunnelChart 
            data={dados.funilRastreamento}
            title="Funil de Rastreamento"
            icon={Users}
            onItemClick={handleFiltroInterativo}
            tipoFiltro="funil"
            filtroAtivo={filtroInterativo}
          />

          <ClassificacaoAudit 
            data={dados.classificacaoAudit}
            title="Classificação de Risco AUDIT"
            onItemClick={handleFiltroInterativo}
            tipoFiltro="audit-class"
            filtroAtivo={filtroInterativo}
          />
        </div>

        {/* Domínios do AUDIT + Distribuição por Gênero/Idade */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Domínios Alterados do AUDIT</h3>
            </div>
            
            <div className="space-y-3">
              {dados.dominiosAudit.map((dominio, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{dominio.dominio}</span>
                    <span className="text-gray-600">
                      {dominio.alterado} ({dominio.percentual}%)
                    </span>
                  </div>
                  <div 
                    className="relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={(e) => handleFiltroInterativo('dominio', dominio.dominio, `Domínio: ${dominio.dominio}`, e)}
                  >
                    <div 
                      className="absolute inset-0 rounded-lg transition-all duration-300"
                      style={{ 
                        width: `${dominio.percentual}%`,
                        backgroundColor: dominio.cor,
                        opacity: filtroInterativo && filtroInterativo.tipo !== 'dominio' || (filtroInterativo?.tipo === 'dominio' && filtroInterativo?.valor !== dominio.dominio) ? 0.4 : 1,
                        transform: filtroInterativo?.tipo === 'dominio' && filtroInterativo?.valor === dominio.dominio ? 'scaleY(1.2)' : 'scaleY(1)',
                        border: filtroInterativo?.tipo === 'dominio' && filtroInterativo?.valor === dominio.dominio ? '2px solid #db2777' : 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Cobertura por Grupo Demográfico</h3>
            </div>
            
            <div className="space-y-2">
              {estratificacao5Grupos.map((grupo, index) => {
                const corBarra = grupo.cobertura >= 75 ? '#86efac' : grupo.cobertura >= 65 ? '#fbbf24' : '#f87171';
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-xs">{grupo.grupo}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                          {grupo.aplicados}/{grupo.total}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: grupo.riscoAlto > 20 ? '#ef4444' : '#22c55e' }}>
                          {grupo.riscoAlto}% risco
                        </span>
                      </div>
                    </div>
                    <div 
                      className="relative w-full bg-gray-200 rounded-lg h-2.5 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={(e) => handleFiltroInterativo('grupo', grupo.grupo, `Grupo: ${grupo.grupo}`, e)}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg transition-all duration-300"
                        style={{ 
                          width: `${grupo.cobertura}%`,
                          backgroundColor: corBarra,
                          opacity: filtroInterativo && filtroInterativo.tipo !== 'grupo' || (filtroInterativo?.tipo === 'grupo' && filtroInterativo?.valor !== grupo.grupo) ? 0.4 : 1,
                          transform: filtroInterativo?.tipo === 'grupo' && filtroInterativo?.valor === grupo.grupo ? 'scaleY(1.2)' : 'scaleY(1)',
                          border: filtroInterativo?.tipo === 'grupo' && filtroInterativo?.valor === grupo.grupo ? '2px solid #db2777' : 'none'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comorbidades Associadas + Top 5 Fatores de Risco */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertOctagon className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Comorbidades Associadas</h3>
              <span className="text-xs text-gray-500 ml-auto">{riscoModeradoAlto} casos risco</span>
            </div>
            <div className="space-y-2">
              {dados.comorbidadesAssociadas.map((comorb, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-2 border cursor-pointer hover:shadow-md transition-all duration-200 flex items-center gap-3"
                  onClick={(e) => handleFiltroInterativo('comorbidade', comorb.condicao, `Comorbidade: ${comorb.condicao}`, e)}
                  style={{
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'comorbidade' || (filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor !== comorb.condicao) ? 0.4 : 1,
                    transform: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.condicao ? 'scale(1.02)' : 'scale(1)',
                    borderColor: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.condicao ? '#db2777' : '#e5e7eb',
                    borderWidth: filtroInterativo?.tipo === 'comorbidade' && filtroInterativo?.valor === comorb.condicao ? '2px' : '1px'
                  }}
                >
                  <div className="flex-shrink-0 text-center">
                    <div className="text-xl font-bold" style={{ color: comorb.cor }}>
                      {comorb.pacientes}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-700 mb-1">{comorb.condicao}</div>
                    <div className="relative w-full bg-gray-200 rounded h-2">
                      <div 
                        className="absolute inset-0 rounded transition-all duration-300" 
                        style={{ 
                          width: `${comorb.percentual}%`,
                          backgroundColor: comorb.cor
                        }} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 text-sm font-semibold text-gray-600">
                    {comorb.percentual}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Top 5 - Fatores de Risco</h3>
            </div>
            <div className="space-y-2">
              {top5FatoresRisco.map((fator, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-2 border cursor-pointer hover:shadow-md transition-all duration-200 flex items-center gap-3"
                  onClick={(e) => handleFiltroInterativo('fator-risco', fator.fator, `Fator: ${fator.fator}`, e)}
                  style={{
                    opacity: filtroInterativo && filtroInterativo.tipo !== 'fator-risco' || (filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor !== fator.fator) ? 0.4 : 1,
                    transform: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? 'scale(1.02)' : 'scale(1)',
                    borderColor: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? '#db2777' : '#e5e7eb',
                    borderWidth: filtroInterativo?.tipo === 'fator-risco' && filtroInterativo?.valor === fator.fator ? '2px' : '1px'
                  }}
                >
                  <div className="flex-shrink-0 text-center">
                    <div className="text-xl font-bold" style={{ color: fator.cor }}>
                      {fator.pacientes}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-700 mb-1">{fator.fator}</div>
                    <div className="relative w-full bg-gray-200 rounded h-2">
                      <div 
                        className="absolute inset-0 rounded transition-all duration-300" 
                        style={{ 
                          width: `${fator.percentual}%`,
                          backgroundColor: fator.cor
                        }} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 text-sm font-semibold text-gray-600">
                    {fator.percentual}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tempo Desde Último Rastreio + Tipos de Intervenção */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Tempo Desde Último Rastreio</h3>
            </div>
            
            <div className="space-y-3">
              {dados.agingRastreios.map((item, index) => {
                const cores = ['#ef4444', '#f59e0b', '#fbbf24', '#86efac', '#22c55e'];
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.periodo}</span>
                      <span className="text-gray-600">
                        {item.pacientes} ({item.percentual}%)
                      </span>
                    </div>
                    <div 
                      className="relative w-full bg-gray-200 rounded-lg h-3 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={(e) => handleFiltroInterativo('aging', item.periodo, `Tempo: ${item.periodo}`, e)}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg transition-all duration-300"
                        style={{ 
                          width: `${item.percentual}%`,
                          backgroundColor: cores[index],
                          opacity: filtroInterativo && filtroInterativo.tipo !== 'aging' || (filtroInterativo?.tipo === 'aging' && filtroInterativo?.valor !== item.periodo) ? 0.4 : 1,
                          transform: filtroInterativo?.tipo === 'aging' && filtroInterativo?.valor === item.periodo ? 'scaleY(1.2)' : 'scaleY(1)',
                          border: filtroInterativo?.tipo === 'aging' && filtroInterativo?.valor === item.periodo ? '2px solid #db2777' : 'none'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Intervenções Realizadas</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div 
                className="bg-green-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
                onClick={(e) => handleFiltroInterativo('intervencao', 'educacao', 'Intervenção: Educação em saúde', e)}
                style={{
                  opacity: filtroInterativo && filtroInterativo.tipo !== 'intervencao' || (filtroInterativo?.tipo === 'intervencao' && filtroInterativo?.valor !== 'educacao') ? 0.4 : 1,
                  border: filtroInterativo?.tipo === 'intervencao' && filtroInterativo?.valor === 'educacao' ? '2px solid #db2777' : 'none'
                }}
              >
                <p className="text-xs font-medium text-gray-600 mb-1">Educação em Saúde</p>
                <p className="text-xl font-bold text-green-600">{dados.intervencoes.educacaoSaude.quantidade}</p>
                <p className="text-[10px] text-gray-500">Baixo risco (0-7)</p>
              </div>
              
              <div 
                className="bg-yellow-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
                onClick={(e) => handleFiltroInterativo('intervencao', 'breve', 'Intervenção: Breve', e)}
                style={{
                  opacity: filtroInterativo && filtroInterativo.tipo !== 'intervencao' || (filtroInterativo?.tipo === 'intervencao' && filtroInterativo?.valor !== 'breve') ? 0.4 : 1,
                  border: filtroInterativo?.tipo === 'intervencao' && filtroInterativo?.valor === 'breve' ? '2px solid #db2777' : 'none'
                }}
              >
                <p className="text-xs font-medium text-gray-600 mb-1">Intervenção Breve</p>
                <p className="text-xl font-bold text-yellow-600">{dados.intervencoes.intervencaoBreve.quantidade}</p>
                <p className="text-[10px] text-gray-500">Risco moderado (8-15)</p>
              </div>
              
              <div 
                className="bg-orange-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
                onClick={(e) => handleFiltroInterativo('intervencao', 'aps', 'Intervenção: Acompanhamento APS', e)}
                style={{
                  opacity: filtroInterativo && filtroInterativo.tipo !== 'intervencao' || (filtroInterativo?.tipo === 'intervencao' && filtroInterativo?.valor !== 'aps') ? 0.4 : 1,
                  border: filtroInterativo?.tipo === 'intervencao' && filtroInterativo?.valor === 'aps' ? '2px solid #db2777' : 'none'
                }}
              >
                <p className="text-xs font-medium text-gray-600 mb-1">Acompanhamento APS</p>
                <p className="text-xl font-bold text-orange-600">{dados.intervencoes.acompanhamentoAPS.quantidade}</p>
                <p className="text-[10px] text-gray-500">Alto risco (16-19)</p>
              </div>
              
              <div 
                className="bg-red-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
                onClick={(e) => handleFiltroInterativo('intervencao', 'capsad', 'Intervenção: CAPS-AD', e)}
                style={{
                  opacity: filtroInterativo && filtroInterativo.tipo !== 'intervencao' || (filtroInterativo?.tipo === 'intervencao' && filtroInterativo?.valor !== 'capsad') ? 0.4 : 1,
                  border: filtroInterativo?.tipo === 'intervencao' && filtroInterativo?.valor === 'capsad' ? '2px solid #db2777' : 'none'
                }}
              >
                <p className="text-xs font-medium text-gray-600 mb-1">Encam. CAPS-AD</p>
                <p className="text-xl font-bold text-red-600">{dados.intervencoes.encaminhamentoCAPSad.quantidade}</p>
                <p className="text-[10px] text-gray-500">Muito alto (20+)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Follow-up de Casos com Risco */}
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Follow-up Casos com Risco (AUDIT ≥8)</h3>
            <span className="text-xs text-gray-500">{riscoModeradoAlto} casos</span>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'ib-concluida', 'Follow-up: IB concluída', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'ib-concluida') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'ib-concluida' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">IB Concluída</p>
              <p className="text-lg font-bold text-green-500">385</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'ib-andamento', 'Follow-up: IB em andamento', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'ib-andamento') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'ib-andamento' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">IB Andamento</p>
              <p className="text-lg font-bold text-blue-500">257</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'caps-ad', 'Follow-up: CAPS-AD', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'caps-ad') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'caps-ad' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">CAPS-AD</p>
              <p className="text-lg font-bold text-purple-500">114</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'reducao', 'Follow-up: Redução consumo', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'reducao') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'reducao' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Redução consumo</p>
              <p className="text-lg font-bold text-teal-500">168</p>
            </div>
            <div 
              className="bg-white rounded p-2 text-center cursor-pointer hover:shadow-md transition-all"
              onClick={(e) => handleFiltroInterativo('followup', 'perda', 'Follow-up: Perda follow-up', e)}
              style={{
                opacity: filtroInterativo && filtroInterativo.tipo !== 'followup' || (filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor !== 'perda') ? 0.4 : 1,
                border: filtroInterativo?.tipo === 'followup' && filtroInterativo?.valor === 'perda' ? '2px solid #db2777' : '1px solid #e5e7eb'
              }}
            >
              <p className="text-xs text-gray-600">Perda follow-up</p>
              <p className="text-lg font-bold text-gray-500">133</p>
            </div>
          </div>
        </div>

        {/* Evolução do Rastreio (12 meses) */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">Evolução do Rastreio (12 meses)</h3>
          </div>
          
          <div className="grid grid-cols-12 gap-1 mb-4">
            {dados.evolucaoTemporal.map((item, index) => {
              const distanciaMeta = item.meta - item.cobertura;
              let backgroundColor;
              if (distanciaMeta > 12) backgroundColor = '#dc2626';
              else if (distanciaMeta > 10) backgroundColor = '#ef4444';
              else if (distanciaMeta > 8) backgroundColor = '#f59e0b';
              else if (distanciaMeta > 5) backgroundColor = '#fbbf24';
              else backgroundColor = '#10b981';
              
              return (
                <div key={index} className="relative group">
                  <div 
                    className="aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      <div className="font-semibold">{item.mes}</div>
                      <div>Cobertura: {item.cobertura}%</div>
                      <div>Aplicados: {item.aplicados}</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-gray-600 mt-1">{item.mes}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-gray-600">Crítico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-gray-600">Atenção</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-gray-600">Adequado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}