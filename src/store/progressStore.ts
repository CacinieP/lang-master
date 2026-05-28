import { create } from 'zustand';
import type { ConceptProgress, Layer } from '@/types';
import { loadProgress, saveProgress } from '@/services/storage';
import { updateProgressAfterQuiz, calculateLayerProgress } from '@/services/masteryTracker';

interface ProgressState {
  conceptProgress: Record<string, ConceptProgress>;
  layerProgress: Record<Layer, number>;
  conceptLayers: Record<string, Layer>;
  totalPerLayer: Record<Layer, number>;

  load: (conceptLayers: Record<string, Layer>, totalPerLayer: Record<Layer, number>) => void;
  recordQuizResult: (conceptId: string, layer: Layer, passed: boolean) => void;
  getConceptStatus: (conceptId: string) => 'unvisited' | 'exploring' | 'practicing' | 'mastered';
  getMasteryScore: (conceptId: string) => number;
  getMasteredConceptIds: () => Set<string>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  conceptProgress: {},
  layerProgress: { lexical: 0, morphological: 0, syntax: 0, semantic: 0, pragmatic: 0 },
  conceptLayers: {},
  totalPerLayer: { lexical: 0, morphological: 0, syntax: 0, semantic: 0, pragmatic: 0 },

  load: (conceptLayers, totalPerLayer) => {
    const progress = loadProgress();
    const layerProgress = calculateLayerProgress(progress, conceptLayers, totalPerLayer);
    set({ conceptProgress: progress, layerProgress, conceptLayers, totalPerLayer });
  },

  recordQuizResult: (conceptId, layer, passed) => {
    const { conceptProgress, conceptLayers, totalPerLayer } = get();
    const existing = conceptProgress[conceptId];
    const updated = updateProgressAfterQuiz(existing, passed, layer);
    const newProgress = { ...conceptProgress, [conceptId]: updated };
    const layerProgress = calculateLayerProgress(newProgress, conceptLayers, totalPerLayer);
    saveProgress(newProgress);
    set({ conceptProgress: newProgress, layerProgress });
  },

  getConceptStatus: (conceptId) => {
    const { conceptProgress } = get();
    const p = conceptProgress[conceptId];
    if (!p) return 'unvisited';
    if (p.mastery_score >= 0.8) return 'mastered';
    if (p.attempts > 0) return 'practicing';
    return 'exploring';
  },

  getMasteryScore: (conceptId) => {
    const { conceptProgress } = get();
    return conceptProgress[conceptId]?.mastery_score ?? 0;
  },

  getMasteredConceptIds: () => {
    const { conceptProgress } = get();
    const ids = new Set<string>();
    for (const [id, p] of Object.entries(conceptProgress)) {
      if (p.mastery_score >= 0.8) ids.add(id);
    }
    return ids;
  },
}));
