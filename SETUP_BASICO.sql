-- =====================================================
-- SETUP BÁSICO - DASHBOARD APS - SUPABASE
-- =====================================================
-- Execute este arquivo diretamente no Dashboard Web do Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- TABELAS BÁSICAS
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

-- Tabela de CIDs
CREATE TABLE IF NOT EXISTS cids (
    codigo VARCHAR(10) PRIMARY KEY,
    descricao VARCHAR(500) NOT NULL,
    categoria VARCHAR(100),
    subcategoria VARCHAR(100),
    ativo BOOLEAN DEFAULT true
);

-- Tabela de linhas de cuidado
CREATE TABLE IF NOT EXISTS linhas_cuidado (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    ativa BOOLEAN DEFAULT true,
    cor_hex VARCHAR(7),
    icone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de faixas etárias
CREATE TABLE IF NOT EXISTS faixas_etarias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(30) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    idade_minima INTEGER,
    idade_maxima INTEGER,
    descricao TEXT,
    ativa BOOLEAN DEFAULT true
);

-- =====================================================
-- TABELA PRINCIPAL DE PACIENTES
-- =====================================================

CREATE TABLE IF NOT EXISTS pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prontuario VARCHAR(20) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo VARCHAR(1) CHECK (sexo IN ('M', 'F')) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    cep VARCHAR(8),
    
    -- Demografia
    titularidade VARCHAR(20) CHECK (titularidade IN ('titular', 'dependente')) NOT NULL,
    faixa_etaria VARCHAR(30) NOT NULL,
    
    -- Dados do programa
    data_vinculacao DATE,
    status_vinculacao VARCHAR(20) CHECK (status_vinculacao IN ('vinculado', 'nao_vinculado', 'desvinculado')) DEFAULT 'vinculado',
    tempo_programa_meses INTEGER,
    
    -- Relacionamentos
    cliente_id UUID REFERENCES clientes(id),
    unidade_id UUID REFERENCES unidades(id),
    produto_id UUID REFERENCES produtos(id),
    medico_familia_id UUID REFERENCES profissionais(id),
    enfermeiro_familia_id UUID REFERENCES profissionais(id),
    enfermeiro_coordenador_id UUID REFERENCES profissionais(id),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DADOS BÁSICOS
-- =====================================================

-- Inserir CIDs básicos
INSERT INTO cids (codigo, descricao, categoria) VALUES
('I10', 'Hipertensão essencial', 'Doenças do aparelho circulatório'),
('E11.9', 'Diabetes mellitus tipo 2', 'Doenças endócrinas'),
('E66.9', 'Obesidade', 'Doenças endócrinas'),
('F41.1', 'Ansiedade generalizada', 'Transtornos mentais'),
('F32.9', 'Episódio depressivo', 'Transtornos mentais'),
('M79.0', 'Reumatismo', 'Doenças músculo-esqueléticas'),
('J06.9', 'Infecção respiratória aguda', 'Doenças do aparelho respiratório'),
('Z00.0', 'Exame médico geral', 'Fatores que influenciam o estado de saúde'),
('E78.5', 'Hiperlipidemia', 'Doenças endócrinas'),
('N39.0', 'Infecção do trato urinário', 'Doenças do aparelho geniturinário')
ON CONFLICT (codigo) DO NOTHING;

-- Inserir linhas de cuidado
INSERT INTO linhas_cuidado (codigo, nome, cor_hex) VALUES
('saude-mulher', 'Saúde da Mulher', '#ec4899'),
('saude-homem', 'Saúde do Homem', '#3b82f6'),
('saude-mental', 'Saúde Mental', '#8b5cf6'),
('doencas-cronicas', 'Doenças Crônicas', '#ef4444'),
('hipertensao', 'Hipertensão Arterial', '#dc2626'),
('diabetes', 'Diabetes Mellitus', '#f59e0b'),
('obesidade', 'Obesidade', '#fbbf24'),
('cardiologia', 'Cardiologia', '#f43f5e'),
('saude-crianca', 'Saúde da Criança', '#06b6d4'),
('saude-idoso', 'Saúde do Idoso', '#6b7280')
ON CONFLICT (codigo) DO NOTHING;

-- Inserir faixas etárias
INSERT INTO faixas_etarias (codigo, nome, idade_minima, idade_maxima) VALUES
('crianca', 'Criança (0-12 anos)', 0, 12),
('adolescente', 'Adolescente (13-17 anos)', 13, 17),
('adulto-jovem', 'Adulto Jovem (18-39 anos)', 18, 39),
('adulto', 'Adulto (40-59 anos)', 40, 59),
('idoso', 'Idoso (60+ anos)', 60, NULL)
ON CONFLICT (codigo) DO NOTHING;

-- Inserir clientes
INSERT INTO clientes (nome, codigo) VALUES
('Tech Corp S.A.', 'tech-corp'),
('Indústrias ABC Ltda', 'industrias-abc'),
('Serviços XYZ', 'servicos-xyz')
ON CONFLICT (codigo) DO NOTHING;

-- Inserir produtos
INSERT INTO produtos (nome, codigo) VALUES
('APS On-site', 'aps-onsite'),
('APS Digital', 'aps-digital'),
('APS Enfermeiro Dedicado', 'aps-enfermeiro')
ON CONFLICT (codigo) DO NOTHING;

-- Inserir unidades
INSERT INTO unidades (nome, codigo) VALUES
('Unidade Central', 'central'),
('Unidade Norte', 'norte'),
('Unidade Sul', 'sul')
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_pacientes_cpf ON pacientes (cpf);
CREATE INDEX IF NOT EXISTS idx_pacientes_status ON pacientes (status_vinculacao);
CREATE INDEX IF NOT EXISTS idx_pacientes_cliente ON pacientes (cliente_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_unidade ON pacientes (unidade_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_faixa_etaria ON pacientes (faixa_etaria);

-- =====================================================
-- ENABLE RLS (Row Level Security)
-- =====================================================

ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CONFIRMAÇÃO
-- =====================================================

SELECT 'SETUP COMPLETO! Tabelas criadas com sucesso.' as status;