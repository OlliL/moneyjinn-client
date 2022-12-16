import type { EtfFlowTransport } from "../transport/EtfFlowTransport";

export type UpdateEtfFlowRequest = {
  updateEtfFlowRequest: {
    etfFlowTransport: EtfFlowTransport;
  };
};
