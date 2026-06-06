import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteContractpartnerMatchingModalStore =
  createDeleteModalStore<ContractpartnerMatching>(
    "deleteContractpartnerMatchingModal",
  );

export default useDeleteContractpartnerMatchingModalStore;

export default useDeleteContractpartnerMatchingModalStore;
