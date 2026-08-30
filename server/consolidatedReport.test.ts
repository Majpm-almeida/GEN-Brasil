import { describe, expect, it } from "vitest";
import { buildReportAppendices, reportReadiness } from "../shared/consolidatedReport";

describe("relatório consolidado do GT", () => {
  const worksheets = [
    { lens: "guerra_hibrida" as const, status: "versao_final", includeAsAppendix: true },
    { lens: "lawfare" as const, status: "versao_final", includeAsAppendix: false },
    { lens: "seguranca_transnacional" as const, status: "versao_final", includeAsAppendix: true },
  ];

  it("inclui somente as matrizes expressamente selecionadas como anexos", () => {
    expect(buildReportAppendices({ worksheets, synthesis: { includeMatrixAsAppendix: true } })).toEqual([
      { title: "Matriz de Teste — Guerra Híbrida", kind: "worksheet_matrix", lens: "guerra_hibrida" },
      { title: "Matriz de Teste — Segurança Transnacional", kind: "worksheet_matrix", lens: "seguranca_transnacional" },
      { title: "Matriz de Integração", kind: "integration_matrix" },
    ]);
  });

  it("sinaliza prontidão apenas quando as três fichas e a síntese estão finalizadas", () => {
    expect(reportReadiness({ worksheets, synthesis: { status: "versao_final" } })).toEqual({ finalizedWorksheets: 3, synthesisFinalized: true, complete: true });
    expect(reportReadiness({ worksheets: worksheets.slice(0, 2), synthesis: { status: "rascunho" } }).complete).toBe(false);
  });
});
