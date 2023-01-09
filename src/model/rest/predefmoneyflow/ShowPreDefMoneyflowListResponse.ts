import type { AbstractResponse } from "../AbstractResponse";
import type { PreDefMoneyflowTransport } from "../transport/PreDefMoneyflowTransport";

export type ShowPreDefMoneyflowListResponse = AbstractResponse & {
  preDefMoneyflowTransports: Array<PreDefMoneyflowTransport>;
};
