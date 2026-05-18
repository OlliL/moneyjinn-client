import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import { vi } from "vitest";

export default class ContractpartnerMatchingServiceMocker {
  static mockFetchAllContractpartnerMatching(matchings: ContractpartnerMatching[]): void {
    ContractpartnerMatchingService.fetchAllContractpartnerMatching = vi
      .fn()
      .mockResolvedValue(matchings);
  }
}

