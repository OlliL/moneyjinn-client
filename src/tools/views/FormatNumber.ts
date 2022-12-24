export function redIfNegativeEnd(check?: number): string {
  const cssClass =
    "text-end" + (check != null && check < 0 ? " text-danger" : "");
  return cssClass;
}

export function redIfNegativeStart(check?: number): string {
  const cssClass =
    "text-start" + (check != null && check < 0 ? " text-danger" : "");
  return cssClass;
}

export function formatNumber(num: number, decimalPlaces: number): string {
  if (num !== undefined) {
    // save decimal places of the given number, ignore negative sign
    const decimals: string = Math.abs(num % 1)
      .toFixed(decimalPlaces)
      .substring(2);
    // delete decimal places of the given number
    num = ~~num;
    // format number with thousand delimiter and add decimal places again
    let numStr = num.toLocaleString("de");
    if (decimalPlaces > 0) {
      numStr = numStr.concat(",", decimals);
    }
    return numStr;
  }
  return "";
}
