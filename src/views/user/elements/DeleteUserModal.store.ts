import type { User } from "@/model/user/User";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteUserModalStore = defineStore("deleteUserModal", () => {
  const open = ref(false);
  const user = ref({} as User);
  const onDone = ref<(() => void) | undefined>(undefined);

  const openDeleteUser = (entry: User, cb?: () => void) => {
    user.value = entry;
    onDone.value = cb;
    open.value = true;
  };

  watch(open, (isOpen) => {
    if (!isOpen) {
      user.value = {} as User;
    }
  });

  return {
    open,
    user,
    onDone,
    openDeleteUser,
  };
});

export default useDeleteUserModalStore;

