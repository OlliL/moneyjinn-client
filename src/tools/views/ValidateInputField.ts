export function validateInputField(field: any, errorMessage: string) {
  let valid = true;
  let message = "";
  if (!field) {
    valid = false;
    message = errorMessage;
  }
  return [valid, message] as const;
}
