import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteContractpartnerModalStore =
  createDeleteModalStore<Contractpartner>("deleteContractpartnerModal");

export default useDeleteContractpartnerModalStore;

export default useDeleteContractpartnerModalStore;
