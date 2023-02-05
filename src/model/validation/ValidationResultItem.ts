import type { ErrorCode } from "../ErrorCode";

export type ValidationResultItem = {
  key?: string;
  error: ErrorCode;
  variableArray?: Array<string>;
};
