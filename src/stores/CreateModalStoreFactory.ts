import { handleBackendError } from "@/tools/views/HandleBackendError";
import { defineStore } from "pinia";
import { computed, ref, toRaw, watch } from "vue";
import { useI18n } from "vue-i18n";

export function createCreateModalStore<T extends { id: number }>(
  storeId: string,
  options: {
    titleCreate: string;
    titleUpdate: string;
    createFn: (entity: T) => Promise<T | void>;
    updateFn: (entity: T) => Promise<T | void>;
    getEmptyEntity: () => T;
  },
) {
  return defineStore(storeId, () => {
    const { t } = useI18n();

    const open = ref(false);
    const onDone = ref<((entry: T) => void) | undefined>(undefined);

    const mData = ref<T>({} as T);
    const origData = ref<T | undefined>(undefined);

    const isEditMode = computed(() => origData.value !== undefined);

    const title = computed(() =>
      isEditMode.value ? t(options.titleUpdate) : t(options.titleCreate),
    );

    const resetForm = (
      resetAll?: () => void,
      setFieldTouched?: (field: string, touched: boolean) => void,
    ) => {
      mData.value = isEditMode.value
        ? structuredClone(toRaw(origData.value))
        : options.getEmptyEntity();

      if (resetAll) {
        resetAll();
      }
    };

    const openCreate = (cb?: (entry: T) => void) => {
      origData.value = undefined;
      onDone.value = cb;
      open.value = true;
      resetForm();
    };

    const openEdit = (entry: T, cb?: (entry: T) => void) => {
      origData.value = entry;
      onDone.value = cb;
      open.value = true;
      resetForm();
    };

    watch(open, (isVisible) => {
      if (!isVisible) {
        origData.value = undefined;
      }
    });

    const save = (
      handleSubmit: (fn: () => unknown) => (e?: Event) => Promise<unknown>,
    ) => {
      return handleSubmit(() => {
        const serviceCall = isEditMode.value
          ? options.updateFn(mData.value)
          : options.createFn(mData.value);

        serviceCall
          .then((result) => {
            if (!isEditMode.value && result) mData.value = result;
            open.value = false;
            onDone.value?.(mData.value);
          })
          .catch(handleBackendError);
      });
    };

    return {
      open,
      mData,
      title,
      openCreate,
      openEdit,
      resetForm,
      save,
    };
  });
}
