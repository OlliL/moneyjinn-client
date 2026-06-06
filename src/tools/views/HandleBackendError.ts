import { BackendErrorType, type BackendError } from "@/model/BackendError";
import { getErrorMessage } from "@/model/ErrorCode";
import { toast } from "vue-sonner";

let serverErrorIds: (string | number)[] = [];

export function dismissServerErrors() {
  serverErrorIds.forEach((id) => toast.dismiss(id));
  serverErrorIds = [];
}

export function showServerError(message: string) {
  const id = toast.error(message, {
    duration: Infinity,
  });
  serverErrorIds.push(id);
}

export function handleBackendError(backendError: BackendError) {
  const validationResult = backendError.getValidationResult();

  if (backendError.getErrorType() !== BackendErrorType.VALIDATION_ERROR) {
    showServerError(backendError.getErrorMessage());
  } else if (validationResult) {
    for (const resultItem of validationResult.validationResultItems) {
      showServerError(getErrorMessage(resultItem.error));
    }
  }
}
