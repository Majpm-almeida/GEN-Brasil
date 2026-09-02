import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CASE_TITLE, lenses, type WorksheetLens } from "@shared/exercise";
import { ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { useEffect, useState } from "react";

const BRASAO_URL = "/manus-storage/brasao-nacional-esg-csd_5edbae08.jpg";

function parseEventIds(value?: string | null) {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === "number").sort((a, b) => a - b) : [];
  } catch {
    return [];
  }
}

function worksheetNumber(lens: WorksheetLens) {
  return (["guerra_hibrida", "lawfare", "seguranca_transnacional"] as WorksheetLens[]).indexOf(lens) + 1;
}

function memberLabel(member: any) {
  const identity = member.reportName || member.name || member.email || "Participante sem identificação";
  return member.course ? `${member.course} ${identity}` : identity;
}

export function WorksheetPdfPreview({ open, onOpenChange, workspace, worksheet, lensId, onDownload }: { open: boolean; onOpenChange: (open: boolean) => void; workspace: any; worksheet: any; lensId: WorksheetLens; onDownload: () => void }) {
  const [page, setPage] = useState(1);
  useEffect(() => { if (open) setPage(1); }, [open, worksheet?.id, lensId]);
  const lens = lenses[lensId];
  const selectedEvents = parseEventIds(worksheet?.selectedEventIds);
  const decisiveEvents = parseEventIds(worksheet?.decisiveEventIds);
  const leader = workspace?.members?.find((member: any) => member.role === "dirigente" && member.active !== false);
  const rapporteur = workspace?.members?.find((member: any) => member.role === "relator" && member.active !== false);
  const paragraphs = [worksheet?.centralJudgment, worksheet?.evidenceBasis, worksheet?.limitsAndAlternatives, worksheet?.clarificationNeeded, worksheet?.integrationInput].map(item => String(item || "Não registrado."));
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="w-[calc(100vw-1.5rem)] max-w-none p-4 sm:w-[calc(100vw-3rem)] sm:max-w-none lg:w-[min(92vw,72rem)]"><DialogHeader className="pr-8"><DialogTitle>Pré-visualização da Ficha-Síntese</DialogTitle><DialogDescription>Revise a capa e o corpo antes de iniciar o download em PDF.</DialogDescription></DialogHeader><div className="max-h-[67vh] overflow-y-auto rounded-xl bg-slate-100 p-3 sm:p-6"><div className="mx-auto flex w-full max-w-[650px] flex-col gap-4"><div className="overflow-hidden rounded-sm bg-white shadow-md" style={{ aspectRatio: "210 / 297" }}>{page === 1 ? <div className="flex h-full flex-col px-[9%] pb-[7%] pt-[6%] text-slate-900"><div className="flex items-center gap-4 border-b border-slate-300 pb-4"><img src={BRASAO_URL} alt="Brasão nacional" className="h-14 w-14 object-contain sm:h-20 sm:w-20" /><div className="font-serif leading-snug text-slate-900"><p className="text-[0.58rem] font-bold sm:text-xs">ESCOLA SUPERIOR DE GUERRA (ESG)</p><p className="mt-1 text-[0.52rem] font-semibold sm:text-[0.68rem]">CURSO SUPERIOR DE DEFESA - CSD 2026</p></div></div><div className="mt-[11%] text-center"><p className="text-[0.52rem] font-bold tracking-[0.12em] text-amber-800 sm:text-xs">ATIVIDADE INTEGRADORA</p><h3 className="mt-5 font-serif text-base font-bold leading-tight text-primary sm:text-2xl">FICHA-SÍNTESE {worksheetNumber(lensId)} - {lens.label.toUpperCase()}</h3></div><dl className="mt-[10%] space-y-1 text-[0.48rem] leading-[1.45] sm:text-[0.66rem]"><div><dt className="inline font-bold">CURSO: </dt><dd className="inline">Curso Superior de Defesa - CSD 2026</dd></div><div><dt className="inline font-bold">SEMANA / UNIDADE DE ESTUDO: </dt><dd className="inline">Semana 04 - UE 2.2</dd></div><div><dt className="inline font-bold">GT Nº: </dt><dd className="inline">{String(workspace?.group?.code ?? "").replace(/\D/g, "") || workspace?.group?.code}</dd></div><div><dt className="inline font-bold">PRODUTO: </dt><dd className="inline">Ficha-Síntese nº {worksheetNumber(lensId)} - {lens.label}</dd></div><div><dt className="inline font-bold">DATA: </dt><dd className="inline">{new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</dd></div><div><dt className="inline font-bold">CASO DE ESTUDO: </dt><dd className="inline">{CASE_TITLE}</dd></div><div><dt className="inline font-bold">DIRIGENTE DO GRUPO: </dt><dd className="inline">{leader ? memberLabel(leader) : "Não informado"}</dd></div><div><dt className="inline font-bold">RELATOR: </dt><dd className="inline">{rapporteur ? memberLabel(rapporteur) : "Não informado"}</dd></div><div><dt className="font-bold">COMPONENTES DO GT:</dt><dd className="pl-3">{workspace?.members?.filter((member: any) => member.active !== false).map(memberLabel).join(" · ") || "Não informados"}</dd></div></dl><div className="mt-auto pt-3 text-center font-serif text-[0.56rem] leading-5 sm:text-xs"><p>Rio de Janeiro/RJ</p><p>2026</p></div></div> : <div className="h-full px-[9%] pt-[10%] text-slate-900"><p className="border-b border-slate-400 pb-3 text-[0.55rem] font-bold leading-relaxed text-primary sm:text-xs">EVENTOS UTILIZADOS COMO EVIDÊNCIA: <span className="font-normal">{selectedEvents.length ? `nº ${selectedEvents.join(", ")}` : "Não registrados"}{decisiveEvents.length ? ` (decisivos: ${decisiveEvents.join(", ")})` : ""}</span></p><div className="mt-6 space-y-3 text-justify font-serif text-[0.54rem] leading-[1.55] text-slate-800 sm:text-[0.73rem]">{paragraphs.map((paragraph, index) => <p key={index} className="first-letter:ml-4">{paragraph}</p>)}</div></div>}</div><p className="text-center text-xs font-semibold text-muted-foreground">Página {page} de 2</p></div></div><DialogFooter className="gap-2 sm:justify-between"><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(1)}><ChevronLeft className="mr-1 h-4 w-4" />Capa</Button><Button variant="outline" size="sm" disabled={page === 2} onClick={() => setPage(2)}>Corpo<ChevronRight className="ml-1 h-4 w-4" /></Button></div><Button size="sm" onClick={onDownload}><FileDown className="mr-2 h-4 w-4" />Baixar PDF</Button></DialogFooter></DialogContent></Dialog>;
}
