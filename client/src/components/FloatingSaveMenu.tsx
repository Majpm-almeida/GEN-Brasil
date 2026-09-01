import { Button } from "@/components/ui/button";
import { CheckCircle2, FileCheck2, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FloatingSaveMenuProps = {
  ready: boolean;
  readyMessage: string;
  pending: boolean;
  canFinalize: boolean;
  finalLabel: string;
  onSaveDraft: () => void;
  onFinalize: () => void;
};

export function FloatingSaveMenu({ ready, readyMessage, pending, canFinalize, finalLabel, onSaveDraft, onFinalize }: FloatingSaveMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const cancelScheduledClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = (delay = 360) => {
    cancelScheduledClose();
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, delay);
  };
  useEffect(() => () => cancelScheduledClose(), []);
  const closeIfFocusLeaves = () => {
    window.setTimeout(() => {
      if (!menuRef.current?.contains(document.activeElement)) scheduleClose(120);
    }, 0);
  };
  const handleAction = (action: () => void) => {
    cancelScheduledClose();
    action();
    setOpen(false);
  };
  return <div ref={menuRef} className="fixed bottom-6 right-6 z-40" onMouseEnter={() => { cancelScheduledClose(); setOpen(true); }} onMouseLeave={() => scheduleClose()} onFocusCapture={() => { cancelScheduledClose(); setOpen(true); }} onBlurCapture={closeIfFocusLeaves} onKeyDown={(event) => { if (event.key === "Escape") { cancelScheduledClose(); setOpen(false); } }}><div className={`absolute bottom-[calc(100%+0.75rem)] right-0 w-72 origin-bottom-right transition duration-150 ${open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}><div className="rounded-2xl border border-border bg-card p-3 shadow-xl"><p className={`flex gap-2 px-1 pb-3 text-xs leading-5 ${ready ? "text-emerald-700" : "text-muted-foreground"}`}>{ready && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}{ready ? readyMessage : "Conclua os campos essenciais para liberar a versão final."}</p><div className="grid gap-2"><Button variant="outline" className="justify-start" disabled={pending} onClick={() => handleAction(onSaveDraft)}><Save className="mr-2 h-4 w-4" />Salvar rascunho</Button>{canFinalize && <Button className="justify-start" disabled={pending || !ready} onClick={() => handleAction(onFinalize)}><FileCheck2 className="mr-2 h-4 w-4" />{finalLabel}</Button>}</div></div></div><Button size="icon" aria-label="Abrir ações de salvamento" aria-expanded={open} aria-haspopup="menu" title="Salvar ou finalizar" className="h-14 w-14 rounded-full border border-amber-200 bg-primary text-primary-foreground shadow-xl transition-transform duration-150 hover:bg-primary/90 active:scale-95" onClick={() => { cancelScheduledClose(); setOpen(current => !current); }}><Save className="h-6 w-6" /></Button></div>;
}
