import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("tipografia dos PDFs acadêmicos", () => {
  it("mantém margens laterais simétricas e justifica as linhas internas dos parágrafos", () => {
    const renderer = readFileSync(resolve(process.cwd(), "client/src/lib/academicPdfDownload.ts"), "utf8");

    expect(renderer).toContain("const MARGIN = 46");
    expect(renderer).toContain("const contentWidth = pageWidth - MARGIN * 2");
    expect(renderer).toContain("function drawJustifiedLine");
    expect(renderer).toContain("const wordSpacing = (availableWidth - wordsWidth) / (words.length - 1)");
    expect(renderer).toContain("else drawJustifiedLine(doc, line, x, y + index * PARAGRAPH_LINE_HEIGHT, availableWidth)");
  });
});
