import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getWorksheetPdfFit } from "@/lib/worksheetPdfDownload";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { analyticResultOptions, caseEvents, classificationOptions, lenses, type AnalyticResult, type Classification, type WorksheetLens } from "@shared/exercise";
import { AlertTriangle, CheckCircle2, FileCheck2, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type WorksheetDraft = {
  classification: Classification | "";
  selectedEventIds: number[];
  decisiveEventIds: number[];
  testEntries: Record<string, string>;
  testResults: Record<string, AnalyticResult | "">;
  testSufficiency: Record<string, string>;
  centralJudgment: string;
  evidenceBasis: string;
  limitsAndAlternatives: string;
  clarificationNeeded: string;
  integrationInput: string;
};

const emptyDraft = (): WorksheetDraft => ({
  classification: "",
  selectedEventIds: [],
  decisiveEventIds: [],
  testEntries: {},
  testResults: {},
  testSufficiency: {},
  centralJudgment: "",
  evidenceBasis: "",
  limitsAndAlternatives: "",
  clarificationNeeded: "",
  integrationInput: "",
});

function parseRecord(value?: string | null) {
  try {
    const parsed = JSON.parse(value ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, string> : {};
  } catch {
    return {};
  }
}

function parseEventIds(value?: string | null) {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === "number") : [];
  } catch {
    return [];
  }
}

function wordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function ParagraphField({ number, title, value, onChange, hint }: { number: string; title: string; value: string; onChange: (value: string) => void; hint: string }) {
  return <div className="rounded-xl border border-border/75 bg-background/55 p-4 sm:p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold text-primary">{number}</span><div><Label className="text-base font-semibold text-primary">{title}</Label><p className="mt-1 text-sm leading-6 text-muted-foreground">{hint}</p></div></div><span className="text-xs text-muted-foreground">{wordCount(value)} palavras</span></div><Textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-4 min-h-32 resize-y bg-card" placeholder="Redija o parágrafo analítico do GT." /></div>;
}

