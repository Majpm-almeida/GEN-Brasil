import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getFirestore: vi.fn(),
  buildManagerRequestEmail: vi.fn(),
  sendTransactionalEmail: vi.fn(),
}));

vi.mock("./_core/env", () => ({ ENV: { managerEmail: "gestor@example.com" } }));
vi.mock("./_core/firebaseAdmin", () => ({ getFirebaseFirestore: mocks.getFirestore }));
vi.mock("./email", () => ({ buildManagerRequestEmail: mocks.buildManagerRequestEmail, buildWelcomeApprovalEmail: vi.fn(), sendTransactionalEmail: mocks.sendTransactionalEmail }));

import { resendAccessRequestNotification, revokeAccessRequest } from "./accessStore";

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

  it("marca o acesso como revogado sem apagar a solicitação original", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const get = vi.fn().mockResolvedValue({ exists: true, data: () => ({ uid: "usuario-1", name: "Participante", email: "participante@example.com", status: "approved", requestedAt: "2026-08-30T00:00:00.000Z" }) });
    mocks.getFirestore.mockReturnValue({ collection: () => ({ doc: () => ({ get, update }) }) });

    const result = await revokeAccessRequest({ uid: "usuario-1", name: "Participante", email: "participante@example.com" }, "gestor@example.com");

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ status: "revoked", revokedBy: "gestor@example.com" }));
    expect(result).toMatchObject({ uid: "usuario-1", status: "revoked", revokedBy: "gestor@example.com" });
  });

  it("cria um registro revogado para preservar a trilha de uma conta sem solicitação prévia", async () => {
    const set = vi.fn().mockResolvedValue(undefined);
    const get = vi.fn().mockResolvedValue({ exists: false });
    mocks.getFirestore.mockReturnValue({ collection: () => ({ doc: () => ({ get, set }) }) });

    const result = await revokeAccessRequest({ uid: "legado-1", name: "Conta legada", email: "legado@example.com" }, "gestor@example.com");

    expect(set).toHaveBeenCalledWith(expect.objectContaining({ uid: "legado-1", status: "revoked", email: "legado@example.com" }));
    expect(result).toMatchObject({ uid: "legado-1", status: "revoked" });
  });
});
