import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteContractpartnerAccountModalStore = defineStore(
  "deleteContractpartnerAccountModal",
  () => {
    const open = ref(false);
    const account = ref<ContractpartnerAccount | undefined>(undefined);
    const onDone = ref<(() => void) | undefined>(undefined);

    const openDeleteContractpartnerAccount = (
      entry: ContractpartnerAccount,
      cb?: () => void,
    ) => {
      account.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (newOpen) => {
      if (!newOpen) {
        account.value = undefined;
      }
    });

    return {
      open,
      account,
      onDone,
      openDeleteContractpartnerAccount,
    };
  },
);

export default useDeleteContractpartnerAccountModalStore;
