import { describe, expect, it } from "vitest";
import { searchCaseEvents } from "../shared/caseSearch";

describe("searchCaseEvents", () => {
  it("finds events by number, title, evidence and limitation without accent sensitivity", () => {
    expect(searchCaseEvents("evento 4").map(event => event.id)).toContain(4);
    expect(searchCaseEvents("criminalidade transnacional").map(event => event.id)).toContain(5);
    expect(searchCaseEvents("credenciais de um gerente").map(event => event.id)).toContain(1);
    expect(searchCaseEvents("nexo causal").map(event => event.id)).toContain(1);
  });

  it("returns the complete event list when the search is empty", () => {
    expect(searchCaseEvents(" ")).toHaveLength(8);
  });
});
