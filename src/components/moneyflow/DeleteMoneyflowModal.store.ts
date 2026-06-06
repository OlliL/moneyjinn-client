import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteMoneyflowModalStore = createDeleteModalStore<Moneyflow>(
  "deleteMoneyflowModal",
);
