import { CASE_TITLE, caseEvents, lenses, type WorksheetLens } from "@shared/exercise";
import { jsPDF } from "jspdf";

const BRASAO_URL = "/manus-storage/brasao-nacional-esg-csd_5edbae08.jpg";
const MARGIN = 46;
const BODY_TOP = 118;
const BODY_BOTTOM = 50;
const BODY_FONT_SIZE = 10.2;
const BODY_LINE_HEIGHT = 14.2;
const PARAGRAPH_GAP = 11;
const NAVY: [number, number, number] = [21, 47, 79];
const GOLD: [number, number, number] = [138, 100, 23];
const BODY: [number, number, number] = [42, 59, 78];

export type WorksheetPdfFit = {
  fits: boolean;
  usedHeight: number;
  availableHeight: number;
  lineCount: number;
};

function parseEventIds(value?: string | null) {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === "number").sort((a, b) => a - b) : [];
  } catch {
    return [];
  }
}

function formatDate() {
  return new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

function worksheetNumber(lens: WorksheetLens) {
  return (["guerra_hibrida", "lawfare", "seguranca_transnacional"] as WorksheetLens[]).indexOf(lens) + 1;
}

function worksheetName(lens: WorksheetLens) {
  return `Ficha-Síntese nº ${worksheetNumber(lens)} - ${lenses[lens].label}`;
}

function groupNumber(group: any) {
  return String(group.code || "").replace(/\D/g, "") || group.code || "Não informado";
}

function componentLabel(member: any) {
  const name = member.name || member.email || "Participante sem identificação";
  return member.course ? `${member.course} ${name}` : name;
}

function roleMember(members: any[], role: string) {
  return members.find(member => member.role === role && member.active !== false);
}

function selectedEvents(value?: string | null) {
  const ids = parseEventIds(value);
  return ids.length ? `nº ${ids.join(", ")}` : "Não registrados";
}

function eventEvidenceLine(worksheet: any) {
  const evidence = selectedEvents(worksheet.selectedEventIds);
  const decisive = parseEventIds(worksheet.decisiveEventIds);
  return decisive.length ? `${evidence} (decisivos: ${decisive.join(", ")})` : evidence;
}

function narrativeParagraphs(worksheet: any) {
  return [
    worksheet?.centralJudgment || "Não registrado.",
    worksheet?.evidenceBasis || "Não registrado.",
    worksheet?.limitsAndAlternatives || "Não registrado.",
    worksheet?.clarificationNeeded || "Não registrado.",
    worksheet?.integrationInput || "Não registrado.",
  ].map(value => String(value).trim() || "Não registrado.");
}

function wrapNarrative(doc: jsPDF, value: string, contentWidth: number) {
  return doc.splitTextToSize(value, contentWidth) as string[];
}

function drawJustifiedLine(doc: jsPDF, line: string, x: number, y: number, availableWidth: number) {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    doc.text(line, x, y);
    return;
  }
  const wordsWidth = words.reduce((total, word) => total + doc.getTextWidth(word), 0);
  const spacing = (availableWidth - wordsWidth) / (words.length - 1);
  if (spacing <= 0) {
    doc.text(line, x, y);
    return;
  }
  let currentX = x;
  words.forEach(word => {
    doc.text(word, currentX, y);
    currentX += doc.getTextWidth(word) + spacing;
  });
}

function createBodyMeasurementDoc() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFont("times", "normal");
  doc.setFontSize(BODY_FONT_SIZE);
  return doc;
}

export function getWorksheetPdfFit(worksheet: any): WorksheetPdfFit {
  const doc = createBodyMeasurementDoc();
  const contentWidth = doc.internal.pageSize.getWidth() - MARGIN * 2;
  const availableHeight = doc.internal.pageSize.getHeight() - BODY_TOP - BODY_BOTTOM;
  const lines = narrativeParagraphs(worksheet).reduce((total, paragraph) => total + wrapNarrative(doc, paragraph, contentWidth).length, 0);
  const usedHeight = lines * BODY_LINE_HEIGHT + (narrativeParagraphs(worksheet).length - 1) * PARAGRAPH_GAP;
  return { fits: usedHeight <= availableHeight, usedHeight, availableHeight, lineCount: lines };
}

