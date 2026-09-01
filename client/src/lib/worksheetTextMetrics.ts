export type WorksheetNarrative = {
  centralJudgment?: string;
  evidenceBasis?: string;
  limitsAndAlternatives?: string;
  clarificationNeeded?: string;
  integrationInput?: string;
};

export function countWords(value?: string) {
  return value?.trim() ? value.trim().split(/\s+/).length : 0;
}

export function getWorksheetTextDistribution(narrative: WorksheetNarrative) {
  const entries = [
    ["Juízo central", narrative.centralJudgment],
    ["Fundamentação", narrative.evidenceBasis],
    ["Limites", narrative.limitsAndAlternatives],
    ["Esclarecimentos", narrative.clarificationNeeded],
    ["Integração", narrative.integrationInput],
  ].map(([label, value]) => ({ label, words: countWords(value) }));
  const total = entries.reduce((sum, entry) => sum + entry.words, 0);
  const average = total ? total / entries.length : 0;
  const largest = Math.max(...entries.map(entry => entry.words));
  const smallest = Math.min(...entries.map(entry => entry.words));
  const allStarted = entries.every(entry => entry.words > 0);
  const balanced = allStarted && (largest - smallest) <= Math.max(30, average * 0.8);
  return { entries, total, average, largest, smallest, allStarted, balanced };
}
