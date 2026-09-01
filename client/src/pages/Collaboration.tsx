import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { downloadWorksheetPdf } from "@/lib/worksheetPdfDownload";
import { caseEvents, lenses, type WorksheetLens } from "@shared/exercise";
import { BookOpenText, FileDown, History, Loader2, MessageSquareText, Send, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const worksheetLensOptions: WorksheetLens[] = ["guerra_hibrida", "lawfare", "seguranca_transnacional"];

function safeJson(value?: string | null) {
  try { return JSON.parse(value ?? "{}"); } catch { return {}; }
}

function readableTimestamp(value: Date | string) {
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function snapshotSummary(snapshot: string, artifact: "worksheet" | "synthesis") {
  const data = safeJson(snapshot) as Record<string, unknown>;
  const fields = artifact === "worksheet"
    ? [data.centralJudgment, data.evidenceBasis, data.integrationInput]
    : [data.strategicJudgment, data.missionResponse, data.recommendations];
  return fields.find(field => typeof field === "string" && field.trim()) as string | undefined;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character] ?? character));
}

function printWorksheet({ worksheet, group }: { worksheet: any; group: any }) {
  const lens = lenses[worksheet.lens as WorksheetLens];
  const eventIds = safeJson(worksheet.selectedEventIds);
  const selectedEvents = Array.isArray(eventIds) ? eventIds.map(id => caseEvents.find(event => event.id === id)?.title).filter(Boolean).join("; ") : "Não registrados";
  const testEntries = safeJson(worksheet.testEntries) as Record<string, string>;
  const criteria = lens?.criteria.map(criterion => `<section><h3>${escapeHtml(criterion.title)}</h3><p>${escapeHtml(testEntries[criterion.id] || "Não registrado")}</p></section>`).join("") ?? "";
  const paragraphs = [
    ["Classificação e juízo central", worksheet.centralJudgment],
    ["Fundamentação", worksheet.evidenceBasis],
    ["Limites e explicações alternativas", worksheet.limitsAndAlternatives],
    ["O que ainda precisa ser esclarecido", worksheet.clarificationNeeded],
    ["Insumo temático para a integração", worksheet.integrationInput],
  ].map(([title, value]) => `<section><h3>${escapeHtml(String(title))}</h3><p>${escapeHtml(String(value || "Não registrado"))}</p></section>`).join("");
  const page = window.open("", "_blank", "noopener,noreferrer");
  if (!page) { toast.error("Permita janelas pop-up para exportar a ficha em PDF."); return; }
  page.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(`${group.code} · ${lens?.label ?? "Ficha-Síntese"}`)}</title><style>body{font-family:Arial,sans-serif;color:#152f4f;max-width:850px;margin:36px auto;padding:0 28px;line-height:1.55}h1,h2{font-family:Georgia,serif}h1{font-size:28px;margin:0 0 6px}h2{font-size:20px;border-bottom:1px solid #ced9e6;padding-bottom:6px;margin:28px 0 12px}h3{font-size:14px;margin:20px 0 5px}p{font-size:13px;color:#314861;white-space:pre-wrap}.eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8a6417}.meta{background:#eff4f8;padding:14px;border-radius:8px;margin:18px 0}.meta p{margin:3px 0}@media print{body{margin:0;max-width:none;padding:0}}</style></head><body><p class="eyebrow">GEN-Brasil · Jornada Acadêmica CSD 2026</p><h1>Ficha-Síntese — ${escapeHtml(lens?.label ?? "")}</h1><div class="meta"><p><strong>Grupo de Trabalho:</strong> ${escapeHtml(group.code)} · ${escapeHtml(group.missionAxis)}</p><p><strong>Status:</strong> ${escapeHtml(worksheet.status === "versao_final" ? "Versão final" : "Rascunho")}</p><p><strong>Classificação:</strong> ${escapeHtml(worksheet.classification || "Não registrada")}</p><p><strong>Eventos mobilizados:</strong> ${escapeHtml(selectedEvents || "Não registrados")}</p></div><h2>Teste analítico</h2>${criteria}<h2>Texto da Ficha-Síntese</h2>${paragraphs}</body></html>`);
  page.document.close();
  page.focus();
  window.setTimeout(() => page.print(), 180);
}

function GroupPicker({ groupId, onChange }: { groupId: number | null; onChange: (id: number) => void }) {
  const { data: access } = trpc.workspace.myAccess.useQuery();
  const groups = useMemo(() => access?.isAdmin ? access.availableGroups : access?.memberships.map(item => ({ id: item.groupId, code: item.code, missionAxis: item.missionAxis })) ?? [], [access]);
  useEffect(() => { if (!groupId && groups[0]) onChange(groups[0].id); }, [groupId, groups, onChange]);
  if (!groups.length) return null;
  return <Select value={groupId ? String(groupId) : undefined} onValueChange={value => onChange(Number(value))}><SelectTrigger className="w-full bg-card sm:w-[300px]"><SelectValue placeholder="Selecione o GT" /></SelectTrigger><SelectContent>{groups.map(group => <SelectItem key={group.id} value={String(group.id)}>{group.code} · {group.missionAxis}</SelectItem>)}</SelectContent></Select>;
}

