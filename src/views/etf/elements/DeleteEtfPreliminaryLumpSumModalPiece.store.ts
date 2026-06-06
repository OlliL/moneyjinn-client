import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteEtfPreliminaryLumpSumModalPieceStore =
  createDeleteModalStore<EtfPreliminaryLumpSum>(
    "deleteEtfPreliminaryLumpSumPieceModal",
  );

export default useDeleteEtfPreliminaryLumpSumModalPieceStore;
