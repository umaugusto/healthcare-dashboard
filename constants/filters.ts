// VERSAO GEMINI 0.1/constants/filters.ts
import { SelectOption } from '../types';

export const faixasEtariasAPS = [
  { id: "crianca", label: "Criança (0-12 anos)", desc: "Pediatria e desenvolvimento" },
  { id: "adolescente", label: "Adolescente (13-17 anos)", desc: "Saúde do adolescente" },
  { id: "adulto-jovem", label: "Adulto Jovem (18-39 anos)", desc: "Prevenção e planejamento" },
  { id: "adulto", label: "Adulto (40-59 anos)", desc: "Doenças crônicas" },
  { id: "idoso", label: "Idoso (60+ anos)", desc: "Geriatria e cuidados especiais" },
];

export const sexoOptions = [
  { id: "masculino", label: "Masculino", icon: "♂️" },
  { id: "feminino", label: "Feminino", icon: "♀️" },
];

export const titularidadeOptions = [
  { id: "titular", label: "Titular", desc: "Responsável pelo plano" },
  { id: "dependente", label: "Dependente", desc: "Vinculado ao titular" },
];

export const temposPrograma = [
  { value: "todos", label: "Todos os tempos" },
  { value: "ate6m", label: "Até 6 meses" },
  { value: "6a12m", label: "6 a 12 meses" },
  { value: "12a24m", label: "12 a 24 meses" },
  { value: "mais24m", label: "Mais de 24 meses" },
];

export const clienteOptions: SelectOption[] = [
  { label: "Tech Corp S.A.", value: "tech-corp" },
  { label: "Indústrias ABC Ltda", value: "industrias-abc" },
  { label: "Serviços XYZ", value: "servicos-xyz" },
];

export const produtoOptions: SelectOption[] = [
  { label: "APS On-site", value: "aps-onsite" },
  { label: "APS Digital", value: "aps-digital" },
  { label: "APS Enfermeiro Dedicado", value: "aps-enfermeiro" },
];

export const unidadeOptions: SelectOption[] = [
  { label: "Unidade Central", value: "central" },
  { label: "Unidade Norte", value: "norte" },
  { label: "Unidade Sul", value: "sul" },
];

export const medicosFamiliaOptions: SelectOption[] = [
  { label: "Dr. Carlos Silva", value: "carlos-silva" },
  { label: "Dra. Ana Santos", value: "ana-santos" },
  { label: "Dr. Pedro Costa", value: "pedro-costa" },
];

export const enfermeirosFamiliaOptions: SelectOption[] = [
  { label: "Enf. Lucia Ferreira", value: "lucia-ferreira" },
  { label: "Enf. Roberto Alves", value: "roberto-alves" },
];

export const coordenadoresOptions: SelectOption[] = [
  { label: "Paula Mendes", value: "paula-mendes" },
  { label: "Carlos Ribeiro", value: "carlos-ribeiro" },
];

export const careLinesOptions: SelectOption[] = [
    { value: 'saude-mulher', label: 'Saúde da Mulher' },
    { value: 'saude-homem', label: 'Saúde do Homem' },
    { value: 'saude-mental', label: 'Saúde Mental' },
    { value: 'doencas-cronicas', label: 'Doenças Crônicas' },
    { value: 'cardiologia', label: 'Cardiologia' },
    { value: 'hipertensao', label: 'Hipertensão Arterial' },
    { value: 'diabetes', label: 'Diabetes Mellitus' },
    { value: 'obesidade', label: 'Obesidade' },
    { value: 'saude-crianca', label: 'Saúde da Criança' },
    { value: 'saude-idoso', label: 'Saúde do Idoso' },
    { value: 'tabagismo', label: 'Tabagismo' },
    { value: 'gestante', label: 'Gestantes e Puérperas' },
    { value: 'oncologia', label: 'Oncologia' },
    { value: 'nefrologia', label: 'Nefrologia' },
    { value: 'pneumologia', label: 'Pneumologia' },
];

export const cidOptions: SelectOption[] = [
  { value: 'I10', label: 'I10 - Hipertensão essencial' },
  { value: 'I11', label: 'I11 - Doença cardíaca hipertensiva' },
  { value: 'E11.9', label: 'E11.9 - Diabetes Mellitus tipo 2' },
  { value: 'E11.2', label: 'E11.2 - Diabetes com complicações renais' },
  { value: 'E78.5', label: 'E78.5 - Hiperlipidemia' },
  { value: 'E66.9', label: 'E66.9 - Obesidade' },
  { value: 'Z00.0', label: 'Z00.0 - Exame médico geral' },
  { value: 'J06.9', label: 'J06.9 - Infecção respiratória aguda' },
  { value: 'J44.0', label: 'J44.0 - DPOC' },
  { value: 'M79.3', label: 'M79.3 - Dor muscular' },
  { value: 'M54.5', label: 'M54.5 - Dor lombar' },
  { value: 'N39.0', label: 'N39.0 - Infecção do trato urinário' },
  { value: 'F41.1', label: 'F41.1 - Ansiedade generalizada' },
  { value: 'F32.9', label: 'F32.9 - Episódio depressivo' },
  { value: 'F33', label: 'F33 - Transtorno depressivo recorrente' },
  { value: 'K29', label: 'K29 - Gastrite' },
  { value: 'N18', label: 'N18 - Doença renal crônica' },
  { value: 'B24', label: 'B24 - HIV' },
  { value: 'A90', label: 'A90 - Dengue' },
  { value: 'Z71.1', label: 'Z71.1 - Aconselhamento médico' },
];
