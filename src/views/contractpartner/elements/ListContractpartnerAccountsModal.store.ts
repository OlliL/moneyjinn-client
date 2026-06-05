import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useListContractpartnerAccountsModalStore = defineStore(
  "listContractpartnerAccountsModal",
  () => {
    const open = ref(false);
    const contractpartner = ref<Contractpartner | undefined>(undefined);

    const openListContractpartnerAccounts = (entry: Contractpartner) => {
      contractpartner.value = entry;
      open.value = true;
    };

    // Combined watcher: reset when modal closes
    watch(
      open,
      (newOpen) => {
        if (!newOpen) {
          contractpartner.value = undefined;
        }
      },
    );

    return {
      open,
      contractpartner,
      openListContractpartnerAccounts,
    };
  },
);

