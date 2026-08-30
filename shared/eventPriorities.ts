import { caseEvents, lenses, type WorksheetLens } from "./exercise";

export type EventPriorityContext = {
  lens: WorksheetLens | "integracao" | null;
  label: string;
  eventIds: number[];
  badgeLabel: "Prioritário" | "Integração" | null;
  guidance: string;
};

export function getEventPriorityContext(missionAxis?: string | null): EventPriorityContext {
  const normalizedAxis = missionAxis?.toLocaleLowerCase("pt-BR") ?? "";

  if (normalizedAxis.includes("lawfare")) {
    return {
      lens: "lawfare",
      label: "Lawfare",
      eventIds: lenses.lawfare.priorityEvents,
      badgeLabel: "Prioritário",
      guidance: "Os eventos marcados constituem o núcleo ou os apoios preferenciais para o teste de Lawfare.",
    };
  }

  if (normalizedAxis.includes("transnacional")) {
    return {
      lens: "seguranca_transnacional",
      label: "Segurança Transnacional",
      eventIds: lenses.seguranca_transnacional.priorityEvents,
      badgeLabel: "Prioritário",
      guidance: "Os eventos marcados são o núcleo ou os apoios preferenciais para o teste de Segurança Transnacional.",
    };
  }

  if (normalizedAxis.includes("grande estratégia") || normalizedAxis.includes("grande estrategia")) {
    return {
      lens: "integracao",
      label: "Integração / Grande Estratégia",
      eventIds: caseEvents.map(event => event.id),
      badgeLabel: "Integração",
      guidance: "Na integração, todos os eventos podem ser utilizados. O GT deve selecionar aqueles pertinentes à sua Missão de Aprofundamento e distinguir fatos, hipóteses e lacunas.",
    };
  }

  if (normalizedAxis.includes("gh") || normalizedAxis.includes("guerra híbrida") || normalizedAxis.includes("guerra hibrida")) {
    return {
      lens: "guerra_hibrida",
      label: "Guerra Híbrida",
      eventIds: lenses.guerra_hibrida.priorityEvents,
      badgeLabel: "Prioritário",
      guidance: "Os eventos marcados são prioritários para o teste de pluralidade de instrumentos, vulnerabilidades, sincronização e objetivo estratégico comum.",
    };
  }

  return {
    lens: null,
    label: "Lente ainda não selecionada",
    eventIds: [],
    badgeLabel: null,
    guidance: "Selecione um GT para visualizar os eventos prioritários correspondentes à sua lente analítica.",
  };
}
