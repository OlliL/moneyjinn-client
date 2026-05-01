import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type UserSession = {
  userId: number;
  userName: string;
  userIsAdmin: boolean;
  userCanLogin: boolean;
  userIsNew: boolean;
};

export const useUserSessionStore = defineStore(
  "userSession",
  () => {
    const userSession = ref<UserSession>({
      userId: 0,
      userName: "",
      userIsAdmin: false,
      userCanLogin: false,
      userIsNew: true,
    });

    const getUserId = computed((): number => {
      return userSession.value.userId;
    });

    const isAdmin = computed((): boolean => {
      return userSession.value.userIsAdmin;
    });

    function setUserSession(userSess: UserSession) {
      Object.assign(userSession.value, userSess);
    }

    function logout() {
      userSession.value.userId = 0;
      userSession.value.userName = "";
      userSession.value.userIsAdmin = false;
      userSession.value.userCanLogin = false;
      userSession.value.userIsNew = true;
    }

    return {
      userSession,
      getUserId,
      isAdmin,
      setUserSession,
      logout,
    };
  },
  {
    persist: true,
  },
);
