import type { Group } from "@/model/group/Group";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteGroupModalStore = defineStore("deleteGroupModal", () => {
  const open = ref(false);
  const group = ref({} as Group);
  const onDone = ref<(() => void) | undefined>(undefined);

  const openDeleteGroup = (entry: Group, cb?: () => void) => {
    group.value = entry;
    onDone.value = cb;
    open.value = true;
  };

  watch(open, (isOpen) => {
    if (!isOpen) {
      group.value = {} as Group;
    }
  });

  return {
    open,
    group,
    onDone,
    openDeleteGroup,
  };
});

export default useDeleteGroupModalStore;

