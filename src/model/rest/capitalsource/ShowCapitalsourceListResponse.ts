import type { CapitalsourceTransport } from "@/model/rest/transport/CapitalsourceTransport";
import type { ErrorResponse } from "../ErrorResponse";

export type ShowCapitalsourceListResponse = ErrorResponse & {
  capitalsourceTransports: Array<CapitalsourceTransport>;
};
