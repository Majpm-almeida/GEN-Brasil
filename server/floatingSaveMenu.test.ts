import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("acionador flutuante de salvamento", () => {
  it("reúne salvamento, finalização e interações por mouse e teclado", () => {
    const component = readFileSync(resolve(process.cwd(), "client/src/components/FloatingSaveMenu.tsx"), "utf8");

    expect(component).toContain("const scheduleClose = (delay = 360)");
    expect(component).toContain("onMouseLeave={() => scheduleClose()}");
    expect(component).toContain("cancelScheduledClose(); setOpen(true);");
    expect(component).toContain("onFocusCapture={() => { cancelScheduledClose(); setOpen(true); }}");
    expect(component).toContain('event.key === "Escape"');
    expect(component).toContain("Salvar rascunho");
    expect(component).toContain("aria-label=\"Abrir ações de salvamento\"");
  });

  it("substitui as barras fixas nas Fichas-Síntese e na Síntese e slides", () => {
    const worksheetEditor = readFileSync(resolve(process.cwd(), "client/src/components/WorksheetEditorEnhanced.tsx"), "utf8");
    const synthesisEditor = readFileSync(resolve(process.cwd(), "client/src/components/SynthesisEditorEnhanced.tsx"), "utf8");

    expect(worksheetEditor).toContain("<FloatingSaveMenu");
    expect(worksheetEditor).toContain('finalLabel="Finalizar ficha"');
    expect(synthesisEditor).toContain("<FloatingSaveMenu");
    expect(synthesisEditor).toContain('finalLabel="Finalizar síntese"');
  });
});
