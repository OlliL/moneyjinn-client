import I18nHolder from "@/handler/I18nHolder";
import type { SelectBoxValue } from "../SelectBoxValue";

export enum CapitalsourceImport {
  NOT_ALLOWED,
  ALL_ALLOWED,
  BALANCE_ALLOWED,
}

export const capitalsourceImportNames = [
  I18nHolder.t()("General.no"),
  I18nHolder.t()("General.no"),
  I18nHolder.t()("General.all"),
  I18nHolder.t()("Capitalsource.balance"),
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
