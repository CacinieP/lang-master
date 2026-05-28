import type { ConceptNode, Layer, Paradigm, ConceptGraph } from '@/types';

let conceptCache: ConceptNode[] = [];
let graphCache: ConceptGraph | null = null;

export function initConceptEngine(concepts: ConceptNode[], graph: ConceptGraph): void {
  conceptCache = concepts;
  graphCache = graph;
}

export function getConceptById(id: string): ConceptNode | undefined {
  return conceptCache.find((c) => c.id === id);
}

export function getAllConcepts(): ConceptNode[] {
  return conceptCache;
}

export function getConceptsByLayer(layer: Layer): ConceptNode[] {
  return conceptCache
    .filter((c) => c.layer === layer)
    .sort((a, b) => a.layer_position - b.layer_position);
}

export function getConceptsByParadigm(paradigm: Paradigm): ConceptNode[] {
  return conceptCache.filter((c) => c.paradigm_tags.includes(paradigm));
}

export function getConceptsByDifficulty(difficulty: number): ConceptNode[] {
  return conceptCache.filter((c) => c.difficulty === difficulty);
}

export function resolvePrerequisites(conceptId: string): string[] {
  if (!graphCache) return [];
  const visited = new Set<string>();
  const queue = [conceptId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const prereqs = graphCache.edges
      .filter((e) => e.to === current && e.type === 'prerequisite')
      .map((e) => e.from);

    queue.push(...prereqs);
  }

  visited.delete(conceptId);
  return [...visited];
}

export function getNextConcept(masteredIds: Set<string>): ConceptNode | undefined {
  if (!graphCache) return conceptCache[0];

  const candidates = conceptCache.filter((c) => !masteredIds.has(c.id));
  if (candidates.length === 0) return undefined;

  // Find concepts whose prerequisites are all mastered
  const ready = candidates.filter((c) => {
    const prereqs = graphCache!.edges
      .filter((e) => e.to === c.id && e.type === 'prerequisite')
      .map((e) => e.from);
    return prereqs.every((p) => masteredIds.has(p));
  });

  if (ready.length === 0) return candidates[0];

  // Among ready concepts, pick the one with lowest difficulty, then lowest layer_position
  ready.sort((a, b) => {
    if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
    const layerOrder = ['lexical', 'morphological', 'syntax', 'semantic', 'pragmatic'];
    const la = layerOrder.indexOf(a.layer);
    const lb = layerOrder.indexOf(b.layer);
    if (la !== lb) return la - lb;
    return a.layer_position - b.layer_position;
  });

  return ready[0];
}

export function getRelatedConcepts(conceptId: string): { related: string[]; contrasts: string[] } {
  if (!graphCache) return { related: [], contrasts: [] };

  const related = graphCache.edges
    .filter((e) => (e.from === conceptId || e.to === conceptId) && e.type === 'related')
    .map((e) => (e.from === conceptId ? e.to : e.from));

  const contrasts = graphCache.edges
    .filter((e) => (e.from === conceptId || e.to === conceptId) && e.type === 'contrast')
    .map((e) => (e.from === conceptId ? e.to : e.from));

  return { related, contrasts };
}
