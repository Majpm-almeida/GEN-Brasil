import { describe, expect, it } from "vitest";

describe("configuração pública do Firebase", () => {
  it("reconhece a chave e o projeto pelo endpoint do Firebase Authentication", async () => {
    const apiKey = process.env.VITE_FIREBASE_API_KEY;
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

    expect(apiKey).toBeTruthy();
    expect(projectId).toBe("gen-brasil");

    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const payload = await response.json() as { error?: { message?: string } };
    const firebaseError = payload.error?.message ?? "";

    expect(firebaseError).not.toMatch(/API_KEY_INVALID|PROJECT_NOT_FOUND|SERVICE_DISABLED/i);
  });
});
