import type { AlphaLanguage } from '@/types';
import { highlightCode } from '@/utils/highlight';

interface Props {
  code: string;
  language: AlphaLanguage;
}

export function CodeBlock({ code, language }: Props) {
  const html = highlightCode(code, language);

  return (
    <div className="code-block">
      <pre className="code-pre">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
