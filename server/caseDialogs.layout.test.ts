import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("janelas de consulta da Base do caso", () => {
  it("usa largura dinâmica ampla e conteúdo rolável para o caso e as regras", async () => {
    const source = await readFile(new URL("../client/src/components/CaseLibraryEnhanced.tsx", import.meta.url), "utf8");

    expect(source).toContain("const wideConsultationDialog");
    expect(source).toContain("sm:max-w-none");
    expect(source).toContain("lg:w-[min(94vw,86rem)]");
    expect(source).toContain("2xl:w-[min(90vw,96rem)]");
    expect(source).toContain("<ScrollArea className=\"min-h-0 max-h-[70vh]\"><Tabs");
  });
});
