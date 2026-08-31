import { analyticResultOptions } from "../shared/exercise";
import { hasCompleteCriterionResults } from "../shared/validation";
import { describe, expect, it } from "vitest";

describe("resultados do teste analítico", () => {
  it("mantém as quatro gradações aprovadas para cada critério", () => {
    expect(analyticResultOptions).toEqual(["Satisfeito", "Parcial", "Não satisfeito", "Insuficiente"]);
  });

  it("exige um resultado válido para todos os critérios da lente antes da finalização", () => {
    expect(hasCompleteCriterionResults("guerra_hibrida", JSON.stringify({
      pluralidade: "Satisfeito",
      vulnerabilidades: "Parcial",
      sincronizacao: "Não satisfeito",
      objetivo: "Insuficiente",
      atribuicao: "Satisfeito",
    }))).toBe(true);
    expect(hasCompleteCriterionResults("guerra_hibrida", JSON.stringify({ pluralidade: "Satisfeito" }))).toBe(false);
    expect(hasCompleteCriterionResults("guerra_hibrida", JSON.stringify({
      pluralidade: "Satisfeito",
      vulnerabilidades: "Parcial",
      sincronizacao: "Indefinido",
      objetivo: "Insuficiente",
      atribuicao: "Satisfeito",
    }))).toBe(false);
  });
});
