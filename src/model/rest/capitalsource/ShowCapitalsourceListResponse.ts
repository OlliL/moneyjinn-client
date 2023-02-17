import type { CapitalsourceTransport } from "@/api";
import type { ErrorResponse } from "../ErrorResponse";

export type ShowCapitalsourceListResponse = ErrorResponse & {
  capitalsourceTransports: Array<CapitalsourceTransport>;
};
