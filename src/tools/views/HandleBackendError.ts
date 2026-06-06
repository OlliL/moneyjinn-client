import { BackendErrorType, type BackendError } from "@/model/BackendError";
import { getErrorMessage } from "@/model/ErrorCode";
import { toast } from "vue-sonner";

export function handleBackendError(backendError: BackendError) {
  const validationResult = backendError.getValidationResult();

  if (backendError.getErrorType() !== BackendErrorType.VALIDATION_ERROR) {
    toast.error(backendError.getErrorMessage(), { duration: Infinity });
  } else if (validationResult) {
    for (const resultItem of validationResult.validationResultItems) {
      toast.error(getErrorMessage(resultItem.error), { duration: Infinity });
    }
  }
}
