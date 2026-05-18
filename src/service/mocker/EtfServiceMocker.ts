import type { EtfDepot } from "@/model/etf/EtfDepot";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import EtfService from "@/service/EtfService";
import { vi } from "vitest";

export default class EtfServiceMocker {
  static mockListEtfFlowsById(depot: EtfDepot): void {
    EtfService.listEtfFlowsById = vi.fn().mockResolvedValue(depot);
  }

  static mockListEtfOverview(summary: EtfSummary[]): void {
    EtfService.listEtfOverview = vi.fn().mockResolvedValue(summary);
  }
}

