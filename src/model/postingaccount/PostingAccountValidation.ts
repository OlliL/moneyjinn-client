import type { ValidationResult } from "../validation/ValidationResult";
import type { PostingAccount } from "./PostingAccount";

export type PostingAccountValidation = {
  validationResult: ValidationResult;
  mpa: PostingAccount;
};
