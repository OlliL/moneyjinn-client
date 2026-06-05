import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteEtfPreliminaryLumpSumModalMonthlyStore = defineStore(
  "deleteEtfPreliminaryLumpSumMonthlyModal",
  () => {
    const open = ref(false);
    const lumpSum = ref({} as EtfPreliminaryLumpSum);
    const onDone =
      ref<((lumpSum: EtfPreliminaryLumpSum) => void) | undefined>(undefined);

    const openDeleteEtfPreliminaryLumpSumMonthly = (
      entry: EtfPreliminaryLumpSum,
      cb?: (lumpSum: EtfPreliminaryLumpSum) => void,
    ) => {
      lumpSum.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        lumpSum.value = {} as EtfPreliminaryLumpSum;
      }
    });

    return {
      open,
      lumpSum,
      onDone,
      openDeleteEtfPreliminaryLumpSumMonthly,
    };
  },
);

export default useDeleteEtfPreliminaryLumpSumModalMonthlyStore;