export function WorksheetEditorEnhanced({ activeGroupId }: { activeGroupId: number | null }) {
  const { data: workspace, isLoading } = trpc.workspace.groupWorkspace.useQuery({ groupId: activeGroupId ?? 0 }, { enabled: Boolean(activeGroupId) });
  const utils = trpc.useUtils();
  const [activeLens, setActiveLens] = useState<WorksheetLens>("guerra_hibrida");
  const [draft, setDraft] = useState<WorksheetDraft>(emptyDraft());
  const existing = workspace?.worksheets.find((item: any) => item.lens === activeLens);
  const activeDefinition = lenses[activeLens];
  const save = trpc.workspace.saveWorksheet.useMutation({
    onSuccess: () => {
      toast.success("Ficha salva com êxito.");
      utils.workspace.groupWorkspace.invalidate({ groupId: activeGroupId ?? 0 });
      utils.workspace.myAccess.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  useEffect(() => {
    const rawResults = parseRecord(existing?.testResults);
    const validResults = Object.fromEntries(Object.entries(rawResults).filter(([, value]) => analyticResultOptions.includes(value as AnalyticResult))) as Record<string, AnalyticResult>;
    setDraft({
      classification: (existing?.classification as Classification | null) ?? "",
      selectedEventIds: parseEventIds(existing?.selectedEventIds),
      decisiveEventIds: parseEventIds(existing?.decisiveEventIds),
      testEntries: parseRecord(existing?.testEntries),
      testResults: validResults,
      testSufficiency: parseRecord(existing?.testSufficiency),
      centralJudgment: existing?.centralJudgment ?? "",
      evidenceBasis: existing?.evidenceBasis ?? "",
      limitsAndAlternatives: existing?.limitsAndAlternatives ?? "",
      clarificationNeeded: existing?.clarificationNeeded ?? "",
      integrationInput: existing?.integrationInput ?? "",
    });
  }, [activeLens, existing?.id, existing?.updatedAt]);

  if (!activeGroupId) return <Card className="border-dashed bg-card/80"><CardContent className="p-8 text-center text-sm leading-6 text-muted-foreground">Selecione um Grupo de Trabalho para registrar a Ficha-Síntese.</CardContent></Card>;
  if (isLoading || !workspace) return <div className="flex min-h-[260px] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const isFinal = existing?.status === "versao_final";
  const resultsComplete = activeDefinition.criteria.every(criterion => Boolean(draft.testResults[criterion.id]));
  const essentialTextComplete = Boolean(draft.classification && draft.centralJudgment.trim() && draft.evidenceBasis.trim() && draft.limitsAndAlternatives.trim() && draft.clarificationNeeded.trim() && draft.integrationInput.trim());
  const isComplete = essentialTextComplete && resultsComplete;
  const pdfFit = getWorksheetPdfFit(draft);
  const bodyUsePercent = Math.min(999, Math.round((pdfFit.usedHeight / pdfFit.availableHeight) * 100));
  const update = <K extends keyof WorksheetDraft>(key: K, value: WorksheetDraft[K]) => setDraft(current => ({ ...current, [key]: value }));
  const toggleEvidence = (eventId: number) => setDraft(current => {
    const selectedEventIds = current.selectedEventIds.includes(eventId) ? current.selectedEventIds.filter(id => id !== eventId) : [...current.selectedEventIds, eventId].sort((a, b) => a - b);
    return { ...current, selectedEventIds, decisiveEventIds: current.decisiveEventIds.filter(id => selectedEventIds.includes(id)) };
  });
  const toggleDecisive = (eventId: number) => setDraft(current => ({ ...current, decisiveEventIds: current.decisiveEventIds.includes(eventId) ? current.decisiveEventIds.filter(id => id !== eventId) : [...current.decisiveEventIds, eventId].sort((a, b) => a - b) }));
  const submit = (status: "rascunho" | "versao_final") => {
    if (status === "versao_final" && !isComplete) {
      toast.error("Para finalizar, preencha a classificação, os cinco parágrafos e o resultado de todos os critérios.");
      return;
    }
    save.mutate({
      groupId: activeGroupId,
      lens: activeLens,
      classification: draft.classification || null,
      selectedEventIds: JSON.stringify(draft.selectedEventIds),
      decisiveEventIds: JSON.stringify(draft.decisiveEventIds),
      testEntries: JSON.stringify(draft.testEntries),
      testResults: JSON.stringify(draft.testResults),
      testSufficiency: JSON.stringify(draft.testSufficiency),
      centralJudgment: draft.centralJudgment,
      evidenceBasis: draft.evidenceBasis,
      limitsAndAlternatives: draft.limitsAndAlternatives,
      clarificationNeeded: draft.clarificationNeeded,
      integrationInput: draft.integrationInput,
      status,
    });
  };

  return <div className="space-y-6"><section className="rounded-[1.35rem] border border-primary/10 bg-card/80 p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="eyebrow">{workspace.group.code} · {workspace.group.missionAxis}</p><h2 className="mt-2 font-serif text-2xl text-primary">Matriz e texto de análise</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Registre evidências, destaque os eventos decisivos, avalie cada critério e consolide o juízo analítico do GT.</p></div><Badge className={isFinal ? "bg-indigo-100 text-indigo-900 hover:bg-indigo-100" : "bg-amber-100 text-amber-900 hover:bg-amber-100"}>{isFinal ? "Versão final" : "Rascunho em elaboração"}</Badge></div></section><Tabs value={activeLens} onValueChange={(value) => setActiveLens(value as WorksheetLens)} className="space-y-5"><TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0"><TabsTrigger value="guerra_hibrida" className="rounded-lg border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Guerra Híbrida</TabsTrigger><TabsTrigger value="lawfare" className="rounded-lg border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Lawfare</TabsTrigger><TabsTrigger value="seguranca_transnacional" className="rounded-lg border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Segurança Transnacional</TabsTrigger></TabsList><TabsContent value={activeLens} className="mt-0 space-y-6"><Card className="border-0 bg-primary text-primary-foreground shadow-[0_12px_35px_-24px_rgba(17,42,73,0.7)]"><CardContent className="p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">Pergunta-chave</p><p className="mt-3 max-w-4xl font-serif text-base leading-7">{activeDefinition.keyQuestion}</p><p className="mt-4 text-sm leading-6 text-slate-100/80">{activeDefinition.guidance}</p></CardContent></Card><div className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]"><Card className="border-0 bg-card/85 shadow-sm"><CardHeader><p className="eyebrow">Etapa 1</p><CardTitle className="mt-1 font-serif text-xl text-primary">Evidências mobilizadas</CardTitle><CardDescription>Selecione os eventos efetivamente utilizados. Os eventos prioritários são guia, não lista fechada.</CardDescription></CardHeader><CardContent><div className="grid gap-2 sm:grid-cols-2">{caseEvents.map(event => <label key={event.id} className={cn("flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors", draft.selectedEventIds.includes(event.id) ? "border-primary bg-secondary/55" : "border-border/80 bg-card hover:border-primary/30")}><Checkbox className="mt-0.5" checked={draft.selectedEventIds.includes(event.id)} onCheckedChange={() => toggleEvidence(event.id)} /><span><span className="font-semibold text-primary">Evento {event.id}</span><span className="ml-2 text-muted-foreground">{event.title}</span>{activeDefinition.priorityEvents.includes(event.id) && <span className="ml-2 inline-flex rounded bg-amber-100 px-1.5 py-0.5 text-[0.64rem] font-bold uppercase tracking-wide text-amber-900">prioritário</span>}</span></label>)}</div><div className="mt-5 border-t border-border/70 pt-5"><p className="text-sm font-semibold text-primary">Eventos decisivos</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Selecione somente entre os eventos já mobilizados. Esta indicação será destacada no Relatório do GT.</p><div className="mt-3 flex flex-wrap gap-2">{draft.selectedEventIds.length ? draft.selectedEventIds.map(eventId => <label key={eventId} className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm", draft.decisiveEventIds.includes(eventId) ? "border-amber-300 bg-amber-50 text-amber-950" : "border-border/80 bg-background/55 text-muted-foreground")}><Checkbox checked={draft.decisiveEventIds.includes(eventId)} onCheckedChange={() => toggleDecisive(eventId)} />Evento {eventId}</label>) : <p className="rounded-lg border border-dashed px-3 py-2 text-xs leading-5 text-muted-foreground">Selecione primeiro ao menos uma evidência mobilizada.</p>}</div></div></CardContent></Card><Card className="border-0 bg-card/85 shadow-sm"><CardHeader><p className="eyebrow">Etapa 2</p><CardTitle className="mt-1 font-serif text-xl text-primary">Classificação fundamentada</CardTitle><CardDescription>Defina a conclusão depois de confrontar os elementos constitutivos com as evidências disponíveis.</CardDescription></CardHeader><CardContent><Label htmlFor="classification">Classificação do GT</Label><Select value={draft.classification || undefined} onValueChange={(value) => update("classification", value as Classification)}><SelectTrigger id="classification" className="mt-2"><SelectValue placeholder="Selecione a classificação" /></SelectTrigger><SelectContent>{classificationOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select><div className="mt-5 rounded-lg bg-muted/65 p-4"><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Regra de decisão</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{activeDefinition.decisionRule}</p></div></CardContent></Card></div><Card className="border-0 bg-card/85 shadow-sm"><CardHeader><p className="eyebrow">Etapa 3</p><CardTitle className="mt-1 font-serif text-xl text-primary">Teste analítico</CardTitle><CardDescription>Registre a aplicação aos eventos, o resultado do critério e o teste de suficiência. O resultado é obrigatório para finalizar a ficha.</CardDescription></CardHeader><CardContent className="space-y-5">{activeDefinition.criteria.map((criterion, index) => <section key={criterion.id} className="rounded-xl border border-border/75 bg-background/55 p-4 sm:p-5"><div className="grid gap-5 xl:grid-cols-[0.55fr_1fr]"><div><div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded bg-secondary text-xs font-bold text-primary">{index + 1}</span><h3 className="font-semibold text-primary">{criterion.title}</h3></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{criterion.definition}</p><div className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50 p-3"><p className="text-[0.65rem] font-bold uppercase tracking-widest text-amber-800">Não basta</p><p className="mt-1 text-xs leading-5 text-amber-950/80">{criterion.insufficient}</p></div></div><div className="space-y-4"><div><Label htmlFor={`application-${criterion.id}`} className="text-sm leading-6 text-primary">Aplicação aos eventos</Label><Textarea id={`application-${criterion.id}`} value={draft.testEntries[criterion.id] ?? ""} onChange={(event) => update("testEntries", { ...draft.testEntries, [criterion.id]: event.target.value })} className="mt-2 min-h-28 resize-y" placeholder="Relacione fatos, eventos e limites da evidência ao critério." /></div><div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]"><div><Label htmlFor={`result-${criterion.id}`}>Resultado <span className="text-rose-700">*</span></Label><Select value={draft.testResults[criterion.id] || undefined} onValueChange={(value) => update("testResults", { ...draft.testResults, [criterion.id]: value as AnalyticResult })}><SelectTrigger id={`result-${criterion.id}`} className="mt-2"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{analyticResultOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div><div><Label htmlFor={`sufficiency-${criterion.id}`}>Teste de suficiência</Label><Textarea id={`sufficiency-${criterion.id}`} value={draft.testSufficiency[criterion.id] ?? ""} onChange={(event) => update("testSufficiency", { ...draft.testSufficiency, [criterion.id]: event.target.value })} className="mt-2 min-h-24 resize-y" placeholder="Justifique o resultado e registre os limites da evidência." /></div></div></div></div></section>)}<div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950/80">O <strong>resultado</strong> resume a conclusão do critério; o <strong>teste de suficiência</strong> registra a justificativa e os limites da evidência.</div></CardContent></Card><Card className="border-0 bg-card/85 shadow-sm"><CardHeader><p className="eyebrow">Etapa 4</p><CardTitle className="mt-1 font-serif text-xl text-primary">Texto da Ficha-Síntese</CardTitle><CardDescription>Redija os cinco parágrafos exigidos pela Coletânea. O corpo do PDF aceita até uma página.</CardDescription></CardHeader><CardContent className="space-y-6">{pdfFit.fits ? <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-950"><strong>Estimativa de extensão:</strong> cerca de {bodyUsePercent}% da página do corpo será utilizado. O PDF manterá a Ficha-Síntese em uma única página após a capa.</div> : <div role="alert" className="flex gap-3 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-950"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" /><p><strong>Extensão excedida:</strong> os cinco parágrafos ocuparão cerca de {bodyUsePercent}% do corpo disponível e ultrapassarão uma página no PDF. Reduza o texto antes de exportar.</p></div>}<ParagraphField number="1" title="Classificação e juízo central" value={draft.centralJudgment} onChange={(value) => update("centralJudgment", value)} hint="Apresente a classificação adotada e a razão principal da conclusão." /><ParagraphField number="2" title="Fundamentação" value={draft.evidenceBasis} onChange={(value) => update("evidenceBasis", value)} hint="Cite os eventos decisivos e relacione os fatos aos critérios do teste." /><ParagraphField number="3" title="Limites e explicações alternativas" value={draft.limitsAndAlternatives} onChange={(value) => update("limitsAndAlternatives", value)} hint="Delimite onde a evidência é insuficiente e quais explicações alternativas são plausíveis." /><ParagraphField number="4" title="O que ainda precisa ser esclarecido" value={draft.clarificationNeeded} onChange={(value) => update("clarificationNeeded", value)} hint="Indique a principal informação ou relação que falta para aumentar a segurança da conclusão." /><ParagraphField number="5" title="Insumo temático para a integração" value={draft.integrationInput} onChange={(value) => update("integrationInput", value)} hint={activeDefinition.paragraphFiveFocus} /></CardContent></Card><div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">{isComplete ? <span className="inline-flex items-center gap-2 text-emerald-700"><CheckCircle2 className="h-4 w-4" />Campos essenciais preenchidos</span> : "Preencha a classificação, os cinco parágrafos e todos os resultados para liberar a versão final."}</p><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={save.isPending} onClick={() => submit("rascunho")}><Save className="mr-2 h-4 w-4" />Salvar rascunho</Button>{workspace.access.canFinalize && <Button disabled={save.isPending} onClick={() => submit("versao_final")}><FileCheck2 className="mr-2 h-4 w-4" />Finalizar ficha</Button>}</div></div></TabsContent></Tabs></div>;
}
