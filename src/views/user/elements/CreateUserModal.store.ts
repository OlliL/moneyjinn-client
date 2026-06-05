import type { User } from "@/model/user/User";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreateUserModalStore = defineStore("createUserModal", () => {
  const open = ref(false);
  const user = ref<User | undefined>(undefined);
  const onDone = ref<(() => void) | undefined>(undefined);

  const openCreateUser = (cb?: () => void) => {
    user.value = undefined;
    onDone.value = cb;
    open.value = true;
  };

  const openEditUser = (entry: User, cb?: () => void) => {
    user.value = entry;
    onDone.value = cb;
    open.value = true;
  };

  watch(open, (isOpen) => {
    if (!isOpen) {
      user.value = undefined;
    }
  });

  return {
    open,
    user,
    onDone,
    openCreateUser,
    openEditUser,
  };
});

export default useCreateUserModalStore;
