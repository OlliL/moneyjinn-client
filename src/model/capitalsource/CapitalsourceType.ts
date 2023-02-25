import i18n from "@/main";
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
  i18n.global.t("Capitalsource.currentAsset"),
  i18n.global.t("Capitalsource.longTermAsset"),
  i18n.global.t("Capitalsource.reserveAsset"),
  i18n.global.t("Capitalsource.provisionAsset"),
  i18n.global.t("Capitalsource.credit"),
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
