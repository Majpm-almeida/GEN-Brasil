import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, ClipboardCheck, Clock3, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

function BrandedShell({ children }: { children: React.ReactNode }) {
  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f6f1] px-4 py-10 text-primary"><div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full border border-primary/10 bg-[#d7c693]/15" /><div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full border border-primary/10 bg-[#15364c]/10" />{children}</main>;
}

export default function AccessGate({ children }: { children: React.ReactNode }) {
  const { user, loading, login, logout } = useAuth();
  const [, setLocation] = useLocation();
  const access = trpc.access.status.useQuery(undefined, { enabled: Boolean(user) && !loading, retry: false, refetchOnWindowFocus: true });

  useEffect(() => {
    if (access.data?.status === "approved") setLocation("/");
  }, [access.data?.status, setLocation]);

  if (loading || (user && access.isLoading)) {
    return <BrandedShell><div className="relative z-10 text-center"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /><p className="mt-4 text-sm text-muted-foreground">Verificando seu acesso ao GEN-Brasil...</p></div></BrandedShell>;
  }

  if (!user) {
    return <BrandedShell><Card className="relative z-10 w-full max-w-xl border-primary/10 bg-card/95 shadow-2xl shadow-primary/10"><CardContent className="p-8 sm:p-10"><p className="eyebrow">CSD 2026 · JORNADA ACADÊMICA</p><h1 className="mt-4 font-serif text-4xl leading-tight text-primary">GEN-Brasil</h1><p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">Uma plataforma de análise estratégica para os Grupos de Trabalho do caso <strong className="font-semibold text-primary">“Minerais Críticos, Autonomia e Poder Nacional”</strong>.</p><div className="mt-8 grid gap-3 rounded-2xl bg-secondary/55 p-5 text-sm leading-6 text-muted-foreground sm:grid-cols-3"><span className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" />Fichas analíticas</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Acesso aprovado</span><span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Síntese integrada</span></div><Button className="mt-8 h-12 w-full text-base" onClick={() => void login()}><span className="mr-3 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-[#4285f4]">G</span>Entrar com Google</Button><p className="mt-4 text-center text-xs leading-5 text-muted-foreground">O primeiro acesso registra sua solicitação para avaliação da coordenação.</p></CardContent></Card></BrandedShell>;
  }

  if (access.data?.status === "approved") return <>{children}</>;

  const rejected = access.data?.status === "rejected";
  const revoked = access.data?.status === "revoked";
  const unavailable = rejected || revoked;
  return <BrandedShell><Card className="relative z-10 w-full max-w-2xl border-primary/10 bg-card/95 shadow-2xl shadow-primary/10"><CardContent className="p-8 sm:p-10"><div className={`grid h-12 w-12 place-items-center rounded-2xl ${revoked ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>{unavailable ? <ShieldCheck className="h-6 w-6" /> : <Clock3 className="h-6 w-6" />}</div><p className="eyebrow mt-7">SOLICITAÇÃO DE ACESSO</p><h1 className="mt-3 font-serif text-3xl text-primary">{revoked ? "Acesso revogado pela coordenação" : rejected ? "Solicitação em análise pela coordenação" : `Bem-vindo(a), ${user.name?.split(" ")[0] ?? "participante"}.`}</h1><p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">{revoked ? "O acesso desta conta à plataforma foi revogado. Caso precise de esclarecimentos, entre em contato com a coordenação do curso." : rejected ? "A solicitação não foi liberada nesta etapa. Caso considere necessário, entre em contato com a coordenação do curso." : "Sua conta Google foi identificada e sua solicitação foi registrada. Enquanto a aprovação do gestor é concluída, você pode conhecer o propósito desta jornada acadêmica."}</p>{!unavailable && <div className="mt-7 grid gap-4 rounded-2xl border border-primary/10 bg-secondary/45 p-5 sm:grid-cols-3"><div><p className="text-sm font-semibold text-primary">Analisar</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Aplicar as lentes de Guerra Híbrida, Lawfare e Segurança Transnacional.</p></div><div><p className="text-sm font-semibold text-primary">Integrar</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Conectar evidências, incertezas e recomendações estratégicas.</p></div><div><p className="text-sm font-semibold text-primary">Entregar</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Organizar a síntese e os quatro slides finais do GT.</p></div></div>}<div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button className="h-11 flex-1" disabled={access.isFetching} onClick={() => void access.refetch()}><CheckCircle2 className="mr-2 h-4 w-4" />{access.isFetching ? "Verificando..." : "Verificar situação"}</Button><Button variant="outline" className="h-11" onClick={() => void logout()}><LogOut className="mr-2 h-4 w-4" />Sair</Button></div><p className="mt-4 text-center text-xs text-muted-foreground">{revoked ? "O acesso permanece bloqueado enquanto o registro estiver revogado." : rejected ? "O acesso permanece indisponível até nova liberação." : "Você receberá um e-mail de boas-vindas quando o acesso for aprovado."}</p></CardContent></Card></BrandedShell>;
}
