export function toFixed(value: number, precision: number): number {
  const power = Math.pow(10, precision || 0);
  return Math.round(value * power) / power;
}
