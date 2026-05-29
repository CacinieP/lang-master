interface Props {
  timeRemaining: number;
  timeLimit: number;
}

export function ChallengeTimer({ timeRemaining, timeLimit }: Props) {
  const pct = (timeRemaining / timeLimit) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  let color = 'var(--accent-green)';
  if (pct < 20) color = 'var(--accent-red)';
  else if (pct < 50) color = 'var(--accent-orange)';

  return (
    <div className="challenge-timer" role="timer" aria-live="polite" aria-label={`Time remaining: ${display}`}>
      <div className="timer-bar">
        <div className="timer-bar-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="timer-display" style={{ color }}>{display}</span>
    </div>
  );
}
