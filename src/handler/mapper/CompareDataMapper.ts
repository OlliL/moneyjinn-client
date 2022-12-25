import type { CompareData } from "@/model/comparedata/CompareData";
import type { CompareDataDataset } from "@/model/comparedata/CompareDataDataset";
import type { CompareDataTransport } from "@/model/rest/comparedata/transport/CompareDataTransport";
import { mapMoneyflowTransportToModel } from "./MoneyflowTransportMapper";

export function mapCompareDataTransportToModel(
  transport: CompareDataTransport
): CompareData {
  const model = {} as CompareData;

  if (transport.moneyflowTransport) {
    const moneyflow = mapMoneyflowTransportToModel(
      transport.moneyflowTransport,
      false
    );
    model.moneyflow = moneyflow;
  }

  if (transport.compareDataDatasetTransport) {
    const compareDataDataset: CompareDataDataset = {
      amount: transport.compareDataDatasetTransport.amount,
      comment: transport.compareDataDatasetTransport.comment,
      partner: transport.compareDataDatasetTransport.partner,
      bookingDate: new Date(transport.compareDataDatasetTransport.bookingDate),
      invoiceDate: transport.compareDataDatasetTransport.invoiceDate
        ? new Date(transport.compareDataDatasetTransport.invoiceDate)
        : undefined,
    };
    model.compareDataDataset = compareDataDataset;
  }

  return model;
}
