import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useListMoneyflowModalStore = defineStore(
  "listMoneyflowModal",
  () => {
    const open = ref(false);
    const moneyflow = ref<Moneyflow | undefined>(undefined);
    const importedReceipt = ref<ImportedMoneyflowReceipt | undefined>(
      undefined,
    );

    const openListMoneyflow = (
      entry: Moneyflow,
      receipt?: ImportedMoneyflowReceipt,
    ) => {
      moneyflow.value = entry;
      importedReceipt.value = receipt;

      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        moneyflow.value = undefined;
        importedReceipt.value = undefined;
      }
    });

    return {
      open,
      moneyflow,
      importedReceipt,
      openListMoneyflow,
    };
  },
);

export default useListMoneyflowModalStore;
