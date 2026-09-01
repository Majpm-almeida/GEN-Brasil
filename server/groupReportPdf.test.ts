import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Relatório do GT em PDF", () => {
  it("delega a composição às Fichas-Síntese selecionadas", () => {
    const renderer = readFileSync(resolve(process.cwd(), "client/src/lib/groupReportPdfDownload.ts"), "utf8");

    expect(renderer).toContain("downloadSelectedWorksheetsPdf");
    expect(renderer).toContain("selectedLenses: WorksheetLens[]");
    expect(renderer).toContain("await downloadSelectedWorksheetsPdf(workspace, selectedLenses)");
  });

  it("mantém a seleção explícita antes do download", () => {
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/ConsolidatedReport.tsx"), "utf8");

    expect(page).toContain("downloadGroupReportPdf(workspace, selectedWorksheetLenses)");
    expect(page).toContain("reportLensOrder.map(lens => <label");
    expect(page).toContain("Selecione ao menos uma Ficha-Síntese para gerar o relatório em PDF.");
  });
});
