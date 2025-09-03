-- =====================================================
-- SCHEMA COMPLETO - DASHBOARD APS - REFATORAÇÃO
-- =====================================================
-- Schema expandido baseado no REFACTORING_PLAN.md
-- Total: 32 tabelas mapeadas dos dados mockados

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- TABELAS BÁSICAS (já existem, mas garantindo)
-- =====================================================

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos APS
CREATE TABLE IF NOT EXISTS produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de unidades
CREATE TABLE IF NOT EXISTS unidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    endereco TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de profissionais
CREATE TABLE IF NOT EXISTS profissionais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(30) CHECK (tipo IN ('medico_familia', 'enfermeiro_familia', 'enfermeiro_coordenador')) NOT NULL,
    crm_coren VARCHAR(20),
    especialidade VARCHAR(100),
    unidade_id UUID REFERENCES unidades(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NOVAS TABELAS PARA DADOS COMPLETOS
-- =====================================================

-- Tabela de atendimentos (4.825 registros)
CREATE TABLE IF NOT EXISTS atendimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) NOT NULL,
    data_atendimento DATE NOT NULL,
    tipo_atendimento VARCHAR(20) CHECK (tipo_atendimento IN ('aps', 'pa_virtual', 'consulta_agendada')) NOT NULL,
    profissional_id UUID REFERENCES profissionais(id),
    cid_principal VARCHAR(10) REFERENCES cids(codigo),
    cid_secundarios VARCHAR(10)[],
    motivo_consulta TEXT,
    descricao TEXT,
    desfecho VARCHAR(30) CHECK (desfecho IN ('alta', 'encaminhamento', 'retorno_agendado', 'resolvido')),
    especialidade_encaminhada VARCHAR(100),
    status VARCHAR(20) DEFAULT 'realizada',
    duracao_minutos INTEGER,
    canal VARCHAR(20) CHECK (canal IN ('presencial', 'telemedicina', 'telefone', 'chat')),
    satisfacao_paciente INTEGER CHECK (satisfacao_paciente BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de exames laboratoriais
CREATE TABLE IF NOT EXISTS exames_laboratoriais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) NOT NULL,
    data_exame DATE NOT NULL,
    tipo_exame VARCHAR(50) NOT NULL,
    
    -- Glicemia
    glicemia_jejum DECIMAL(5,2),
    hemoglobina_glicada DECIMAL(4,2),
    
    -- Pressão Arterial
    pressao_sistolica INTEGER,
    pressao_diastolica INTEGER,
    
    -- Antropometria
    peso DECIMAL(5,2),
    altura DECIMAL(4,2),
    imc DECIMAL(4,2),
    circunferencia_abdominal DECIMAL(5,2),
    
    -- Lipidograma
    colesterol_total INTEGER,
    hdl INTEGER,
    ldl INTEGER,
    triglicerides INTEGER,
    
    -- Outros
    creatinina DECIMAL(4,2),
    ureia INTEGER,
    
    profissional_id UUID REFERENCES profissionais(id),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de rastreios
CREATE TABLE IF NOT EXISTS rastreios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) NOT NULL,
    tipo_rastreio VARCHAR(30) NOT NULL,
    data_solicitacao DATE,
    data_realizacao DATE,
    data_vencimento DATE,
    status VARCHAR(20) CHECK (status IN ('pendente', 'agendado', 'realizado', 'cancelado', 'vencido')) DEFAULT 'pendente',
    resultado TEXT,
    
    -- Específicos para cada tipo
    -- Mamografia
    birads VARCHAR(10),
    
    -- Citologia
    resultado_citologia VARCHAR(50),
    
    -- Colonoscopia
    preparo_adequado BOOLEAN,
    
    -- PHQ-9, GAD-7
    pontuacao INTEGER,
    
    -- AUDIT
    pontuacao_audit INTEGER,
    classificacao_risco VARCHAR(20),
    
    profissional_solicitante UUID REFERENCES profissionais(id),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de linhas de cuidado por paciente
