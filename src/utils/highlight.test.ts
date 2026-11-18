import { describe, expect, it } from 'vitest';
import { highlightCode } from './highlight';

describe('highlightCode', () => {
  it('wraps keywords in a tk-keyword span', () => {
    expect(highlightCode('return', 'python')).toBe('<span class="tk-keyword">return</span>');
    expect(highlightCode('fn', 'rust')).toContain('tk-keyword');
  });

  it('distinguishes language-specific keywords', () => {
    // 'def' is a Python keyword but a plain identifier in Rust.
    expect(highlightCode('def', 'python')).toContain('tk-keyword');
    expect(highlightCode('def', 'rust')).toContain('tk-identifier');
  });

  it('highlights strings and escapes HTML inside them', () => {
    const out = highlightCode('"a<b>&c"', 'python');
    expect(out).toContain('tk-string');
    expect(out).toContain('&lt;');
    expect(out).toContain('&amp;');
    expect(out).not.toContain('<b>');
  });

  it('handles escaped quotes inside strings', () => {
    const out = highlightCode('"say \\"hi\\""', 'java');
    expect(out).toContain('tk-string');
  });

  it('highlights numbers', () => {
    expect(highlightCode('42', 'c')).toContain('tk-number');
    expect(highlightCode('3.14', 'python')).toContain('tk-number');
  });

  it('highlights Python # comments', () => {
    const out = highlightCode('x = 1  # note', 'python');
    expect(out).toContain('tk-comment');
    expect(out).toContain('note');
  });

  it('highlights // line comments in C-family languages', () => {
    expect(highlightCode('// hi', 'java')).toContain('tk-comment');
    expect(highlightCode('// hi', 'rust')).toContain('tk-comment');
  });

  it('highlights /* block comments */', () => {
    expect(highlightCode('/* block */', 'c')).toContain('tk-comment');
  });

  it('marks type hints distinctly from keywords', () => {
    expect(highlightCode('String', 'java')).toContain('tk-type');
    expect(highlightCode('i32', 'rust')).toContain('tk-type');
  });

  it('marks call-site identifiers as functions', () => {
    expect(highlightCode('print(', 'python')).toContain('tk-function');
  });

  it('leaves whitespace unwrapped', () => {
    expect(highlightCode('a b', 'python')).toContain('a</span> <span');
  });

  it('returns an empty string for empty input', () => {
    expect(highlightCode('', 'python')).toBe('');
  });

  it('does not throw on any Alpha language', () => {
    for (const lang of ['python', 'c', 'java', 'rust'] as const) {
      expect(() => highlightCode('let x = 1; // 注释', lang)).not.toThrow();
    }
  });
});
