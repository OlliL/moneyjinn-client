import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeletePreDefMoneyflowModalStore =
  createDeleteModalStore<PreDefMoneyflow>("deletePreDefMoneyflowModal");
