import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreateCapitalsourceModalStore = defineStore(
  "createCapitalsourceModal",
  () => {
    const open = ref(false);
    const capitalsource = ref<Capitalsource | undefined>(undefined);
    const onDone = ref<((entry: Capitalsource) => void) | undefined>(undefined);

    const openCreateCapitalsource = (cb?: (entry: Capitalsource) => void) => {
      capitalsource.value = undefined;
      onDone.value = cb;
      open.value = true;
    };

    const openEditCapitalsource = (
      entry: Capitalsource,
      cb?: (entry: Capitalsource) => void,
    ) => {
      capitalsource.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        capitalsource.value = undefined;
      }
    });

    return {
      open,
      capitalsource,
      onDone,
      openCreateCapitalsource,
      openEditCapitalsource,
    };
  },
);
