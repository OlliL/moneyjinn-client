import type { ErrorResponse } from "../ErrorResponse";
import type { EtfFlowTransport } from "../transport/EtfFlowTransport";
import type { EtfTransport } from "../transport/EtfTransport";

export type ShowDeleteEtfFlowResponse = ErrorResponse & {
  showDeleteEtfFlowResponse: {
    etfTransport: Array<EtfTransport>;
    etfFlowTransport: EtfFlowTransport;
  };
};
