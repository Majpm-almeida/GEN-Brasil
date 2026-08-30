import { describe, expect, it } from "vitest";
import { getFirebaseFirestore } from "./_core/firebaseAdmin";

describe("acesso administrativo ao Firestore", () => {
  it("consegue consultar a coleção protegida de solicitações sem criar documentos", async () => {
    const snapshot = await getFirebaseFirestore().collection("genBrasilAccessRequests").limit(1).get();
    expect(Array.isArray(snapshot.docs)).toBe(true);
    expect(snapshot.size).toBeGreaterThanOrEqual(0);
  }, 15_000);
});
