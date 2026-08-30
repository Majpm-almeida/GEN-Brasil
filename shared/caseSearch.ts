import { caseEvents } from "./exercise";

function normalizeForSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function searchCaseEvents(query: string) {
  const normalizedQuery = normalizeForSearch(query.trim());
  if (!normalizedQuery) return caseEvents;

  return caseEvents.filter(event => {
    const searchableContent = [
      `evento ${event.id}`,
      String(event.id),
      event.title,
      event.evidence,
      event.limitation,
    ].join(" ");

    return normalizeForSearch(searchableContent).includes(normalizedQuery);
  });
}
