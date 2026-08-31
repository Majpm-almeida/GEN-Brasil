import { type ReportAppendix } from "@shared/consolidatedReport";
import { CASE_TITLE, caseEvents, lenses, type WorksheetLens } from "@shared/exercise";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

const MARGIN = 46;
const BOTTOM_MARGIN = 58;
const PAGE_BODY: [number, number, number] = [42, 59, 78];
const NAVY: [number, number, number] = [21, 47, 79];
const GOLD: [number, number, number] = [138, 100, 23];
const LINE_HEIGHT = 15.5;

function parseJson(value?: string | null) {
  try {
    return JSON.parse(value ?? "{}");
  } catch {
    return {};
  }
}

function selectedEventNumbers(value?: string | null) {
  const eventIds = parseJson(value);
  return Array.isArray(eventIds) ? eventIds.filter(id => typeof id === "number").sort((a, b) => a - b) : [];
}

function eventList(value?: string | null) {
  const ids = selectedEventNumbers(value);
  return ids.length ? `nº ${ids.join(", ")}` : "Não registrados";
}

function formatDate() {
  return new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

function worksheetTitle(lens: WorksheetLens) {
  const index = (Object.keys(lenses) as WorksheetLens[]).indexOf(lens) + 1;
  return `Ficha-Síntese ${index} — ${lenses[lens].label}`;
}

function statusLabel(status?: string | null) {
  return status === "versao_final" ? "Versão final" : status === "rascunho" ? "Rascunho" : "Não iniciado";
}

function componentLabel(member: any) {
  const course = member.course?.trim();
  const name = member.name || member.email || "Participante sem identificação";
  return course ? `${course} ${name}` : name;
}

function addFooter(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(207, 216, 227);
    doc.line(MARGIN, height - 32, width - MARGIN, height - 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(105, 122, 142);
    doc.text("GEN-Brasil · Curso Superior de Defesa — CSD 2026", MARGIN, height - 18);
    doc.text(`Página ${page} de ${pages}`, width - MARGIN, height - 18, { align: "right" });
  }
}

function drawJustifiedLine(doc: jsPDF, line: string, x: number, y: number, availableWidth: number) {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    doc.text(line, x, y);
    return;
  }
  const wordsWidth = words.reduce((total, word) => total + doc.getTextWidth(word), 0);
  const wordSpacing = (availableWidth - wordsWidth) / (words.length - 1);
  if (wordSpacing <= 0) {
    doc.text(line, x, y);
    return;
  }
  let currentX = x;
  words.forEach(word => {
    doc.text(word, currentX, y);
    currentX += doc.getTextWidth(word) + wordSpacing;
  });
}

function drawJustifiedParagraph(doc: jsPDF, value: string, x: number, y: number, width: number) {
  const lines = doc.splitTextToSize(value, width) as string[];
  lines.forEach((line, index) => {
    if (index === lines.length - 1) doc.text(line, x, y + index * LINE_HEIGHT);
    else drawJustifiedLine(doc, line, x, y + index * LINE_HEIGHT, width);
  });
  return lines.length * LINE_HEIGHT + 10;
}

function addSectionHeading(doc: jsPDF, title: string, cursorY: number) {
  const width = doc.internal.pageSize.getWidth();
  doc.setFont("times", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...NAVY);
  doc.text(title, MARGIN, cursorY);
  doc.setDrawColor(201, 214, 227);
  doc.line(MARGIN, cursorY + 8, width - MARGIN, cursorY + 8);
  return cursorY + 27;
}

