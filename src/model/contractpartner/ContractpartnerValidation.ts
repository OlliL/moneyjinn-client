import type { ValidationResult } from "../validation/ValidationResult";
import type { Contractpartner } from "./Contractpartner";

export type ContractpartnerValidation = {
  validationResult: ValidationResult;
  mcp: Contractpartner;
};