async function loadBrasao() {
  const response = await fetch(BRASAO_URL);
  if (!response.ok) throw new Error("Não foi possível carregar o brasão nacional.");
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível processar o brasão nacional."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

function drawCover(doc: jsPDF, workspace: any, worksheet: any, lensId: WorksheetLens, brasao: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const activeMembers = workspace.members.filter((member: any) => member.active !== false);
  const leader = roleMember(activeMembers, "dirigente");
  const rapporteur = roleMember(activeMembers, "relator");
  doc.addImage(brasao, "JPEG", MARGIN, 31, 67, 67);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...NAVY);
  doc.text("ESCOLA SUPERIOR DE GUERRA (ESG)", MARGIN + 84, 58);
  doc.setFontSize(12);
  doc.text("CURSO SUPERIOR DE DEFESA - CSD 2026", MARGIN + 84, 78);
  doc.setDrawColor(196, 205, 216);
  doc.line(MARGIN, 116, pageWidth - MARGIN, 116);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...GOLD);
  doc.text("ATIVIDADE INTEGRADORA", pageWidth / 2, 202, { align: "center" });
  doc.setFont("times", "bold");
  doc.setFontSize(19);
  doc.setTextColor(...NAVY);
  const title = `FICHA-SÍNTESE ${worksheetNumber(lensId)} - ${lenses[lensId].label.toUpperCase()}`;
  doc.text(doc.splitTextToSize(title, pageWidth - MARGIN * 2) as string[], pageWidth / 2, 248, { align: "center", lineHeightFactor: 1.2 });

  const metadata = [
    ["CURSO", "Curso Superior de Defesa - CSD 2026"],
    ["SEMANA / UNIDADE DE ESTUDO", "Semana 04 - UE 2.2"],
    ["GT Nº", groupNumber(workspace.group)],
    ["PRODUTO", worksheetName(lensId)],
    ["DATA", formatDate()],
    ["CASO DE ESTUDO", CASE_TITLE],
    ["DIRIGENTE DO GRUPO", leader ? componentLabel(leader) : "Não informado"],
    ["RELATOR", rapporteur ? componentLabel(rapporteur) : "Não informado"],
  ];
  let y = 311;
  const contentWidth = pageWidth - MARGIN * 2;
  metadata.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.2);
    doc.setTextColor(...BODY);
    const labelText = `${label}: `;
    doc.text(labelText, MARGIN, y);
    doc.setFont("helvetica", "normal");
    const labelWidth = doc.getTextWidth(labelText);
    const lines = doc.splitTextToSize(String(value), contentWidth - labelWidth) as string[];
    doc.text(lines, MARGIN + labelWidth, y, { lineHeightFactor: 1.3 });
    y += Math.max(13, lines.length * 12.2) + 3;
  });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.2);
  doc.text("COMPONENTES DO GT:", MARGIN, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  activeMembers.map(componentLabel).forEach((member: string) => {
    const lines = doc.splitTextToSize(member, contentWidth - 18) as string[];
    doc.text(lines, MARGIN + 18, y, { lineHeightFactor: 1.25 });
    y += Math.max(12, lines.length * 11.5);
  });
  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...NAVY);
  doc.text("Rio de Janeiro/RJ", pageWidth / 2, pageHeight - 60, { align: "center" });
  doc.text("2026", pageWidth / 2, pageHeight - 38, { align: "center" });
}

