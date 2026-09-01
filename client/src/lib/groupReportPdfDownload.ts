import { type WorksheetLens } from "@shared/exercise";
import { downloadSelectedWorksheetsPdf } from "@/lib/worksheetPdfDownload";

export async function downloadGroupReportPdf(workspace: any, selectedLenses: WorksheetLens[]) {
  await downloadSelectedWorksheetsPdf(workspace, selectedLenses);
}
