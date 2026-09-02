import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Check, Loader2, Save, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function roleLabel(role: string) {
  return role === "dirigente" ? "Dirigente" : role === "relator" ? "Relator" : "Integrante";
}

export default function ReportNames() {
  const { data: access } = trpc.workspace.myAccess.useQuery();
  const [groupId, setGroupId] = useState<number | null>(null);
  const [draftNames, setDraftNames] = useState<Record<number, string>>({});
  const options = useMemo(() => {
    if (!access) return [];
    return access.isAdmin ? access.availableGroups : access.memberships.map(item => ({ id: item.groupId, code: item.code, missionAxis: item.missionAxis }));
  }, [access]);
  const { data: workspace, isLoading } = trpc.workspace.groupWorkspace.useQuery({ groupId: groupId ?? 0 }, { enabled: Boolean(groupId) });
  const utils = trpc.useUtils();
  const saveReportName = trpc.workspace.setMemberReportName.useMutation({
    onSuccess: () => {
      toast.success("Nome de exibição do relatório atualizado.");
      utils.workspace.groupWorkspace.invalidate({ groupId: groupId ?? 0 });
      utils.workspace.admin.participants.invalidate();
    },
    onError: error => toast.error(error.message),
  });
  useEffect(() => {
    if (!groupId && options.length) setGroupId(options[0].id);
  }, [groupId, options]);
  useEffect(() => {
    if (!workspace) return;
    setDraftNames(Object.fromEntries(workspace.members.filter((member: any) => member.active !== false).map((member: any) => [member.userId, member.reportName ?? member.name ?? ""])));
  }, [workspace?.group?.id, workspace?.members]);
  const saveMember = (member: any) => {
    const value = (draftNames[member.userId] ?? "").trim();
    saveReportName.mutate({ groupId: groupId ?? 0, userId: member.userId, reportName: value || null });
  };
  return <div className="mx-auto w-full max-w-[1220px] pb-12"><header className="mb-7 flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Composição dos documentos acadêmicos</p><h1 className="mt-2 font-serif text-2xl leading-snug text-primary sm:text-3xl">Nomes nos relatórios</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Defina como os integrantes aparecerão nas capas, nas pré-visualizações e nos PDFs do Grupo de Trabalho.</p></div><Select value={groupId ? String(groupId) : undefined} onValueChange={(value) => setGroupId(Number(value))}><SelectTrigger className="w-[250px] bg-card/80 shadow-sm"><SelectValue placeholder="Selecione o GT" /></SelectTrigger><SelectContent>{options.map(group => <SelectItem key={group.id} value={String(group.id)}>{group.code} · {group.missionAxis}</SelectItem>)}</SelectContent></Select></header>{!options.length ? <Card className="border-dashed"><CardContent className="p-8 text-center text-sm leading-6 text-muted-foreground">Não há Grupo de Trabalho disponível para configuração.</CardContent></Card> : isLoading || !workspace ? <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : !workspace.access.canManageReportNames ? <Card className="border-dashed bg-card/80"><CardContent className="flex min-h-52 flex-col items-center justify-center p-8 text-center"><UsersRound className="h-7 w-7 text-primary" /><h2 className="mt-4 font-serif text-xl text-primary">Configuração restrita</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">O nome de exibição nos relatórios pode ser definido pela administração ou pelo Dirigente do próprio GT.</p></CardContent></Card> : <Card className="border-0 bg-card/85 shadow-sm"><CardHeader className="border-b border-border/70"><p className="eyebrow">{workspace.group.code} · {workspace.group.missionAxis}</p><CardTitle className="mt-1 font-serif text-xl text-primary">Nome de exibição no relatório</CardTitle><CardDescription>O nome original da conta é mantido somente como referência administrativa. Deixe o campo em branco para restaurar automaticamente o nome captado da conta.</CardDescription></CardHeader><CardContent className="space-y-3 pt-6">{workspace.members.filter((member: any) => member.active !== false).map((member: any) => { const value = draftNames[member.userId] ?? ""; const original = member.name || member.email || "Participante sem identificação"; const changed = value.trim() !== original; return <section key={member.id} className="grid gap-3 rounded-xl border border-border/75 bg-background/55 p-4 lg:grid-cols-[minmax(13rem,0.8fr)_minmax(15rem,1fr)_auto] lg:items-end"><div><p className="font-semibold text-primary">{original}</p><p className="mt-1 text-xs text-muted-foreground">{member.email || "E-mail não informado"}</p><Badge variant="secondary" className="mt-2">{roleLabel(member.role)}</Badge></div><div><Label htmlFor={`report-name-${member.id}`}>Nome que aparecerá no relatório</Label><Input id={`report-name-${member.id}`} value={value} maxLength={160} onChange={(event) => setDraftNames(current => ({ ...current, [member.userId]: event.target.value }))} className="mt-2 bg-card" placeholder={original} /></div><Button type="button" variant={changed ? "default" : "outline"} disabled={saveReportName.isPending || !changed} onClick={() => saveMember(member)}><Save className="mr-2 h-4 w-4" />Salvar nome</Button></section>; })}<div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-950"><Check className="h-4 w-4 shrink-0 text-emerald-700" />A alteração é específica deste GT e passa a ser usada nos PDFs e nas pré-visualizações dos documentos acadêmicos.</div></CardContent></Card>}</div>;
}
