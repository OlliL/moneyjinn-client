import type { ValidationResultItem } from "./ValidationResultItem";

export type ValidationResult = {
  result: boolean;
  validationResultItems: Array<ValidationResultItem>;
};
