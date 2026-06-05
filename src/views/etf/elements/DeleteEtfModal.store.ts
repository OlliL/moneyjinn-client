import type { Etf } from "@/model/etf/Etf";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteEtfModalStore = defineStore("deleteEtfModal", () => {
  const open = ref(false);
  const etf = ref({} as Etf);
  const onDone = ref<(() => void) | undefined>(undefined);

  const openDeleteEtf = (entry: Etf, cb?: () => void) => {
    etf.value = entry;
    onDone.value = cb;
    open.value = true;
  };

  watch(open, (isOpen) => {
    if (!isOpen) {
      etf.value = {} as Etf;
    }
  });

  return {
    open,
    etf,
    onDone,
    openDeleteEtf,
  };
});

export default useDeleteEtfModalStore;

