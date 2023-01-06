import { toFixed } from "../math";

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
    const fixedNum = toFixed(num, decimalPlaces);
    let fixedNumStr = fixedNum.toLocaleString("de");

    const decimalPlace = fixedNumStr.indexOf(",");
    if (decimalPlace === -1) {
      // 7   --> 7,00
      fixedNumStr += ",00";
    } else if (decimalPlace == fixedNumStr.length - 2) {
      // 7,5 --> 7,50
      fixedNumStr += "0";
    }

    return fixedNumStr;
  }
  return "";
}
