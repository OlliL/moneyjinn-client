import I18nHolder from "@/handler/I18nHolder";
import type { SelectBoxValue } from "../SelectBoxValue";

export enum UserRole {
  STANDARD,
  ADMIN,
  IMPORT,
  INACTIVE,
}

export const userRoleNames = [
  I18nHolder.t()("User.standard"),
  I18nHolder.t()("User.admin"),
  I18nHolder.t()("User.import"),
  I18nHolder.t()("User.inactive"),
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
