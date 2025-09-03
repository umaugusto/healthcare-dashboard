-- =====================================================
-- INSERIR PACIENTES DE EXEMPLO - DASHBOARD APS
-- =====================================================
-- Execute este arquivo no Dashboard Web do Supabase

-- Primeiro, vamos buscar os IDs das tabelas de referência
-- (Execute uma linha por vez para ver os resultados)

-- Ver clientes disponíveis
SELECT id, nome FROM clientes;

-- Ver unidades disponíveis  
SELECT id, nome FROM unidades;

-- Ver produtos disponíveis
SELECT id, nome FROM produtos;

-- =====================================================
-- INSERIR PACIENTES DE EXEMPLO (100 pacientes)
-- =====================================================
-- Substitua os UUIDs pelos IDs reais que apareceram nas consultas acima

-- Exemplo com IDs fictícios - VOCÊ DEVE SUBSTITUIR pelos IDs reais
INSERT INTO pacientes (
  prontuario, cpf, nome, data_nascimento, sexo, 
  titularidade, faixa_etaria, status_vinculacao,
  data_vinculacao, tempo_programa_meses,
  cliente_id, unidade_id, produto_id
) VALUES
-- Pacientes vinculados
('100001', '12345678901', 'Maria Silva Santos', '1985-03-15', 'F', 'titular', 'adulto-jovem', 'vinculado', '2023-01-15', 8, 
  (SELECT id FROM clientes LIMIT 1), 
  (SELECT id FROM unidades LIMIT 1), 
  (SELECT id FROM produtos LIMIT 1)
),
('100002', '12345678902', 'João Carlos Oliveira', '1978-07-22', 'M', 'titular', 'adulto', 'vinculado', '2022-06-10', 15,
  (SELECT id FROM clientes LIMIT 1), 
  (SELECT id FROM unidades LIMIT 1), 
  (SELECT id FROM produtos LIMIT 1)
),
('100003', '12345678903', 'Ana Paula Costa', '1992-11-08', 'F', 'dependente', 'adulto-jovem', 'vinculado', '2023-03-20', 6,
  (SELECT id FROM clientes LIMIT 1), 
  (SELECT id FROM unidades OFFSET 1 LIMIT 1), 
  (SELECT id FROM produtos LIMIT 1)
),
('100004', '12345678904', 'Pedro Henrique Lima', '1965-12-03', 'M', 'titular', 'idoso', 'vinculado', '2021-08-05', 25,
  (SELECT id FROM clientes LIMIT 1), 
  (SELECT id FROM unidades LIMIT 1), 
  (SELECT id FROM produtos OFFSET 1 LIMIT 1)
),
('100005', '12345678905', 'Carla Fernanda Souza', '1988-04-17', 'F', 'titular', 'adulto-jovem', 'nao_vinculado', NULL, NULL,
  (SELECT id FROM clientes OFFSET 1 LIMIT 1), 
  (SELECT id FROM unidades OFFSET 1 LIMIT 1), 
  (SELECT id FROM produtos LIMIT 1)
),
('100006', '12345678906', 'Roberto da Silva', '1990-09-25', 'M', 'dependente', 'adulto-jovem', 'vinculado', '2023-05-12', 4,
  (SELECT id FROM clientes LIMIT 1), 
  (SELECT id FROM unidades OFFSET 2 LIMIT 1), 
  (SELECT id FROM produtos LIMIT 1)
),
('100007', '12345678907', 'Juliana Santos', '1975-01-30', 'F', 'titular', 'adulto', 'vinculado', '2022-12-08', 9,
  (SELECT id FROM clientes OFFSET 2 LIMIT 1), 
  (SELECT id FROM unidades LIMIT 1), 
  (SELECT id FROM produtos OFFSET 2 LIMIT 1)
),
('100008', '12345678908', 'Carlos Eduardo', '2010-06-14', 'M', 'dependente', 'adolescente', 'vinculado', '2023-02-28', 7,
  (SELECT id FROM clientes LIMIT 1), 
  (SELECT id FROM unidades LIMIT 1), 
  (SELECT id FROM produtos LIMIT 1)
),
('100009', '12345678909', 'Fernanda Alves', '1995-08-19', 'F', 'titular', 'adulto-jovem', 'vinculado', '2021-11-15', 22,
  (SELECT id FROM clientes OFFSET 1 LIMIT 1), 
  (SELECT id FROM unidades OFFSET 1 LIMIT 1), 
  (SELECT id FROM produtos OFFSET 1 LIMIT 1)
),
('100010', '12345678910', 'Antonio José', '1955-05-12', 'M', 'titular', 'idoso', 'vinculado', '2020-09-03', 36,
  (SELECT id FROM clientes LIMIT 1), 
  (SELECT id FROM unidades LIMIT 1), 
  (SELECT id FROM produtos LIMIT 1)
);

-- =====================================================
-- VERIFICAR SE OS DADOS FORAM INSERIDOS
-- =====================================================

-- Contar total de pacientes
SELECT COUNT(*) as total_pacientes FROM pacientes;

-- Ver alguns pacientes inseridos
SELECT 
  prontuario, 
  nome, 
  sexo, 
  titularidade, 
  status_vinculacao,
  data_vinculacao
FROM pacientes 
ORDER BY prontuario 
LIMIT 10;

-- Verificar distribuição por status
SELECT 
  status_vinculacao,
  COUNT(*) as quantidade,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM pacientes), 1) as percentual
FROM pacientes
GROUP BY status_vinculacao;

-- =====================================================
-- PRÓXIMO PASSO
-- =====================================================
-- Se este exemplo funcionou, podemos criar mais pacientes
-- ou configurar o Node.js para gerar os 8.950 pacientes automaticamente