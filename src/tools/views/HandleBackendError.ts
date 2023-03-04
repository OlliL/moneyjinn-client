import { BackendErrorType, type BackendError } from "@/model/BackendError";
import { getErrorMessage } from "@/model/ErrorCode";
import type { Ref } from "vue";

export function handleBackendError(
  backendError: BackendError,
  serverErrors: Ref<Array<string>>
) {
  const validationResult = backendError.getValidationResult();
  serverErrors.value = new Array<string>();

  if (backendError.getErrorType() != BackendErrorType.VALIDATION_ERROR)
    serverErrors.value.push(backendError.getErrorMessage());
  else if (validationResult)
    for (const resultItem of validationResult.validationResultItems) {
      serverErrors.value.push(getErrorMessage(resultItem.error));
    }
}
