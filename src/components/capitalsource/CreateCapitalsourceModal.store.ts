import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import CapitalsourceService from "@/service/CapitalsourceService";
import { createCreateModalStore } from "@/stores/CreateModalStoreFactory";

export const useCreateCapitalsourceModalStore =
  createCreateModalStore<Capitalsource>("createCapitalsourceModal", {
    titleCreate: "Capitalsource.title.create",
    titleUpdate: "Capitalsource.title.update",
    createFn: (e) => CapitalsourceService.createCapitalsource(e),
    updateFn: (e) => CapitalsourceService.updateCapitalsource(e),
    getEmptyEntity: () =>
      ({
        validFrom: new Date(),
        validTil: new Date("2999-12-31"),
      }) as Capitalsource,
  });
