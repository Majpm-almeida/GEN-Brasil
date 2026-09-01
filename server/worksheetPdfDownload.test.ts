import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Ficha-Síntese em PDF", () => {
  it("compõe capa institucional e corpo de página única", () => {
    const renderer = readFileSync(resolve(process.cwd(), "client/src/lib/worksheetPdfDownload.ts"), "utf8");

    expect(renderer).toContain("ESCOLA SUPERIOR DE GUERRA (ESG)");
    expect(renderer).toContain("CURSO SUPERIOR DE DEFESA - CSD 2026");
    expect(renderer).toContain("ATIVIDADE INTEGRADORA");
    expect(renderer).toContain("Rio de Janeiro/RJ");
    expect(renderer).toContain("EVENTOS UTILIZADOS COMO EVIDÊNCIA:");
    expect(renderer).toContain("drawCover(doc, workspace, worksheet, lensId, brasao)");
    expect(renderer).toContain("drawBody(doc, worksheet)");
  });

  it("calcula a ocupação dos cinco parágrafos e bloqueia a exportação quando extrapolada", () => {
    const renderer = readFileSync(resolve(process.cwd(), "client/src/lib/worksheetPdfDownload.ts"), "utf8");

    expect(renderer).toContain("export function getWorksheetPdfFit");
    expect(renderer).toContain("usedHeight <= availableHeight");
    expect(renderer).toContain("O texto da Ficha-Síntese ultrapassa a capacidade de uma página no PDF.");
  });

  it("permite baixar as fichas disponíveis em arquivos individuais a partir de uma única ação", () => {
    const renderer = readFileSync(resolve(process.cwd(), "client/src/lib/worksheetPdfDownload.ts"), "utf8");

    expect(renderer).toContain("downloadIndividualWorksheetsPdf");
    expect(renderer).toContain("availableLenses.forEach");
    expect(renderer).toContain("Fichas-Síntese salvas para download individual");
  });
});
