export interface StudentData {
  Nome: string;
  CPF: string | number;
  Curso: string;
  Financeiro: string;
  Avaliação: string;
  "Tempo mínimo": string;
  Documentos: string;
  Disciplinas: string;
  Cobranças: string;
  "Status Inscrição": string;
  "Data Início": string;
  "Data Solic. Digital": string;
  "Tipo Cert. Digital": string;
  "Status Cert. Digital": string;
  "Data Solic. Impresso": string;
  "Tipo Cert. Impresso": string;
  "Status Cert. Impresso": string;
  Turma: string;
}

export interface ProcessedStudent {
  nome: string;
  cpf: string;
  curso: string;
  financeiro: "OK" | "X" | "Não encontrado";
  avaliacao: "OK" | "X" | "Não encontrado";
  tempoMinimo: "OK" | "X" | "Não encontrado";
  documentos: "OK" | "X" | "Não encontrado";
  disciplinasCompletas: number;
  disciplinasTotal: number;
  disciplinasPercentual: number;
  cobrancasPagas: number;
  cobrancasTotal: number;
  cobrancasPercentual: number;
  statusInscricao: string;
  dataInicio: Date | null;
  dataSolicDigital: Date | null;
  tipoCartDigital: string;
  statusCartDigital: string;
  dataSolicImpresso: Date | null;
  tipoCartImpresso: string;
  statusCartImpresso: string;
  turma: string;
  inadimplenciaCategoria: "Em dia" | "Atraso leve" | "Atraso médio" | "Inadimplente grave";
}

export interface DashboardMetrics {
  totalAlunos: number;
  percentualEmDia: number;
  progressoMedioDisciplinas: number;
  documentosCompletos: number;
  ultimaAtualizacao: Date;
  solicitacoesCertificados7d: number;
  solicitacoesCertificados30d: number;
  solicitacoesCertificados90d: number;
}