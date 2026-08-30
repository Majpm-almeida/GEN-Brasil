import { describe, expect, it } from "vitest";
import { caseDescription, caseEvents, exerciseRules } from "../shared/exercise";

describe("conteúdo integral da base do exercício", () => {
  it("mantém os oito eventos com informação e limite de evidência completos", () => {
    expect(caseEvents).toHaveLength(8);
    const expectedFragments = [
      ["Entre junho e agosto de 2026", "A coincidência temporal com negociações internacionais não demonstra nexo causal."],
      ["influenciadores e páginas sediadas fora do Brasil", "operação de influência coordenada."],
      ["propriedade intelectual, garantias de fornecimento", "eventual instrumentalização de outros meios."],
      ["especialistas independentes", "litigância estratégica legítima e possível instrumentalização."],
      ["hubs logísticos usados também por atividades lícitas", "uso instrumental por ator estatal."],
      ["Nenhum episódio causa paralisação prolongada", "exploração efetivamente demonstrada."],
      ["quadro comum de indicadores", "pode aumentar tempo de resposta e dificultar atribuição."],
      ["visibilidade estratégica do setor mineral brasileiro", "o que não se sustenta com as evidências disponíveis."],
    ] as const;

    expectedFragments.forEach(([evidenceFragment, limitationFragment], index) => {
      expect(caseEvents[index]?.evidence).toContain(evidenceFragment);
      expect(caseEvents[index]?.limitation).toContain(limitationFragment);
    });
  });

  it("oferece o caso completo e as três referências metodológicas solicitadas", () => {
    expect(caseDescription.strategicContext).toHaveLength(4);
    expect(caseDescription.realActors).toHaveLength(7);
    expect(caseDescription.fictionalActors).toHaveLength(6);
    expect(exerciseRules.separation).toHaveLength(2);
    expect(exerciseRules.stages).toHaveLength(6);
    expect(exerciseRules.lensMap).toHaveLength(4);
  });
});
