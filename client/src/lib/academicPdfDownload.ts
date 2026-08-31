import { type AcademicPdfDocument } from "@shared/academicPdfDefinitions";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

const MARGIN = 46;
const PARAGRAPH_LINE_HEIGHT = 16;
const BODY_COLOR: [number, number, number] = [49, 72, 97];
const TITLE_COLOR: [number, number, number] = [21, 47, 79];

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

function drawJustifiedParagraph(doc: jsPDF, value: string, x: number, y: number, availableWidth: number) {
  const lines = doc.splitTextToSize(value, availableWidth) as string[];
  lines.forEach((line, index) => {
    const isLastLine = index === lines.length - 1;
    if (isLastLine) doc.text(line, x, y + index * PARAGRAPH_LINE_HEIGHT);
    else drawJustifiedLine(doc, line, x, y + index * PARAGRAPH_LINE_HEIGHT, availableWidth);
  });
}

function addFooter(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(207, 216, 227);
    doc.line(MARGIN, pageHeight - 32, pageWidth - MARGIN, pageHeight - 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(105, 122, 142);
    doc.text("GEN-Brasil · Jornada Acadêmica CSD 2026", MARGIN, pageHeight - 18);
    doc.text(`Página ${page} de ${pages}`, pageWidth - MARGIN, pageHeight - 18, { align: "right" });
  }
}

export function downloadAcademicPdf(document: AcademicPdfDocument) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - MARGIN * 2;
  let cursorY = MARGIN;

  const ensureSpace = (height: number) => {
    if (cursorY + height > pageHeight - 58) {
      doc.addPage();
      cursorY = MARGIN;
    }
  };

  const paragraph = (value: string) => {
    const lines = doc.splitTextToSize(value, contentWidth) as string[];
    const height = Math.max(18, lines.length * PARAGRAPH_LINE_HEIGHT) + 10;
    ensureSpace(height);
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...BODY_COLOR);
    drawJustifiedParagraph(doc, value, MARGIN, cursorY, contentWidth);
    cursorY += height;
  };

  doc.setProperties({ title: document.title, subject: document.subtitle, author: "GEN-Brasil" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(138, 100, 23);
  doc.text(document.eyebrow.toUpperCase(), MARGIN, cursorY);
  cursorY += 27;
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...TITLE_COLOR);
  const titleLines = doc.splitTextToSize(document.title, contentWidth) as string[];
  doc.text(titleLines, MARGIN, cursorY, { lineHeightFactor: 1.12 });
  cursorY += titleLines.length * 27 + 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(105, 122, 142);
  doc.text(document.subtitle, MARGIN, cursorY);
  cursorY += 30;

  document.sections.forEach(section => {
    if (section.heading) {
      ensureSpace(36);
      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...TITLE_COLOR);
      doc.text(section.heading, MARGIN, cursorY);
      cursorY += 25;
    }
    section.paragraphs.forEach(paragraph);
    cursorY += 8;
  });

  document.tables.forEach(table => {
    ensureSpace(50);
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...TITLE_COLOR);
    doc.text(table.title, MARGIN, cursorY);
    cursorY += 12;
    autoTable(doc, {
      head: [table.headers],
      body: table.rows,
      startY: cursorY,
      margin: { left: MARGIN, right: MARGIN, bottom: 58 },
      theme: "grid",
      styles: { font: "helvetica", fontSize: 8.5, cellPadding: 6, textColor: BODY_COLOR, valign: "top", overflow: "linebreak" },
      headStyles: { fillColor: [234, 240, 246], textColor: TITLE_COLOR, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [249, 250, 252] },
    });
    cursorY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? cursorY + 20;
    cursorY += 24;
  });

  addFooter(doc);
  doc.save(document.filename);
}
