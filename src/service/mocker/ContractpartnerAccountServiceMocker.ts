import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import ContractpartnerAccountService from "@/service/ContractpartnerAccountService";
import { vi } from "vitest";

export default class ContractpartnerAccountServiceMocker {
  static mockFetchAllContractpartnerAccount(accounts: ContractpartnerAccount[]): void {
    ContractpartnerAccountService.fetchAllContractpartnerAccount = vi
      .fn()
      .mockResolvedValue(accounts);
  }
}

