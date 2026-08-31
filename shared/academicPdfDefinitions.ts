import { caseContext, caseDescription, exerciseRules } from "./exercise";

export type AcademicPdfTable = {
  title: string;
  headers: string[];
  rows: string[][];
};

export type AcademicPdfDocument = {
  filename: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: Array<{ heading?: string; paragraphs: string[] }>;
  tables: AcademicPdfTable[];
};

export function toPdfFilename(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function casePdfDocument(): AcademicPdfDocument {
  return {
    filename: `GEN-Brasil_${toPdfFilename(caseContext.title)}.pdf`,
    eyebrow: "GEN-Brasil · Jornada Acadêmica CSD 2026",
    title: caseContext.title,
    subtitle: "Caso Único da Semana · Coletânea CSD 2026 · Semana 04",
    sections: [{ paragraphs: [...caseDescription.strategicContext] }],
    tables: [
      {
        title: "Conjuntura de atores reais em 2026",
        headers: ["Ator real", "Papel público na conjuntura do caso"],
        rows: caseDescription.realActors.map(row => [...row]),
      },
      {
        title: "Quadro funcional brasileiro",
        headers: ["Ator / estrutura", "Função relevante para o exercício"],
        rows: caseDescription.brazilianFramework.map(row => [...row]),
      },
      {
        title: "Atores operacionais fictícios do caso",
        headers: ["Ator fictício", "Caracterização para o exercício"],
        rows: caseDescription.fictionalActors.map(row => [...row]),
      },
    ],
  };
}

export function rulesPdfDocument(): AcademicPdfDocument {
  return {
    filename: "GEN-Brasil_regras-de-utilizacao-do-caso.pdf",
    eyebrow: "GEN-Brasil · Referência metodológica",
    title: "Regras de utilização do caso",
    subtitle: "Coletânea CSD 2026 · Semana 04",
    sections: [
      { heading: "Regras de separação entre realidade e hipótese", paragraphs: [...exerciseRules.separation] },
      { heading: "Como utilizar os eventos hipotéticos", paragraphs: [...exerciseRules.useEvents] },
      { heading: "Nota metodológica", paragraphs: [exerciseRules.note] },
    ],
    tables: [
      {
        title: "Etapas de utilização do caso",
        headers: ["Etapa", "Função no exercício", "Pergunta prática"],
        rows: exerciseRules.stages.map(row => [...row]),
      },
      {
        title: "Mapa de uso dos eventos hipotéticos ao longo da semana por lente",
        headers: ["Dia / lente", "Eventos prioritários", "Como utilizar"],
        rows: exerciseRules.lensMap.map(row => [...row]),
      },
    ],
  };
}
