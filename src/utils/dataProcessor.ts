import { StudentData, ProcessedStudent } from "@/types/student";

export function normalizeStatus(value: string): "OK" | "X" | "Não encontrado" {
  const normalized = value.toLowerCase().trim();
  if (normalized === "ok") return "OK";
  if (normalized === "x") return "X";
  return "Não encontrado";
}

export function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.toLowerCase().includes("não solicitado")) {
    return null;
  }

  // Try DD/MM/YYYY format first
  const ddmmyyyy = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Try YYYY-MM-DD format
  const yyyymmdd = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (yyyymmdd) {
    const [, year, month, day] = yyyymmdd;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  return null;
}

export function parseFraction(fraction: string): { numerator: number; denominator: number; percentage: number } {
  const match = fraction.match(/^(\d+)\/(\d+)$/);
  if (!match) {
    return { numerator: 0, denominator: 0, percentage: 0 };
  }

  const numerator = parseInt(match[1]);
  const denominator = parseInt(match[2]);
  const percentage = denominator === 0 ? 0 : (numerator / denominator) * 100;

  return { numerator, denominator, percentage };
}

export function categorizeInadimplencia(percentage: number): "Em dia" | "Atraso leve" | "Atraso médio" | "Inadimplente grave" {
  if (percentage === 100) return "Em dia";
  if (percentage >= 80) return "Atraso leve";
  if (percentage >= 50) return "Atraso médio";
  return "Inadimplente grave";
}

export function processStudentData(data: StudentData[]): ProcessedStudent[] {
  return data.map((student) => {
    const disciplinas = parseFraction(student.Disciplinas);
    const cobrancas = parseFraction(student.Cobranças);

    return {
      nome: student.Nome,
      cpf: String(student.CPF).padStart(11, '0'),
      curso: student.Curso,
      financeiro: normalizeStatus(student.Financeiro),
      avaliacao: normalizeStatus(student.Avaliação),
      tempoMinimo: normalizeStatus(student["Tempo mínimo"]),
      documentos: normalizeStatus(student.Documentos),
      disciplinasCompletas: disciplinas.numerator,
      disciplinasTotal: disciplinas.denominator,
      disciplinasPercentual: disciplinas.percentage,
      cobrancasPagas: cobrancas.numerator,
      cobrancasTotal: cobrancas.denominator,
      cobrancasPercentual: cobrancas.percentage,
      statusInscricao: student["Status Inscrição"],
      dataInicio: parseDate(student["Data Início"]),
      dataSolicDigital: parseDate(student["Data Solic. Digital"]),
      tipoCartDigital: student["Tipo Cert. Digital"],
      statusCartDigital: student["Status Cert. Digital"],
      dataSolicImpresso: parseDate(student["Data Solic. Impresso"]),
      tipoCartImpresso: student["Tipo Cert. Impresso"],
      statusCartImpresso: student["Status Cert. Impresso"],
      turma: student.Turma,
      inadimplenciaCategoria: categorizeInadimplencia(cobrancas.percentage),
    };
  });
}

export function calculateMetrics(students: ProcessedStudent[]) {
  const total = students.length;
  const emDia = students.filter(s => s.inadimplenciaCategoria === "Em dia").length;
  const documentosOK = students.filter(s => s.documentos === "OK").length;
  
  const progressoMedio = total > 0 
    ? students.reduce((sum, s) => sum + s.disciplinasPercentual, 0) / total 
    : 0;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const solicitacoes7d = students.filter(s => 
    (s.dataSolicDigital && s.dataSolicDigital >= sevenDaysAgo) ||
    (s.dataSolicImpresso && s.dataSolicImpresso >= sevenDaysAgo)
  ).length;

  const solicitacoes30d = students.filter(s => 
    (s.dataSolicDigital && s.dataSolicDigital >= thirtyDaysAgo) ||
    (s.dataSolicImpresso && s.dataSolicImpresso >= thirtyDaysAgo)
  ).length;

  const solicitacoes90d = students.filter(s => 
    (s.dataSolicDigital && s.dataSolicDigital >= ninetyDaysAgo) ||
    (s.dataSolicImpresso && s.dataSolicImpresso >= ninetyDaysAgo)
  ).length;

  return {
    totalAlunos: total,
    percentualEmDia: total > 0 ? (emDia / total) * 100 : 0,
    progressoMedioDisciplinas: progressoMedio,
    documentosCompletos: documentosOK,
    ultimaAtualizacao: new Date(),
    solicitacoesCertificados7d: solicitacoes7d,
    solicitacoesCertificados30d: solicitacoes30d,
    solicitacoesCertificados90d: solicitacoes90d,
  };
}