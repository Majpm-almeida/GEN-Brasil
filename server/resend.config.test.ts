import { describe, expect, it } from "vitest";
import { normalizeEmailFrom } from "./email";

describe("configuração do e-mail transacional", () => {
  it("autentica no Resend com a permissão restrita de envio", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    const sender = process.env.EMAIL_FROM;

    expect(apiKey).toBeTruthy();
    expect(normalizeEmailFrom(sender ?? "")).toBe("GEN-Brasil <acesso@magnavis.shop>");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: "{}",
    });

    // Uma chave com permissão somente de envio não pode listar domínios. Uma
    // requisição sem destinatário é rejeitada pelo conteúdo, mas não pela credencial.
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });
});
