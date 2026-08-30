import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  getMembershipsForUser: vi.fn(),
  listEventComments: vi.fn(),
  createEventComment: vi.fn(),
  listAnalysisVersions: vi.fn(),
}));
vi.mock("./accessStore", () => ({ getAccessStatusForUser: vi.fn().mockResolvedValue("approved") }));

import * as db from "./db";
import { workspaceRouter } from "./routers/workspace";

const context = { user: { id: 42, role: "user" as const }, req: {}, res: {} } as any;

describe("colaboração e histórico do GT", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.getMembershipsForUser).mockResolvedValue([{ groupId: 7, role: "integrante" }] as any);
  });

  it("permite comentário de um integrante apenas em evento do seu GT", async () => {
    vi.mocked(db.createEventComment).mockResolvedValue(11);
    const caller = workspaceRouter.createCaller(context);
    await expect(caller.eventComments.add({ groupId: 7, eventId: 3, content: "Verificar a origem e a cronologia desta evidência." })).resolves.toEqual({ id: 11 });
    expect(db.createEventComment).toHaveBeenCalledWith(expect.objectContaining({ groupId: 7, eventId: 3, authorUserId: 42 }));
  });

  it("bloqueia comentários fora do GT vinculado", async () => {
    const caller = workspaceRouter.createCaller(context);
    await expect(caller.eventComments.add({ groupId: 8, eventId: 3, content: "Comentário sem acesso." })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("retorna o histórico da ficha apenas para a lente solicitada", async () => {
    vi.mocked(db.listAnalysisVersions).mockResolvedValue([{ id: 3, lens: "guerra_hibrida", status: "rascunho" }] as any);
    const caller = workspaceRouter.createCaller(context);
    await expect(caller.analysisVersions({ groupId: 7, artifact: "worksheet", lens: "guerra_hibrida" })).resolves.toHaveLength(1);
    expect(db.listAnalysisVersions).toHaveBeenCalledWith({ groupId: 7, artifact: "worksheet", lens: "guerra_hibrida" });
  });
});
