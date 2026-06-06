import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteContractpartnerAccountModalStore =
  createDeleteModalStore<ContractpartnerAccount>(
    "deleteContractpartnerAccountModal",
  );

export default useDeleteContractpartnerAccountModalStore;

export default useDeleteContractpartnerAccountModalStore;
