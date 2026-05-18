import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerService from "@/service/ContractpartnerService";
import { vi } from "vitest";

export default class ContractpartnerServiceMocker {
  static mockFetchAllContractpartner(contractpartners: Contractpartner[]): void {
    ContractpartnerService.fetchAllContractpartner = vi
      .fn()
      .mockResolvedValue(contractpartners);
  }
}

