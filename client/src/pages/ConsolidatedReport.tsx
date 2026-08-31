import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadGroupReportPdf } from "@/lib/groupReportPdfDownload";
import { trpc } from "@/lib/trpc";
import { buildReportAppendices, reportLensOrder, reportReadiness } from "@shared/consolidatedReport";
import { CASE_TITLE, caseEvents, lenses, type WorksheetLens } from "@shared/exercise";
import { AlertCircle, CheckCircle2, FileDown, FileText, Loader2, ScrollText, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function parseJson(value?: string | null) {
  try {
    return JSON.parse(value ?? "{}");
  } catch {
    return {};
  }
}

function selectedEventIds(value?: string | null) {
  const ids = parseJson(value);
  return Array.isArray(ids) ? ids.filter(id => typeof id === "number") : [];
}

function selectedEventLabels(value?: string | null) {
  return selectedEventIds(value).map(id => `Evento ${id} · ${caseEvents.find(event => event.id === id)?.title}`).filter(Boolean);
}

function worksheetLabel(lens: WorksheetLens) {
  return `Ficha-Síntese ${reportLensOrder.indexOf(lens) + 1} — ${lenses[lens].label}`;
}

function GroupSelector({ groupId, onChange }: { groupId: number | null; onChange: (id: number) => void }) {
  const { data: access } = trpc.workspace.myAccess.useQuery();
  const groups = useMemo(() => access?.isAdmin ? access.availableGroups : access?.memberships.map(item => ({ id: item.groupId, code: item.code, missionAxis: item.missionAxis })) ?? [], [access]);
  useEffect(() => { if (!groupId && groups[0]) onChange(groups[0].id); }, [groupId, groups, onChange]);
  if (!groups.length) return null;
  return <Select value={groupId ? String(groupId) : undefined} onValueChange={value => onChange(Number(value))}><SelectTrigger className="w-full bg-card sm:w-[300px]"><SelectValue placeholder="Selecione o GT" /></SelectTrigger><SelectContent>{groups.map(group => <SelectItem key={group.id} value={String(group.id)}>{group.code} · {group.missionAxis}</SelectItem>)}</SelectContent></Select>;
}

function ReportStatus({ status }: { status?: string | null }) {
  const label = status === "versao_final" ? "Versão final" : status === "rascunho" ? "Rascunho" : "Não iniciado";
  const style = status === "versao_final" ? "bg-indigo-100 text-indigo-900 hover:bg-indigo-100" : status === "rascunho" ? "bg-amber-100 text-amber-900 hover:bg-amber-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100";
  return <Badge className={style}>{label}</Badge>;
}

function ResultBadge({ value }: { value?: string }) {
  const style = value === "Satisfeito" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : value === "Parcial" ? "border-amber-200 bg-amber-50 text-amber-900" : value === "Não satisfeito" ? "border-rose-200 bg-rose-50 text-rose-800" : value === "Insuficiente" ? "border-slate-200 bg-slate-50 text-slate-700" : "border-border bg-muted/40 text-muted-foreground";
  return <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${style}`}>{value || "Não registrado"}</span>;
}

function WorksheetSection({ worksheet }: { worksheet: any }) {
  const lens = lenses[worksheet.lens as WorksheetLens];
  const entries = parseJson(worksheet.testEntries) as Record<string, string>;
  const results = parseJson(worksheet.testResults) as Record<string, string>;
  const sufficiency = parseJson(worksheet.testSufficiency) as Record<string, string>;
  const paragraphs = [
    ["Classificação e juízo central", worksheet.centralJudgment],
    ["Fundamentação", worksheet.evidenceBasis],
    ["Limites e explicações alternativas", worksheet.limitsAndAlternatives],
    ["O que ainda precisa ser esclarecido", worksheet.clarificationNeeded],
    ["Insumo temático para a integração", worksheet.integrationInput],
  ];
  return <Card className="border-0 bg-card/85 shadow-sm"><CardHeader className="border-b border-border/70 pb-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Ficha-Síntese</p><CardTitle className="mt-1 font-serif text-xl text-primary">{lens.label}</CardTitle></div><ReportStatus status={worksheet.status} /></div><CardDescription className="pt-2">Classificação: <span className="font-semibold text-primary">{worksheet.classification || "Não registrada"}</span></CardDescription></CardHeader><CardContent className="space-y-6 pt-6"><div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-muted/50 p-4"><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Eventos mobilizados</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedEventLabels(worksheet.selectedEventIds).join("; ") || "Nenhum evento foi registrado."}</p></div><div className="rounded-xl border border-amber-200/70 bg-amber-50/65 p-4"><p className="text-xs font-bold uppercase tracking-widest text-amber-800">Eventos decisivos</p><p className="mt-2 text-sm leading-6 text-amber-950/80">{selectedEventLabels(worksheet.decisiveEventIds).join("; ") || "Nenhum evento foi destacado."}</p></div></div><div><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Teste analítico</p><div className="mt-3 overflow-x-auto rounded-xl border border-border/70"><div className="min-w-[860px]"><div className="grid grid-cols-[0.8fr_1.45fr_0.7fr_1.1fr] border-b bg-muted/65 text-xs font-bold uppercase tracking-wider text-primary"><p className="p-3">Elemento</p><p className="border-l p-3">Aplicação aos eventos</p><p className="border-l p-3">Resultado</p><p className="border-l p-3">Teste de suficiência</p></div>{lens.criteria.map(criterion => <div key={criterion.id} className="grid grid-cols-[0.8fr_1.45fr_0.7fr_1.1fr] border-b border-border/60 last:border-0"><p className="p-3 text-sm font-semibold leading-6 text-primary">{criterion.title}</p><p className="border-l p-3 text-sm leading-6 text-muted-foreground">{entries[criterion.id] || "Não registrado."}</p><div className="border-l p-3"><ResultBadge value={results[criterion.id]} /></div><p className="border-l p-3 text-sm leading-6 text-muted-foreground">{sufficiency[criterion.id] || "Não registrado."}</p></div>)}</div></div></div><div><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Texto da Ficha-Síntese</p><div className="mt-3 space-y-3">{paragraphs.map(([title, content]) => <div key={String(title)} className="rounded-lg border border-border/70 bg-background/55 p-4"><p className="text-sm font-semibold text-primary">{title}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{String(content || "Não registrado.")}</p></div>)}</div></div></CardContent></Card>;
}

function SynthesisSection({ synthesis }: { synthesis: any }) {
  const blocks = [["Relações entre eventos", synthesis.connectionNotes], ["Juízo estratégico integrado", synthesis.strategicJudgment], ["Resultado das três lentes", synthesis.lensResults], ["Conexões, limites e pontos a esclarecer", synthesis.connectionsAndLimits], ["Resposta à Missão de Aprofundamento", synthesis.missionResponse], ["Recomendações estratégicas", synthesis.recommendations], ["Estado final desejado", synthesis.desiredEndState]];
  const slides = [synthesis.slideOne, synthesis.slideTwo, synthesis.slideThree, synthesis.slideFour];
  return <Card className="border-0 bg-card/85 shadow-sm"><CardHeader className="border-b border-border/70 pb-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Produto de integração</p><CardTitle className="mt-1 font-serif text-xl text-primary">Síntese Estratégica Integrada</CardTitle></div><ReportStatus status={synthesis.status} /></div></CardHeader><CardContent className="space-y-6 pt-6"><div className="rounded-xl bg-muted/50 p-4"><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Eventos centrais</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedEventLabels(synthesis.selectedEventIds).join("; ") || "Nenhum evento foi registrado."}</p></div><div className="grid gap-3 lg:grid-cols-2">{blocks.map(([title, content]) => <div key={String(title)} className="rounded-lg border border-border/70 bg-background/55 p-4"><p className="text-sm font-semibold text-primary">{title}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{String(content || "Não registrado.")}</p></div>)}</div><div><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Quatro slides finais</p><div className="mt-3 grid gap-3 md:grid-cols-2">{slides.map((slide, index) => <div key={index} className="rounded-lg border border-border/70 bg-background/55 p-4"><p className="text-sm font-semibold text-primary">Slide {index + 1}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{slide || "Não registrado."}</p></div>)}</div></div></CardContent></Card>;
}

function AppendixSection({ workspace, appendices }: { workspace: any; appendices: ReturnType<typeof buildReportAppendices> }) {
  if (!appendices.length) return <Card className="border-dashed bg-card/70"><CardContent className="p-5"><p className="font-semibold text-primary">Anexos do relatório</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Nenhuma matriz foi selecionada pelo GT como anexo opcional.</p></CardContent></Card>;
  return <Card className="border-0 bg-amber-50/70 shadow-sm"><CardHeader><p className="eyebrow">Materiais de trabalho selecionados</p><CardTitle className="mt-1 font-serif text-xl text-primary">Anexos do relatório</CardTitle><CardDescription>Somente matrizes explicitamente marcadas pelo GT são incluídas no documento baixável.</CardDescription></CardHeader><CardContent className="space-y-3">{appendices.map(appendix => { const worksheet = appendix.lens ? workspace.worksheets.find((item: any) => item.lens === appendix.lens) : null; return <div key={appendix.title} className="rounded-xl border border-amber-200 bg-white/75 p-4"><p className="font-semibold text-primary">{appendix.title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{appendix.kind === "worksheet_matrix" ? `Eventos associados: ${selectedEventLabels(worksheet?.selectedEventIds).join("; ") || "Não registrados."}` : "Matriz de integração baseada nas relações entre eventos registradas na Síntese Estratégica."}</p></div>; })}</CardContent></Card>;
}

function EmptyReport() {
  return <Card className="border-dashed bg-card/80"><CardContent className="flex min-h-56 flex-col items-center justify-center p-8 text-center"><UsersRound className="h-8 w-8 text-primary" /><h2 className="mt-4 font-serif text-xl text-primary">Selecione um Grupo de Trabalho</h2><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">O relatório incorpora somente os produtos e anexos selecionados no contexto do GT escolhido.</p></CardContent></Card>;
}

function ReportHeader({ groupId, onChange }: { groupId: number | null; onChange: (id: number) => void }) {
  return <header className="mb-7 flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Produto de consolidação</p><h1 className="mt-2 font-serif text-2xl leading-snug text-primary sm:text-3xl">Relatório do Grupo de Trabalho</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Reúna as Fichas-Síntese, a Síntese Estratégica Integrada, os slides e os anexos do GT em um único PDF estruturado.</p></div><GroupSelector groupId={groupId} onChange={onChange} /></header>;
}

export default function ConsolidatedReport() {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [selectedLenses, setSelectedLenses] = useState<WorksheetLens[]>(reportLensOrder);
  const { data: workspace, isLoading } = trpc.workspace.groupWorkspace.useQuery({ groupId: groupId ?? 0 }, { enabled: Boolean(groupId) });
  if (!groupId) return <div className="mx-auto w-full max-w-[1520px] pb-10"><ReportHeader groupId={groupId} onChange={setGroupId} /><EmptyReport /></div>;
  if (isLoading || !workspace) return <div className="flex min-h-[300px] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;
  const appendices = buildReportAppendices(workspace);
  const readiness = reportReadiness(workspace);
  const selectedWorksheetLenses = reportLensOrder.filter(lens => selectedLenses.includes(lens));
  const downloadPdf = () => {
    if (!selectedWorksheetLenses.length) {
      toast.error("Selecione ao menos uma Ficha-Síntese para gerar o relatório em PDF.");
      return;
    }
    try {
      downloadGroupReportPdf(workspace, selectedWorksheetLenses);
      toast.success("Relatório do GT gerado e iniciado para download.");
    } catch {
      toast.error("Não foi possível gerar o relatório em PDF. Tente novamente.");
    }
  };
  return <div className="mx-auto w-full max-w-[1520px] pb-10"><ReportHeader groupId={groupId} onChange={setGroupId} /><section className="mb-6 rounded-[1.35rem] bg-primary p-6 text-primary-foreground shadow-[0_12px_35px_-24px_rgba(17,42,73,0.7)]"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">{workspace.group.code} · Relatório consolidado</p><h2 className="mt-3 font-serif text-2xl">{CASE_TITLE}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-100/80">O documento inclui identificação institucional, integrantes do GT, as Fichas-Síntese selecionadas, síntese integrada, slides e anexos configurados.</p></div><div className="w-full space-y-3 rounded-xl border border-white/15 bg-white/10 p-4 lg:max-w-md"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">Fichas no PDF</p><p className="mt-1 text-xs leading-5 text-slate-100/75">Selecione as Fichas-Síntese que deverão integrar este relatório.</p></div><div className="space-y-2">{reportLensOrder.map(lens => <label key={lens} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/15 bg-slate-950/10 px-3 py-2.5 text-sm transition-colors hover:bg-white/10"><Checkbox checked={selectedLenses.includes(lens)} onCheckedChange={(checked) => setSelectedLenses(current => checked ? Array.from(new Set([...current, lens])) : current.filter(item => item !== lens))} className="border-white/60 bg-white text-primary data-[state=checked]:border-amber-300 data-[state=checked]:bg-amber-300" /><span>{worksheetLabel(lens)}</span></label>)}</div><Button className="w-full bg-amber-400 text-primary hover:bg-amber-300" onClick={downloadPdf}><FileDown className="mr-2 h-4 w-4" />Gerar relatório em PDF</Button></div></div></section><Card className={readiness.complete ? "mb-6 border-emerald-200 bg-emerald-50/65" : "mb-6 border-amber-200 bg-amber-50/65"}><CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"><div className={readiness.complete ? "rounded-lg bg-emerald-100 p-2 text-emerald-800" : "rounded-lg bg-amber-100 p-2 text-amber-800"}>{readiness.complete ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}</div><div><p className="font-semibold text-primary">{readiness.complete ? "Relatório com todos os produtos finalizados" : "Relatório disponível, com produtos ainda em elaboração"}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{readiness.finalizedWorksheets}/3 fichas finalizadas · Síntese {readiness.synthesisFinalized ? "finalizada" : "em elaboração"} · {appendices.length} anexo{appendices.length === 1 ? " selecionado" : "s selecionados"}.</p></div></CardContent></Card><div className="space-y-6"><section><div className="mb-3 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><h2 className="font-serif text-xl text-primary">Fichas-Síntese selecionadas</h2></div><div className="space-y-5">{selectedWorksheetLenses.length ? selectedWorksheetLenses.map(lens => { const worksheet = workspace.worksheets.find((item: any) => item.lens === lens); return worksheet ? <WorksheetSection key={lens} worksheet={worksheet} /> : <Card key={lens} className="border-dashed bg-card/70"><CardContent className="p-5"><p className="font-semibold text-primary">{worksheetLabel(lens)}</p><p className="mt-1 text-sm text-muted-foreground">Ainda não iniciada.</p></CardContent></Card>; }) : <Card className="border-dashed bg-card/70"><CardContent className="p-5 text-sm leading-6 text-muted-foreground">Selecione ao menos uma Ficha-Síntese para visualizar a composição do PDF.</CardContent></Card>}</div></section>{workspace.synthesis ? <SynthesisSection synthesis={workspace.synthesis} /> : <Card className="border-dashed bg-card/70"><CardContent className="p-5"><p className="font-semibold text-primary">Síntese Estratégica Integrada</p><p className="mt-1 text-sm text-muted-foreground">Ainda não iniciada.</p></CardContent></Card>}<AppendixSection workspace={workspace} appendices={appendices} /></div></div>;
}
