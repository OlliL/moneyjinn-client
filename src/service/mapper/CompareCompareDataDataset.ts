import type { CompareDataDatasetTransport } from "@/api";
import type { CompareDataDataset } from "@/model/comparedata/CompareDataDataset";

export function mapCCompareDataDatasetTransportToModel(
  transport: CompareDataDatasetTransport,
): CompareDataDataset {
  const model: CompareDataDataset = {
    amount: transport.amount,
    comment: transport.comment,
    partner: transport.partner,
    bookingDate: new Date(transport.bookingDate),
    invoiceDate: transport.invoiceDate
      ? new Date(transport.invoiceDate)
      : undefined,
  };
  model.bookingDate.setHours(0, 0, 0, 0);
  model.invoiceDate?.setHours(0, 0, 0, 0);

  return model;
}
