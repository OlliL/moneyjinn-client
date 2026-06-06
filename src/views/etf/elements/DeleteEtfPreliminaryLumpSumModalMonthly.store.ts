import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteEtfPreliminaryLumpSumModalMonthlyStore =
  createDeleteModalStore<EtfPreliminaryLumpSum>(
    "deleteEtfPreliminaryLumpSumMonthlyModal",
  );

export default useDeleteEtfPreliminaryLumpSumModalMonthlyStore;
