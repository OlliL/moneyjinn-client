import i18n from "@/main";
import type { SelectBoxValue } from "../SelectBoxValue";

export enum CapitalsourceImport {
  NOT_ALLOWED,
  ALL_ALLOWED,
  BALANCE_ALLOWED,
}

export const capitalsourceImportNames = [
  i18n.global.t("General.no"),
  i18n.global.t("General.all"),
  i18n.global.t("Capitalsource.balance"),
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
