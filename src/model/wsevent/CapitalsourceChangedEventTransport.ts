import type { CapitalsourceTransport } from "@/api";

export type CapitalsourceChangedEventTransport = {
  eventType: string;
  capitalsourceTransport: CapitalsourceTransport;
};
