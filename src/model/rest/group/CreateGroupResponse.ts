import type { ValidationResponse } from "../ValidationResponse";

export type CreateGroupResponse = ValidationResponse & {
  groupId: number;
};
