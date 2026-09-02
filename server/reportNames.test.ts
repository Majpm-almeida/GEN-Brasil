import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("nomes de exibição nos relatórios", () => {
  it("modela e protege o nome por vínculo de GT para administração e dirigente", () => {
    const schema = readFileSync(resolve(process.cwd(), "drizzle/schema.ts"), "utf8");
    const database = readFileSync(resolve(process.cwd(), "server/db.ts"), "utf8");
    const router = readFileSync(resolve(process.cwd(), "server/routers/workspace.ts"), "utf8");

    expect(schema).toContain('reportName: varchar("reportName", { length: 160 })');
    expect(database).toContain("setMemberReportName");
    expect(router).toContain("setMemberReportName");
    expect(router).toContain("canManageReportNames: membership.role === \"dirigente\"");
    expect(router).toContain("Somente o dirigente do GT ou a administração pode alterar o nome do relatório.");
  });

  it("oferece o campo aos responsáveis e usa sua preferência nos documentos", () => {
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/ReportNames.tsx"), "utf8");
    const worksheetPdf = readFileSync(resolve(process.cwd(), "client/src/lib/worksheetPdfDownload.ts"), "utf8");
    const synthesisPdf = readFileSync(resolve(process.cwd(), "client/src/lib/synthesisPdfDownload.ts"), "utf8");
    const preview = readFileSync(resolve(process.cwd(), "client/src/components/WorksheetPdfPreview.tsx"), "utf8");

    expect(page).toContain("Nome que aparecerá no relatório");
    expect(page).toContain("workspace.access.canManageReportNames");
    expect(page).toContain("setMemberReportName");
    expect(worksheetPdf).toContain("member.reportName || member.name");
    expect(synthesisPdf).toContain("member.reportName || member.name");
    expect(preview).toContain("member.reportName || member.name");
  });
});
