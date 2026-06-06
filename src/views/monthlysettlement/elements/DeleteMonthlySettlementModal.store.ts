import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteMonthlySettlementModalStore = createDeleteModalStore<
  MonthlySettlement[]
>("deleteMonthlySettlementModal");
