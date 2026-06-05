import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteContractpartnerMatchingModalStore = defineStore(
  "deleteContractpartnerMatchingModal",
  () => {
    const open = ref(false);
    const matching = ref({} as ContractpartnerMatching);
    const onDone = ref<(() => void) | undefined>(undefined);

    const openDeleteContractpartnerMatching = (
      entry: ContractpartnerMatching,
      cb?: () => void,
    ) => {
      matching.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        matching.value = {} as ContractpartnerMatching;
      }
    });

    return {
      open,
      matching,
      onDone,
      openDeleteContractpartnerMatching,
    };
  },
);

export default useDeleteContractpartnerMatchingModalStore;

