import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useEditMoneyflowModalStore = defineStore("editMoneyflowModal", () => {
  const open = ref(false);
  const moneyflow = ref<Moneyflow | undefined>(undefined);
  const importedReceipt = ref<ImportedMoneyflowReceipt | undefined>(undefined);
  const onDone = ref<(() => void) | undefined>(undefined);
  const onShowReceipt = ref<((moneyflowId: number) => void) | undefined>(
    undefined,
  );

  const openEditMoneyflow = (
    entry: Moneyflow,
    receipt?: ImportedMoneyflowReceipt,
    doneCb?: () => void,
    showReceiptCb?: (moneyflowId: number) => void,
  ) => {
    moneyflow.value = entry;
    importedReceipt.value = receipt;
    onDone.value = doneCb;
    onShowReceipt.value = showReceiptCb;
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
    onShowReceipt,
    openEditMoneyflow,
  };
});

export default useEditMoneyflowModalStore;

