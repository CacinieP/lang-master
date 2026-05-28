import type { ConceptNode } from '@/types';
import { lexicalP1Concepts } from './lexical-p1';
import { morphologicalP2Concepts } from './morphological-p2';
import { syntaxP3Concepts } from './syntax-p3';

export const CONCEPT_NODES: ConceptNode[] = [
  ...lexicalP1Concepts,
  ...morphologicalP2Concepts,
  ...syntaxP3Concepts,
];
