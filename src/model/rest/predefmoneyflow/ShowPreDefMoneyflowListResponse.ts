import type { ErrorResponse } from "../ErrorResponse";
import type { PreDefMoneyflowTransport } from "../transport/PreDefMoneyflowTransport";

export type ShowPreDefMoneyflowListResponse = ErrorResponse & {
  showPreDefMoneyflowListResponse: {
    initials: Array<string>;
    preDefMoneyflowTransport: Array<PreDefMoneyflowTransport>;
  };
};