function addWorksheet(doc: jsPDF, workspace: any, worksheet: any, lensId: WorksheetLens) {
  doc.addPage();
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;
  const lens = lenses[lensId];
  const testEntries = parseJson(worksheet?.testEntries) as Record<string, string>;
  const testResults = parseJson(worksheet?.testResults) as Record<string, string>;
  const testSufficiency = parseJson(worksheet?.testSufficiency) as Record<string, string>;
  let cursorY = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text("CURSO SUPERIOR DE DEFESA — CSD 2026", MARGIN, cursorY);
  cursorY += 28;
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...NAVY);
  doc.text(worksheetTitle(lensId).toUpperCase(), MARGIN, cursorY);
  cursorY += 26;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...PAGE_BODY);
  const meta = [
    ["GT Nº", workspace.group.code.replace(/\D/g, "") || workspace.group.code],
    ["Produto", worksheetTitle(lensId)],
    ["Status", statusLabel(worksheet?.status)],
    ["Data de geração", formatDate()],
    ["Caso de estudo", CASE_TITLE],
    ["Eventos utilizados como evidência", eventList(worksheet?.selectedEventIds)],
    ["Eventos decisivos", eventList(worksheet?.decisiveEventIds)],
    ["Classificação", worksheet?.classification || "Não registrada"],
  ];
  meta.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, MARGIN, cursorY);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), MARGIN + 150, cursorY);
    cursorY += 14;
  });
  cursorY += 6;
  cursorY = addSectionHeading(doc, "Teste de suficiência", cursorY);
  autoTable(doc, {
    startY: cursorY,
    head: [["Elemento", "Aplicação aos eventos", "Resultado", "Teste de suficiência"]],
    body: lens.criteria.map(criterion => [
      criterion.title,
      testEntries[criterion.id] || "Não registrado.",
      testResults[criterion.id] || "Não registrado.",
      testSufficiency[criterion.id] || "Não registrado.",
    ]),
    margin: { left: MARGIN, right: MARGIN, bottom: BOTTOM_MARGIN },
    theme: "grid",
    styles: { font: "helvetica", fontSize: 7.6, cellPadding: 5, textColor: PAGE_BODY, valign: "top", overflow: "linebreak" },
    headStyles: { fillColor: [234, 240, 246], textColor: NAVY, fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 98 }, 1: { cellWidth: 180 }, 2: { cellWidth: 72, halign: "center" }, 3: { cellWidth: 142 } },
    alternateRowStyles: { fillColor: [249, 250, 252] },
  });
  cursorY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? cursorY;
  const narrative = [
    ["Classificação e juízo central", worksheet?.centralJudgment],
    ["Fundamentação", worksheet?.evidenceBasis],
    ["Limites e explicações alternativas", worksheet?.limitsAndAlternatives],
    ["O que ainda precisa ser esclarecido", worksheet?.clarificationNeeded],
    ["Insumo temático para a integração", worksheet?.integrationInput],
  ];
  narrative.forEach(([heading, value]) => {
    const text = String(value || "Não registrado.");
    if (cursorY + 60 > doc.internal.pageSize.getHeight() - BOTTOM_MARGIN) {
      doc.addPage();
      cursorY = MARGIN;
    }
    cursorY = addSectionHeading(doc, String(heading), cursorY);
    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...PAGE_BODY);
    const estimatedHeight = (doc.splitTextToSize(text, contentWidth) as string[]).length * LINE_HEIGHT + 10;
    if (cursorY + estimatedHeight > doc.internal.pageSize.getHeight() - BOTTOM_MARGIN) {
      doc.addPage();
      cursorY = MARGIN;
    }
    cursorY += drawJustifiedParagraph(doc, text, MARGIN, cursorY, contentWidth) + 8;
  });
}

