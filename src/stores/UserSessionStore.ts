import { defineStore } from "pinia";

export type UserSession = {
  userId: number;
  userName: string;
  userIsAdmin: boolean;
  userCanLogin: boolean;
  userIsNew: boolean;
};

export const useUserSessionStore = defineStore("userSession", {
  state: () =>
    ({
      userId: 0,
      userName: "",
      userIsAdmin: false,
      userCanLogin: false,
      userIsNew: true,
    }) as UserSession,
  getters: {
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
      this.userIsAdmin = userSess.userIsAdmin;
      this.userCanLogin = userSess.userCanLogin;
      this.userIsNew = userSess.userIsNew;
    },
    logout() {
      this.userId = 0;
      this.userName = "";
      this.userIsAdmin = false;
      this.userCanLogin = false;
      this.userIsNew = true;
    },
  },
  persist: true,
});
