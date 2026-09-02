import { CASE_TITLE, caseEvents } from "@shared/exercise";
import { jsPDF } from "jspdf";

const MARGIN = 46;
const BOTTOM_MARGIN = 58;
const NAVY: [number, number, number] = [21, 47, 79];
const GOLD: [number, number, number] = [138, 100, 23];
const BODY: [number, number, number] = [42, 59, 78];

function formatDate() {
  return new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

function groupSlug(group: any) {
  return String(group.code || "GT").replace(/\s+/g, "");
}

function eventList(ids: number[]) {
  return ids.length ? ids.sort((a, b) => a - b).map(id => `Evento ${id} · ${caseEvents.find(event => event.id === id)?.title ?? ""}`).join("; ") : "Não registrados";
}

function memberLabel(member: any) {
  const identity = member.reportName || member.name || member.email || "Participante sem identificação";
  return member.course ? `${member.course} ${identity}` : identity;
}

function addFooter(doc: jsPDF) {
  const total = doc.getNumberOfPages();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  for (let page = 1; page <= total; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(207, 216, 227);
    doc.line(MARGIN, height - 32, width - MARGIN, height - 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(105, 122, 142);
    doc.text("GEN-Brasil · Curso Superior de Defesa — CSD 2026", MARGIN, height - 18);
    doc.text(`Página ${page} de ${total}`, width - MARGIN, height - 18, { align: "right" });
  }
}

function drawJustifiedLine(doc: jsPDF, line: string, x: number, y: number, availableWidth: number) {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return doc.text(line, x, y);
  const wordsWidth = words.reduce((sum, word) => sum + doc.getTextWidth(word), 0);
  const gap = (availableWidth - wordsWidth) / (words.length - 1);
  if (gap <= 0) return doc.text(line, x, y);
  let currentX = x;
  words.forEach(word => {
    doc.text(word, currentX, y);
    currentX += doc.getTextWidth(word) + gap;
  });
}

function addHeading(doc: jsPDF, title: string, y: number) {
  const width = doc.internal.pageSize.getWidth();
  if (y + 35 > doc.internal.pageSize.getHeight() - BOTTOM_MARGIN) {
    doc.addPage();
    y = MARGIN;
  }
  doc.setFont("times", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...NAVY);
  doc.text(title, MARGIN, y);
  doc.setDrawColor(201, 214, 227);
  doc.line(MARGIN, y + 8, width - MARGIN, y + 8);
  return y + 27;
}

function addParagraph(doc: jsPDF, value: string, y: number) {
  const width = doc.internal.pageSize.getWidth() - MARGIN * 2;
  const lineHeight = 15.5;
  const lines = doc.splitTextToSize(value || "Não registrado.", width) as string[];
  doc.setFont("times", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...BODY);
  lines.forEach((line, index) => {
    if (y > doc.internal.pageSize.getHeight() - BOTTOM_MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
    if (index === lines.length - 1) doc.text(line, MARGIN, y);
    else drawJustifiedLine(doc, line, MARGIN, y, width);
    y += lineHeight;
  });
  return y + 12;
}

function addMetadata(doc: jsPDF, group: any, members: any[], title: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;
  const leader = members.find(member => member.role === "dirigente");
  const rapporteur = members.find(member => member.role === "relator");
  let y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text("CURSO SUPERIOR DE DEFESA — CSD 2026", pageWidth / 2, y, { align: "center" });
  y += 33;
  doc.setFont("times", "bold");
  doc.setFontSize(21);
  doc.setTextColor(...NAVY);
  doc.text(title.toUpperCase(), pageWidth / 2, y, { align: "center" });
  y += 29;
  const rows = [
    ["GT", group.code || "Não informado"],
    ["Data de geração", formatDate()],
    ["Caso de estudo", CASE_TITLE],
    ["Missão de aprofundamento", group.missionText || "Não informada"],
    ["Dirigente", leader ? memberLabel(leader) : "Não informado"],
    ["Relator", rapporteur ? memberLabel(rapporteur) : "Não informado"],
  ];
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.2);
    doc.setTextColor(...BODY);
    const prefix = `${label}: `;
    doc.text(prefix, MARGIN, y);
    doc.setFont("helvetica", "normal");
    const prefixWidth = doc.getTextWidth(prefix);
    const lines = doc.splitTextToSize(String(value), contentWidth - prefixWidth) as string[];
    doc.text(lines, MARGIN + prefixWidth, y, { lineHeightFactor: 1.3 });
    y += Math.max(13, lines.length * 12.5) + 3;
  });
  return y + 12;
}

