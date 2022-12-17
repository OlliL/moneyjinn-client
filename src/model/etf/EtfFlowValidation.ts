import type { ValidationResult } from "../validation/ValidationResult";
import type { EtfFlow } from "./EtfFlow";

export type EtfFlowValidation = {
  validationResult: ValidationResult;
  etfFlow: EtfFlow;
};
