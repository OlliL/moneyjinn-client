import type { ErrorCode } from "../ErrorCode";

export type ValidationResultItem = {
  key?: number;
  error: ErrorCode;
  variableArray?: Array<string>;
};
