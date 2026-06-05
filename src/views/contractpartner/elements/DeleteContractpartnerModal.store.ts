import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteContractpartnerModalStore = defineStore(
  "deleteContractpartnerModal",
  () => {
    const open = ref(false);
    const contractpartner = ref({} as Contractpartner);
    const onDone = ref<(() => void) | undefined>(undefined);

    const openDeleteContractpartner = (
      entry: Contractpartner,
      cb?: () => void,
    ) => {
      contractpartner.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    // Combined watcher: reset when modal closes
    watch(open, (newOpen) => {
      if (!newOpen) {
        contractpartner.value = {} as Contractpartner;
      }
    });

    return {
      open,
      contractpartner,
      onDone,
      openDeleteContractpartner,
    };
  },
);

export default useDeleteContractpartnerModalStore;
