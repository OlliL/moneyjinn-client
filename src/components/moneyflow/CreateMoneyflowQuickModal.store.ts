import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreateMoneyflowQuickModalStore = defineStore(
  "createMoneyflowQuickModal",
  () => {
    const open = ref(false);
    const preDefMoneyflow = ref<PreDefMoneyflow | undefined>(undefined);
    const onDone = ref<((entry: Moneyflow) => void) | undefined>(undefined);

    const openCreateMoneyflowQuick = (
      entry: PreDefMoneyflow,
      cb?: (entry: Moneyflow) => void,
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
      openCreateMoneyflowQuick,
      close,
    };
  },
);

export default useCreateMoneyflowQuickModalStore;

