import { describe, expect, it } from "vitest";
import { caseEvents, classificationOptions, lenses, missions } from "../shared/exercise";
import { canRegisterSubmission, isSynthesisComplete, isWorksheetComplete } from "../shared/validation";
import { buildAppendixManifest } from "../shared/appendices";

describe("base acadêmica do exercício", () => {
  it("preserva os oito eventos hipotéticos e as três lentes obrigatórias", () => {
    expect(caseEvents).toHaveLength(8);
    expect(Object.values(lenses).map(lens => lens.label)).toEqual([
      "Guerra Híbrida", "Lawfare", "Segurança Transnacional",
    ]);
  });

  it("mantém as classificações e as missões para os 16 GTs", () => {
    expect(classificationOptions).toContain("HIPÓTESE PLAUSÍVEL, MAS NÃO CONFIRMADA");
    expect(missions).toHaveLength(16);
    expect(missions[0]?.code).toBe("GT 01");
    expect(missions[15]?.code).toBe("GT 16");
  });
});

describe("validação de produtos acadêmicos", () => {
  const worksheet = {
    classification: "CARACTERIZADO",
    centralJudgment: "Juízo central.",
    evidenceBasis: "Fundamentação.",
    limitsAndAlternatives: "Limites.",
    clarificationNeeded: "Esclarecimentos.",
    integrationInput: "Insumo para integração.",
  };
  const synthesis = {
    strategicJudgment: "Juízo integrado.", lensResults: "Resultados.", connectionsAndLimits: "Limites.",
    missionResponse: "Resposta à missão.", recommendations: "Recomendações.", desiredEndState: "Estado final.",
    slideOne: "Slide 1.", slideTwo: "Slide 2.", slideThree: "Slide 3.", slideFour: "Slide 4.",
  };

  it("exige classificação e cinco parágrafos para finalizar uma ficha", () => {
    expect(isWorksheetComplete(worksheet)).toBe(true);
    expect(isWorksheetComplete({ ...worksheet, clarificationNeeded: "  " })).toBe(false);
    expect(isWorksheetComplete({ ...worksheet, classification: null })).toBe(false);
  });

  it("exige os seis blocos e os quatro slides para finalizar a síntese", () => {
    expect(isSynthesisComplete(synthesis)).toBe(true);
    expect(isSynthesisComplete({ ...synthesis, slideThree: "" })).toBe(false);
  });

  it("permite registrar submissão somente após produto finalizado e checklist", () => {
    expect(canRegisterSubmission("submetido", true, true)).toBe(true);
    expect(canRegisterSubmission("submetido", false, true)).toBe(false);
    expect(canRegisterSubmission("versao_final", true, true)).toBe(false);
  });

  it("inclui apenas as matrizes selecionadas como anexos do relatório final", () => {
    expect(buildAppendixManifest({
      guerraHibrida: true,
      lawfare: false,
      segurancaTransnacional: true,
      matrizIntegracao: false,
    })).toEqual([
      "Matriz de Teste — Guerra Híbrida",
      "Matriz de Teste — Segurança Transnacional",
    ]);
  });
});
