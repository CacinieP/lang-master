interface Props {
  streak: number;
}

export function StreakIndicator({ streak }: Props) {
  if (streak < 2) return null;

  const multiplier = Math.min(1 + (streak - 1) * 0.5, 3);
  const intensity = Math.min(streak, 5);

  return (
    <div className={`streak-indicator intensity-${intensity}`} aria-label={`Streak: ${streak}, multiplier: ×${multiplier.toFixed(1)}`}>
      <span className="streak-fire" aria-hidden="true">🔥</span>
      <span className="streak-count">×{streak}</span>
      <span className="streak-mult">×{multiplier.toFixed(1)}</span>
    </div>
  );
}
