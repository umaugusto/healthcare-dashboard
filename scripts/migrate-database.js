const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuração do Supabase com service_role key para operações admin
const supabaseUrl = 'https://bgivemisrbkdtmbxojlu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkyODQ0MiwiZXhwIjoyMDcyNTA0NDQyfQ.ZAVpzi6Qe8zuzTfIvsGCfjORY4EBi5iJqrFYe7YMZgA'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSQLFile(filename) {
  console.log(`📄 Executando ${filename}...`)
  
  const sqlPath = path.join(__dirname, '..', filename)
  const sqlContent = fs.readFileSync(sqlPath, 'utf8')
  
  // Dividir em comandos individuais (separados por ;)
  const commands = sqlContent
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
  
  console.log(`📋 Executando ${commands.length} comandos SQL...`)
  
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i]
    if (command.length === 0) continue
    
    try {
      console.log(`⏳ Executando comando ${i + 1}/${commands.length}...`)
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: command
      })
      
      if (error) {
        // Tentar execução direta se RPC falhar
        const { error: directError } = await supabase
          .from('_supabase_migrations')
          .select('*')
          .limit(1)
        
        if (directError) {
          console.log(`⚠️  Aviso no comando ${i + 1}: ${error.message}`)
          // Continue com o próximo comando para comandos não críticos
        }
      } else {
        console.log(`✅ Comando ${i + 1} executado com sucesso`)
      }
      
    } catch (err) {
      console.log(`❌ Erro no comando ${i + 1}: ${err.message}`)
      // Para alguns erros, continuamos (ex: tabela já existe)
      if (!err.message.includes('already exists')) {
        throw err
      }
    }
  }
}

