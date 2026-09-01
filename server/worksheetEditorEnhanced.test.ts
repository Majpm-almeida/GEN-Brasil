import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("editor aprimorado de Fichas-Síntese", () => {
  it("oferece os campos aprovados e mantém os eventos decisivos condicionados às evidências mobilizadas", () => {
    const editor = readFileSync(resolve(process.cwd(), "client/src/components/WorksheetEditorEnhanced.tsx"), "utf8");

    expect(editor).toContain("Eventos decisivos");
    expect(editor).toContain("Selecione somente entre os eventos já mobilizados");
    expect(editor).toContain("Aplicação aos eventos");
    expect(editor).toContain("Teste de suficiência");
    expect(editor).toContain("analyticResultOptions.map");
    expect(editor).toContain("decisiveEventIds: current.decisiveEventIds.filter(id => selectedEventIds.includes(id))");
    expect(editor).toContain("getWorksheetPdfFit(draft)");
    expect(editor).toContain("Extensão excedida:");
    expect(editor).toContain("ultrapassarão uma página no PDF");
    expect(editor).toContain("Faixa: 70–130");
    expect(editor).toContain("Faixa equilibrada");
  });
});
