import type { CapitalsourceTransport } from "../transport/CapitalsourceTransport";

export type CapitalsourceChangedEventTransport = {
  eventType: string;
  capitalsourceTransport: CapitalsourceTransport;
};
