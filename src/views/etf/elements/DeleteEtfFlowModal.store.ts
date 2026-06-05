import type { EtfFlow } from "@/model/etf/EtfFlow";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useDeleteEtfFlowModalStore = defineStore(
  "deleteEtfFlowModal",
  () => {
    const open = ref(false);
    const flow = ref({} as EtfFlow);
    const etfName = ref("");
    const onDone = ref<((etfFlow: EtfFlow) => void) | undefined>(undefined);

    const openDeleteEtfFlow = (
      entry: EtfFlow,
      context?: {
        etfName: string;
        onDone?: (etfFlow: EtfFlow) => void;
      },
    ) => {
      etfName.value = context?.etfName ?? "";
      onDone.value = context?.onDone;
      flow.value = entry;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        flow.value = {} as EtfFlow;
      }
    });

    return {
      open,
      flow,
      etfName,
      onDone,
      openDeleteEtfFlow,
    };
  },
);

export default useDeleteEtfFlowModalStore;

