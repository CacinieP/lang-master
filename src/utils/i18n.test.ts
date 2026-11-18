import { describe, expect, it } from 'vitest';
import { t } from './i18n';

describe('i18n.t', () => {
  it('returns the Chinese string by default', () => {
    expect(t('explore_mode')).toBe('探索模式');
  });

  it('returns the English string when requested', () => {
    expect(t('explore_mode', 'en')).toBe('Explore Mode');
  });

  it('falls back to the key for unknown entries', () => {
    expect(t('no_such_key')).toBe('no_such_key');
    expect(t('no_such_key', 'en')).toBe('no_such_key');
  });

  it('keeps zh and en in sync for every defined key', () => {
    // Probe a representative sample of keys used across the UI.
    const keys = [
      'app_title', 'challenge_mode', 'layer_lexical', 'layer_pragmatic',
      'quiz_submit', 'welcome_title', 'severity_high', 'play_again',
      'back_to_explore', 'result_total_score', 'save_failed',
    ];
    for (const key of keys) {
      expect(t(key, 'zh'), key).not.toBe(key);
      expect(t(key, 'en'), key).not.toBe(key);
    }
  });
});
