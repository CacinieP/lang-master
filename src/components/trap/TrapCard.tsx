import type { Trap } from '@/types';
import { useUserStore } from '@/store/userStore';

interface Props {
  sourceLang: string;
  targetLang: string;
  trap: Trap;
}

const SEVERITY_COLORS: Record<string, string> = {
  high: 'var(--accent-red)',
  medium: 'var(--accent-orange)',
  low: 'var(--accent-yellow)',
};

export function TrapCard({ sourceLang, targetLang, trap }: Props) {
  const uiLanguage = useUserStore((s) => s.profile.ui_language);

  return (
    <div className="trap-card" data-severity={trap.severity}>
      <div className="trap-card-header">
        <span
          className="severity-dot"
          style={{ backgroundColor: SEVERITY_COLORS[trap.severity] }}
        />
        <span className="trap-lang-pair">{sourceLang} → {targetLang}</span>
        <span className="severity-label">{trap.severity}</span>
      </div>
      <div className="trap-description">{trap.description}</div>
      <div className="trap-examples">
        <div className="trap-example wrong">
          <span className="example-label">
            {uiLanguage === 'zh' ? '错误' : 'Wrong'}
          </span>
          <code>{trap.example_wrong}</code>
        </div>
        <div className="trap-example correct">
          <span className="example-label">
            {uiLanguage === 'zh' ? '正确' : 'Correct'}
          </span>
          <code>{trap.example_correct}</code>
        </div>
      </div>
      <div className="trap-explanation">{trap.explanation}</div>
    </div>
  );
}
