import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useEditMoneyflowModalStore = defineStore(
  "editMoneyflowModal",
  () => {
    const open = ref(false);
    const moneyflow = ref<Moneyflow | undefined>(undefined);
    const importedReceipt = ref<ImportedMoneyflowReceipt | undefined>(
      undefined,
    );
    const onDone = ref<((moneyflow: Moneyflow) => void) | undefined>(undefined);

    const openEditMoneyflow = (
      entry: Moneyflow,
      receipt?: ImportedMoneyflowReceipt,
      doneCb?: (moneyflow: Moneyflow) => void,
    ) => {
      moneyflow.value = entry;
      importedReceipt.value = receipt;
      onDone.value = doneCb;

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
      onDone,
      openEditMoneyflow,
    };
  },
);

export default useEditMoneyflowModalStore;