function EventCommentPanel({ groupId }: { groupId: number | null }) {
  const [eventId, setEventId] = useState(1);
  const [comment, setComment] = useState("");
  const utils = trpc.useUtils();
  const { data: comments, isLoading } = trpc.workspace.eventComments.list.useQuery({ groupId: groupId ?? 0, eventId }, { enabled: Boolean(groupId) });
  const addComment = trpc.workspace.eventComments.add.useMutation({
    onSuccess: () => { setComment(""); utils.workspace.eventComments.list.invalidate({ groupId: groupId ?? 0, eventId }); toast.success("Comentário registrado para o seu GT."); },
    onError: error => toast.error(error.message),
  });
  if (!groupId) return <EmptyCollaboration />;
  return <Card className="border-0 bg-card/85 shadow-sm"><CardHeader><p className="eyebrow">Caderno colaborativo</p><CardTitle className="mt-1 font-serif text-xl text-primary">Comentários por evento</CardTitle><CardDescription>Os registros são compartilhados somente com integrantes do GT selecionado e com a coordenação.</CardDescription></CardHeader><CardContent className="space-y-5"><div><Label htmlFor="comment-event">Evento de referência</Label><Select value={String(eventId)} onValueChange={value => setEventId(Number(value))}><SelectTrigger id="comment-event" className="mt-2"><SelectValue /></SelectTrigger><SelectContent>{caseEvents.map(event => <SelectItem key={event.id} value={String(event.id)}>Evento {event.id} · {event.title}</SelectItem>)}</SelectContent></Select></div><div className="rounded-xl border border-border/70 bg-muted/35 p-4"><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Foco do comentário</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Registre dúvida metodológica, vínculo a verificar, evidência adicional ou ressalva analítica. Evite transformar hipótese em fato.</p></div><div><Label htmlFor="new-comment">Novo comentário</Label><Textarea id="new-comment" value={comment} onChange={event => setComment(event.target.value)} className="mt-2 min-h-28" maxLength={2000} placeholder="Escreva uma contribuição objetiva para os integrantes do GT." /><div className="mt-2 flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{comment.length}/2000 caracteres</span><Button size="sm" disabled={comment.trim().length < 2 || addComment.isPending} onClick={() => addComment.mutate({ groupId, eventId, content: comment.trim() })}><Send className="mr-2 h-3.5 w-3.5" />Publicar comentário</Button></div></div><Separator /><div className="space-y-3"><p className="text-xs font-bold uppercase tracking-widest text-primary/70">Discussão do Evento {eventId}</p>{isLoading ? <div className="flex h-20 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div> : comments?.length ? comments.map(item => <div key={item.id} className="rounded-xl border border-border/70 bg-background/60 p-4"><div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1"><p className="text-sm font-semibold text-primary">{item.authorName || item.authorEmail || "Integrante do GT"}</p><span className="text-xs text-muted-foreground">{readableTimestamp(item.createdAt)}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{item.content}</p></div>) : <p className="rounded-lg border border-dashed p-4 text-sm leading-6 text-muted-foreground">Ainda não há comentários para este evento neste GT.</p>}</div></CardContent></Card>;
}

function VersionHistoryPanel({ groupId }: { groupId: number | null }) {
  const [artifact, setArtifact] = useState<"worksheet" | "synthesis">("worksheet");
  const [lens, setLens] = useState<WorksheetLens>("guerra_hibrida");
  const input = useMemo(() => ({ groupId: groupId ?? 0, artifact, ...(artifact === "worksheet" ? { lens } : {}) }), [groupId, artifact, lens]);
  const { data: versions, isLoading } = trpc.workspace.analysisVersions.useQuery(input as any, { enabled: Boolean(groupId) });
  if (!groupId) return <EmptyCollaboration />;
  return <Card className="border-0 bg-card/85 shadow-sm"><CardHeader><p className="eyebrow">Rastreabilidade acadêmica</p><CardTitle className="mt-1 font-serif text-xl text-primary">Histórico de versões</CardTitle><CardDescription>Cada salvamento das Fichas-Síntese e da Síntese Estratégica Integrada gera um registro cronológico, com autor e estado do produto.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><div><Label>Produto</Label><Select value={artifact} onValueChange={value => setArtifact(value as "worksheet" | "synthesis")}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="worksheet">Ficha-Síntese</SelectItem><SelectItem value="synthesis">Síntese Estratégica Integrada</SelectItem></SelectContent></Select></div>{artifact === "worksheet" && <div><Label>Lente</Label><Select value={lens} onValueChange={value => setLens(value as WorksheetLens)}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent>{worksheetLensOptions.map(item => <SelectItem key={item} value={item}>{lenses[item].label}</SelectItem>)}</SelectContent></Select></div>}</div><div className="space-y-3">{isLoading ? <div className="flex h-24 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div> : versions?.length ? versions.map((version, index) => <div key={version.id} className="rounded-xl border border-border/70 bg-background/60 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex flex-wrap items-center gap-2"><Badge variant="secondary">Versão {versions.length - index}</Badge><Badge className={version.status === "versao_final" ? "bg-indigo-100 text-indigo-900 hover:bg-indigo-100" : "bg-amber-100 text-amber-900 hover:bg-amber-100"}>{version.status === "versao_final" ? "Versão final" : "Rascunho"}</Badge></div><span className="text-xs text-muted-foreground">{readableTimestamp(version.createdAt)}</span></div><p className="mt-3 text-sm font-medium text-primary">{version.savedByName || version.savedByEmail || "Autor não disponível"}</p><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{snapshotSummary(version.snapshot, artifact) || "Registro de salvamento sem trecho textual disponível."}</p></div>) : <p className="rounded-lg border border-dashed p-4 text-sm leading-6 text-muted-foreground">Nenhuma versão foi registrada ainda. O histórico começa no próximo salvamento deste produto.</p>}</div></CardContent></Card>;
}

function WorksheetExportPanel({ groupId }: { groupId: number | null }) {
  const { data: workspace, isLoading } = trpc.workspace.groupWorkspace.useQuery({ groupId: groupId ?? 0 }, { enabled: Boolean(groupId) });
  if (!groupId) return <EmptyCollaboration />;
  if (isLoading || !workspace) return <div className="flex min-h-44 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  const exportWorksheet = async (worksheet: any, lens: WorksheetLens) => {
    try {
      await downloadWorksheetPdf({ workspace, worksheet, lensId: lens });
      toast.success("Ficha-Síntese gerada e iniciada para download.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível gerar a Ficha-Síntese em PDF.");
    }
  };
  return <Card className="border-0 bg-card/85 shadow-sm"><CardHeader><p className="eyebrow">Produto acadêmico</p><CardTitle className="mt-1 font-serif text-xl text-primary">Exportar Fichas-Síntese em PDF</CardTitle><CardDescription>Gere uma Ficha-Síntese com capa institucional ESG/CSD 2026 e corpo acadêmico de uma página.</CardDescription></CardHeader><CardContent className="space-y-3">{worksheetLensOptions.map(lens => { const worksheet = workspace.worksheets.find((item: any) => item.lens === lens); return <div key={lens} className="flex flex-col gap-3 rounded-xl border border-border/75 bg-background/55 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-primary">{lenses[lens].label}</p><p className="mt-1 text-sm text-muted-foreground">{worksheet ? (worksheet.status === "versao_final" ? "Versão final disponível para exportação." : "Rascunho disponível para revisão ou exportação.") : "A ficha ainda não possui conteúdo salvo."}</p></div><Button variant="outline" size="sm" disabled={!worksheet} onClick={() => void exportWorksheet(worksheet, lens)}><FileDown className="mr-2 h-4 w-4" />Exportar em PDF</Button></div>;})}</CardContent></Card>;
}

function EmptyCollaboration() {
  return <Card className="border-dashed bg-card/80"><CardContent className="flex min-h-52 flex-col items-center justify-center p-8 text-center"><UsersRound className="h-7 w-7 text-primary" /><h2 className="mt-4 font-serif text-xl text-primary">Selecione um Grupo de Trabalho</h2><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Os comentários, as versões e as exportações são sempre vinculados a um GT para preservar o contexto e a rastreabilidade da jornada acadêmica.</p></CardContent></Card>;
}

export default function Collaboration() {
  const [groupId, setGroupId] = useState<number | null>(null);
  return <div className="mx-auto w-full max-w-[1520px] pb-10"><header className="mb-7 flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Registro coletivo e produtos</p><h1 className="mt-2 font-serif text-2xl leading-snug text-primary sm:text-3xl">Colaboração e versões</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Concentre os comentários por evento, consulte a trilha dos salvamentos e prepare as Fichas-Síntese para exportação em PDF.</p></div><GroupPicker groupId={groupId} onChange={setGroupId} /></header><Tabs defaultValue="comentarios" className="space-y-6"><TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-transparent p-0 sm:grid-cols-3"><TabsTrigger value="comentarios" className="w-full rounded-lg border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><MessageSquareText className="mr-2 h-4 w-4" />Comentários por evento</TabsTrigger><TabsTrigger value="historico" className="w-full rounded-lg border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><History className="mr-2 h-4 w-4" />Histórico de versões</TabsTrigger><TabsTrigger value="exportar" className="w-full rounded-lg border bg-card px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><BookOpenText className="mr-2 h-4 w-4" />Exportar fichas</TabsTrigger></TabsList><TabsContent value="comentarios" className="mt-0"><EventCommentPanel groupId={groupId} /></TabsContent><TabsContent value="historico" className="mt-0"><VersionHistoryPanel groupId={groupId} /></TabsContent><TabsContent value="exportar" className="mt-0"><WorksheetExportPanel groupId={groupId} /></TabsContent></Tabs></div>;
}
