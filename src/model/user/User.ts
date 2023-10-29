import type { UserRole } from "./UserRole";

export type User = {
  id: number;
  userName: string;
  userPassword?: string;
  userIsNew: boolean;
  role: UserRole;
  groupId?: number;
  groupName?: string;
};
