import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { approveAccessRequest, ensureAccessRequest, listPendingAccessRequests, resendAccessRequestNotification } from "../accessStore";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { ENV } from "../_core/env";
import { getApplicationUrl } from "../siteUrl";

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
    return listPendingAccessRequests();
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
});
