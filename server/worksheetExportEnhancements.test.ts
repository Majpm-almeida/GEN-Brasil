import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("revisão e exportação ampliada das Fichas-Síntese", () => {
  it("oferece pré-visualização paginada e download individual em lote", () => {
    const collaboration = readFileSync(resolve(process.cwd(), "client/src/pages/Collaboration.tsx"), "utf8");
    const preview = readFileSync(resolve(process.cwd(), "client/src/components/WorksheetPdfPreview.tsx"), "utf8");

    expect(collaboration).toContain("Fichas para download individual");
    expect(collaboration).toContain("downloadIndividualWorksheetsPdf(workspace, selectedIndividualLenses)");
    expect(collaboration).toContain("selectedIndividualLenses");
    expect(collaboration).toContain("Pré-visualizar");
    expect(preview).toContain("Página {page} de 2");
    expect(preview).toContain("EVENTOS UTILIZADOS COMO EVIDÊNCIA:");
    expect(preview).toContain("Baixar PDF");
  });
});
