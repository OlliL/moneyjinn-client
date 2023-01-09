import type { CapitalsourceTransport } from "@/model/rest/transport/CapitalsourceTransport";
import type { AbstractResponse } from "../AbstractResponse";

export type ShowCapitalsourceListResponse = AbstractResponse & {
  capitalsourceTransports: Array<CapitalsourceTransport>;
};
