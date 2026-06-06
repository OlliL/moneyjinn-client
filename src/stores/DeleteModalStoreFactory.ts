// stores/createDeleteModalStore.ts
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export function createDeleteModalStore<T>(storeId: string) {
  return defineStore(storeId, () => {
    const open = ref(false);
    // Wir nutzen hier 'as T', damit die Entity dem Generic entspricht (wie dein {} as Moneyflow)
    const entity = ref<T>({} as T);
    const onDone = ref<((entry: T) => void) | undefined>(undefined);

    const openDelete = (entry: T, cb?: (entry: T) => void) => {
      entity.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    // Reset beim Schließen des Modals
    watch(open, (isOpen) => {
      if (!isOpen) {
        entity.value = {} as T;
      }
    });

    return {
      open,
      entity, // generischer Name statt 'moneyflow'
      onDone,
      openDelete, // einheitlicher Name statt 'openDeleteMoneyflow'
    };
  });
}
