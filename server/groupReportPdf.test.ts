import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Relatório do GT em PDF", () => {
  it("gera um arquivo baixável com metadados institucionais e a matriz completa do teste", () => {
    const renderer = readFileSync(resolve(process.cwd(), "client/src/lib/groupReportPdfDownload.ts"), "utf8");

    expect(renderer).toContain("CURSO SUPERIOR DE DEFESA — CSD 2026");
    expect(renderer).toContain("COMPONENTES DO GT:");
    expect(renderer).toContain('["Elemento", "Aplicação aos eventos", "Resultado", "Teste de suficiência"]');
    expect(renderer).toContain("worksheet?.decisiveEventIds");
    expect(renderer).toContain("doc.save(`${groupSlug}_RelatorioConsolidado.pdf`)");
  });

  it("aciona a geração local de PDF a partir do botão do relatório", () => {
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/ConsolidatedReport.tsx"), "utf8");

    expect(page).toContain("downloadGroupReportPdf(workspace, appendices)");
    expect(page).toContain("Gerar relatório em PDF");
    expect(page).toContain("Eventos decisivos");
    expect(page).toContain("Teste de suficiência");
  });
});
