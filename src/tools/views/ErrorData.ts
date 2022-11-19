export type ErrorData = {
  fieldLabel: string;
  fieldColor: string;
  inputClass: string;
};

export function generateErrorData(
  isValid: boolean | null,
  validLabel: string,
  errorLabel: string
): ErrorData {
  const errorData = {} as ErrorData;
  if (isValid == null || isValid) {
    errorData.fieldColor = "black";
    errorData.fieldLabel = validLabel;
    errorData.inputClass = isValid == null ? "" : "is-valid";
  } else {
    errorData.fieldColor = "#dc3545";
    errorData.fieldLabel = errorLabel;
    errorData.inputClass = "is-invalid";
  }
  return errorData;
}
