import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteContractpartnerModalStore =
  createDeleteModalStore<Contractpartner>("deleteContractpartnerModal");
