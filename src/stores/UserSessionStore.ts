import { defineStore } from "pinia";

export type UserSession = {
  userId: number;
  userName: string;
  userAuthorizationToken: string;
  userRefreshToken: string;
  userIsAdmin: boolean;
  userCanLogin: boolean;
  userIsNew: boolean;
};

export const useUserSessionStore = defineStore("userSession", {
  state: () =>
    ({
      userId: 0,
      userName: "",
      userAuthorizationToken: "",
      userRefreshToken: "",
      userIsAdmin: false,
      userCanLogin: false,
      userIsNew: true,
    } as UserSession),
  getters: {
    getAuthorizationToken(): string {
      return this.userAuthorizationToken;
    },
  },
  actions: {
    setUserSession(userSess: UserSession) {
      this.userId = userSess.userId;
      this.userName = userSess.userName;
      this.userAuthorizationToken = userSess.userAuthorizationToken;
      this.userRefreshToken = userSess.userRefreshToken;
      this.userIsAdmin = userSess.userIsAdmin;
      this.userCanLogin = userSess.userCanLogin;
      this.userIsNew = userSess.userIsNew;
    },
  },
  persist: {
    enabled: true,
  },
});
