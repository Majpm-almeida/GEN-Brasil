import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getFirestore: vi.fn(),
  buildManagerRequestEmail: vi.fn(),
  sendTransactionalEmail: vi.fn(),
}));

vi.mock("./_core/env", () => ({ ENV: { managerEmail: "gestor@example.com" } }));
vi.mock("./_core/firebaseAdmin", () => ({ getFirebaseFirestore: mocks.getFirestore }));
vi.mock("./email", () => ({ buildManagerRequestEmail: mocks.buildManagerRequestEmail, buildWelcomeApprovalEmail: vi.fn(), sendTransactionalEmail: mocks.sendTransactionalEmail }));

import { resendAccessRequestNotification } from "./accessStore";

describe("reenvio de notificação de acesso", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.buildManagerRequestEmail.mockReturnValue({ subject: "Solicitação", html: "<p>Revisar</p>" });
    mocks.sendTransactionalEmail.mockResolvedValue({ sent: true, id: "mail_123" });
  });

  it("reenvia ao gestor somente uma solicitação pendente usando o domínio público informado", async () => {
    const get = vi.fn().mockResolvedValue({ exists: true, data: () => ({ uid: "usuario-1", name: "Participante", email: "participante@example.com", status: "pending" }) });
    mocks.getFirestore.mockReturnValue({ collection: () => ({ doc: () => ({ get }) }) });

    const result = await resendAccessRequestNotification("usuario-1", "https://genbrasil.manus.space");

    expect(mocks.buildManagerRequestEmail).toHaveBeenCalledWith({ name: "Participante", email: "participante@example.com", approvalUrl: "https://genbrasil.manus.space/administracao" });
    expect(mocks.sendTransactionalEmail).toHaveBeenCalledWith({ to: "gestor@example.com", subject: "Solicitação", html: "<p>Revisar</p>" });
    expect(result).toEqual({ sent: true, id: "mail_123" });
  });

  it("bloqueia o reenvio de uma solicitação que já foi aprovada", async () => {
    const get = vi.fn().mockResolvedValue({ exists: true, data: () => ({ uid: "usuario-1", status: "approved" }) });
    mocks.getFirestore.mockReturnValue({ collection: () => ({ doc: () => ({ get }) }) });

    await expect(resendAccessRequestNotification("usuario-1", "https://genbrasil.manus.space")).rejects.toThrow("Somente solicitações pendentes");
    expect(mocks.sendTransactionalEmail).not.toHaveBeenCalled();
  });
});