function addSynthesis(doc: jsPDF, workspace: any) {
  const synthesis = workspace.synthesis;
  doc.addPage();
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;
  let cursorY = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text("CURSO SUPERIOR DE DEFESA — CSD 2026", MARGIN, cursorY);
  cursorY += 28;
  cursorY = addSectionHeading(doc, "Síntese Estratégica Integrada", cursorY);
  const sections = [
    ["Eventos centrais", eventList(synthesis?.selectedEventIds)],
    ["Relações entre eventos", synthesis?.connectionNotes],
    ["Juízo estratégico integrado", synthesis?.strategicJudgment],
    ["Resultado das três lentes", synthesis?.lensResults],
    ["Conexões, limites e pontos a esclarecer", synthesis?.connectionsAndLimits],
    ["Resposta à Missão de Aprofundamento", synthesis?.missionResponse],
    ["Recomendações estratégicas", synthesis?.recommendations],
    ["Estado final desejado", synthesis?.desiredEndState],
  ];
  sections.forEach(([heading, value]) => {
    const text = String(value || "Não registrado.");
    if (cursorY + 60 > doc.internal.pageSize.getHeight() - BOTTOM_MARGIN) {
      doc.addPage();
      cursorY = MARGIN;
    }
    cursorY = addSectionHeading(doc, String(heading), cursorY);
    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...PAGE_BODY);
    const estimatedHeight = (doc.splitTextToSize(text, contentWidth) as string[]).length * LINE_HEIGHT + 10;
    if (cursorY + estimatedHeight > doc.internal.pageSize.getHeight() - BOTTOM_MARGIN) {
      doc.addPage();
      cursorY = MARGIN;
    }
    cursorY += drawJustifiedParagraph(doc, text, MARGIN, cursorY, contentWidth) + 8;
  });
  const slides = [synthesis?.slideOne, synthesis?.slideTwo, synthesis?.slideThree, synthesis?.slideFour];
  if (slides.some(Boolean)) {
    if (cursorY + 70 > doc.internal.pageSize.getHeight() - BOTTOM_MARGIN) {
      doc.addPage();
      cursorY = MARGIN;
    }
    cursorY = addSectionHeading(doc, "Quatro slides finais", cursorY);
    autoTable(doc, {
      startY: cursorY,
      head: [["Slide", "Conteúdo"]],
      body: slides.map((slide, index) => [`Slide ${index + 1}`, slide || "Não registrado."]),
      margin: { left: MARGIN, right: MARGIN, bottom: BOTTOM_MARGIN },
      theme: "grid",
      styles: { font: "helvetica", fontSize: 8.5, cellPadding: 6, textColor: PAGE_BODY, valign: "top", overflow: "linebreak" },
      headStyles: { fillColor: [234, 240, 246], textColor: NAVY, fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 420 } },
    });
  }
}

function addAppendices(doc: jsPDF, workspace: any, appendices: ReportAppendix[]) {
  if (!appendices.length) return;
  doc.addPage();
  let cursorY = MARGIN;
  cursorY = addSectionHeading(doc, "Anexos selecionados", cursorY);
  appendices.forEach((appendix, index) => {
    if (cursorY + 70 > doc.internal.pageSize.getHeight() - BOTTOM_MARGIN) {
      doc.addPage();
      cursorY = MARGIN;
    }
    cursorY = addSectionHeading(doc, `Anexo ${index + 1} — ${appendix.title}`, cursorY);
    if (appendix.kind === "worksheet_matrix" && appendix.lens) {
      const worksheet = workspace.worksheets.find((item: any) => item.lens === appendix.lens);
      const lens = lenses[appendix.lens];
      const entries = parseJson(worksheet?.testEntries) as Record<string, string>;
      const results = parseJson(worksheet?.testResults) as Record<string, string>;
      const sufficiency = parseJson(worksheet?.testSufficiency) as Record<string, string>;
      autoTable(doc, {
        startY: cursorY,
        head: [["Elemento", "Aplicação aos eventos", "Resultado", "Teste de suficiência"]],
        body: lens.criteria.map(criterion => [criterion.title, entries[criterion.id] || "Não registrado.", results[criterion.id] || "Não registrado.", sufficiency[criterion.id] || "Não registrado."]),
        margin: { left: MARGIN, right: MARGIN, bottom: BOTTOM_MARGIN },
        theme: "grid",
        styles: { font: "helvetica", fontSize: 7.6, cellPadding: 5, textColor: PAGE_BODY, valign: "top", overflow: "linebreak" },
        headStyles: { fillColor: [234, 240, 246], textColor: NAVY, fontStyle: "bold" },
        columnStyles: { 0: { cellWidth: 98 }, 1: { cellWidth: 180 }, 2: { cellWidth: 72, halign: "center" }, 3: { cellWidth: 142 } },
      });
      cursorY = ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? cursorY) + 22;
    } else {
      const synthesis = workspace.synthesis;
      doc.setFont("times", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(...PAGE_BODY);
      cursorY += drawJustifiedParagraph(doc, String(synthesis?.connectionNotes || "Não registrado."), MARGIN, cursorY, doc.internal.pageSize.getWidth() - MARGIN * 2) + 18;
    }
  });
}

