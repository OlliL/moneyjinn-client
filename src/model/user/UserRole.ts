import I18nSingleton from "@/config/I18nSingleton";
import type { SelectBoxValue } from "../SelectBoxValue";

export enum UserRole {
  STANDARD,
  ADMIN,
  IMPORT,
  INACTIVE,
}

export const userRoleNames = [
  I18nSingleton.t()("User.standard"),
  I18nSingleton.t()("User.admin"),
  I18nSingleton.t()("User.import"),
  I18nSingleton.t()("User.inactive"),
];

export const userRoleValues = [
  { id: undefined, value: "" },
] as Array<SelectBoxValue>;
for (const role in UserRole) {
  const roleNum = Number(role);
  if (!isNaN(roleNum)) {
    userRoleValues.push({
      id: roleNum,
      value: userRoleNames[roleNum],
    });
  }
}
