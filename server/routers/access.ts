import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { approveAccessRequest, ensureAccessRequest, listAccessRequestsForReview, resendAccessRequestNotification, revokeAccessRequest } from "../accessStore";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { ENV } from "../_core/env";
import { getApplicationUrl } from "../siteUrl";
import * as db from "../db";

function assertManager(email: string | null) {
  if (email?.trim().toLowerCase() !== ENV.managerEmail.trim().toLowerCase()) {
    throw new TRPCError({ code: "FORBIDDEN", message: "A aprovação de acessos é restrita ao gestor configurado." });
  }
}

export const accessRouter = router({
  status: protectedProcedure.query(async ({ ctx }) => {
    const { request } = await ensureAccessRequest(ctx.user, getApplicationUrl(ctx.req));
    return request;
  }),
  pending: adminProcedure.query(async ({ ctx }) => {
    assertManager(ctx.user.email);
    return listAccessRequestsForReview();
  }),
  resendNotification: adminProcedure.input(z.object({ uid: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    assertManager(ctx.user.email);
    try {
      const delivery = await resendAccessRequestNotification(input.uid, getApplicationUrl(ctx.req));
      return { success: true as const, delivery };
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "Não foi possível reenviar a notificação." });
    }
  }),
  approve: adminProcedure.input(z.object({ uid: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    assertManager(ctx.user.email);
    try {
      const request = await approveAccessRequest(input.uid, ctx.user, getApplicationUrl(ctx.req));
      return { success: true as const, request };
    } catch (error) {
      throw new TRPCError({ code: "NOT_FOUND", message: error instanceof Error ? error.message : "Solicitação não encontrada." });
    }
  }),
  revoke: adminProcedure.input(z.object({ userId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    assertManager(ctx.user.email);
    const user = await db.getUserById(input.userId);
    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Participante não encontrado." });
    if (user.email?.trim().toLowerCase() === ENV.managerEmail.trim().toLowerCase()) {
      throw new TRPCError({ code: "FORBIDDEN", message: "O acesso do gestor configurado não pode ser revogado por esta ação." });
    }
    try {
      const uid = user.openId.startsWith("firebase:") ? user.openId.slice(9) : user.openId;
      const request = await revokeAccessRequest({ uid, name: user.name ?? null, email: user.email ?? null }, ctx.user.email ?? ctx.user.name ?? "Coordenação");
      return { success: true as const, request };
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "Não foi possível revogar o acesso." });
    }
  }),
});
