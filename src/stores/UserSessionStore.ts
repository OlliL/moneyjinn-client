import { defineStore } from "pinia";

export type UserSession = {
  userId: number;
  userName: string;
  userAuthorizationToken: string;
  userIsAdmin: boolean;
  userCanLogin: boolean;
  userIsNew: boolean;
};

export const useUserSessionStore = defineStore("userSession", {
  state: () => ({} as UserSession),
  getters: {
    getAuthorizationToken(): string {
      return this.userAuthorizationToken;
    },
  },
  actions: {
    setUserSession(userSess: UserSession) {
      this.$state = userSess;
    },
  },
});
