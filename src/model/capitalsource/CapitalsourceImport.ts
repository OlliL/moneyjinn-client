import I18nSingleton from "@/config/I18nSingleton";
import type { SelectBoxValue } from "../SelectBoxValue";

export enum CapitalsourceImport {
  NOT_ALLOWED,
  ALL_ALLOWED,
  BALANCE_ALLOWED,
}

export const capitalsourceImportNames = [
  I18nSingleton.t()("General.no"),
  I18nSingleton.t()("General.all"),
  I18nSingleton.t()("Capitalsource.balance"),
];

export const capitalsourceImportValues = [
  { id: undefined, value: "" },
] as Array<SelectBoxValue>;
for (const importAllowed in CapitalsourceImport) {
  const importNum = Number(importAllowed);
  if (!isNaN(importNum)) {
    capitalsourceImportValues.push({
      id: importNum,
      value: capitalsourceImportNames[importNum],
    });
  }
}
