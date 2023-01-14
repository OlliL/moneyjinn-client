import type { SelectBoxValue } from "../SelectBoxValue";

export enum CapitalsourceState {
  __PLACEHOLDER,
  NON_CACHE,
  CACHE,
}

export const capitalsourceStateNames = ["", "unbar", "bar"];

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
