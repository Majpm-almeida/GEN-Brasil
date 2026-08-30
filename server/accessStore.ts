import type { User } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { getFirebaseFirestore } from "./_core/firebaseAdmin";
import { initialAccessStatus, type AccessStatus } from "./accessPolicy";
import { buildManagerRequestEmail, buildWelcomeApprovalEmail, sendTransactionalEmail } from "./email";

const collectionName = "genBrasilAccessRequests";

export type AccessRequest = {
  uid: string;
  email: string | null;
  name: string | null;
  status: AccessStatus;
  requestedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
};

function firebaseUid(user: User) {
  return user.openId.startsWith("firebase:") ? user.openId.slice(9) : user.openId;
}

function asAccessRequest(uid: string, user: User, data: Partial<AccessRequest>): AccessRequest {
  return {
    uid,
    email: data.email ?? user.email ?? null,
    name: data.name ?? user.name ?? null,
    status: data.status ?? initialAccessStatus(user.email, ENV.managerEmail),
    requestedAt: data.requestedAt ?? new Date().toISOString(),
    approvedAt: data.approvedAt ?? null,
    approvedBy: data.approvedBy ?? null,
  };
}

export async function ensureAccessRequest(user: User, siteUrl: string): Promise<{ request: AccessRequest; created: boolean }> {
  const uid = firebaseUid(user);
  const ref = getFirebaseFirestore().collection(collectionName).doc(uid);
  const existing = await ref.get();
  if (existing.exists) return { request: asAccessRequest(uid, user, existing.data() ?? {}), created: false };
  const request = asAccessRequest(uid, user, {});
  await ref.set(request);
  if (request.status === "pending") {
    const message = buildManagerRequestEmail({ name: request.name, email: request.email, approvalUrl: `${siteUrl}/administracao` });
    await sendTransactionalEmail({ to: ENV.managerEmail, ...message });
  }
  return { request, created: true };
}

export async function resendAccessRequestNotification(uid: string, siteUrl: string) {
  const ref = getFirebaseFirestore().collection(collectionName).doc(uid);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new Error("Solicitação de acesso não encontrada.");
  const request = snapshot.data() as AccessRequest;
  if (request.status !== "pending") throw new Error("Somente solicitações pendentes podem receber novo aviso.");
  const message = buildManagerRequestEmail({ name: request.name, email: request.email, approvalUrl: `${siteUrl}/administracao` });
  return sendTransactionalEmail({ to: ENV.managerEmail, ...message });
}

export async function listPendingAccessRequests() {
  const snapshot = await getFirebaseFirestore().collection(collectionName).where("status", "==", "pending").get();
  return snapshot.docs.map(doc => doc.data() as AccessRequest).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
}

export async function approveAccessRequest(uid: string, approver: User, siteUrl: string) {
  const ref = getFirebaseFirestore().collection(collectionName).doc(uid);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new Error("Solicitação de acesso não encontrada.");
  const request = snapshot.data() as AccessRequest;
  const approvedAt = new Date().toISOString();
  await ref.update({ status: "approved", approvedAt, approvedBy: approver.email ?? approver.name ?? "Coordenação" });
  const approved = { ...request, status: "approved" as const, approvedAt, approvedBy: approver.email ?? approver.name ?? "Coordenação" };
  if (approved.email) {
    const message = buildWelcomeApprovalEmail({ name: approved.name, siteUrl });
    await sendTransactionalEmail({ to: approved.email, ...message });
  }
  return approved;
}
