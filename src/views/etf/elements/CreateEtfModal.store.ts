import type { Etf } from "@/model/etf/Etf";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreateEtfModalStore = defineStore("createEtfModal", () => {
  const open = ref(false);
  const etf = ref<Etf | undefined>(undefined);
  const onDone = ref<(() => void) | undefined>(undefined);

  const openCreateEtf = (cb?: () => void) => {
    etf.value = undefined;
    onDone.value = cb;
    open.value = true;
  };

  const openEditEtf = (entry: Etf, cb?: () => void) => {
    etf.value = entry;
    onDone.value = cb;
    open.value = true;
  };

  watch(open, (isOpen) => {
    if (!isOpen) {
      etf.value = undefined;
    }
  });

  return {
    open,
    etf,
    onDone,
    openCreateEtf,
    openEditEtf,
  };
});

export default useCreateEtfModalStore;

