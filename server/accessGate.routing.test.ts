import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("navegação após aprovação de acesso", () => {
  it("não redireciona usuários aprovados para a Visão Geral", async () => {
    const source = await readFile(new URL("../client/src/pages/AccessGate.tsx", import.meta.url), "utf8");

    expect(source).not.toContain('setLocation("/")');
    expect(source).toContain('if (access.data?.status === "approved") return <>{children}</>;');
  });
});