CREATE TABLE IF NOT EXISTS pacientes_linhas_cuidado (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) NOT NULL,
    linha_cuidado_id UUID REFERENCES linhas_cuidado(id) NOT NULL,
    data_inclusao DATE NOT NULL,
    data_exclusao DATE,
    status VARCHAR(20) DEFAULT 'ativo',
    motivo_inclusao VARCHAR(100),
    profissional_responsavel UUID REFERENCES profissionais(id),
    UNIQUE(paciente_id, linha_cuidado_id, data_inclusao)
);

-- Tabela de metas e indicadores
CREATE TABLE IF NOT EXISTS metas_indicadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_indicador VARCHAR(50) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    meta_numerador INTEGER,
    meta_denominador INTEGER,
    meta_percentual DECIMAL(5,2),
    periodo_referencia VARCHAR(20),
    cliente_id UUID REFERENCES clientes(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de controle de qualidade
CREATE TABLE IF NOT EXISTS controle_qualidade (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) NOT NULL,
    tipo_controle VARCHAR(50) NOT NULL,
    data_avaliacao DATE NOT NULL,
    
    -- Controle de hipertensão
    pa_controlada BOOLEAN,
    medicamento_otimizado BOOLEAN,
    
    -- Controle de diabetes
    hba1c_meta BOOLEAN,
    glicemia_controlada BOOLEAN,
    
    -- Controle de obesidade
    perda_peso_percentual DECIMAL(4,2),
    meta_peso_atingida BOOLEAN,
    
    profissional_avaliador UUID REFERENCES profissionais(id),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de medicamentos
CREATE TABLE IF NOT EXISTS medicamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    principio_ativo VARCHAR(255) NOT NULL,
    classe_terapeutica VARCHAR(100),
    codigo_ean VARCHAR(20),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de prescrições
CREATE TABLE IF NOT EXISTS prescricoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) NOT NULL,
    atendimento_id UUID REFERENCES atendimentos(id),
    medicamento_id UUID REFERENCES medicamentos(id) NOT NULL,
    data_prescricao DATE NOT NULL,
    dose VARCHAR(50),
    frequencia VARCHAR(100),
    duracao_dias INTEGER,
    via_administracao VARCHAR(50),
    profissional_id UUID REFERENCES profissionais(id) NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) NOT NULL,
    profissional_id UUID REFERENCES profissionais(id) NOT NULL,
    data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
    tipo_consulta VARCHAR(30),
    canal VARCHAR(20) CHECK (canal IN ('presencial', 'telemedicina', 'telefone')),
    motivo VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('agendado', 'confirmado', 'realizado', 'cancelado', 'faltou')) DEFAULT 'agendado',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de encaminhamentos
CREATE TABLE IF NOT EXISTS encaminhamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) NOT NULL,
    atendimento_origem_id UUID REFERENCES atendimentos(id),
    especialidade_destino VARCHAR(100) NOT NULL,
    motivo_encaminhamento TEXT,
    urgencia VARCHAR(20) CHECK (urgencia IN ('rotina', 'prioritario', 'urgente')),
    status VARCHAR(20) CHECK (status IN ('pendente', 'agendado', 'realizado', 'cancelado')) DEFAULT 'pendente',
    data_encaminhamento DATE NOT NULL,
    data_agendamento DATE,
    data_realizacao DATE,
    profissional_origem UUID REFERENCES profissionais(id),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de perfil de saúde (questionários)
CREATE TABLE IF NOT EXISTS perfil_saude (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) NOT NULL,
    data_resposta DATE NOT NULL,
    tipo_questionario VARCHAR(50) NOT NULL,
    
    -- Dados gerais
    idade_questionario INTEGER,
    respondeu_completo BOOLEAN DEFAULT false,
    
    -- Aging específico
    meses_sem_resposta INTEGER,
    categoria_aging VARCHAR(20) CHECK (categoria_aging IN ('menos_3_meses', '3_9_meses', 'mais_9_meses')),
    
    -- Scores específicos
    score_geral INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notificações e alertas
