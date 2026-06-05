import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useReceiptModalStore = defineStore("receiptModal", () => {
  const open = ref(false);
  const moneyflowId = ref<number | undefined>(undefined);
  const importedReceipt = ref<ImportedMoneyflowReceipt | undefined>(undefined);

  const openListReceipt = (
    entryMoneyflowId: number,
    entryImportedReceipt?: ImportedMoneyflowReceipt,
  ) => {
    moneyflowId.value = entryMoneyflowId;
    importedReceipt.value = entryImportedReceipt;
    open.value = true;
  };

  const close = () => {
    open.value = false;
  };

  watch(open, (isOpen) => {
    if (!isOpen) {
      moneyflowId.value = undefined;
      importedReceipt.value = undefined;
    }
  });

  return {
    open,
    moneyflowId,
    importedReceipt,
    openListReceipt,
    close,
  };
});

export default useReceiptModalStore;
