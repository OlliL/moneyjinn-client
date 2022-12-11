import type { ValidationResult } from "../validation/ValidationResult";
import type { Moneyflow } from "./Moneyflow";

export type MoneyflowsValidation = {
  validationResult: ValidationResult;
  moneyflows?: Array<Moneyflow>;
};
