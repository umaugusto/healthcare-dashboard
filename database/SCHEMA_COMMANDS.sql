CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE INDEX IF NOT EXISTS idx_pacientes_status ON pacientes (status_vinculacao);

CREATE INDEX IF NOT EXISTS idx_pacientes_cliente ON pacientes (cliente_id);

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

END;

$$ LANGUAGE plpgsql;

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

RETURN NEW;

END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_pacientes_faixa_etaria
    BEFORE INSERT OR UPDATE ON pacientes
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_faixa_etaria();

IF TG_OP = 'DELETE' THEN
        RETURN OLD;

END IF;

RETURN NEW;

END;

$$ LANGUAGE plpgsql;

ALTER TABLE atendimentos ENABLE ROW LEVEL SECURITY;

ALTER TABLE exames_laboratoriais ENABLE ROW LEVEL SECURITY;

ALTER TABLE rastreios ENABLE ROW LEVEL SECURITY;

ALTER TABLE prescricoes ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE exames_laboratoriais IS 'Resultados de exames laboratoriais e medidas';

COMMENT ON TABLE rastreios IS 'Controle de rastreamentos (mamografia, citologia, etc)';

COMMENT ON TABLE controle_qualidade IS 'Avaliação de controle de doenças crônicas';

COMMENT ON VIEW v_cobertura_dashboard IS 'View otimizada para dashboard de cobertura';