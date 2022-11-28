import type { ValidationResult } from "../validation/ValidationResult";
import type { Moneyflow } from "./Moneyflow";

export type MoneyflowValidation = {
  validationResult: ValidationResult;
  mmf?: Moneyflow;
};
