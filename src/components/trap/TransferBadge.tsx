import type { PositiveTransfer } from '@/types';

interface Props {
  sourceLang: string;
  targetLang: string;
  transfer: PositiveTransfer;
}

export function TransferBadge({ sourceLang, targetLang, transfer }: Props) {
  return (
    <div className="transfer-badge" data-strength={transfer.strength}>
      <div className="transfer-header">
        <span className="transfer-icon">✓</span>
        <span className="transfer-lang-pair">{sourceLang} → {targetLang}</span>
        <span className="transfer-strength">{transfer.strength}</span>
      </div>
      <div className="transfer-note">{transfer.note}</div>
    </div>
  );
}
