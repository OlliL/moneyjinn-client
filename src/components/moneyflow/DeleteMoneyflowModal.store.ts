import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteMoneyflowModalStore = defineStore(
  "deleteMoneyflowModal",
  () => {
    const open = ref(false);
    const moneyflow = ref({} as Moneyflow);
    const onDone = ref<((entry: Moneyflow) => void) | undefined>(undefined);

    const openDeleteMoneyflow = (
      entry: Moneyflow,
      cb?: (entry: Moneyflow) => void,
    ) => {
      moneyflow.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        moneyflow.value = {} as Moneyflow;
      }
    });

    return {
      open,
      moneyflow,
      onDone,
      openDeleteMoneyflow,
    };
  },
);

export default useDeleteMoneyflowModalStore;
