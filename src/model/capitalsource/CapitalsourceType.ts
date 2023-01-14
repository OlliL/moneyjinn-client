import type { SelectBoxValue } from "../SelectBoxValue";

export enum CapitalsourceType {
  __PLACEHOLDER,
  CURRENT_ASSET,
  LONG_TERM_ASSET,
  RESERVE_ASSET,
  PROVISION_ASSET,
  CREDIT,
}

export const capitalsourceTypeNames = [
  "",
  "Umlaufvermögen",
  "Anlagevermögen",
  "Rücklagevermögen",
  "Rückstellungsvermögen",
  "Kredit",
];

export const capitalsourceTypeValues = new Array<SelectBoxValue>();
for (const type in CapitalsourceType) {
  const typeNum = Number(type);
  if (!isNaN(typeNum)) {
    capitalsourceTypeValues.push({
      id: typeNum,
      value: capitalsourceTypeNames[typeNum],
    });
  }
}
