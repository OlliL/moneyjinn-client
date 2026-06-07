import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreateContractpartnerMatchingModalStore = defineStore(
  "createContractpartnerMatchingModal",
  () => {
    const open = ref(false);
    const matching = ref<ContractpartnerMatching | undefined>(undefined);

    const onDone = ref<((entry: ContractpartnerMatching) => void) | undefined>(
      undefined,
    );

    const openCreateContractpartnerMatching = (
      cb?: (entry: ContractpartnerMatching) => void,
    ) => {
      matching.value = undefined;
      onDone.value = cb;
      open.value = true;
    };

    const openEditContractpartnerMatching = (
      entry: ContractpartnerMatching,
      cb?: () => void,
    ) => {
      matching.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        matching.value = undefined;
      }
    });

    return {
      open,
      matching,
      onDone,
      openCreateContractpartnerMatching,
      openEditContractpartnerMatching,
    };
  },
);

export default useCreateContractpartnerMatchingModalStore;
