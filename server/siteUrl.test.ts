import { describe, expect, it } from "vitest";
import { getApplicationUrl } from "./siteUrl";

describe("endereço da aplicação em notificações", () => {
  it("prioriza a origem real da requisição", () => {
    expect(getApplicationUrl({ headers: { origin: "https://3000-exemplo.manus.computer/", host: "interno" } })).toBe("https://3000-exemplo.manus.computer");
  });

  it("usa host e protocolo encaminhados quando a origem não é enviada", () => {
    expect(getApplicationUrl({ protocol: "http", headers: { host: "interno", "x-forwarded-host": "gen-brasil.manus.space", "x-forwarded-proto": "https" } })).toBe("https://gen-brasil.manus.space");
  });

  it("não inventa um endereço quando não recebe host", () => {
    expect(() => getApplicationUrl({ headers: {} })).toThrow("Não foi possível identificar");
  });
});
