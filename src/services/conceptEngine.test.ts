import { beforeEach, describe, expect, it } from 'vitest';
import {
  initConceptEngine,
  getConceptById,
  getAllConcepts,
  getConceptsByLayer,
  getConceptsByParadigm,
  getConceptsByDifficulty,
  resolvePrerequisites,
  getNextConcept,
  getRelatedConcepts,
} from './conceptEngine';
import { CONCEPT_NODES } from '@/data/concepts';
import { conceptGraph } from '@/data/graph';
import type { ConceptGraph, ConceptNode } from '@/types';

function node(id: string, overrides: Partial<ConceptNode> = {}): ConceptNode {
  return {
    id,
    name: id,
    name_en: id,
    description: '',
    description_en: '',
    layer: 'lexical',
    layer_position: 1,
    paradigm_tags: ['procedural'],
    difficulty: 1,
    new_concept_count: 1,
    expressions: {},
    traps: {},
    positive_transfers: {},
    dependencies: [],
    related: [],
    contrasts: [],
    semantic_tests: [],
    ...overrides,
  };
}

describe('conceptEngine with real Alpha data', () => {
  beforeEach(() => initConceptEngine(CONCEPT_NODES, conceptGraph));

  it('looks concepts up by id', () => {
    expect(getConceptById('literal_values')?.name).toBe('字面量');
    expect(getConceptById('does_not_exist')).toBeUndefined();
    expect(getAllConcepts()).toHaveLength(24);
  });

  it('sorts layer concepts by layer_position', () => {
    const lexical = getConceptsByLayer('lexical');
    const positions = lexical.map((c) => c.layer_position);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('filters by paradigm and difficulty', () => {
    for (const c of getConceptsByParadigm('functional')) {
      expect(c.paradigm_tags).toContain('functional');
    }
    for (const c of getConceptsByDifficulty(2)) expect(c.difficulty).toBe(2);
  });

  it('resolves transitive prerequisites without self', () => {
    const prereqs = resolvePrerequisites('control_flow_conditional');
    expect(prereqs).toContain('conditional_keywords');
    expect(prereqs).toContain('literal_values'); // transitive via variable_declaration chain
    expect(prereqs).not.toContain('control_flow_conditional');
  });

  it('recommends an unmastered concept with satisfied prerequisites first', () => {
    const next = getNextConcept(new Set());
    expect(next).toBeDefined();
    expect(next?.difficulty).toBe(1);
  });

  it('returns undefined when everything is mastered', () => {
    const all = new Set(CONCEPT_NODES.map((c) => c.id));
    expect(getNextConcept(all)).toBeUndefined();
  });

  it('exposes bidirectional related and contrast edges', () => {
    const { related, contrasts } = getRelatedConcepts('variable_declaration');
    expect(related.length + contrasts.length).toBeGreaterThan(0);
    expect(contrasts).toContain('constant_declaration');
  });
});

describe('conceptEngine graph algorithms (synthetic)', () => {
  const graph: ConceptGraph = {
    edges: [
      { from: 'a', to: 'b', type: 'prerequisite', strength: 1 },
      { from: 'b', to: 'c', type: 'prerequisite', strength: 1 },
      { from: 'x', to: 'y', type: 'related', strength: 0.5 },
      { from: 'y', to: 'z', type: 'contrast', strength: 0.5 },
    ],
  };

  beforeEach(() =>
    initConceptEngine(
      [
        node('a'),
        node('b', { difficulty: 2 }),
        node('c', { difficulty: 3 }),
        node('x', { difficulty: 3 }),
        node('y', { difficulty: 3 }),
        node('z', { difficulty: 3 }),
      ],
      graph,
    ),
  );

  it('resolvePrerequisites walks the whole chain', () => {
    expect(resolvePrerequisites('c').sort()).toEqual(['a', 'b']);
    expect(resolvePrerequisites('a')).toEqual([]);
  });

  it('resolvePrerequisites terminates on cyclic graphs', () => {
    initConceptEngine([node('p'), node('q')], {
      edges: [
        { from: 'p', to: 'q', type: 'prerequisite', strength: 1 },
        { from: 'q', to: 'p', type: 'prerequisite', strength: 1 },
      ],
    });
    expect(resolvePrerequisites('p')).toEqual(['q']);
  });

  it('getNextConcept respects prerequisite readiness', () => {
    // Nothing mastered: only a and x are ready; a wins on difficulty/layer order.
    expect(getNextConcept(new Set())?.id).toBe('a');
    // With a mastered, b becomes ready and outranks x (lower difficulty).
    expect(getNextConcept(new Set(['a']))?.id).toBe('b');
  });

  it('getNextConcept falls back when nothing is ready', () => {
    initConceptEngine([node('b', { difficulty: 2 }), node('c', { difficulty: 3 })], graph);
    // b needs a (absent from cache, never mastered) → no ready concept → fallback.
    expect(getNextConcept(new Set())?.id).toBe('b');
  });

  it('getRelatedConcepts reads both edge directions', () => {
    expect(getRelatedConcepts('y').related).toEqual(['x']);
    expect(getRelatedConcepts('y').contrasts).toEqual(['z']);
    expect(getRelatedConcepts('x').related).toEqual(['y']);
  });

  it('returns empty results before initialization', () => {
    initConceptEngine([], { edges: [] });
    expect(getAllConcepts()).toEqual([]);
    expect(resolvePrerequisites('a')).toEqual([]);
    expect(getRelatedConcepts('a')).toEqual({ related: [], contrasts: [] });
  });
});
