import type { EtfFlowTransport } from "../transport/EtfFlowTransport";

export type CreateEtfFlowRequest = {
  createEtfFlowRequest: {
    etfFlowTransport: EtfFlowTransport;
  };
};
