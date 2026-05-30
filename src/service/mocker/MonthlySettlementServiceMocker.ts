import { BackendError } from "@/model/BackendError";
import type { AvailableMonth } from "@/model/monthlysettlement/AvailableMonth";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import type { MonthlySettlementEditTransporter } from "@/model/monthlysettlement/MonthlySettlementEditTransporter";
import MonthlySettlementService from "@/service/MonthlySettlementService";
import { vi } from "vitest";

export default class MonthlySettlementServiceMocker {
  static mockGetAvailableMonth(availableMonth: AvailableMonth): void {
    MonthlySettlementService.getAvailableMonth = vi
      .fn()
      .mockResolvedValue(availableMonth);
  }

  static mockGetMonthlySettlementList(
    monthlySettlements: MonthlySettlement[],
    prevYear = 0,
    prevMonth = 0,
    nextYear = 0,
    nextMonth = 0,
  ): void {
    MonthlySettlementService.getMonthlySettlementList = vi
      .fn()
      .mockResolvedValue({
        monthlySettlements,
        prevYear,
        prevMonth,
        nextYear,
        nextMonth,
      });
  }

  static mockGetMonthlySettlementForEdit(
    transporter: MonthlySettlementEditTransporter,
  ): void {
    MonthlySettlementService.getMonthlySettlementForEdit = vi
      .fn()
      .mockResolvedValue(transporter);
  }
  static mockGetMonthlySettlementForEditResolved(
    transporter: MonthlySettlementEditTransporter,
  ): void {
    MonthlySettlementService.getMonthlySettlementForEdit = vi
      .fn()
      .mockResolvedValue(transporter);
  }

  static mockUpsertMonthlySettlementResolved(): void {
    MonthlySettlementService.upsertMonthlySettlement = vi
      .fn()
      .mockResolvedValue(undefined);
  }

  static mockUpsertMonthlySettlementRejected(error: BackendError): void {
    MonthlySettlementService.upsertMonthlySettlement = vi
      .fn()
      .mockRejectedValue(error);
  }
}
