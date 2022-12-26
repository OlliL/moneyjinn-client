import type { ValidationResult } from "../validation/ValidationResult";
import type { User } from "./User";

export type UserValidation = {
  validationResult: ValidationResult;
  user: User;
};
