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
  revokedAt?: string | null;
  revokedBy?: string | null;
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
    revokedAt: data.revokedAt ?? null,
    revokedBy: data.revokedBy ?? null,
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

export async function listAccessRequestsForReview() {
  const snapshot = await getFirebaseFirestore().collection(collectionName).get();
  return snapshot.docs
    .map(doc => doc.data() as AccessRequest)
    .filter(request => request.status === "pending" || request.status === "revoked")
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
}

export async function approveAccessRequest(uid: string, approver: User, siteUrl: string) {
  const ref = getFirebaseFirestore().collection(collectionName).doc(uid);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new Error("Solicitação de acesso não encontrada.");
  const request = snapshot.data() as AccessRequest;
  if (request.status !== "pending") throw new Error("Somente solicitações pendentes podem ser aprovadas.");
  const approvedAt = new Date().toISOString();
  await ref.update({ status: "approved", approvedAt, approvedBy: approver.email ?? approver.name ?? "Coordenação" });
  const approved = { ...request, status: "approved" as const, approvedAt, approvedBy: approver.email ?? approver.name ?? "Coordenação" };
  if (approved.email) {
    const message = buildWelcomeApprovalEmail({ name: approved.name, siteUrl });
    await sendTransactionalEmail({ to: approved.email, ...message });
  }
  return approved;
}

export async function revokeAccessRequest(subject: { uid: string; name: string | null; email: string | null }, revokedBy: string) {
  const ref = getFirebaseFirestore().collection(collectionName).doc(subject.uid);
  const snapshot = await ref.get();
  const revokedAt = new Date().toISOString();
  if (!snapshot.exists) {
    const request: AccessRequest = { uid: subject.uid, name: subject.name, email: subject.email, status: "revoked", requestedAt: revokedAt, approvedAt: null, approvedBy: null, revokedAt, revokedBy };
    await ref.set(request);
    return request;
  }
  const request = snapshot.data() as AccessRequest;
  if (request.status === "revoked") throw new Error("O acesso desta conta já está revogado.");
  await ref.update({ status: "revoked", revokedAt, revokedBy });
  return { ...request, status: "revoked" as const, revokedAt, revokedBy };
}

export async function getAccessStatusForUser(user: User): Promise<AccessStatus | null> {
  const snapshot = await getFirebaseFirestore().collection(collectionName).doc(firebaseUid(user)).get();
  if (!snapshot.exists) return null;
  return (snapshot.data() as AccessRequest).status;
}
