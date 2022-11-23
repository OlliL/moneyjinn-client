export function redIfNegativeEnd(check?: number): string {
  const cssClass =
    "text-end" + (check != null && check < 0 ? " text-danger" : "");
  return cssClass;
}

export function formatNumber(num: number, decimalPlaces: number): string {
  if (num !== undefined) {
    num = +num.toFixed(decimalPlaces).replace(/^-0\.00$/, "0.00");
  }
  return new Intl.NumberFormat("de-DE", {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(num);
}
