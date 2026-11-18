import { describe, expect, it } from 'vitest';
import { CONCEPT_NODES } from './index';

// Regression for issue #27: expr_basic_01 shipped with correct_answer '11'
// although 2 + 3*4 - 5%2 = 13. Numeric answers are now RECOMPUTED here from
// first principles instead of trusted. For these integer operations JS
// semantics match the target languages:
//   Math.trunc  = C integer division (truncate toward zero)
//   Math.floor  = Python floor division (//)
//   %           = remainder follows the dividend (C99 and JS alike)
//   * / + -     = identical precedence in JS, Python and C

const byId = new Map(
  CONCEPT_NODES.flatMap((c) => c.semantic_tests.map((t) => [t.id, t] as const)),
);

const trunc = (n: number, d: number) => Math.trunc(n / d);

const ARITHMETIC: Array<[string, string]> = [
  // expressions & precedence
  ['expr_basic_01', String(2 + 3 * 4 - (5 % 2))],
  ['expr_basic_02', String((10 % 3) + trunc(10, 3))],
  ['expr_basic_05', String(trunc(7, 2) * 2)],
  ['op_prec_01', String(2 + 3 * 4)],
  ['op_prec_02', String(!(5 > 3) || 3 > 0) === 'true' ? 'True' : 'False'],
  ['op_prec_05', 3 > 2 && 2 > 1 ? 'True' : 'False'],
  // division & remainder
  ['basic_operators_semantic_1', String(trunc(5, 2))],
  ['basic_operators_semantic_3', String(Math.floor(7 / 2))],
  ['basic_operators_semantic_4', String(Math.floor(-7 / 2))],
  ['basic_operators_semantic_5', String(-7 % 2)],
  // literals & casts
  ['literal_values_semantic_2', String(0x2a)],
  ['literal_values_semantic_4', String(1 + 1)], // True + True, bool is int
  ['type_cast_01', String(Math.trunc(3.7))],
  ['type_cast_05', String(300 % 256)], // 300 as u8 wraps modulo 256
  // assignment
  ['assignment_operators_semantic_3', String(10 + 5)],
  ['assignment_operators_semantic_5', String(3 * (2 + 1))],
  // calls & interpolation
  ['func_call_01', `${Math.sqrt(3 ** 2 + 4 ** 2)}.0`],
  ['str_interp_03', `"Result: ${2 + 3}"`],
  ['str_interp_05', `"${5}-${5}"`],
  // returns
  ['fn_ret_01', `${Math.floor(17 / 5)} ${17 % 5}`],
  ['fn_ret_02', `${trunc(17, 5)} ${17 % 5}`],
  ['fn_def_01', String(3 + 4)],
  // loops & conditionals
  ['cf_while_02', String((() => { let c = 0; while (c < 3) c += 1; return c; })())],
  ['cf_while_04', String((() => { let i = 0; while (false) i += 1; return i; })())],
  ['cf_cond_01', 75 >= 90 ? '"A"' : 75 >= 80 ? '"B"' : '"C"'],
  // bindings
  ['variable_declaration_semantic_1', String((() => { let x = 42; x = 43; return x; })())],
  ['constant_declaration_semantic_1', String(3.14159)],
  ['scope_05', String((() => { let x = 1; const f = () => { x = 2; }; f(); return x; })())],
];

describe('numeric answers recomputed from first principles (issue #27)', () => {
  it.each(ARITHMETIC)('%s: bank answer matches recomputation', (id, computed) => {
    const test = byId.get(id);
    expect(test, `test ${id} must exist`).toBeDefined();
    expect(test!.correct_answer, `${id}: recomputed ${computed}`).toBe(computed);
  });
});
