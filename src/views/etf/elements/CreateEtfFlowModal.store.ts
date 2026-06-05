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

    const openCreateEtfFlow = (
      etfId: number | undefined,
      cb?: (etfFlow: EtfFlow) => void,
    ) => {
      defaultEtfId.value = etfId;
      onDone.value = cb;
      flow.value = undefined;
      open.value = true;
    };

    const openEditEtfFlow = (
      entry: EtfFlow,
      etfId: number | undefined,
      cb?: (etfFlow: EtfFlow) => void,
    ) => {
      defaultEtfId.value = etfId;
      onDone.value = cb;
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
