import { BackendError } from "@/model/BackendError";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import { vi } from "vitest";

export default class ContractpartnerMatchingServiceMocker {
  static mockFetchAllContractpartnerMatching(
    matchings: ContractpartnerMatching[],
  ): void {
    ContractpartnerMatchingService.fetchAllContractpartnerMatching = vi
      .fn()
      .mockResolvedValue(matchings);
  }

  static mockCreateContractpartnerMatchingResolved(
    item: ContractpartnerMatching,
  ): void {
    ContractpartnerMatchingService.createContractpartnerMatching = vi
      .fn()
      .mockResolvedValue(item);
  }

  static mockUpdateContractpartnerMatchingResolved(): void {
    ContractpartnerMatchingService.updateContractpartnerMatching = vi
      .fn()
      .mockResolvedValue(undefined);
  }

  static mockCreateContractpartnerMatchingRejected(error: BackendError): void {
    ContractpartnerMatchingService.createContractpartnerMatching = vi
      .fn()
      .mockRejectedValue(error);
  }
}