export function downloadSynthesisPdf({ group, members, synthesis }: { group: any; members: any[]; synthesis: any }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setProperties({ title: `Síntese Estratégica Integrada — ${group.code}`, subject: CASE_TITLE, author: "GEN-Brasil" });
  let y = addMetadata(doc, group, members, "Síntese Estratégica Integrada");
  y = addHeading(doc, "Base da integração", y);
  y = addParagraph(doc, `Eventos centrais: ${eventList(synthesis.selectedEventIds || [])}`, y);
  y = addHeading(doc, "Relações entre eventos e grau de evidência", y);
  y = addParagraph(doc, synthesis.connectionNotes, y);
  const sections = [
    ["1. Juízo estratégico integrado", synthesis.strategicJudgment],
    ["2. Resultado das três lentes", synthesis.lensResults],
    ["3. Conexões, limites e pontos a esclarecer", synthesis.connectionsAndLimits],
    ["4. Resposta à Missão de Aprofundamento", synthesis.missionResponse],
    ["5. Recomendações estratégicas", synthesis.recommendations],
    ["6. Estado final desejado", synthesis.desiredEndState],
  ];
  sections.forEach(([heading, value]) => {
    y = addHeading(doc, heading, y);
    y = addParagraph(doc, String(value || ""), y);
  });
  addFooter(doc);
  doc.save(`${groupSlug(group)}_SinteseEstrategicaIntegrada.pdf`);
}

export function downloadPresentationPdf({ group, synthesis }: { group: any; synthesis: any }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setProperties({ title: `Apresentação Final — ${group.code}`, subject: CASE_TITLE, author: "GEN-Brasil" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const slides = [
    ["Juízo Estratégico Integrado", synthesis.slideOne],
    ["Evidências e Incertezas", synthesis.slideTwo],
    ["Missão de Aprofundamento", synthesis.slideThree],
    ["Recomendações e Estado Final", synthesis.slideFour],
  ];
  slides.forEach(([title, content], index) => {
    if (index) doc.addPage();
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pageWidth, 84, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(236, 241, 247);
    doc.text(`CURSO SUPERIOR DE DEFESA — CSD 2026 · ${group.code || "GT"}`, MARGIN, 33);
    doc.setFont("helvetica", "normal");
    doc.text(`APRESENTAÇÃO FINAL · ${CASE_TITLE}`, MARGIN, 52);
    doc.setFillColor(...GOLD);
    doc.roundedRect(pageWidth - 105, 25, 58, 32, 6, 6, "F");
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(`${index + 1}`, pageWidth - 76, 47, { align: "center" });
    doc.setFont("times", "bold");
    doc.setFontSize(29);
    doc.setTextColor(...NAVY);
    const titleLines = doc.splitTextToSize(String(title), pageWidth - MARGIN * 2) as string[];
    doc.text(titleLines, MARGIN, 150, { lineHeightFactor: 1.15 });
    const contentY = 150 + titleLines.length * 33 + 30;
    doc.setDrawColor(201, 214, 227);
    doc.line(MARGIN, contentY - 16, pageWidth - MARGIN, contentY - 16);
    doc.setFont("times", "normal");
    doc.setFontSize(16);
    doc.setTextColor(...BODY);
    const bodyLines = doc.splitTextToSize(String(content || "Conteúdo não registrado."), pageWidth - MARGIN * 2) as string[];
    doc.text(bodyLines, MARGIN, contentY, { lineHeightFactor: 1.45 });
    doc.setDrawColor(207, 216, 227);
    doc.line(MARGIN, pageHeight - 35, pageWidth - MARGIN, pageHeight - 35);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(105, 122, 142);
    doc.text("GEN-Brasil · Jornada Acadêmica CSD 2026", MARGIN, pageHeight - 20);
    doc.text(`Slide ${index + 1} de 4`, pageWidth - MARGIN, pageHeight - 20, { align: "right" });
  });
  doc.save(`${groupSlug(group)}_ApresentacaoFinal.pdf`);
}
