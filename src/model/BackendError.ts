import { getErrorMessage } from "./ErrorCode";
import type { ValidationResult } from "./validation/ValidationResult";

export enum BackendErrorType {
  CLIENT_ERROR,
  AUTH_ERROR,
  VALIDATION_ERROR,
  ERROR,
}

export class BackendError {
  private readonly errorType: BackendErrorType;
  private readonly errorCode: number | undefined;
  private readonly errorMessage: string | undefined;
  private readonly validationResult: ValidationResult | undefined;

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
    if (this.errorMessage) return this.errorMessage;
    else if (this.errorCode) return getErrorMessage(this.errorCode);
    return "";
  }

  getValidationResult(): ValidationResult | undefined {
    return this.validationResult;
  }
}