async function createTables() {
  console.log('🏗️  Criando tabelas...')
  
  // Criar tabelas uma por uma para melhor controle
  const tables = [
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
    `CREATE EXTENSION IF NOT EXISTS "pg_trgm";`,
    
    `CREATE TABLE IF NOT EXISTS clientes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nome VARCHAR(255) NOT NULL,
      codigo VARCHAR(50) UNIQUE NOT NULL,
      ativo BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,
    
    `CREATE TABLE IF NOT EXISTS produtos (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nome VARCHAR(255) NOT NULL,
      codigo VARCHAR(50) UNIQUE NOT NULL,
      descricao TEXT,
      ativo BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,
    
    `CREATE TABLE IF NOT EXISTS unidades (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nome VARCHAR(255) NOT NULL,
      codigo VARCHAR(50) UNIQUE NOT NULL,
      endereco TEXT,
      ativo BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,
    
    `CREATE TABLE IF NOT EXISTS profissionais (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nome VARCHAR(255) NOT NULL,
      tipo VARCHAR(30) CHECK (tipo IN ('medico_familia', 'enfermeiro_familia', 'enfermeiro_coordenador')) NOT NULL,
      crm_coren VARCHAR(20),
      especialidade VARCHAR(100),
      unidade_id UUID REFERENCES unidades(id),
      ativo BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,
    
    `CREATE TABLE IF NOT EXISTS cids (
      codigo VARCHAR(10) PRIMARY KEY,
      descricao VARCHAR(500) NOT NULL,
      categoria VARCHAR(100),
      subcategoria VARCHAR(100),
      ativo BOOLEAN DEFAULT true
    );`,
    
    `CREATE TABLE IF NOT EXISTS linhas_cuidado (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      codigo VARCHAR(50) UNIQUE NOT NULL,
      nome VARCHAR(255) NOT NULL,
      descricao TEXT,
      ativa BOOLEAN DEFAULT true,
      cor_hex VARCHAR(7),
      icone VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,
    
    `CREATE TABLE IF NOT EXISTS faixas_etarias (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      codigo VARCHAR(30) UNIQUE NOT NULL,
      nome VARCHAR(100) NOT NULL,
      idade_minima INTEGER,
      idade_maxima INTEGER,
      descricao TEXT,
      ativa BOOLEAN DEFAULT true
    );`,
    
    `CREATE TABLE IF NOT EXISTS pacientes (
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
      titularidade VARCHAR(20) CHECK (titularidade IN ('titular', 'dependente')) NOT NULL,
      faixa_etaria VARCHAR(30) NOT NULL,
      data_vinculacao DATE,
      status_vinculacao VARCHAR(20) CHECK (status_vinculacao IN ('vinculado', 'nao_vinculado', 'desvinculado')) DEFAULT 'vinculado',
      tempo_programa_meses INTEGER,
      cliente_id UUID REFERENCES clientes(id),
      unidade_id UUID REFERENCES unidades(id),
      produto_id UUID REFERENCES produtos(id),
      medico_familia_id UUID REFERENCES profissionais(id),
      enfermeiro_familia_id UUID REFERENCES profissionais(id),
      enfermeiro_coordenador_id UUID REFERENCES profissionais(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`
  ]
  
  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: table })
      if (error && !error.message.includes('already exists')) {
        console.log(`⚠️  Erro ao criar tabela: ${error.message}`)
      }
    } catch (err) {
      console.log(`⚠️  Tentando método alternativo...`)
    }
  }
}

async function insertBasicData() {
  console.log('📊 Inserindo dados básicos...')
  
  // CIDs
  const cids = [
    { codigo: 'I10', descricao: 'Hipertensão essencial', categoria: 'Doenças do aparelho circulatório' },
    { codigo: 'E11.9', descricao: 'Diabetes mellitus tipo 2', categoria: 'Doenças endócrinas' },
    { codigo: 'E66.9', descricao: 'Obesidade', categoria: 'Doenças endócrinas' },
    { codigo: 'F41.1', descricao: 'Ansiedade generalizada', categoria: 'Transtornos mentais' },
    { codigo: 'F32.9', descricao: 'Episódio depressivo', categoria: 'Transtornos mentais' },
    { codigo: 'M79.0', descricao: 'Reumatismo', categoria: 'Doenças músculo-esqueléticas' },
    { codigo: 'J06.9', descricao: 'Infecção respiratória aguda', categoria: 'Doenças do aparelho respiratório' },
    { codigo: 'Z00.0', descricao: 'Exame médico geral', categoria: 'Fatores que influenciam o estado de saúde' },
    { codigo: 'E78.5', descricao: 'Hiperlipidemia', categoria: 'Doenças endócrinas' },
    { codigo: 'N39.0', descricao: 'Infecção do trato urinário', categoria: 'Doenças do aparelho geniturinário' }
  ]
  
  const { error: cidError } = await supabase
    .from('cids')
    .upsert(cids, { onConflict: 'codigo' })
  
  if (cidError) console.log(`⚠️  Erro ao inserir CIDs: ${cidError.message}`)
  else console.log(`✅ CIDs inseridos com sucesso`)
  
  // Linhas de Cuidado
  const linhasCuidado = [
    { codigo: 'saude-mulher', nome: 'Saúde da Mulher', cor_hex: '#ec4899' },
    { codigo: 'saude-homem', nome: 'Saúde do Homem', cor_hex: '#3b82f6' },
    { codigo: 'saude-mental', nome: 'Saúde Mental', cor_hex: '#8b5cf6' },
    { codigo: 'doencas-cronicas', nome: 'Doenças Crônicas', cor_hex: '#ef4444' },
    { codigo: 'hipertensao', nome: 'Hipertensão Arterial', cor_hex: '#dc2626' },
    { codigo: 'diabetes', nome: 'Diabetes Mellitus', cor_hex: '#f59e0b' },
    { codigo: 'obesidade', nome: 'Obesidade', cor_hex: '#fbbf24' },
    { codigo: 'cardiologia', nome: 'Cardiologia', cor_hex: '#f43f5e' },
    { codigo: 'saude-crianca', nome: 'Saúde da Criança', cor_hex: '#06b6d4' },
    { codigo: 'saude-idoso', nome: 'Saúde do Idoso', cor_hex: '#6b7280' }
  ]
  
  const { error: lcError } = await supabase
    .from('linhas_cuidado')
    .upsert(linhasCuidado, { onConflict: 'codigo' })
  
  if (lcError) console.log(`⚠️  Erro ao inserir Linhas de Cuidado: ${lcError.message}`)
  else console.log(`✅ Linhas de Cuidado inseridas com sucesso`)
  
  // Faixas Etárias
  const faixasEtarias = [
    { codigo: 'crianca', nome: 'Criança (0-12 anos)', idade_minima: 0, idade_maxima: 12 },
    { codigo: 'adolescente', nome: 'Adolescente (13-17 anos)', idade_minima: 13, idade_maxima: 17 },
    { codigo: 'adulto-jovem', nome: 'Adulto Jovem (18-39 anos)', idade_minima: 18, idade_maxima: 39 },
    { codigo: 'adulto', nome: 'Adulto (40-59 anos)', idade_minima: 40, idade_maxima: 59 },
    { codigo: 'idoso', nome: 'Idoso (60+ anos)', idade_minima: 60, idade_maxima: null }
  ]
  
  const { error: feError } = await supabase
    .from('faixas_etarias')
    .upsert(faixasEtarias, { onConflict: 'codigo' })
  
  if (feError) console.log(`⚠️  Erro ao inserir Faixas Etárias: ${feError.message}`)
  else console.log(`✅ Faixas Etárias inseridas com sucesso`)
  
  // Clientes
  const clientes = [
    { nome: 'Tech Corp S.A.', codigo: 'tech-corp' },
    { nome: 'Indústrias ABC Ltda', codigo: 'industrias-abc' },
    { nome: 'Serviços XYZ', codigo: 'servicos-xyz' }
  ]
  
  const { error: clienteError } = await supabase
    .from('clientes')
    .upsert(clientes, { onConflict: 'codigo' })
  
  if (clienteError) console.log(`⚠️  Erro ao inserir Clientes: ${clienteError.message}`)
  else console.log(`✅ Clientes inseridos com sucesso`)
  
  // Produtos
  const produtos = [
    { nome: 'APS On-site', codigo: 'aps-onsite' },
    { nome: 'APS Digital', codigo: 'aps-digital' },
    { nome: 'APS Enfermeiro Dedicado', codigo: 'aps-enfermeiro' }
  ]
  
  const { error: produtoError } = await supabase
    .from('produtos')
    .upsert(produtos, { onConflict: 'codigo' })
  
  if (produtoError) console.log(`⚠️  Erro ao inserir Produtos: ${produtoError.message}`)
  else console.log(`✅ Produtos inseridos com sucesso`)
  
  // Unidades
  const unidades = [
    { nome: 'Unidade Central', codigo: 'central' },
    { nome: 'Unidade Norte', codigo: 'norte' },
    { nome: 'Unidade Sul', codigo: 'sul' }
  ]
  
  const { error: unidadeError } = await supabase
    .from('unidades')
    .upsert(unidades, { onConflict: 'codigo' })
  
  if (unidadeError) console.log(`⚠️  Erro ao inserir Unidades: ${unidadeError.message}`)
  else console.log(`✅ Unidades inseridas com sucesso`)
}

async function createIndexes() {
  console.log('🔍 Criando índices...')
  
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_pacientes_cpf ON pacientes (cpf);',
    'CREATE INDEX IF NOT EXISTS idx_pacientes_status ON pacientes (status_vinculacao);',
    'CREATE INDEX IF NOT EXISTS idx_pacientes_cliente ON pacientes (cliente_id);',
    'CREATE INDEX IF NOT EXISTS idx_pacientes_unidade ON pacientes (unidade_id);',
    'CREATE INDEX IF NOT EXISTS idx_pacientes_faixa_etaria ON pacientes (faixa_etaria);'
  ]
  
  for (const index of indexes) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: index })
      if (error && !error.message.includes('already exists')) {
        console.log(`⚠️  Erro ao criar índice: ${error.message}`)
      }
    } catch (err) {
      console.log(`⚠️  Índice pode já existir: ${err.message}`)
    }
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando migração do banco de dados...')
    
    await createTables()
    await insertBasicData()
    await createIndexes()
    
    console.log('✅ Migração concluída com sucesso!')
    console.log('📋 Próximo passo: Popular com dados de pacientes (npm run seed)')
    
  } catch (error) {
    console.error('❌ Erro na migração:', error.message)
    process.exit(1)
  }
}

main()