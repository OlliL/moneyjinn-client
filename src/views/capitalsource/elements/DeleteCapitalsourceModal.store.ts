import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteCapitalsourceModalStore = defineStore(
  "deleteCapitalsourceModal",
  () => {
    const open = ref(false);
    const capitalsource = ref({} as Capitalsource);
    const onDone = ref<(() => void) | undefined>(undefined);

    const openDeleteCapitalsource = (
      capitalsourceEntry: Capitalsource,
      cb?: () => void,
    ) => {
      onDone.value = cb;
      capitalsource.value = capitalsourceEntry;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        capitalsource.value = {} as Capitalsource;
      }
    });

    return {
      open,
      capitalsource,
      onDone,
      openDeleteCapitalsource,
    };
  },
);

