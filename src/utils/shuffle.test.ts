import { describe, expect, it, vi } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle (C7 helper)', () => {
  it('returns a new array without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const snapshot = [...input];
    const out = shuffle(input);
    expect(out).not.toBe(input);
    expect(input).toEqual(snapshot);
  });

  it('preserves every element exactly once', () => {
    const input = Array.from({ length: 100 }, (_, i) => i);
    expect(shuffle(input).sort((a, b) => a - b)).toEqual(input);
  });

  it('handles empty and single-element arrays', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle([42])).toEqual([42]);
  });

  it('follows Fisher-Yates with a deterministic RNG', () => {
    // Math.random stubbed to 0 → j is always 0 → each position swaps with 0,
    // producing a left rotation by one. Pins the algorithm, not just the contract.
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0);
    try {
      expect(shuffle([1, 2, 3, 4])).toEqual([2, 3, 4, 1]);
    } finally {
      spy.mockRestore();
    }
  });

  it('actually reorders across many runs (no privileged order)', () => {
    const input = ['python', 'c', 'java', 'rust'];
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) seen.add(shuffle(input).join(','));
    expect(seen.size).toBeGreaterThan(1);
  });
});
