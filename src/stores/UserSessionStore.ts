import { defineStore } from "pinia";

export type UserSession = {
  userId: number;
  userName: string;
  userAuthorizationToken: string;
  userRefreshToken: string;
  userIsAdmin: boolean;
  userCanLogin: boolean;
  userIsNew: boolean;
  csrfToken: string;
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
      csrfToken: "",
    } as UserSession),
  getters: {
    getAuthorizationToken(): string {
      return this.userAuthorizationToken;
    },
    getRefreshToken(): string {
      return this.userRefreshToken;
    },
    getUserId(): number {
      return this.userId;
    },
    isAdmin(): boolean {
      return this.userIsAdmin;
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
    setCsrfToken(token: string) {
      this.csrfToken = token;
    },
    setAuthorizationToken(token: string) {
      this.userAuthorizationToken = token;
    },
    setRefreshToken(token: string) {
      this.userRefreshToken = token;
    },
    logout() {
      this.userId = 0;
      this.userName = "";
      this.userAuthorizationToken = "";
      this.userRefreshToken = "";
      this.userIsAdmin = false;
      this.userCanLogin = false;
      this.userIsNew = true;
      this.csrfToken = "";
    },
  },
  persist: true,
});
