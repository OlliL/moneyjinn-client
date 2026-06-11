import { defineStore } from "pinia";
import { ref, watch } from "vue";

export function createDeleteModalStore<T>(storeId: string) {
  return defineStore(storeId, () => {
    const open = ref(false);
    const entity = ref<T>({} as T);
    const onDone = ref<((entry: T) => void) | undefined>(undefined);

    const openDelete = (entry: T, cb?: (entry: T) => void) => {
      entity.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        entity.value = {} as T;
      }
    });

    return {
      open,
      entity,
      onDone,
      openDelete,
    };
  });
}
