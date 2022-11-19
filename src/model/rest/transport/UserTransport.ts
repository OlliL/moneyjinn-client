export type UserTransport = {
  id: number;
  userName: string;
  userPassword?: string;
  userIsAdmin?: number;
  userIsNew?: number;
  userCanLogin?: number;
};
