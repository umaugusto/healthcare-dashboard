// This file will be auto-generated when you run: npm run db:types
// For now, we'll create basic types based on our schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pacientes: {
        Row: {
          id: string
          prontuario: string
          cpf: string
          nome: string
          data_nascimento: string
          sexo: 'M' | 'F'
          email: string | null
          telefone: string | null
          endereco: string | null
          cep: string | null
          titularidade: 'titular' | 'dependente'
          faixa_etaria: string
          data_vinculacao: string | null
          status_vinculacao: 'vinculado' | 'nao_vinculado' | 'desvinculado'
          tempo_programa_meses: number | null
          cliente_id: string | null
          unidade_id: string | null
          produto_id: string | null
          medico_familia_id: string | null
          enfermeiro_familia_id: string | null
          enfermeiro_coordenador_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prontuario: string
          cpf: string
          nome: string
          data_nascimento: string
          sexo: 'M' | 'F'
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          cep?: string | null
          titularidade: 'titular' | 'dependente'
          faixa_etaria: string
          data_vinculacao?: string | null
          status_vinculacao?: 'vinculado' | 'nao_vinculado' | 'desvinculado'
          cliente_id?: string | null
          unidade_id?: string | null
          produto_id?: string | null
          medico_familia_id?: string | null
          enfermeiro_familia_id?: string | null
          enfermeiro_coordenador_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prontuario?: string
          cpf?: string
          nome?: string
          data_nascimento?: string
          sexo?: 'M' | 'F'
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          cep?: string | null
          titularidade?: 'titular' | 'dependente'
          faixa_etaria?: string
          data_vinculacao?: string | null
          status_vinculacao?: 'vinculado' | 'nao_vinculado' | 'desvinculado'
          cliente_id?: string | null
          unidade_id?: string | null
          produto_id?: string | null
          medico_familia_id?: string | null
          enfermeiro_familia_id?: string | null
          enfermeiro_coordenador_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables as needed
      atendimentos: {
        Row: {
          id: string
          paciente_id: string
          data_atendimento: string
          tipo_atendimento: 'aps' | 'pa_virtual' | 'consulta_agendada'
          profissional_id: string | null
          cid_principal: string | null
          cid_secundarios: string[] | null
          motivo_consulta: string | null
          descricao: string | null
          desfecho: 'alta' | 'encaminhamento' | 'retorno_agendado' | null
          especialidade_encaminhada: string | null
          status: 'agendada' | 'realizada' | 'cancelada' | 'faltou'
          created_at: string
        }
        Insert: {
          id?: string
          paciente_id: string
          data_atendimento: string
          tipo_atendimento: 'aps' | 'pa_virtual' | 'consulta_agendada'
          profissional_id?: string | null
          cid_principal?: string | null
          cid_secundarios?: string[] | null
          motivo_consulta?: string | null
          descricao?: string | null
          desfecho?: 'alta' | 'encaminhamento' | 'retorno_agendado' | null
          especialidade_encaminhada?: string | null
          status?: 'agendada' | 'realizada' | 'cancelada' | 'faltou'
          created_at?: string
        }
        Update: {
          id?: string
          paciente_id?: string
          data_atendimento?: string
          tipo_atendimento?: 'aps' | 'pa_virtual' | 'consulta_agendada'
          profissional_id?: string | null
          cid_principal?: string | null
          cid_secundarios?: string[] | null
          motivo_consulta?: string | null
          descricao?: string | null
          desfecho?: 'alta' | 'encaminhamento' | 'retorno_agendado' | null
          especialidade_encaminhada?: string | null
          status?: 'agendada' | 'realizada' | 'cancelada' | 'faltou'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}