export function downloadGroupReportPdf(workspace: any, appendices: ReportAppendix[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;
  let cursorY = MARGIN;
  const leader = workspace.members.find((member: any) => member.role === "dirigente");
  const rapporteur = workspace.members.find((member: any) => member.role === "relator");
  doc.setProperties({ title: `Relatório Consolidado — ${workspace.group.code}`, subject: CASE_TITLE, author: "GEN-Brasil" });
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...NAVY);
  doc.text("CURSO SUPERIOR DE DEFESA — CSD 2026", pageWidth / 2, cursorY, { align: "center" });
  cursorY += 44;
  doc.setFontSize(22);
  doc.text("RELATÓRIO DO GRUPO DE TRABALHO", pageWidth / 2, cursorY, { align: "center" });
  cursorY += 30;
  doc.setDrawColor(201, 214, 227);
  doc.line(MARGIN, cursorY, pageWidth - MARGIN, cursorY);
  cursorY += 28;
  const metadata = [
    ["CURSO", "Curso Superior de Defesa — CSD 2026"],
    ["SEMANA / UNIDADE DE ESTUDO", "Semana 04 — UE 2.2"],
    ["GT Nº", workspace.group.code.replace(/\D/g, "") || workspace.group.code],
    ["PRODUTO", "Relatório Consolidado do Grupo de Trabalho"],
    ["DATA", formatDate()],
    ["CASO DE ESTUDO", CASE_TITLE],
    ["EIXO / MISSÃO", workspace.group.missionAxis],
    ["MISSÃO DE APROFUNDAMENTO", workspace.group.missionText],
    ["DIRIGENTE DO GRUPO", leader ? componentLabel(leader) : "Não informado"],
    ["RELATOR", rapporteur ? componentLabel(rapporteur) : "Não informado"],
  ];
  metadata.forEach(([label, value]) => {
    const prefix = `${label}: `;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...PAGE_BODY);
    doc.text(prefix, MARGIN, cursorY);
    doc.setFont("helvetica", "normal");
    const prefixWidth = doc.getTextWidth(prefix);
    const lines = doc.splitTextToSize(String(value), contentWidth - prefixWidth) as string[];
    doc.text(lines, MARGIN + prefixWidth, cursorY, { lineHeightFactor: 1.35 });
    cursorY += Math.max(14, lines.length * 13) + 3;
  });
  cursorY += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("COMPONENTES DO GT:", MARGIN, cursorY);
  cursorY += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const members = workspace.members.filter((member: any) => member.active !== false).map(componentLabel);
  members.forEach((member: string) => {
    const lines = doc.splitTextToSize(member, contentWidth - 20) as string[];
    doc.text(lines, MARGIN + 20, cursorY, { lineHeightFactor: 1.3 });
    cursorY += Math.max(13, lines.length * 12.5);
  });
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(105, 122, 142);
  const note = "O relatório reúne as Fichas-Síntese, a Síntese Estratégica Integrada, os quatro slides e os anexos que tenham sido expressamente selecionados pelo GT.";
  const noteLines = doc.splitTextToSize(note, contentWidth) as string[];
  doc.text(noteLines, MARGIN, cursorY + 12, { lineHeightFactor: 1.35 });
  (Object.keys(lenses) as WorksheetLens[]).forEach(lensId => addWorksheet(doc, workspace, workspace.worksheets.find((item: any) => item.lens === lensId), lensId));
  addSynthesis(doc, workspace);
  addAppendices(doc, workspace, appendices);
  addFooter(doc);
  const groupSlug = workspace.group.code.replace(/\s+/g, "");
  doc.save(`${groupSlug}_RelatorioConsolidado.pdf`);
}
