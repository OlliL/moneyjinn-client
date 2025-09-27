import I18nSingleton from "@/config/I18nSingleton";
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
  I18nSingleton.t()("Capitalsource.currentAsset"),
  I18nSingleton.t()("Capitalsource.longTermAsset"),
  I18nSingleton.t()("Capitalsource.reserveAsset"),
  I18nSingleton.t()("Capitalsource.provisionAsset"),
  I18nSingleton.t()("Capitalsource.credit"),
];

export const capitalsourceTypeValues = new Array<SelectBoxValue>();
for (const type in CapitalsourceType) {
  const typeNum = Number(type);
  if (!isNaN(typeNum)) {
    capitalsourceTypeValues.push({
      id: typeNum,
      value: capitalsourceTypeNames[typeNum] ?? "",
    });
  }
}
