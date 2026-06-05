import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeletePreDefMoneyflowModalStore = defineStore(
  "deletePreDefMoneyflowModal",
  () => {
    const open = ref(false);
    const preDefMoneyflow = ref({} as PreDefMoneyflow);
    const onDone = ref<(() => void) | undefined>(undefined);

    const openDeletePreDefMoneyflow = (
      entry: PreDefMoneyflow,
      cb?: () => void,
    ) => {
      preDefMoneyflow.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        preDefMoneyflow.value = {} as PreDefMoneyflow;
      }
    });

    return {
      open,
      preDefMoneyflow,
      onDone,
      openDeletePreDefMoneyflow,
    };
  },
);

export default useDeletePreDefMoneyflowModalStore;
