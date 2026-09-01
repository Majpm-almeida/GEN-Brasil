import { describe, expect, it } from "vitest";
import { countWords, getWorksheetTextDistribution } from "../client/src/lib/worksheetTextMetrics";

describe("métricas textuais da Ficha-Síntese", () => {
  it("conta palavras ignorando espaços excedentes", () => {
    expect(countWords("  análise   estratégica  integrada ")).toBe(3);
    expect(countWords(" ")).toBe(0);
  });

  it("aponta distribuição equilibrada quando os cinco parágrafos possuem volume semelhante", () => {
    const text = Array.from({ length: 80 }, () => "evidência").join(" ");
    const metrics = getWorksheetTextDistribution({ centralJudgment: text, evidenceBasis: text, limitsAndAlternatives: text, clarificationNeeded: text, integrationInput: text });

    expect(metrics.total).toBe(400);
    expect(metrics.allStarted).toBe(true);
    expect(metrics.balanced).toBe(true);
  });
});
