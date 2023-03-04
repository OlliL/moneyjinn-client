import I18nHolder from "@/handler/I18nHolder";
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
  I18nHolder.t()("Capitalsource.currentAsset"),
  I18nHolder.t()("Capitalsource.longTermAsset"),
  I18nHolder.t()("Capitalsource.reserveAsset"),
  I18nHolder.t()("Capitalsource.provisionAsset"),
  I18nHolder.t()("Capitalsource.credit"),
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
