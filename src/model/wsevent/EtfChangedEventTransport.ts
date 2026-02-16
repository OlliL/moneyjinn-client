import type { EtfTransport } from "@/api";

export type EtfChangedEventTransport = {
  eventType: string;
  etfTransport: EtfTransport;
};
