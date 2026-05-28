import type { ConceptProgress, Layer } from '@/types';
import { defaultConceptProgress } from '@/types';

const MASTERY_THRESHOLD = 0.8;

export function calculateMastery(progress: ConceptProgress): number {
  return progress.mastery_score;
}

export function isMastered(progress: ConceptProgress): boolean {
  return progress.mastery_score >= MASTERY_THRESHOLD;
}

export function getConceptStatus(
  progress: ConceptProgress | undefined,
): 'unvisited' | 'exploring' | 'practicing' | 'mastered' {
  if (!progress) return 'unvisited';
  if (progress.mastery_score >= MASTERY_THRESHOLD) return 'mastered';
  if (progress.attempts > 0) return 'practicing';
  return 'exploring';
}

export function updateProgressAfterQuiz(
  existing: ConceptProgress | undefined,
  passed: boolean,
  layer: Layer,
): ConceptProgress {
  const progress = existing ?? defaultConceptProgress();
  const delta = passed ? 0.3 : -0.05;
  const newScore = Math.max(0, Math.min(1, progress.mastery_score + delta));

  return {
    ...progress,
    status: getConceptStatus({ ...progress, mastery_score: newScore }),
    attempts: progress.attempts + 1,
    last_attempted_at: Date.now(),
    best_result: passed
      ? newScore >= MASTERY_THRESHOLD
        ? 'mastered'
        : 'passed'
      : progress.best_result,
    mastery_score: newScore,
    layer_progress: {
      ...progress.layer_progress,
      [layer]: Math.min(1, (progress.layer_progress[layer] ?? 0) + (passed ? 0.2 : 0)),
    },
  };
}

export function calculateLayerProgress(
  allProgress: Record<string, ConceptProgress>,
  conceptLayers: Record<string, Layer>,
  totalPerLayer: Record<Layer, number>,
): Record<Layer, number> {
  const masteredPerLayer: Record<Layer, number> = {
    lexical: 0,
    morphological: 0,
    syntax: 0,
    semantic: 0,
    pragmatic: 0,
  };

  for (const [id, progress] of Object.entries(allProgress)) {
    const layer = conceptLayers[id];
    if (layer && isMastered(progress)) {
      masteredPerLayer[layer]++;
    }
  }

  const result: Record<Layer, number> = {
    lexical: 0,
    morphological: 0,
    syntax: 0,
    semantic: 0,
    pragmatic: 0,
  };

  for (const layer of Object.keys(totalPerLayer) as Layer[]) {
    const total = totalPerLayer[layer];
    result[layer] = total > 0 ? masteredPerLayer[layer] / total : 0;
  }

  return result;
}
