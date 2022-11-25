import type { ErrorResponse } from "../ErrorResponse";
import type { CapitalsourceTransport } from "@/model/rest/transport/CapitalsourceTransport";

export type ShowCapitalsourceListResponse = {
  error?: ErrorResponse;
  showCapitalsourceListResponse: {
    initials: Array<string>;
    capitalsourceTransport: Array<CapitalsourceTransport>;
    currentlyValid: number;
  };
};
