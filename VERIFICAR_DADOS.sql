-- =====================================================
-- VERIFICAR DADOS INSERIDOS - DASHBOARD APS
-- =====================================================
-- Execute este arquivo no Dashboard Web do Supabase

-- Total de pacientes inseridos
SELECT COUNT(*) as total_pacientes FROM pacientes;

-- Distribuição por sexo
SELECT 
    sexo,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM pacientes), 1) as percentual
FROM pacientes
GROUP BY sexo
ORDER BY sexo;

-- Distribuição por titularidade
SELECT 
    titularidade,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM pacientes), 1) as percentual
FROM pacientes
GROUP BY titularidade
ORDER BY titularidade;

-- Distribuição por status de vinculação
SELECT 
    status_vinculacao,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM pacientes), 1) as percentual
FROM pacientes
GROUP BY status_vinculacao
ORDER BY status_vinculacao;

-- Distribuição por faixa etária
SELECT 
    faixa_etaria,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM pacientes), 1) as percentual
FROM pacientes
GROUP BY faixa_etaria
ORDER BY faixa_etaria;

-- Distribuição por cliente
SELECT 
    c.nome as cliente,
    COUNT(p.*) as pacientes
FROM pacientes p
JOIN clientes c ON p.cliente_id = c.id
GROUP BY c.nome
ORDER BY pacientes DESC;

-- Distribuição por unidade
SELECT 
    u.nome as unidade,
    COUNT(p.*) as pacientes
FROM pacientes p
JOIN unidades u ON p.unidade_id = u.id
GROUP BY u.nome
ORDER BY pacientes DESC;

-- Alguns pacientes de exemplo
SELECT 
    prontuario,
    nome,
    sexo,
    titularidade,
    faixa_etaria,
    status_vinculacao,
    data_vinculacao
FROM pacientes 
ORDER BY prontuario 
LIMIT 10;