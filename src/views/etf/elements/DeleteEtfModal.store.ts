import type { Etf } from "@/model/etf/Etf";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteEtfModalStore =
  createDeleteModalStore<Etf>("deleteEtfModal");

export default useDeleteEtfModalStore;
