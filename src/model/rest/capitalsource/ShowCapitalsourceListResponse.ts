import type { ErrorResponse } from "../ErrorResponse";
import type { CapitalsourceTransport } from "@/model/rest/transport/CapitalsourceTransport";

export type ShowCapitalsourceListResponse = ErrorResponse & {
  showCapitalsourceListResponse: {
    capitalsourceTransport: Array<CapitalsourceTransport>;
  };
};
