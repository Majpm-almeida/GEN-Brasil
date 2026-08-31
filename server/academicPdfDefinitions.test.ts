import { casePdfDocument, rulesPdfDocument, toPdfFilename } from "../shared/academicPdfDefinitions";
import { describe, expect, it } from "vitest";

describe("definições dos PDFs acadêmicos", () => {
  it("prepara o Caso de Estudo com conteúdo, tabelas e nome de arquivo PDF", () => {
    const document = casePdfDocument();

    expect(document.filename).toMatch(/\.pdf$/);
    expect(document.sections[0]?.paragraphs.length).toBeGreaterThan(0);
    expect(document.tables).toHaveLength(3);
    expect(toPdfFilename("Minerais Críticos, Autonomia e Poder Nacional")).toBe("minerais-criticos-autonomia-e-poder-nacional");
  });

  it("prepara as regras com texto metodológico e as duas tabelas de consulta", () => {
    const document = rulesPdfDocument();

    expect(document.filename).toBe("GEN-Brasil_regras-de-utilizacao-do-caso.pdf");
    expect(document.sections).toHaveLength(3);
    expect(document.tables).toHaveLength(2);
  });
});
