import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import { createCreateModalStore } from "@/stores/CreateModalStoreFactory";

export const useCreateContractpartnerMatchingModalStore =
  createCreateModalStore<ContractpartnerMatching>(
    "createContractpartnerMatchingModal",
    {
      titleCreate: "ContractpartnerMatching.title.create",
      titleUpdate: "ContractpartnerMatching.title.update",
      createFn: (e) =>
        ContractpartnerMatchingService.createContractpartnerMatching(e),
      updateFn: (e) =>
        ContractpartnerMatchingService.updateContractpartnerMatching(e),
      getEmptyEntity: () => ({}) as ContractpartnerMatching,
    },
  );
