import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreatePreDefMoneyflowModalStore = defineStore(
  "createPreDefMoneyflowModal",
  () => {
    const open = ref(false);
    const preDefMoneyflow = ref<PreDefMoneyflow | undefined>(undefined);
    const onDone = ref<((entry: PreDefMoneyflow) => void) | undefined>(
      undefined,
    );

    const openCreatePreDefMoneyflow = (
      cb?: (entry: PreDefMoneyflow) => void,
    ) => {
      preDefMoneyflow.value = undefined;
      onDone.value = cb;
      open.value = true;
    };

    const openEditPreDefMoneyflow = (
      entry: PreDefMoneyflow,
      cb?: (entry: PreDefMoneyflow) => void,
    ) => {
      preDefMoneyflow.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        preDefMoneyflow.value = undefined;
      }
    });

    return {
      open,
      preDefMoneyflow,
      onDone,
      openCreatePreDefMoneyflow,
      openEditPreDefMoneyflow,
    };
  },
);

export default useCreatePreDefMoneyflowModalStore;
