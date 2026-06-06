import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteEtfPreliminaryLumpSumModalYearlyStore =
  createDeleteModalStore<EtfPreliminaryLumpSum>(
    "deleteEtfPreliminaryLumpSumYearlyModal",
  );

export default useDeleteEtfPreliminaryLumpSumModalYearlyStore;
