import type { ValidationResult } from "../validation/ValidationResult";
import type { PreDefMoneyflow } from "./PreDefMoneyflow";

export type PreDefMoneyflowValidation = {
  validationResult: ValidationResult;
  preDefMoneyflow: PreDefMoneyflow;
};
