import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useEditMonthlySettlementModalStore = defineStore(
  "editMonthlySettlementModal",
  () => {
    const open = ref(false);
    const year = ref<number | undefined>(undefined);
    const month = ref<number | undefined>(undefined);
    const onDone = ref<((year: number, month: number) => void) | undefined>(
      undefined,
    );

    const openCreateMonthlySettlement = (
      cb?: (year: number, month: number) => void,
    ) => {
      year.value = undefined;
      month.value = undefined;
      onDone.value = cb;
      open.value = true;
    };

    const openEditMonthlySettlement = (
      targetYear?: number,
      targetMonth?: number,
      cb?: (year: number, month: number) => void,
    ) => {
      year.value = targetYear;
      month.value = targetMonth;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        year.value = undefined;
        month.value = undefined;
      }
    });

    return {
      open,
      year,
      month,
      onDone,
      openCreateMonthlySettlement,
      openEditMonthlySettlement,
    };
  },
);

export default useEditMonthlySettlementModalStore;
