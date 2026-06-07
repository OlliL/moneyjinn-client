import type { Etf } from "@/model/etf/Etf";
import CrudEtfService from "@/service/CrudEtfService";
import { createCreateModalStore } from "@/stores/CreateModalStoreFactory";

export const useCreateEtfModalStore = createCreateModalStore<Etf>(
  "createEtfModal",
  {
    titleCreate: "ETF.title.create",
    titleUpdate: "ETF.title.update",
    createFn: (e) => CrudEtfService.createEtf(e),
    updateFn: (e) => CrudEtfService.updateEtf(e),
    getEmptyEntity: () => ({ isFavorite: false }) as Etf,
  },
);
