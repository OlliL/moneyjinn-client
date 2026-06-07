import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { createCreateModalStore } from "@/stores/CreateModalStoreFactory";

export const useCreatePreDefMoneyflowModalStore =
  createCreateModalStore<PreDefMoneyflow>("createPreDefMoneyflowModal", {
    titleCreate: "PreDefMoneyflow.title.create",
    titleUpdate: "PreDefMoneyflow.title.update",
    createFn: (e) => PreDefMoneyflowService.createPreDefMoneyflow(e),
    updateFn: (e) => PreDefMoneyflowService.updatePreDefMoneyflow(e),
    getEmptyEntity: () =>
      ({
        isFavorite: false,
        onceAMonth: false,
        favoriteAbbreviation: "",
        favoriteColor: undefined,
      }) as PreDefMoneyflow,
  });

export default useCreatePreDefMoneyflowModalStore;
