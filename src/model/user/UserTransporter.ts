import type { Group } from "../group/Group";
import type { AccessRelation } from "./AccessRelation";
import type { User } from "./User";

export type UserTransporter = {
  users: Array<User>;
  groups: Array<Group>;
  accessRelations: Array<AccessRelation>;
};
