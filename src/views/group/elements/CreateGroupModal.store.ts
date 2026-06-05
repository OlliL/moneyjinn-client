import type { Group } from "@/model/group/Group";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreateGroupModalStore = defineStore("createGroupModal", () => {
  const open = ref(false);
  const group = ref<Group | undefined>(undefined);
  const onDone = ref<(() => void) | undefined>(undefined);

  const openCreateGroup = (cb?: () => void) => {
    group.value = undefined;
    onDone.value = cb;
    open.value = true;
  };

  const openEditGroup = (entry: Group, cb?: () => void) => {
    group.value = entry;
    onDone.value = cb;
    open.value = true;
  };

  watch(open, (isOpen) => {
    if (!isOpen) {
      group.value = undefined;
    }
  });

  return {
    open,
    group,
    onDone,
    openCreateGroup,
    openEditGroup,
  };
});

export default useCreateGroupModalStore;

