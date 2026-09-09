export function calculatePercentage(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

export function calculateWinRate(won: number, lost: number) {
  return calculatePercentage(won, won + lost);
}

export function calculateAcceptanceRate(accepted: number, rejected: number) {
  return calculatePercentage(accepted, accepted + rejected);
}
