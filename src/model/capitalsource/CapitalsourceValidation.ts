import type { ValidationResult } from "../validation/ValidationResult";
import type { Capitalsource } from "./Capitalsource";

export type CapitalsourceValidation = {
  validationResult: ValidationResult;
  mcs: Capitalsource;
};