function drawBody(doc: jsPDF, worksheet: any) {
  doc.addPage();
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.2);
  doc.setTextColor(...NAVY);
  doc.text("EVENTOS UTILIZADOS COMO EVIDÊNCIA:", MARGIN, 56);
  doc.setFont("helvetica", "normal");
  doc.text(eventEvidenceLine(worksheet), MARGIN + 210, 56);
  doc.setDrawColor(125, 143, 163);
  doc.line(MARGIN, 78, pageWidth - MARGIN, 78);
  let y = BODY_TOP;
  doc.setFont("times", "normal");
  doc.setFontSize(BODY_FONT_SIZE);
  doc.setTextColor(...BODY);
  narrativeParagraphs(worksheet).forEach(paragraph => {
    const lines = wrapNarrative(doc, paragraph, contentWidth);
    lines.forEach((line, index) => {
      if (index === lines.length - 1) doc.text(line, MARGIN, y);
      else drawJustifiedLine(doc, line, MARGIN, y, contentWidth);
      y += BODY_LINE_HEIGHT;
    });
    y += PARAGRAPH_GAP;
  });
}

export async function downloadWorksheetPdf({ workspace, worksheet, lensId }: { workspace: any; worksheet: any; lensId: WorksheetLens }) {
  const fit = getWorksheetPdfFit(worksheet);
  if (!fit.fits) throw new Error("O texto da Ficha-Síntese ultrapassa a capacidade de uma página no PDF.");
  const brasao = await loadBrasao();
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setProperties({ title: worksheetName(lensId), subject: CASE_TITLE, author: "GEN-Brasil" });
  drawCover(doc, workspace, worksheet, lensId, brasao);
  drawBody(doc, worksheet);
  const slug = String(workspace.group.code || "GT").replace(/\s+/g, "");
  doc.save(`${slug}_${worksheetName(lensId).replace(/[^a-zA-Z0-9]+/g, "_")}.pdf`);
}

export async function downloadIndividualWorksheetsPdf(workspace: any, selectedLenses: WorksheetLens[]) {
  const availableLenses = selectedLenses.filter(lensId => workspace.worksheets.some((worksheet: any) => worksheet.lens === lensId));
  if (!availableLenses.length) throw new Error("Não há Fichas-Síntese salvas para download individual.");
  const overflow = availableLenses.find(lensId => !getWorksheetPdfFit(workspace.worksheets.find((worksheet: any) => worksheet.lens === lensId)).fits);
  if (overflow) throw new Error(`A ${worksheetName(overflow)} ultrapassa a capacidade de uma página no PDF.`);
  const brasao = await loadBrasao();
  const slug = String(workspace.group.code || "GT").replace(/\s+/g, "");
  availableLenses.forEach(lensId => {
    const worksheet = workspace.worksheets.find((item: any) => item.lens === lensId);
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setProperties({ title: worksheetName(lensId), subject: CASE_TITLE, author: "GEN-Brasil" });
    drawCover(doc, workspace, worksheet, lensId, brasao);
    drawBody(doc, worksheet);
    doc.save(`${slug}_${worksheetName(lensId).replace(/[^a-zA-Z0-9]+/g, "_")}.pdf`);
  });
  return availableLenses.length;
}

export async function downloadSelectedWorksheetsPdf(workspace: any, selectedLenses: WorksheetLens[]) {
  const selectedWorksheets = selectedLenses.map(lensId => ({ lensId, worksheet: workspace.worksheets.find((item: any) => item.lens === lensId) }));
  const overflow = selectedWorksheets.find(item => !getWorksheetPdfFit(item.worksheet).fits);
  if (overflow) throw new Error(`A ${worksheetName(overflow.lensId)} ultrapassa a capacidade de uma página no PDF.`);
  const brasao = await loadBrasao();
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  selectedWorksheets.forEach(({ lensId, worksheet }, index) => {
    if (index > 0) doc.addPage();
    drawCover(doc, workspace, worksheet, lensId, brasao);
    drawBody(doc, worksheet);
  });
  const slug = String(workspace.group.code || "GT").replace(/\s+/g, "");
  doc.setProperties({ title: `Fichas-Síntese — ${workspace.group.code}`, subject: CASE_TITLE, author: "GEN-Brasil" });
  doc.save(`${slug}_FichasSinteseSelecionadas.pdf`);
}
