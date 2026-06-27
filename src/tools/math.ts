export function toFixed(value: number, precision: number): number {
  const power = Math.pow(10, precision || 0);
  const result = Math.round(value * power) / power;
  return Object.is(result, -0) ? 0 : result;
}
