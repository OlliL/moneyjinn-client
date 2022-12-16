import type { ErrorResponse } from "../ErrorResponse";
import type { EtfTransport } from "../transport/EtfTransport";

export type ShowCreateEtfFlowResponse = ErrorResponse & {
  showCreateEtfFlowResponse: {
    etfTransport: Array<EtfTransport>;
  };
};
