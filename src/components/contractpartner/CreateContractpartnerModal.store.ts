import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreateContractpartnerModalStore = defineStore(
  "createContractpartnerModal",
  () => {
    const open = ref(false);
    const contractpartner = ref<Contractpartner | undefined>(undefined);
    const onDone = ref<((entry: Contractpartner) => void) | undefined>(
      undefined,
    );

    const openCreateContractpartner = (
      cb?: (entry: Contractpartner) => void,
    ) => {
      contractpartner.value = undefined;
      onDone.value = cb;
      open.value = true;
    };

    const openEditContractpartner = (
      entry: Contractpartner,
      cb?: (entry: Contractpartner) => void,
    ) => {
      contractpartner.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (newOpen) => {
      if (!newOpen) {
        contractpartner.value = undefined;
      }
    });

    return {
      open,
      contractpartner,
      onDone,
      openCreateContractpartner,
      openEditContractpartner,
    };
  },
);
