import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreateEtfPreliminaryLumpSumModalPieceStore = defineStore(
  "createEtfPreliminaryLumpSumPieceModal",
  () => {
    const open = ref(false);
    const lumpSum = ref<EtfPreliminaryLumpSum | undefined>(undefined);
    const defaultEtfId = ref<number | undefined>(undefined);
    const onDone =
      ref<((lumpSum: EtfPreliminaryLumpSum) => void) | undefined>(undefined);

    const openCreateEtfPreliminaryLumpSumPiece = (
      etfId: number | undefined,
      entry?: EtfPreliminaryLumpSum,
      cb?: (lumpSum: EtfPreliminaryLumpSum) => void,
    ) => {
      defaultEtfId.value = etfId;
      lumpSum.value = entry;
      onDone.value = cb;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        lumpSum.value = undefined;
      }
    });

    return {
      open,
      lumpSum,
      defaultEtfId,
      onDone,
      openCreateEtfPreliminaryLumpSumPiece,
    };
  },
);

export default useCreateEtfPreliminaryLumpSumModalPieceStore;

