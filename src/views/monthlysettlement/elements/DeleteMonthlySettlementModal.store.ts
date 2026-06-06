import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteMonthlySettlementModalStore = defineStore(
  "deleteMonthlySettlementModal",
  () => {
    const open = ref(false);
    const monthlySettlements = ref<MonthlySettlement[]>([]);
    const onDone = ref<((year: number) => void) | undefined>(undefined);

    const openDeleteMonthlySettlement = (
      settlements: MonthlySettlement[],
      cb?: (year: number) => void,
    ) => {
      monthlySettlements.value = settlements;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        monthlySettlements.value = [];
      }
    });

    return {
      open,
      monthlySettlements,
      onDone,
      openDeleteMonthlySettlement,
    };
  },
);
