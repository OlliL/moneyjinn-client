import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerService from "@/service/ContractpartnerService";
import { createCreateModalStore } from "@/stores/CreateModalStoreFactory";

export const useCreateContractpartnerModalStore =
  createCreateModalStore<Contractpartner>("createContractpartnerModal", {
    titleCreate: "Contractpartner.title.create",
    titleUpdate: "Contractpartner.title.update",
    createFn: (e) => ContractpartnerService.createContractpartner(e),
    updateFn: (e) => ContractpartnerService.updateContractpartner(e),
    getEmptyEntity: () => {
      const beginningOfPreviousMonth = new Date();
      beginningOfPreviousMonth.setDate(1);
      beginningOfPreviousMonth.setHours(0, 0, 0, 0);
      beginningOfPreviousMonth.setMonth(
        beginningOfPreviousMonth.getMonth() - 1,
      );
      return {
        validFrom: beginningOfPreviousMonth,
        validTil: new Date("2999-12-31"),
      } as Contractpartner;
    },
  });
