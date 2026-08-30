import { describe, expect, it } from "vitest";
import { canEnterPlatform, initialAccessStatus } from "./accessPolicy";

describe("política de aprovação de acesso", () => {
  it("aprova automaticamente apenas a conta configurada do gestor", () => {
    expect(initialAccessStatus("tenpm.almeida@gmail.com", "tenpm.almeida@gmail.com")).toBe("approved");
    expect(initialAccessStatus("participante@exemplo.com", "tenpm.almeida@gmail.com")).toBe("pending");
  });

  it("libera a plataforma somente para solicitações aprovadas", () => {
    expect(canEnterPlatform("approved")).toBe(true);
    expect(canEnterPlatform("pending")).toBe(false);
    expect(canEnterPlatform("rejected")).toBe(false);
    expect(canEnterPlatform("revoked")).toBe(false);
  });
});
