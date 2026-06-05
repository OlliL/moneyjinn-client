import type { EtfFlow } from "@/model/etf/EtfFlow";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCreateEtfFlowModalStore = defineStore(
  "createEtfFlowModal",
  () => {
    const open = ref(false);
    const flow = ref<EtfFlow | undefined>(undefined);
    const defaultEtfId = ref<number | undefined>(undefined);
    const onDone = ref<((etfFlow: EtfFlow) => void) | undefined>(undefined);

    const openCreateEtfFlow = (context?: {
      defaultEtfId: number | undefined;
      onDone?: (etfFlow: EtfFlow) => void;
    }) => {
      defaultEtfId.value = context?.defaultEtfId;
      onDone.value = context?.onDone;
      flow.value = undefined;
      open.value = true;
    };

    const openEditEtfFlow = (
      entry: EtfFlow,
      context?: {
        defaultEtfId: number | undefined;
        onDone?: (etfFlow: EtfFlow) => void;
      },
    ) => {
      defaultEtfId.value = context?.defaultEtfId;
      onDone.value = context?.onDone;
      flow.value = entry;
      open.value = true;
    };

    watch(open, (isOpen) => {
      if (!isOpen) {
        flow.value = undefined;
      }
    });

    return {
      open,
      flow,
      defaultEtfId,
      onDone,
      openCreateEtfFlow,
      openEditEtfFlow,
    };
  },
);

export default useCreateEtfFlowModalStore;
