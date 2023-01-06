import type { CapitalsourceTransport } from "../transport/CapitalsourceTransport";

export type CapitalsourceChangedEventTransport = {
  capitalsourceChangedEventTransport: {
    eventType: string;
    capitalsourceTransport: CapitalsourceTransport;
  };
};
