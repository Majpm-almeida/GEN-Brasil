import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  getMembershipsForUser: vi.fn(),
  getGroupWorkspace: vi.fn(),
  setDeliverableStatus: vi.fn(),
}));

import * as db from "./db";
import { workspaceRouter } from "./routers/workspace";

function contextFor(role: "user" | "admin" = "user") {
  return {
    user: { id: 42, role },
    req: {},
    res: {},
  } as any;
}

const finalWorksheetWorkspace = {
  worksheets: [{ lens: "guerra_hibrida", status: "versao_final" }],
  synthesis: null,
};

describe("controle de acesso do espaço de trabalho", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.setDeliverableStatus).mockResolvedValue(undefined);
  });

  it("bloqueia a submissão de integrante sem papel de dirigente ou relator", async () => {
    vi.mocked(db.getMembershipsForUser).mockResolvedValue([{ groupId: 1, role: "integrante" }] as any);
    const caller = workspaceRouter.createCaller(contextFor());
    await expect(caller.setDeliverableStatus({ groupId: 1, type: "ficha_guerra_hibrida", status: "submetido", checklistConfirmed: true }))
      .rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("bloqueia o acesso a um GT ao qual o usuário não está vinculado", async () => {
    vi.mocked(db.getMembershipsForUser).mockResolvedValue([{ groupId: 2, role: "relator" }] as any);
    const caller = workspaceRouter.createCaller(contextFor());
    await expect(caller.setDeliverableStatus({ groupId: 1, type: "ficha_guerra_hibrida", status: "submetido", checklistConfirmed: true }))
      .rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("exige checklist confirmado antes de aceitar a submissão do relator", async () => {
    vi.mocked(db.getMembershipsForUser).mockResolvedValue([{ groupId: 1, role: "relator" }] as any);
    vi.mocked(db.getGroupWorkspace).mockResolvedValue(finalWorksheetWorkspace as any);
    const caller = workspaceRouter.createCaller(contextFor());
    await expect(caller.setDeliverableStatus({ groupId: 1, type: "ficha_guerra_hibrida", status: "submetido", checklistConfirmed: false }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("aceita a submissão do relator quando o conteúdo está finalizado e o checklist foi confirmado", async () => {
    vi.mocked(db.getMembershipsForUser).mockResolvedValue([{ groupId: 1, role: "relator" }] as any);
    vi.mocked(db.getGroupWorkspace).mockResolvedValue(finalWorksheetWorkspace as any);
    const caller = workspaceRouter.createCaller(contextFor());
    await expect(caller.setDeliverableStatus({ groupId: 1, type: "ficha_guerra_hibrida", status: "submetido", checklistConfirmed: true }))
      .resolves.toEqual({ success: true });
    expect(db.setDeliverableStatus).toHaveBeenCalledWith(expect.objectContaining({ groupId: 1, status: "submetido", userId: 42 }));
  });
});
