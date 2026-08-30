import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { buildReportAppendices, reportLensOrder, reportReadiness } from "@shared/consolidatedReport";
import { CASE_TITLE, caseEvents, lenses, type WorksheetLens } from "@shared/exercise";
import { AlertCircle, CheckCircle2, FileDown, FileText, Loader2, Printer, ScrollText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function parseJson(value?: string | null) {
  try { return JSON.parse(value ?? "{}"); } catch { return {}; }
}

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character] ?? character));
}

function selectedEventLabels(value?: string | null) {
  const ids = parseJson(value);
  return Array.isArray(ids) ? ids.map(id => caseEvents.find(event => event.id === id)?.title).filter(Boolean) : [];
}

function GroupSelector({ groupId, onChange }: { groupId: number | null; onChange: (id: number) => void }) {
  const { data: access } = trpc.workspace.myAccess.useQuery();
  const groups = useMemo(() => access?.isAdmin ? access.availableGroups : access?.memberships.map(item => ({ id: item.groupId, code: item.code, missionAxis: item.missionAxis })) ?? [], [access]);
  useEffect(() => { if (!groupId && groups[0]) onChange(groups[0].id); }, [groupId, groups, onChange]);
  if (!groups.length) return null;
  return <Select value={groupId ? String(groupId) : undefined} onValueChange={value => onChange(Number(value))}><SelectTrigger className="w-full bg-card sm:w-[300px]"><SelectValue placeholder="Selecione o GT" /></SelectTrigger><SelectContent>{groups.map(group => <SelectItem key={group.id} value={String(group.id)}>{group.code} · {group.missionAxis}</SelectItem>)}</SelectContent></Select>;
}

function ReportStatus({ status }: { status?: string | null }) {
  return <Badge className={status === "versao_final" ? "bg-indigo-100 text-indigo-900 hover:bg-indigo-100" : status === "rascunho" ? "bg-amber-100 text-amber-900 hover:bg-amber-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"}>{status === "versao_final" ? "Versão final" : status === "rascunho" ? "Rascunho" : "Não iniciado"}</Badge>;
}

function WorksheetSection({ worksheet }: { worksheet: any }) {
  const lens = lenses[worksheet.lens as WorksheetLens];
  const testEntries = parseJson(worksheet.testEntries) as Record<string, string>;
  const paragraphs = [
    ["Classificação e juízo central", worksheet.centralJudgment],
    ["Fundamentação", worksheet.evidenceBasis],
    ["Limites e explicações alternativas", worksheet.limitsAndAlternatives],
    ["O que ainda precisa ser esclarecido", worksheet.clarificationNeeded],
    ["Insumo temático para a integração", worksheet.integrationInput],
  ];
  return <Card className="border-0 bg-card/85 shadow-sm"><CardHeader className="border-b border-border/70 pb-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Ficha-Síntese</p><CardTitle className="mt-1 font-serif text-xl text-primary">{lens.label}</CardTitle></div><ReportStatus status={worksheet.status} /></div><CardDescription className="pt-2">Classificação: <span className="font-semibold text-primary">{worksheet.classification || "Não registrada"}</span></CardDescription></CardHeader><CardContent className="space-y-6 pt-6"><div className="rounded-xl bg-muted/50 p-4"><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Eventos mobilizados</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedEventLabels(worksheet.selectedEventIds).join("; ") || "Nenhum evento foi registrado."}</p></div><div><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Teste analítico</p><div className="mt-3 grid gap-3 lg:grid-cols-2">{lens.criteria.map(criterion => <div key={criterion.id} className="rounded-lg border border-border/70 bg-background/55 p-3"><p className="text-sm font-semibold text-primary">{criterion.title}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{testEntries[criterion.id] || "Não registrado."}</p></div>)}</div></div><div><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Texto da Ficha-Síntese</p><div className="mt-3 space-y-3">{paragraphs.map(([title, content]) => <div key={String(title)} className="rounded-lg border border-border/70 bg-background/55 p-4"><p className="text-sm font-semibold text-primary">{title}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{content || "Não registrado."}</p></div>)}</div></div></CardContent></Card>;
}

