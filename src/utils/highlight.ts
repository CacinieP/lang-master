import type { AlphaLanguage } from '@/types';

interface Token {
  type: 'keyword' | 'string' | 'number' | 'comment' | 'operator' | 'type' | 'function' | 'punctuation' | 'identifier';
  value: string;
}

const KEYWORDS: Record<AlphaLanguage, Set<string>> = {
  python: new Set(['if', 'elif', 'else', 'for', 'while', 'def', 'return', 'class', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'yield', 'lambda', 'and', 'or', 'not', 'is', 'in', 'True', 'False', 'None', 'pass', 'break', 'continue', 'raise', 'global', 'nonlocal', 'assert', 'del', 'async', 'await']),
  c: new Set(['if', 'else', 'for', 'while', 'do', 'return', 'break', 'continue', 'switch', 'case', 'default', 'struct', 'typedef', 'enum', 'union', 'void', 'int', 'char', 'float', 'double', 'long', 'short', 'unsigned', 'signed', 'const', 'static', 'extern', 'sizeof', 'goto']),
  java: new Set(['if', 'else', 'for', 'while', 'do', 'return', 'break', 'continue', 'switch', 'case', 'default', 'class', 'interface', 'extends', 'implements', 'new', 'this', 'super', 'import', 'package', 'public', 'private', 'protected', 'static', 'final', 'void', 'int', 'boolean', 'char', 'double', 'float', 'long', 'short', 'byte', 'try', 'catch', 'finally', 'throw', 'throws', 'abstract', 'synchronized', 'var', 'record', 'sealed', 'permits']),
  rust: new Set(['if', 'else', 'for', 'while', 'loop', 'return', 'break', 'continue', 'match', 'fn', 'let', 'mut', 'struct', 'enum', 'impl', 'trait', 'pub', 'use', 'mod', 'self', 'super', 'where', 'type', 'const', 'static', 'async', 'await', 'move', 'ref', 'true', 'false', 'as', 'in', 'dyn', 'unsafe', 'extern', 'crate']),
};

const TYPE_HINTS: Record<AlphaLanguage, Set<string>> = {
  python: new Set(['int', 'float', 'str', 'bool', 'list', 'dict', 'tuple', 'set', 'bytes', 'None', 'Any', 'Optional', 'Union']),
  c: new Set([]),
  java: new Set(['String', 'Integer', 'Boolean', 'Long', 'Double', 'Float', 'List', 'Map', 'Set', 'ArrayList', 'HashMap', 'Object', 'var']),
  rust: new Set(['i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64', 'u128', 'f32', 'f64', 'bool', 'char', 'str', 'String', 'Vec', 'Option', 'Result', 'Box', 'Rc', 'Arc', 'Self']),
};

function tokenize(code: string, lang: AlphaLanguage): Token[] {
  const tokens: Token[] = [];
  const keywords = KEYWORDS[lang];
  const typeHints = TYPE_HINTS[lang];
  let i = 0;

  while (i < code.length) {
    // Comments
    if (code[i] === '/' && code[i + 1] === '/') {
      const start = i;
      while (i < code.length && code[i] !== '\n') i++;
      tokens.push({ type: 'comment', value: code.slice(start, i) });
      continue;
    }
    if (code[i] === '#') {
      const start = i;
      while (i < code.length && code[i] !== '\n') i++;
      tokens.push({ type: 'comment', value: code.slice(start, i) });
      continue;
    }

    // Strings
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      const start = i;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') i++;
        i++;
      }
      i++;
      tokens.push({ type: 'string', value: code.slice(start, i) });
      continue;
    }

    // Numbers
    if (/\d/.test(code[i])) {
      const start = i;
      while (i < code.length && /[\d._eExXa-fA-F]/.test(code[i])) i++;
      tokens.push({ type: 'number', value: code.slice(start, i) });
      continue;
    }

    // Operators
    if (/[+\-*/%=<>!&|^~?:]/.test(code[i])) {
      const start = i;
      while (i < code.length && /[+\-*/%=<>!&|^~?:]/.test(code[i])) i++;
      tokens.push({ type: 'operator', value: code.slice(start, i) });
      continue;
    }

    // Punctuation
    if (/[{}()\[\];,.]/.test(code[i])) {
      tokens.push({ type: 'punctuation', value: code[i] });
      i++;
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_]/.test(code[i])) {
      const start = i;
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) i++;
      const value = code.slice(start, i);
      if (keywords.has(value)) {
        tokens.push({ type: 'keyword', value });
      } else if (typeHints.has(value)) {
        tokens.push({ type: 'type', value });
      } else if (i < code.length && code[i] === '(') {
        tokens.push({ type: 'function', value });
      } else {
        tokens.push({ type: 'identifier', value });
      }
      continue;
    }

    // Whitespace and other
    tokens.push({ type: 'identifier', value: code[i] });
    i++;
  }

  return tokens;
}

export function highlightCode(code: string, lang: AlphaLanguage): string {
  const tokens = tokenize(code, lang);
  return tokens
    .map((t) => {
      const escaped = t.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<span class="tk-${t.type}">${escaped}</span>`;
    })
    .join('');
}
