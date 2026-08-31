import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("acionadores de download de PDF", () => {
  it("mantém os rótulos Imprimir caso e Imprimir regras nos diálogos correspondentes", () => {
    const component = readFileSync(resolve(process.cwd(), "client/src/components/CaseLibraryEnhanced.tsx"), "utf8");

    expect(component).toContain('<PdfDownloadButton label="Imprimir caso" document={pdfDocument} />');
    expect(component).toContain('<PdfDownloadButton label="Imprimir regras" document={pdfDocument} />');
    expect(component).toContain("downloadAcademicPdf(document)");
  });
});
