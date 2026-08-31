import { analyticResultOptions, lenses, type WorksheetLens } from "./exercise";

export type WorksheetRequiredFields = {
  classification?: string | null;
  centralJudgment?: string | null;
  evidenceBasis?: string | null;
  limitsAndAlternatives?: string | null;
  clarificationNeeded?: string | null;
  integrationInput?: string | null;
};

export type SynthesisRequiredFields = {
  strategicJudgment?: string | null;
  lensResults?: string | null;
  connectionsAndLimits?: string | null;
  missionResponse?: string | null;
  recommendations?: string | null;
  desiredEndState?: string | null;
  slideOne?: string | null;
  slideTwo?: string | null;
  slideThree?: string | null;
  slideFour?: string | null;
};

function parseResultEntries(value?: string | null) {
  try {
    const parsed = JSON.parse(value ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function hasText(value?: string | null) {
  return Boolean(value?.trim());
}

export function isWorksheetComplete(input: WorksheetRequiredFields) {
  return Boolean(
    input.classification &&
    hasText(input.centralJudgment) &&
    hasText(input.evidenceBasis) &&
    hasText(input.limitsAndAlternatives) &&
    hasText(input.clarificationNeeded) &&
    hasText(input.integrationInput),
  );
}

export function hasCompleteCriterionResults(lens: WorksheetLens, testResults?: string | null) {
  const entries = parseResultEntries(testResults);
  return lenses[lens].criteria.every(criterion => analyticResultOptions.includes(entries[criterion.id] as typeof analyticResultOptions[number]));
}

export function isSynthesisComplete(input: SynthesisRequiredFields) {
  return Boolean(
    hasText(input.strategicJudgment) &&
    hasText(input.lensResults) &&
    hasText(input.connectionsAndLimits) &&
    hasText(input.missionResponse) &&
    hasText(input.recommendations) &&
    hasText(input.desiredEndState) &&
    hasText(input.slideOne) &&
    hasText(input.slideTwo) &&
    hasText(input.slideThree) &&
    hasText(input.slideFour),
  );
}

export function canRegisterSubmission(status: string, contentFinalized: boolean, checklistConfirmed: boolean) {
  return status === "submetido" && contentFinalized && checklistConfirmed;
}
