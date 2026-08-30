import { describe, expect, it } from "vitest";
import { normalizeFirebasePrivateKey } from "./_core/firebaseAdmin";

describe("conta de serviço Firebase", () => {
  it("possui JSON válido e correspondente ao projeto configurado", () => {
    const rawCredentials = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;

    expect(rawCredentials).toBeTruthy();
    const credentials = JSON.parse(rawCredentials ?? "{}") as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };

    expect(credentials.project_id).toBe("gen-brasil");
    expect(credentials.client_email).toMatch(/@gen-brasil\.iam\.gserviceaccount\.com$/);
    expect(normalizeFirebasePrivateKey(credentials.private_key ?? "")).toMatch(/BEGIN PRIVATE KEY/);
  });
});
