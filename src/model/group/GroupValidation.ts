import type { ValidationResult } from "../validation/ValidationResult";
import type { Group } from "./Group";

export type GroupValidation = {
  validationResult: ValidationResult;
  group: Group;
};
