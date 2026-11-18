import { describe, expect, it } from 'vitest';
import { CONCEPT_NODES } from './index';
import { conceptGraph } from '../graph';
import { ALPHA_LANGUAGES, LAYERS, PARADIGMS } from '@/types';
import type { AlphaLanguage } from '@/types';

// Machine-checkable subset of the C1-C7 design constraints (CLAUDE.md).
// Answerability of semantic tests lives in answerability.test.ts (issue #1).

const ids = new Set(CONCEPT_NODES.map((c) => c.id));
const TRANSFER_KEY = /^([a-z]+)_to_([a-z]+)$/;

describe('concept data integrity', () => {
  it('has unique concept ids', () => {
    expect(ids.size).toBe(CONCEPT_NODES.length);
  });

  it('has 24 Alpha concepts across P1-P3', () => {
    expect(CONCEPT_NODES).toHaveLength(24);
    for (const c of CONCEPT_NODES) {
      expect([1, 2, 3], `${c.id}: Alpha difficulty must be P1-P3`).toContain(c.difficulty);
    }
  });

  it.each(CONCEPT_NODES.map((c) => [c.id, c] as const))('%s: core fields', (_id, c) => {
    expect(LAYERS).toContain(c.layer);
    expect(c.layer_position).toBeGreaterThanOrEqual(1);
    expect(c.new_concept_count).toBeGreaterThanOrEqual(1);
    expect(c.name.length).toBeGreaterThan(0);
    expect(c.name_en.length).toBeGreaterThan(0);
    expect(c.description.length).toBeGreaterThan(0);
    expect(c.description_en.length).toBeGreaterThan(0);
  });

  it('has unique layer_position within each layer', () => {
    for (const layer of LAYERS) {
      const positions = CONCEPT_NODES.filter((c) => c.layer === layer).map((c) => c.layer_position);
      expect(new Set(positions).size, `layer ${layer}`).toBe(positions.length);
    }
  });

  it.each(CONCEPT_NODES.map((c) => [c.id, c] as const))('%s: paradigm tags valid (C1)', (_id, c) => {
    expect(c.paradigm_tags.length).toBeGreaterThan(0);
    for (const tag of c.paradigm_tags) expect(PARADIGMS).toContain(tag);
  });

  it.each(CONCEPT_NODES.map((c) => [c.id, c] as const))(
    '%s: >=3 language expressions with valid fields (C4)',
    (_id, c) => {
      const entries = Object.entries(c.expressions);
      expect(entries.length, 'C4: minimum 3 languages per concept').toBeGreaterThanOrEqual(3);
      for (const [lang, expr] of entries) {
        expect(ALPHA_LANGUAGES, `unknown language ${lang}`).toContain(lang);
        expect(expr, `${lang} expression missing`).toBeDefined();
        if (!expr) continue;
        expect(PARADIGMS, `${lang}: expression paradigm`).toContain(expr.paradigm);
        expect(expr.code.length, `${lang}: code`).toBeGreaterThan(0);
        expect(expr.explanation.length, `${lang}: explanation`).toBeGreaterThan(0);
        expect(expr.layer_note.length, `${lang}: layer_note`).toBeGreaterThan(0);
      }
    },
  );

  it.each(CONCEPT_NODES.map((c) => [c.id, c] as const))(
    '%s: transfer keys are {source}_to_{target} between distinct Alpha languages (C3)',
    (_id, c) => {
      for (const key of [...Object.keys(c.traps), ...Object.keys(c.positive_transfers)]) {
        const m = key.match(TRANSFER_KEY);
        expect(m, `bad transfer key "${key}"`).not.toBeNull();
        if (!m) continue;
        expect(ALPHA_LANGUAGES, `${key}: source`).toContain(m[1]);
        expect(ALPHA_LANGUAGES, `${key}: target`).toContain(m[2]);
        expect(m[1], `${key}: self-transfer`).not.toBe(m[2]);
      }
      for (const trap of Object.values(c.traps)) {
        if (!trap) continue;
        expect(['low', 'medium', 'high']).toContain(trap.severity);
        expect(trap.description.length).toBeGreaterThan(0);
        expect(trap.example_wrong.length).toBeGreaterThan(0);
        expect(trap.example_correct.length).toBeGreaterThan(0);
      }
    },
  );

  it.each(CONCEPT_NODES.map((c) => [c.id, c] as const))(
    '%s: inline dependency references exist',
    (_id, c) => {
      for (const dep of [...c.dependencies, ...c.related, ...c.contrasts]) {
        expect(ids.has(dep.id), `${c.id} references missing concept "${dep.id}"`).toBe(true);
      }
    },
  );

  it.each(CONCEPT_NODES.map((c) => [c.id, c] as const))('%s: semantic test fields (C6)', (_id, c) => {
    for (const t of c.semantic_tests) {
      expect(['select_output', 'identify_equivalent']).toContain(t.type);
      expect(ALPHA_LANGUAGES).toContain(t.language_context);
      expect([1, 2, 3, 4, 5]).toContain(t.difficulty);
      expect(t.question.length).toBeGreaterThan(0);
      // Issue #12: every question must be explainable.
      expect(t.explanation.trim().length, `${t.id}: explanation required`).toBeGreaterThan(0);
      if (t.explanation_en !== undefined) {
        expect(t.explanation_en.trim().length, `${t.id}: explanation_en`).toBeGreaterThan(0);
      }
    }
  });
});

describe('concept graph integrity', () => {
  it('edges reference existing concepts with valid type and strength', () => {
    for (const e of conceptGraph.edges) {
      expect(ids.has(e.from), `edge from missing concept "${e.from}"`).toBe(true);
      expect(ids.has(e.to), `edge to missing concept "${e.to}"`).toBe(true);
      expect(['prerequisite', 'related', 'contrast', 'compose']).toContain(e.type);
      expect(e.strength).toBeGreaterThanOrEqual(0);
      expect(e.strength).toBeLessThanOrEqual(1);
    }
  });

  it('prerequisite edges are acyclic', () => {
    const prereqs = new Map<string, string[]>();
    for (const e of conceptGraph.edges) {
      if (e.type !== 'prerequisite') continue;
      prereqs.set(e.to, [...(prereqs.get(e.to) ?? []), e.from]);
    }
    const state = new Map<string, 'visiting' | 'done'>();
    const hasCycle = (node: string): boolean => {
      if (state.get(node) === 'done') return false;
      if (state.get(node) === 'visiting') return true;
      state.set(node, 'visiting');
      for (const prev of prereqs.get(node) ?? []) {
        if (hasCycle(prev)) return true;
      }
      state.set(node, 'done');
      return false;
    };
    for (const id of ids) expect(hasCycle(id), `cycle reachable from ${id}`).toBe(false);
  });
});

describe('language display order (C7)', () => {
  it('no language is privileged in the Alpha list order used for display', () => {
    // C7 is enforced at runtime via shuffle(); here we only pin the canonical
    // language set so a silent addition/removal is caught.
    expect([...ALPHA_LANGUAGES].sort()).toEqual(['c', 'java', 'python', 'rust']);
    const asLangs: AlphaLanguage[] = [...ALPHA_LANGUAGES];
    expect(asLangs).toHaveLength(4);
  });
});
