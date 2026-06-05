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
      entry?: PreDefMoneyflow,
      cb?: (entry: PreDefMoneyflow) => void,
    ) => {
      preDefMoneyflow.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    const close = () => {
      open.value = false;
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
      close,
    };
  },
);

export default useCreatePreDefMoneyflowModalStore;