CREATE TABLE IF NOT EXISTS notificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    paciente_id UUID REFERENCES pacientes(id),
    profissional_id UUID REFERENCES profissionais(id),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_leitura TIMESTAMP WITH TIME ZONE,
    prioridade VARCHAR(20) CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')) DEFAULT 'media',
    lida BOOLEAN DEFAULT false,
    metadata JSONB
);

-- Tabela de logs de sistema
CREATE TABLE IF NOT EXISTS logs_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evento VARCHAR(100) NOT NULL,
    descricao TEXT,
    usuario_id UUID,
    paciente_id UUID REFERENCES pacientes(id),
    ip_address INET,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices existentes
CREATE INDEX IF NOT EXISTS idx_pacientes_cpf ON pacientes (cpf);
CREATE INDEX IF NOT EXISTS idx_pacientes_status ON pacientes (status_vinculacao);
CREATE INDEX IF NOT EXISTS idx_pacientes_cliente ON pacientes (cliente_id);

-- Novos índices
CREATE INDEX IF NOT EXISTS idx_atendimentos_paciente ON atendimentos (paciente_id);
CREATE INDEX IF NOT EXISTS idx_atendimentos_data ON atendimentos (data_atendimento);
CREATE INDEX IF NOT EXISTS idx_atendimentos_tipo ON atendimentos (tipo_atendimento);
CREATE INDEX IF NOT EXISTS idx_atendimentos_cid ON atendimentos (cid_principal);

CREATE INDEX IF NOT EXISTS idx_exames_paciente ON exames_laboratoriais (paciente_id);
CREATE INDEX IF NOT EXISTS idx_exames_data ON exames_laboratoriais (data_exame);
CREATE INDEX IF NOT EXISTS idx_exames_tipo ON exames_laboratoriais (tipo_exame);

CREATE INDEX IF NOT EXISTS idx_rastreios_paciente ON rastreios (paciente_id);
CREATE INDEX IF NOT EXISTS idx_rastreios_tipo ON rastreios (tipo_rastreio);
CREATE INDEX IF NOT EXISTS idx_rastreios_status ON rastreios (status);
CREATE INDEX IF NOT EXISTS idx_rastreios_vencimento ON rastreios (data_vencimento);

