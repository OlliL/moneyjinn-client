import I18nSingleton from "@/config/I18nSingleton";
import type { SelectBoxValue } from "../SelectBoxValue";

export enum CapitalsourceState {
  __PLACEHOLDER,
  NON_CASH,
  CASH,
}

export const capitalsourceStateNames = [
  "",
  I18nSingleton.t()("Capitalsource.nonCash"),
  I18nSingleton.t()("Capitalsource.cash"),
];

export const capitalsourceStateValues = new Array<SelectBoxValue>();
for (const state in CapitalsourceState) {
  const stateNum = Number(state);
  if (!isNaN(stateNum)) {
    capitalsourceStateValues.push({
      id: stateNum,
      value: capitalsourceStateNames[stateNum],
    });
  }
}
