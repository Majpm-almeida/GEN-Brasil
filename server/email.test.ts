import { describe, expect, it } from "vitest";
import { buildManagerRequestEmail, buildWelcomeApprovalEmail, normalizeEmailFrom } from "./email";

describe("mensagens transacionais do GEN-Brasil", () => {
  it("normaliza o remetente codificado pelo armazenamento seguro", () => {
    expect(normalizeEmailFrom("GEN-Brasil \\u003cacesso@magnavis.shop\\u003e")).toBe("GEN-Brasil <acesso@magnavis.shop>");
  });

  it("prepara a mensagem de solicitação para o gestor", () => {
    const message = buildManagerRequestEmail({ name: "Maria Silva", email: "maria@exemplo.com", approvalUrl: "https://gen-brasil.manus.space/administracao" });
    expect(message.subject).toContain("solicitação");
    expect(message.html).toContain("Maria Silva");
    expect(message.html).toContain("Revisar solicitação");
  });

  it("prepara o e-mail de boas-vindas com o botão de acesso", () => {
    const message = buildWelcomeApprovalEmail({ name: "Maria Silva", siteUrl: "https://gen-brasil.manus.space" });
    expect(message.subject).toContain("acesso aprovado");
    expect(message.html).toContain("Acessar GEN-Brasil");
    expect(message.html).toContain("https://gen-brasil.manus.space");
  });
});
