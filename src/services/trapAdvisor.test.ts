import { beforeEach, describe, expect, it } from 'vitest';
import { getRelevantTraps, getPositiveTransfers, getAllTraps } from './trapAdvisor';
import { initConceptEngine } from './conceptEngine';
import { CONCEPT_NODES } from '@/data/concepts';
import { conceptGraph } from '@/data/graph';
import type { ConceptNode } from '@/types';

describe('trapAdvisor with real Alpha data', () => {
  beforeEach(() => initConceptEngine(CONCEPT_NODES, conceptGraph));

  it('returns no traps for an unknown concept', () => {
    expect(getRelevantTraps('nope', ['python'])).toEqual([]);
    expect(getPositiveTransfers('nope', ['python'])).toEqual([]);
    expect(getAllTraps('nope')).toEqual([]);
  });

  it('shows only traps whose source language is known (C3)', () => {
    const traps = getRelevantTraps('literal_values', ['python']);
    expect(traps.length).toBeGreaterThan(0);
    for (const t of traps) expect(t.source).toBe('python');
  });

  it('returns nothing when no language is known', () => {
    expect(getRelevantTraps('literal_values', [])).toEqual([]);
    expect(getPositiveTransfers('literal_values', [])).toEqual([]);
  });

  it('getAllTraps ignores known languages', () => {
    const all = getAllTraps('literal_values');
    const relevant = getRelevantTraps('literal_values', ['python', 'c', 'java', 'rust']);
    expect(all.length).toBeGreaterThanOrEqual(relevant.length);
    for (const t of all) expect(t.key).toMatch(/^[a-z]+_to_[a-z]+$/);
  });

  it('parses source and target from the key', () => {
    const [first] = getAllTraps('literal_values');
    expect(first.key).toBe(`${first.source}_to_${first.target}`);
  });

  it('finds positive transfers for known sources', () => {
    const transfers = getPositiveTransfers('assignment_operators', ['c']);
    expect(transfers.length).toBeGreaterThan(0);
    for (const t of transfers) expect(t.source).toBe('c');
  });
});

describe('trapAdvisor key parsing (synthetic)', () => {
  const concept = {
    id: 'synthetic',
    traps: {
      python_to_rust: {
        description: 'ok',
        severity: 'high',
        example_wrong: 'x',
        example_correct: 'y',
        explanation: 'z',
      },
      bogus_key: {
        description: 'bad key',
        severity: 'low',
        example_wrong: 'x',
        example_correct: 'y',
        explanation: 'z',
      },
    },
    positive_transfers: {},
  } as unknown as ConceptNode;

  beforeEach(() => initConceptEngine([concept], { edges: [] }));

  it('skips malformed trap keys instead of crashing', () => {
    const all = getAllTraps('synthetic');
    expect(all).toHaveLength(1);
    expect(all[0].key).toBe('python_to_rust');
    expect(getRelevantTraps('synthetic', ['python'])).toHaveLength(1);
    expect(getRelevantTraps('synthetic', ['rust'])).toHaveLength(0);
  });
});
