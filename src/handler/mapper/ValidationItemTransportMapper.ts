import type { ValidationItemTransport } from "@/api";
import type { ValidationResultItem } from "@/model/validation/ValidationResultItem";

export function mapValidationItemTransportToModel(
  transport: ValidationItemTransport,
): ValidationResultItem {
  const vri = {
    key: transport.key,
    error: transport.error,
    variableArray: transport.variableArray,
  } as ValidationResultItem;
  return vri;
}
