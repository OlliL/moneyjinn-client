import { BackendError } from "@/model/BackendError";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import CrudEtfFlowService from "@/service/CrudEtfFlowService";
import { vi } from "vitest";

export default class CrudEtfFlowServiceMocker {
  static mockCreateEtfFlowResolved(etfFlow: EtfFlow): void {
    CrudEtfFlowService.createEtfFlow = vi.fn().mockResolvedValue(etfFlow);
  }

  static mockUpdateEtfFlowResolved(): void {
    CrudEtfFlowService.updateEtfFlow = vi.fn().mockResolvedValue(undefined);
  }

  static mockCreateEtfFlowRejected(error: BackendError): void {
    CrudEtfFlowService.createEtfFlow = vi.fn().mockRejectedValue(error);
  }
}
