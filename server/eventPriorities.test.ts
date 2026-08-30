import { describe, expect, it } from "vitest";
import { getEventPriorityContext } from "../shared/eventPriorities";

describe("event priorities by GT mission axis", () => {
  it("maps each analytical axis to the event priorities established in the exercise", () => {
    expect(getEventPriorityContext("GH / atribuição")).toMatchObject({ lens: "guerra_hibrida", eventIds: [1, 2, 3, 6, 7, 8] });
    expect(getEventPriorityContext("Lawfare / legitimidade")).toMatchObject({ lens: "lawfare", eventIds: [4, 2, 3, 8] });
    expect(getEventPriorityContext("Seg. Transnacional")).toMatchObject({ lens: "seguranca_transnacional", eventIds: [5, 1, 6] });
  });

  it("marks every event as usable for Grande Estratégia without treating the list as closed", () => {
    const context = getEventPriorityContext("Grande Estratégia");
    expect(context.lens).toBe("integracao");
    expect(context.eventIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(context.badgeLabel).toBe("Integração");
  });
});
