const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://bgivemisrbkdtmbxojlu.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXZlbWlzcmJrZHRtYnhvamx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTE4NTE5MywiZXhwIjoyMDUwNzYxMTkzfQ.wZk10TXzQPHXjH3eoZLG5EBLwGBzRY7XGi5RbVB_W_s'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function createTables() {
  console.log('📋 Criando tabelas principais do sistema...\n')
  
  // Comandos SQL principais para criar as tabelas necessárias
  const tables = [
    {
      name: 'atendimentos',
      sql: `
        CREATE TABLE IF NOT EXISTS atendimentos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          paciente_id UUID REFERENCES pacientes(id) NOT NULL,
          data_atendimento DATE NOT NULL,
          tipo_atendimento VARCHAR(20) CHECK (tipo_atendimento IN ('aps', 'pa_virtual', 'consulta_agendada')),
          cid_principal VARCHAR(10),
          cid_secundarios TEXT[],
          motivo_consulta TEXT,
          profissional_responsavel VARCHAR(100),
          especialidade VARCHAR(50),
          status VARCHAR(20) DEFAULT 'realizado',
          observacoes TEXT,
          valor_consulta DECIMAL(10,2),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );`
    },
    {
      name: 'exames_laboratoriais', 
      sql: `
        CREATE TABLE IF NOT EXISTS exames_laboratoriais (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          paciente_id UUID REFERENCES pacientes(id) NOT NULL,
          data_exame DATE NOT NULL,
          tipo_exame VARCHAR(50) NOT NULL,
          resultado_glicemia INTEGER,
          resultado_hba1c DECIMAL(4,2),
          pressao_sistolica INTEGER,
          pressao_diastolica INTEGER,
          peso DECIMAL(5,2),
          altura DECIMAL(3,2),
          imc DECIMAL(4,2),
          colesterol_total INTEGER,
          colesterol_hdl INTEGER,
          colesterol_ldl INTEGER,
          triglicerides INTEGER,
          creatinina DECIMAL(4,2),
          ureia INTEGER,
          observacoes TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );`
    },
    {
      name: 'rastreios',
      sql: `
        CREATE TABLE IF NOT EXISTS rastreios (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          paciente_id UUID REFERENCES pacientes(id) NOT NULL,
          tipo_rastreio VARCHAR(50) NOT NULL,
          data_solicitacao DATE NOT NULL,
          data_realizacao DATE,
          data_vencimento DATE NOT NULL,
          status VARCHAR(20) DEFAULT 'pendente',
          resultado VARCHAR(50),
          observacoes TEXT,
          unidade_executora VARCHAR(100),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );`
    },
    {
      name: 'linhas_cuidado',
      sql: `
        CREATE TABLE IF NOT EXISTS linhas_cuidado (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL UNIQUE,
          descricao TEXT,
          cor VARCHAR(7) DEFAULT '#3b82f6',
          ativa BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );`
    },
    {
      name: 'pacientes_linhas_cuidado',
      sql: `
        CREATE TABLE IF NOT EXISTS pacientes_linhas_cuidado (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          paciente_id UUID REFERENCES pacientes(id) NOT NULL,
          linha_cuidado_id INTEGER REFERENCES linhas_cuidado(id) NOT NULL,
          data_inclusao DATE NOT NULL DEFAULT CURRENT_DATE,
          status VARCHAR(20) DEFAULT 'ativo',
          observacoes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(paciente_id, linha_cuidado_id)
        );`
    },
    {
      name: 'controle_qualidade',
      sql: `
        CREATE TABLE IF NOT EXISTS controle_qualidade (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          paciente_id UUID REFERENCES pacientes(id) NOT NULL,
          linha_cuidado_id INTEGER REFERENCES linhas_cuidado(id),
          tipo_controle VARCHAR(50) NOT NULL,
          data_avaliacao DATE NOT NULL,
          status_controle VARCHAR(20) CHECK (status_controle IN ('controlado', 'parcialmente_controlado', 'descontrolado')),
          valor_meta DECIMAL(10,2),
          valor_atual DECIMAL(10,2),
          observacoes TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );`
    }
  ]

  let successCount = 0
  let errorCount = 0

  for (const table of tables) {
    try {
      console.log(`📊 Criando tabela: ${table.name}`)
      
      const { error } = await supabase
        .from('__temp_exec')
        .select('1')
        .limit(1)
        
      // Se chegou até aqui, a conexão funciona
      // Vamos executar via SQL direto
      const { data, error: sqlError } = await supabase.rpc('sql', { 
        query: table.sql 
      })
      
      if (sqlError) {
        console.log(`❌ Erro ao criar ${table.name}:`, sqlError.message)
        errorCount++
      } else {
        console.log(`✅ Tabela ${table.name} criada com sucesso!`)
        successCount++
      }
      
    } catch (err) {
      console.log(`❌ Exceção ao criar ${table.name}:`, err.message)
      errorCount++
    }
  }

  // Criar índices importantes
  const indexes = [
    "CREATE INDEX IF NOT EXISTS idx_atendimentos_data ON atendimentos (data_atendimento)",
    "CREATE INDEX IF NOT EXISTS idx_atendimentos_paciente ON atendimentos (paciente_id)",
    "CREATE INDEX IF NOT EXISTS idx_exames_paciente ON exames_laboratoriais (paciente_id)",
    "CREATE INDEX IF NOT EXISTS idx_exames_data ON exames_laboratoriais (data_exame)",
    "CREATE INDEX IF NOT EXISTS idx_rastreios_paciente ON rastreios (paciente_id)",
    "CREATE INDEX IF NOT EXISTS idx_rastreios_tipo ON rastreios (tipo_rastreio)"
  ]

  console.log(`\n📋 Criando ${indexes.length} índices...`)
  
  for (const index of indexes) {
    try {
      const { error } = await supabase.rpc('sql', { query: index })
      if (!error) successCount++
    } catch (err) {
      errorCount++
    }
  }

  console.log('\n📊 RESUMO DA CRIAÇÃO:')
  console.log(`✅ Sucessos: ${successCount}`)
  console.log(`❌ Erros: ${errorCount}`)
  console.log(`📝 Total: ${tables.length + indexes.length}`)

  if (errorCount === 0) {
    console.log('\n🎉 Todas as tabelas principais foram criadas com sucesso!')
  }
}

createTables()