function SynthesisSection({ synthesis }: { synthesis: any }) {
  const blocks = [
    ["Juízo estratégico integrado", synthesis.strategicJudgment], ["Resultado das três lentes", synthesis.lensResults], ["Conexões, limites e pontos a esclarecer", synthesis.connectionsAndLimits], ["Resposta à Missão de Aprofundamento", synthesis.missionResponse], ["Recomendações estratégicas", synthesis.recommendations], ["Estado final desejado", synthesis.desiredEndState],
  ];
  const slides = [synthesis.slideOne, synthesis.slideTwo, synthesis.slideThree, synthesis.slideFour];
  return <Card className="border-0 bg-card/85 shadow-sm"><CardHeader className="border-b border-border/70 pb-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Produto de integração</p><CardTitle className="mt-1 font-serif text-xl text-primary">Síntese Estratégica Integrada</CardTitle></div><ReportStatus status={synthesis.status} /></div></CardHeader><CardContent className="space-y-6 pt-6"><div className="rounded-xl bg-muted/50 p-4"><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Eventos centrais</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedEventLabels(synthesis.selectedEventIds).join("; ") || "Nenhum evento foi registrado."}</p><p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary/70">Relações entre eventos</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{synthesis.connectionNotes || "Não registradas."}</p></div><div className="grid gap-3 lg:grid-cols-2">{blocks.map(([title, content]) => <div key={String(title)} className="rounded-lg border border-border/70 bg-background/55 p-4"><p className="text-sm font-semibold text-primary">{title}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{content || "Não registrado."}</p></div>)}</div><div><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Quatro slides finais</p><div className="mt-3 grid gap-3 md:grid-cols-2">{slides.map((slide, index) => <div key={index} className="rounded-lg border border-border/70 bg-background/55 p-4"><p className="text-sm font-semibold text-primary">Slide {index + 1}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{slide || "Não registrado."}</p></div>)}</div></div></CardContent></Card>;
}

function appendixText(workspace: any, appendix: ReturnType<typeof buildReportAppendices>[number]) {
  if (appendix.kind === "integration_matrix") {
    const synthesis = workspace.synthesis;
    return { selected: selectedEventLabels(synthesis?.selectedEventIds), entries: [{ title: "Relações entre eventos e grau de evidência", content: synthesis?.connectionNotes || "Não registrado." }] };
  }
  const worksheet = workspace.worksheets.find((item: any) => item.lens === appendix.lens);
  const lens = lenses[appendix.lens as WorksheetLens];
  const entries = lens.criteria.map(criterion => ({ title: criterion.title, content: (parseJson(worksheet?.testEntries) as Record<string, string>)[criterion.id] || "Não registrado." }));
  return { selected: selectedEventLabels(worksheet?.selectedEventIds), entries };
}

