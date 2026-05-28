import type { AlphaLanguage, Trap, PositiveTransfer } from '@/types';
import { getConceptById } from './conceptEngine';

export interface TrapInfo {
  key: string;
  source: AlphaLanguage;
  target: AlphaLanguage;
  trap: Trap;
}

export interface TransferInfo {
  key: string;
  source: AlphaLanguage;
  target: AlphaLanguage;
  transfer: PositiveTransfer;
}

function parseTrapKey(key: string): { source: AlphaLanguage; target: AlphaLanguage } | null {
  const parts = key.split('_to_');
  if (parts.length !== 2) return null;
  return { source: parts[0] as AlphaLanguage, target: parts[1] as AlphaLanguage };
}

export function getRelevantTraps(
  conceptId: string,
  knownLanguages: AlphaLanguage[],
): TrapInfo[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];

  return Object.entries(concept.traps)
    .map(([key, trap]) => {
      if (!trap) return null;
      const parsed = parseTrapKey(key);
      if (!parsed) return null;
      // Show trap if the source language is known (user is coming from that language)
      if (!knownLanguages.includes(parsed.source)) return null;
      return { key, source: parsed.source, target: parsed.target, trap };
    })
    .filter((t): t is TrapInfo => t !== null);
}

export function getPositiveTransfers(
  conceptId: string,
  knownLanguages: AlphaLanguage[],
): TransferInfo[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];

  return Object.entries(concept.positive_transfers)
    .map(([key, transfer]) => {
      if (!transfer) return null;
      const parsed = parseTrapKey(key);
      if (!parsed) return null;
      if (!knownLanguages.includes(parsed.source)) return null;
      return { key, source: parsed.source, target: parsed.target, transfer };
    })
    .filter((t): t is TransferInfo => t !== null);
}

export function getAllTraps(conceptId: string): TrapInfo[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];

  return Object.entries(concept.traps)
    .map(([key, trap]) => {
      if (!trap) return null;
      const parsed = parseTrapKey(key);
      if (!parsed) return null;
      return { key, source: parsed.source, target: parsed.target, trap };
    })
    .filter((t): t is TrapInfo => t !== null);
}
