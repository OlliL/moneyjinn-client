import { getErrorMessage } from "./ErrorCode";
import type { ValidationResult } from "./validation/ValidationResult";

export enum BackendErrorType {
  CLIENT_ERROR,
  AUTH_ERROR,
  VALIDATION_ERROR,
  ERROR,
}

export class BackendError {
  private errorType: BackendErrorType;
  private errorCode: number | undefined;
  private errorMessage: string | undefined;
  private validationResult: ValidationResult | undefined;

  constructor(
    _errorType: BackendErrorType,
    _errorCode?: number,
    _errorMessage?: string,
    _validationResult?: ValidationResult,
  ) {
    this.errorType = _errorType;
    this.errorCode = _errorCode;
    this.errorMessage = _errorMessage;
    this.validationResult = _validationResult;
  }

  getErrorType(): BackendErrorType {
    return this.errorType;
  }

  getErrorCode(): number | undefined {
    return this.errorCode;
  }

  getErrorMessage(): string {
    return this.errorMessage
      ? this.errorMessage
      : this.errorCode
      ? getErrorMessage(this.errorCode)
      : "";
  }

  getValidationResult(): ValidationResult | undefined {
    return this.validationResult;
  }
}