function AppendixSection({ workspace, appendices }: { workspace: any; appendices: ReturnType<typeof buildReportAppendices> }) {
  return <Card className="border-0 bg-amber-50/70 shadow-sm"><CardHeader><p className="eyebrow">Materiais de trabalho selecionados</p><CardTitle className="mt-1 font-serif text-xl text-primary">Anexos do relatório</CardTitle><CardDescription>{appendices.length ? "Somente matrizes explicitamente marcadas pelo GT são incluídas nesta seção." : "Nenhuma matriz foi selecionada como anexo para este relatório."}</CardDescription></CardHeader>{appendices.length > 0 && <CardContent className="space-y-4">{appendices.map(appendix => { const data = appendixText(workspace, appendix); return <div key={appendix.title} className="rounded-xl border border-amber-200 bg-white/75 p-4"><h3 className="font-semibold text-primary">{appendix.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong>Eventos associados:</strong> {data.selected.join("; ") || "Não registrados."}</p><div className="mt-3 space-y-2">{data.entries.map(entry => <div key={entry.title}><p className="text-sm font-medium text-primary">{entry.title}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{entry.content}</p></div>)}</div></div>; })}</CardContent>}</Card>;
}

function reportHtml(workspace: any, appendices: ReturnType<typeof buildReportAppendices>) {
  const worksheetHtml = reportLensOrder.map(lensId => {
    const worksheet = workspace.worksheets.find((item: any) => item.lens === lensId);
    const lens = lenses[lensId];
    if (!worksheet) return `<section><h2>Ficha-Síntese — ${escapeHtml(lens.label)}</h2><p>Não iniciada.</p></section>`;
    const tests = lens.criteria.map(criterion => `<h3>${escapeHtml(criterion.title)}</h3><p>${escapeHtml((parseJson(worksheet.testEntries) as Record<string, string>)[criterion.id] || "Não registrado.")}</p>`).join("");
    const paragraphs = [["Classificação e juízo central", worksheet.centralJudgment], ["Fundamentação", worksheet.evidenceBasis], ["Limites e explicações alternativas", worksheet.limitsAndAlternatives], ["O que ainda precisa ser esclarecido", worksheet.clarificationNeeded], ["Insumo temático para a integração", worksheet.integrationInput]].map(([title, content]) => `<h3>${escapeHtml(title)}</h3><p>${escapeHtml(content || "Não registrado.")}</p>`).join("");
    return `<section><h2>Ficha-Síntese — ${escapeHtml(lens.label)}</h2><p><strong>Status:</strong> ${escapeHtml(worksheet.status === "versao_final" ? "Versão final" : "Rascunho")}<br><strong>Classificação:</strong> ${escapeHtml(worksheet.classification || "Não registrada")}<br><strong>Eventos mobilizados:</strong> ${escapeHtml(selectedEventLabels(worksheet.selectedEventIds).join("; ") || "Não registrados")}</p><h3>Teste analítico</h3>${tests}<h3>Texto da Ficha-Síntese</h3>${paragraphs}</section>`;
  }).join("");
  const synthesis = workspace.synthesis;
  const synthesisHtml = synthesis ? `<section><h2>Síntese Estratégica Integrada</h2><p><strong>Status:</strong> ${escapeHtml(synthesis.status === "versao_final" ? "Versão final" : "Rascunho")}<br><strong>Eventos centrais:</strong> ${escapeHtml(selectedEventLabels(synthesis.selectedEventIds).join("; ") || "Não registrados")}</p>${[["Relações entre eventos", synthesis.connectionNotes], ["Juízo estratégico integrado", synthesis.strategicJudgment], ["Resultado das três lentes", synthesis.lensResults], ["Conexões, limites e pontos a esclarecer", synthesis.connectionsAndLimits], ["Resposta à Missão de Aprofundamento", synthesis.missionResponse], ["Recomendações estratégicas", synthesis.recommendations], ["Estado final desejado", synthesis.desiredEndState]].map(([title, content]) => `<h3>${escapeHtml(title)}</h3><p>${escapeHtml(content || "Não registrado.")}</p>`).join("")}<h3>Quatro slides finais</h3>${[synthesis.slideOne, synthesis.slideTwo, synthesis.slideThree, synthesis.slideFour].map((slide, index) => `<h4>Slide ${index + 1}</h4><p>${escapeHtml(slide || "Não registrado.")}</p>`).join("")}</section>` : `<section><h2>Síntese Estratégica Integrada</h2><p>Não iniciada.</p></section>`;
  const appendicesHtml = appendices.length ? appendices.map(appendix => { const content = appendixText(workspace, appendix); return `<section><h2>Anexo — ${escapeHtml(appendix.title)}</h2><p><strong>Eventos associados:</strong> ${escapeHtml(content.selected.join("; ") || "Não registrados")}</p>${content.entries.map(entry => `<h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.content)}</p>`).join("")}</section>`; }).join("") : `<section><h2>Anexos</h2><p>Nenhuma matriz foi selecionada pelo GT.</p></section>`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório consolidado — ${escapeHtml(workspace.group.code)}</title><style>body{font-family:Arial,sans-serif;max-width:900px;margin:36px auto;padding:0 32px;color:#152f4f;line-height:1.58}h1,h2{font-family:Georgia,serif}h1{font-size:30px;margin:0 0 8px}h2{font-size:21px;border-bottom:1px solid #c9d6e3;padding-bottom:7px;margin:38px 0 14px;break-after:avoid}h3{font-size:14px;margin:20px 0 4px}h4{font-size:13px;margin:14px 0 4px}p{font-size:13px;color:#314861;white-space:pre-wrap;margin:0 0 10px}.eyebrow{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#8a6417}.meta{padding:15px;background:#eff4f8;border-radius:9px;margin:18px 0}section{break-inside:avoid}@media print{body{margin:0;max-width:none;padding:0}section{break-inside:auto}}</style></head><body><p class="eyebrow">GEN-Brasil · Jornada Acadêmica CSD 2026</p><h1>Relatório Consolidado do Grupo de Trabalho</h1><div class="meta"><p><strong>Caso de Estudo:</strong> ${escapeHtml(CASE_TITLE)}</p><p><strong>Grupo de Trabalho:</strong> ${escapeHtml(workspace.group.code)} · ${escapeHtml(workspace.group.missionAxis)}</p><p><strong>Missão de Aprofundamento:</strong> ${escapeHtml(workspace.group.missionText)}</p><p><strong>Gerado em:</strong> ${escapeHtml(new Date().toLocaleString("pt-BR"))}</p></div>${worksheetHtml}${synthesisHtml}${appendicesHtml}</body></html>`;
}

