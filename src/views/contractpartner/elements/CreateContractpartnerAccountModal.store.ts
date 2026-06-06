import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreateContractpartnerAccountModalStore = defineStore(
  "createContractpartnerAccountModal",
  () => {
    const open = ref(false);
    const account = ref<ContractpartnerAccount | undefined>(undefined);
    const onDone = ref<(() => void) | undefined>(undefined);

    const openCreateContractpartnerAccount = (id: number, cb?: () => void) => {
      onDone.value = cb;
      account.value = {
        contractpartnerid: id,
      } as ContractpartnerAccount;
      open.value = true;
    };

    const openEditContractpartnerAccount = (
      entry: ContractpartnerAccount,
      cb?: () => void,
    ) => {
      onDone.value = cb;
      account.value = entry;
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
      openCreateContractpartnerAccount,
      openEditContractpartnerAccount,
    };
  },
);

export default useCreateContractpartnerAccountModalStore;
