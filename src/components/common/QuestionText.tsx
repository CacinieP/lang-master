import type { AlphaLanguage } from '@/types';
import { ALPHA_LANGUAGES } from '@/types';
import { CodeBlock } from '../concept/CodeBlock';

interface Props {
  text: string;
  /** Language used for fenced blocks without an explicit tag. */
  fallbackLanguage: AlphaLanguage;
  className?: string;
}

/**
 * Renders a quiz question that may embed ```-fenced code blocks.
 * The fence's language tag (```rust) is honored and stripped from the code;
 * plain segments keep their line breaks (white-space: pre-line in CSS).
 */
export function QuestionText({ text, fallbackLanguage, className }: Props) {
  const parts = text.split('```');
  return (
    <div className={className}>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const nl = part.indexOf('\n');
          const tag = (nl >= 0 ? part.slice(0, nl) : part).trim();
          const lang = (ALPHA_LANGUAGES as readonly string[]).includes(tag)
            ? (tag as AlphaLanguage)
            : fallbackLanguage;
          const code = (nl >= 0 ? part.slice(nl + 1) : part).trim();
          return <CodeBlock key={i} code={code} language={lang} />;
        }
        const trimmed = part.trim();
        if (!trimmed) return null;
        return (
          <p key={i} className="question-text-part">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
