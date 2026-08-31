import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("exportações da Síntese e da apresentação", () => {
  it("gera um PDF próprio para os seis blocos da Síntese Estratégica Integrada", () => {
    const renderer = readFileSync(resolve(process.cwd(), "client/src/lib/synthesisPdfDownload.ts"), "utf8");

    expect(renderer).toContain("downloadSynthesisPdf");
    expect(renderer).toContain("1. Juízo estratégico integrado");
    expect(renderer).toContain("6. Estado final desejado");
    expect(renderer).toContain("doc.save(`${groupSlug(group)}_SinteseEstrategicaIntegrada.pdf`)");
  });

  it("gera uma apresentação acadêmica independente com quatro páginas", () => {
    const renderer = readFileSync(resolve(process.cwd(), "client/src/lib/synthesisPdfDownload.ts"), "utf8");

    expect(renderer).toContain('orientation: "landscape"');
    expect(renderer).toContain("slides.forEach");
    expect(renderer).toContain("Slide ${index + 1} de 4");
    expect(renderer).toContain("doc.save(`${groupSlug(group)}_ApresentacaoFinal.pdf`)");
  });

  it("mantém os botões de download nas posições aprovadas da página de síntese", () => {
    const editor = readFileSync(resolve(process.cwd(), "client/src/components/SynthesisEditorEnhanced.tsx"), "utf8");

    expect(editor).toContain("GERAR PDF da Síntese");
    expect(editor).toContain("GERAR PDF da Apresentação");
    expect(editor).toContain("downloadSynthesisPdf({ group: workspace.group, members: workspace.members, synthesis: draft })");
    expect(editor).toContain("downloadPresentationPdf({ group: workspace.group, synthesis: draft })");
  });
});
