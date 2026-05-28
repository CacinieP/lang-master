import type { AlphaLanguage, Layer, Paradigm, ConceptCategory } from '@/types';

export const LAYER_NAMES: Record<Layer, { zh: string; en: string; short: string }> = {
  lexical: { zh: '词法层', en: 'Lexical', short: 'L1' },
  morphological: { zh: '构造层', en: 'Morphological', short: 'L2' },
  syntax: { zh: '句法层', en: 'Syntax', short: 'L3' },
  semantic: { zh: '语义层', en: 'Semantics', short: 'L4' },
  pragmatic: { zh: '语用层', en: 'Pragmatics', short: 'L5' },
};

export const LAYER_ORDER: Layer[] = ['lexical', 'morphological', 'syntax', 'semantic', 'pragmatic'];

export const PARADIGM_LABELS: Record<Paradigm, { zh: string; en: string; icon: string }> = {
  procedural: { zh: '过程式', en: 'Procedural', icon: '▸' },
  oop: { zh: '面向对象', en: 'OOP', icon: '◆' },
  functional: { zh: '函数式', en: 'Functional', icon: 'λ' },
  concurrent: { zh: '并发式', en: 'Concurrent', icon: '⇶' },
};

export const LANGUAGE_META: Record<AlphaLanguage, {
  name: string;
  name_en: string;
  color: string;
  paradigms: Paradigm[];
  icon: string;
}> = {
  python: {
    name: 'Python',
    name_en: 'Python',
    color: '#3572A5',
    paradigms: ['procedural', 'oop', 'functional'],
    icon: '🐍',
  },
  c: {
    name: 'C',
    name_en: 'C',
    color: '#555555',
    paradigms: ['procedural'],
    icon: '⚙',
  },
  java: {
    name: 'Java',
    name_en: 'Java',
    color: '#B07219',
    paradigms: ['oop'],
    icon: '☕',
  },
  rust: {
    name: 'Rust',
    name_en: 'Rust',
    color: '#DEA584',
    paradigms: ['functional', 'concurrent'],
    icon: '🦀',
  },
};

export const CATEGORIES: ConceptCategory[] = [
  {
    key: 'variables',
    label: '变量与绑定',
    label_en: 'Variables & Binding',
    layer: 'lexical',
    conceptIds: ['literal_values', 'variable_declaration', 'constant_declaration'],
  },
  {
    key: 'operators',
    label: '运算符',
    label_en: 'Operators',
    layer: 'lexical',
    conceptIds: ['basic_operators', 'assignment_operators'],
  },
  {
    key: 'keywords',
    label: '关键字与注释',
    label_en: 'Keywords & Comments',
    layer: 'lexical',
    conceptIds: ['comments', 'conditional_keywords', 'loop_keywords'],
  },
  {
    key: 'expressions',
    label: '表达式与调用',
    label_en: 'Expressions & Calls',
    layer: 'morphological',
    conceptIds: ['expressions_basic', 'function_call', 'member_access', 'operator_precedence'],
  },
  {
    key: 'types_morph',
    label: '类型标注与转换',
    label_en: 'Type Annotation & Casting',
    layer: 'morphological',
    conceptIds: ['type_annotation', 'type_casting'],
  },
  {
    key: 'data_literals',
    label: '数据字面量',
    label_en: 'Data Literals',
    layer: 'morphological',
    conceptIds: ['string_interpolation', 'array_literal'],
  },
  {
    key: 'control_flow',
    label: '控制流',
    label_en: 'Control Flow',
    layer: 'syntax',
    conceptIds: ['control_flow_conditional', 'control_flow_loop_for', 'control_flow_loop_while'],
  },
  {
    key: 'functions',
    label: '函数定义',
    label_en: 'Functions',
    layer: 'syntax',
    conceptIds: ['function_definition', 'function_parameters', 'return_values'],
  },
  {
    key: 'scope_pattern',
    label: '作用域与模式',
    label_en: 'Scope & Patterns',
    layer: 'syntax',
    conceptIds: ['scope_block', 'pattern_matching'],
  },
];
