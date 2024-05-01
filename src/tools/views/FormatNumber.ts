import { toFixed } from "../math";

export function redIfNegative(check?: number): string {
  const cssClass = check != null && check < 0 ? " text-danger" : "";
  return cssClass;
}

export function formatNumber(num: number, decimalPlaces: number): string {
  if (num !== undefined) {
    const fixedNum = toFixed(num, decimalPlaces);
    let fixedNumStr = fixedNum.toLocaleString("de", {
      minimumFractionDigits: decimalPlaces,
    });

    const decimalPlace = fixedNumStr.indexOf(",");
    const fillUpZeroes = Math.abs(
      fixedNumStr.length - 1 - decimalPlaces - decimalPlace,
    );

    if (decimalPlace === -1) {
      if (decimalPlaces > 0) {
        // 7   --> 7,00
        fixedNumStr += "," + "0".repeat(decimalPlaces);
      }
    } else if (fillUpZeroes > 0) {
      // 7,5 --> 7,50
      fixedNumStr += "0".repeat(fillUpZeroes);
    }

    return fixedNumStr;
  }
  return "";
}
