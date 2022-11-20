export function redIfNegativeEnd(check: number): string {
  const cssClass = "text-end" + (check < 0 ? " text-danger" : "");
  return cssClass;
}

export function formatNumber(num: number, decimalPlaces: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(num);
}