CREATE INDEX IF NOT EXISTS idx_pacientes_lc_paciente ON pacientes_linhas_cuidado (paciente_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_lc_linha ON pacientes_linhas_cuidado (linha_cuidado_id);

CREATE INDEX IF NOT EXISTS idx_controle_paciente ON controle_qualidade (paciente_id);
CREATE INDEX IF NOT EXISTS idx_controle_tipo ON controle_qualidade (tipo_controle);
CREATE INDEX IF NOT EXISTS idx_controle_data ON controle_qualidade (data_avaliacao);

-- =====================================================
-- VIEWS PARA CONSULTAS COMPLEXAS
-- =====================================================

-- View para dashboard de cobertura
CREATE OR REPLACE VIEW v_cobertura_dashboard AS
SELECT 
    COUNT(*) as total_pacientes,
    COUNT(CASE WHEN status_vinculacao = 'vinculado' THEN 1 END) as vinculados,
    COUNT(CASE WHEN status_vinculacao = 'nao_vinculado' THEN 1 END) as nao_vinculados,
    ROUND(
        COUNT(CASE WHEN status_vinculacao = 'vinculado' THEN 1 END) * 100.0 / COUNT(*), 
        1
    ) as taxa_vinculacao
FROM pacientes;

-- View para controle de crônicos
CREATE OR REPLACE VIEW v_cronicos_controle AS
SELECT 
    cq.tipo_controle,
    COUNT(*) as total_pacientes,
    COUNT(CASE WHEN cq.pa_controlada = true OR cq.hba1c_meta = true OR cq.meta_peso_atingida = true THEN 1 END) as controlados,
    ROUND(
        COUNT(CASE WHEN cq.pa_controlada = true OR cq.hba1c_meta = true OR cq.meta_peso_atingida = true THEN 1 END) * 100.0 / COUNT(*),
        1
    ) as percentual_controle
FROM controle_qualidade cq
WHERE data_avaliacao >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY cq.tipo_controle;

-- View para utilização APS
CREATE OR REPLACE VIEW v_utilizacao_aps AS
SELECT 
    DATE_TRUNC('month', data_atendimento) as mes_referencia,
    COUNT(*) as total_atendimentos,
    COUNT(DISTINCT paciente_id) as pacientes_unicos,
    COUNT(*) / NULLIF(COUNT(DISTINCT paciente_id), 0) as taxa_recorrencia,
    COUNT(CASE WHEN tipo_atendimento = 'aps' THEN 1 END) as atendimentos_aps,
    COUNT(CASE WHEN tipo_atendimento = 'pa_virtual' THEN 1 END) as atendimentos_pa_virtual
FROM atendimentos
WHERE data_atendimento >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', data_atendimento)
ORDER BY mes_referencia DESC;

-- =====================================================
-- FUNCTIONS PARA CÁLCULOS COMPLEXOS
-- =====================================================

-- Função para calcular idade
CREATE OR REPLACE FUNCTION calcular_idade(data_nascimento DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(data_nascimento));
END;
$$ LANGUAGE plpgsql;

-- Função para determinar faixa etária
CREATE OR REPLACE FUNCTION determinar_faixa_etaria(data_nascimento DATE)
RETURNS VARCHAR(30) AS $$
DECLARE
    idade INTEGER;
BEGIN
    idade := calcular_idade(data_nascimento);
    
    IF idade <= 12 THEN
        RETURN 'crianca';
    ELSIF idade <= 17 THEN
        RETURN 'adolescente';
    ELSIF idade <= 39 THEN
        RETURN 'adulto-jovem';
    ELSIF idade <= 59 THEN
        RETURN 'adulto';
    ELSE
        RETURN 'idoso';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS PARA AUTOMATIZAÇÃO
-- =====================================================

-- Trigger para atualizar faixa etária automaticamente
CREATE OR REPLACE FUNCTION atualizar_faixa_etaria()
RETURNS TRIGGER AS $$
BEGIN
    NEW.faixa_etaria := determinar_faixa_etaria(NEW.data_nascimento);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_pacientes_faixa_etaria
    BEFORE INSERT OR UPDATE ON pacientes
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_faixa_etaria();

-- Trigger para logs de sistema
CREATE OR REPLACE FUNCTION log_sistema()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO logs_sistema (evento, descricao, paciente_id)
    VALUES (
        TG_OP,
        'Operação: ' || TG_OP || ' na tabela: ' || TG_TABLE_NAME,
        COALESCE(NEW.paciente_id, OLD.paciente_id)
    );
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RLS (Row Level Security) POLICIES
-- =====================================================

-- Enable RLS em todas as tabelas sensíveis
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE exames_laboratoriais ENABLE ROW LEVEL SECURITY;
ALTER TABLE rastreios ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescricoes ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (podem ser expandidas)
CREATE POLICY "Usuários podem ver seus próprios dados" ON pacientes
    FOR ALL USING (auth.uid()::text = id::text);

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE atendimentos IS 'Registros de todos os atendimentos (APS + PA Virtual)';
COMMENT ON TABLE exames_laboratoriais IS 'Resultados de exames laboratoriais e medidas';
COMMENT ON TABLE rastreios IS 'Controle de rastreamentos (mamografia, citologia, etc)';
COMMENT ON TABLE controle_qualidade IS 'Avaliação de controle de doenças crônicas';
COMMENT ON VIEW v_cobertura_dashboard IS 'View otimizada para dashboard de cobertura';

-- =====================================================
-- FINALIZAÇÃO
-- =====================================================

-- Verificar se todas as tabelas foram criadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN (
        'pacientes', 'atendimentos', 'exames_laboratoriais', 'rastreios',
        'pacientes_linhas_cuidado', 'controle_qualidade', 'medicamentos',
        'prescricoes', 'agendamentos', 'encaminhamentos', 'perfil_saude'
    )
ORDER BY tablename;