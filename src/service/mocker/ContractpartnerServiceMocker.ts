import type { BackendError } from "@/model/BackendError";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerService from "@/service/ContractpartnerService";
import { vi } from "vitest";

export default class ContractpartnerServiceMocker {
  static mockFetchAllContractpartner(
    contractpartners: Contractpartner[],
  ): void {
    ContractpartnerService.fetchAllContractpartner = vi
      .fn()
      .mockResolvedValue(contractpartners);
  }

  static mockCreateContractpartnerResolved(): void {
    ContractpartnerService.createContractpartner = vi
      .fn()
      .mockResolvedValue(undefined);
  }

  static mockCreateContractpartnerRejected(error: BackendError): void {
    ContractpartnerService.createContractpartner = vi
      .fn()
      .mockRejectedValue(error);
  }

  static mockUpdateContractpartnerResolved(): void {
    ContractpartnerService.updateContractpartner = vi
      .fn()
      .mockResolvedValue(undefined);
  }
}
