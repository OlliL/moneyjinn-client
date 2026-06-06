import type { EtfFlow } from "@/model/etf/EtfFlow";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteEtfFlowModalStore =
  createDeleteModalStore<EtfFlow>("deleteEtfFlowModal");
