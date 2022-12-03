import type { ValidationResult } from "../validation/ValidationResult";
import type { ContractpartnerAccount } from "./ContractpartnerAccount";

export type ContractpartnerAccountValidation = {
  validationResult: ValidationResult;
  mca: ContractpartnerAccount;
};