function EmptyReport() {
  return <Card className="border-dashed bg-card/80"><CardContent className="flex min-h-56 flex-col items-center justify-center p-8 text-center"><ScrollText className="h-8 w-8 text-primary" /><h2 className="mt-4 font-serif text-xl text-primary">Selecione um Grupo de Trabalho</h2><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">O relatório é sempre gerado no contexto de um GT e incorpora somente seus produtos e anexos selecionados.</p></CardContent></Card>;
}

export default function ConsolidatedReport() {
  const [groupId, setGroupId] = useState<number | null>(null);
  const { data: workspace, isLoading } = trpc.workspace.groupWorkspace.useQuery({ groupId: groupId ?? 0 }, { enabled: Boolean(groupId) });
  if (!groupId) return <div className="mx-auto w-full max-w-[1520px] pb-10"><ReportHeader groupId={groupId} onChange={setGroupId} /><EmptyReport /></div>;
  if (isLoading || !workspace) return <div className="flex min-h-[300px] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;
  const appendices = buildReportAppendices(workspace);
  const readiness = reportReadiness(workspace);
  const openPrint = () => { const page = window.open("", "_blank", "noopener,noreferrer"); if (!page) { toast.error("Permita janelas pop-up para gerar o relatório em PDF."); return; } page.document.write(reportHtml(workspace, appendices)); page.document.close(); page.focus(); window.setTimeout(() => page.print(), 200); };
  return <div className="mx-auto w-full max-w-[1520px] pb-10"><ReportHeader groupId={groupId} onChange={setGroupId} /><section className="mb-6 rounded-[1.35rem] bg-primary p-6 text-primary-foreground shadow-[0_12px_35px_-24px_rgba(17,42,73,0.7)]"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">{workspace.group.code} · Relatório consolidado</p><h2 className="mt-3 font-serif text-2xl">{CASE_TITLE}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-100/80">O relatório incorpora as Fichas-Síntese, a Síntese Estratégica Integrada, os quatro slides e, quando selecionadas, as matrizes de trabalho como anexos.</p></div><Button className="bg-amber-400 text-primary hover:bg-amber-300" onClick={openPrint}><Printer className="mr-2 h-4 w-4" />Gerar relatório em PDF</Button></div></section><Card className={readiness.complete ? "mb-6 border-emerald-200 bg-emerald-50/65" : "mb-6 border-amber-200 bg-amber-50/65"}><CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"><div className={readiness.complete ? "rounded-lg bg-emerald-100 p-2 text-emerald-800" : "rounded-lg bg-amber-100 p-2 text-amber-800"}>{readiness.complete ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}</div><div><p className="font-semibold text-primary">{readiness.complete ? "Relatório com todos os produtos finalizados" : "Relatório disponível, com produtos ainda em elaboração"}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{readiness.finalizedWorksheets}/3 fichas finalizadas · Síntese {readiness.synthesisFinalized ? "finalizada" : "em elaboração"} · {appendices.length} anexo{appendices.length === 1 ? " selecionado" : "s selecionados"}.</p></div></CardContent></Card><div className="space-y-6"><section><div className="mb-3 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><h2 className="font-serif text-xl text-primary">Fichas-Síntese</h2></div><div className="space-y-5">{reportLensOrder.map(lens => { const worksheet = workspace.worksheets.find((item: any) => item.lens === lens); return worksheet ? <WorksheetSection key={lens} worksheet={worksheet} /> : <Card key={lens} className="border-dashed bg-card/70"><CardContent className="p-5"><p className="font-semibold text-primary">Ficha-Síntese — {lenses[lens].label}</p><p className="mt-1 text-sm text-muted-foreground">Ainda não iniciada.</p></CardContent></Card>; })}</div></section>{workspace.synthesis ? <SynthesisSection synthesis={workspace.synthesis} /> : <Card className="border-dashed bg-card/70"><CardContent className="p-5"><p className="font-semibold text-primary">Síntese Estratégica Integrada</p><p className="mt-1 text-sm text-muted-foreground">Ainda não iniciada.</p></CardContent></Card>}<AppendixSection workspace={workspace} appendices={appendices} /></div></div>;
}

function ReportHeader({ groupId, onChange }: { groupId: number | null; onChange: (id: number) => void }) {
  return <header className="mb-7 flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Produto de consolidação</p><h1 className="mt-2 font-serif text-2xl leading-snug text-primary sm:text-3xl">Relatório do Grupo de Trabalho</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Revise e reúna em um único documento os produtos acadêmicos do GT antes da entrega final.</p></div><GroupSelector groupId={groupId} onChange={onChange} /></header>;
}
