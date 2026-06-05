import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteMonthlySettlementModalStore = defineStore(
  "deleteMonthlySettlementModal",
  () => {
    const open = ref(false);
    const year = ref(0);
    const month = ref(0);
    const onDone = ref<((year: number) => void) | undefined>(undefined);

    const openDeleteMonthlySettlement = (
      selectedYear: number,
      selectedMonth: number,
      cb?: (year: number) => void,
    ) => {
      year.value = selectedYear;
      month.value = selectedMonth;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        year.value = 0;
        month.value = 0;
      }
    });

    return {
      open,
      year,
      month,
      onDone,
      openDeleteMonthlySettlement,
    };
  },
);

export default useDeleteMonthlySettlementModalStore;
