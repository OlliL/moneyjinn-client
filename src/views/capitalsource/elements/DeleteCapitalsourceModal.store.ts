import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteCapitalsourceModalStore =
  createDeleteModalStore<Capitalsource>("deleteCapitalsourceModal");
