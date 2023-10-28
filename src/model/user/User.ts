export type User = {
  id: number;
  userName: string;
  userPassword?: string;
  userIsAdmin: boolean;
  userIsNew: boolean;
  userCanLogin: boolean;
  userCanImport: boolean;
  groupId?: number;
  groupName?: string;
};
