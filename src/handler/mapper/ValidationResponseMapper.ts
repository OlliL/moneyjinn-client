import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { ValidationResultItem } from "@/model/validation/ValidationResultItem";

export function mapValidationResponseToModel(
  response: ValidationResponse
): ValidationResult {
  const model = {} as ValidationResult;
  const inner = response.validationResponse;
  if (inner && inner.result !== undefined) {
    model.result = inner.result;
    if (inner.validationItemTransport) {
      model.validationResultItems = new Array<ValidationResultItem>();
      for (const vit of inner.validationItemTransport) {
        const vri = {
          key: vit.key,
          error: vit.error,
          variableArray: vit.variableArray,
        } as ValidationResultItem;
        model.validationResultItems.push(vri);
      }
    }
  } else {
    model.result = true;
  }
  return model;
}
