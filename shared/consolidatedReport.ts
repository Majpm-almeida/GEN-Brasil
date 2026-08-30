import { lenses, type WorksheetLens } from "./exercise";

export const reportLensOrder: WorksheetLens[] = ["guerra_hibrida", "lawfare", "seguranca_transnacional"];

export type ReportAppendix = {
  title: string;
  kind: "worksheet_matrix" | "integration_matrix";
  lens?: WorksheetLens;
};

export function buildReportAppendices(input: { worksheets: Array<{ lens: WorksheetLens; includeAsAppendix?: boolean | null }>; synthesis?: { includeMatrixAsAppendix?: boolean | null } | null }): ReportAppendix[] {
  const worksheetAppendices = reportLensOrder.flatMap(lens => {
    const worksheet = input.worksheets.find(item => item.lens === lens);
    return worksheet?.includeAsAppendix ? [{ title: `Matriz de Teste — ${lenses[lens].label}`, kind: "worksheet_matrix" as const, lens }] : [];
  });
  return input.synthesis?.includeMatrixAsAppendix
    ? [...worksheetAppendices, { title: "Matriz de Integração", kind: "integration_matrix" as const }]
    : worksheetAppendices;
}

export function reportReadiness(input: { worksheets: Array<{ lens: WorksheetLens; status?: string | null }>; synthesis?: { status?: string | null } | null }) {
  const finalizedWorksheets = reportLensOrder.filter(lens => input.worksheets.find(item => item.lens === lens)?.status === "versao_final").length;
  const synthesisFinalized = input.synthesis?.status === "versao_final";
  return {
    finalizedWorksheets,
    synthesisFinalized,
    complete: finalizedWorksheets === reportLensOrder.length && synthesisFinalized,
  };
}
