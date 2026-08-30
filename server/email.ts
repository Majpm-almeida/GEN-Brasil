export function normalizeEmailFrom(value: string) {
  return value.replace(/\\u003c/g, "<").replace(/\\u003e/g, ">");
}

type EmailInput = { to: string; subject: string; html: string };

function linkButton(url: string, label: string) {
  return `<a href="${url}" style="display:inline-block;background:#123148;color:#ffffff;padding:13px 20px;border-radius:8px;font:600 14px Arial,sans-serif;text-decoration:none">${label}</a>`;
}

export function buildManagerRequestEmail(input: { name: string | null; email: string | null; approvalUrl: string }) {
  const identity = input.name || input.email || "Um novo participante";
  return {
    subject: "GEN-Brasil — nova solicitação de acesso",
    html: `<main style="max-width:640px;margin:0 auto;padding:32px;font-family:Arial,sans-serif;color:#173448"><p style="font-size:12px;font-weight:700;letter-spacing:1.5px;color:#98732a">GEN-BRASIL · CSD 2026</p><h1 style="font-family:Georgia,serif;font-size:29px">Nova solicitação de acesso</h1><p><strong>${identity}</strong> solicitou acesso à jornada acadêmica do caso <em>“Minerais Críticos, Autonomia e Poder Nacional”</em>.</p><p>Abra o painel de administração para revisar e aprovar o acesso da conta Google registrada.</p>${linkButton(input.approvalUrl, "Revisar solicitação")}</main>`,
  };
}

export function buildWelcomeApprovalEmail(input: { name: string | null; siteUrl: string }) {
  const firstName = input.name?.trim().split(" ")[0] || "participante";
  return {
    subject: "Bem-vindo(a) ao GEN-Brasil — acesso aprovado",
    html: `<main style="max-width:640px;margin:0 auto;padding:32px;font-family:Arial,sans-serif;color:#173448"><p style="font-size:12px;font-weight:700;letter-spacing:1.5px;color:#98732a">GEN-BRASIL · CSD 2026</p><h1 style="font-family:Georgia,serif;font-size:29px">Bem-vindo(a), ${firstName}.</h1><p>Sua solicitação de acesso foi aprovada pela coordenação. Você já pode entrar na jornada de análise estratégica do GEN-Brasil.</p><p>Na plataforma, seu Grupo de Trabalho poderá consultar o caso, aplicar as lentes analíticas e estruturar a Síntese Estratégica Integrada.</p>${linkButton(input.siteUrl, "Acessar GEN-Brasil")}</main>`,
  };
}

export async function sendTransactionalEmail(input: EmailInput) {
  const { ENV } = await import("./_core/env");
  if (!ENV.resendApiKey || !ENV.emailFrom) return { sent: false as const, reason: "not_configured" as const };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${ENV.resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: normalizeEmailFrom(ENV.emailFrom), to: [input.to], subject: input.subject, html: input.html }),
  });
  if (!response.ok) {
    console.error("[Email] Resend recusou a mensagem", response.status, await response.text());
    return { sent: false as const, reason: "rejected" as const };
  }
  const result = await response.json() as { id?: string };
  return { sent: true as const, id: result.id ?? null };
}
