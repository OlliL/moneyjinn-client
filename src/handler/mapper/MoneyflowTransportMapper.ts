import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSplitEntryTransport } from "@/model/rest/transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "@/model/rest/transport/MoneyflowTransport";
import { mapMoneyflowSplitEntryTransportToModel } from "./MoneyflowSplitEntryTransportMapper";

export function mapMoneyflowTransportToModel(
  transport: MoneyflowTransport,
  hasReceipt: boolean,
  splitEntries?: Array<MoneyflowSplitEntryTransport>
): Moneyflow {
  const model: Moneyflow = {
    id: transport.id,
    userId: transport.userid,
    bookingDate: new Date(transport.bookingdate),
    invoiceDate: new Date(transport.invoicedate),
    amount: transport.amount,
    capitalsourceId: transport.capitalsourceid,
    capitalsourceComment: transport.capitalsourcecomment,
    contractpartnerId: transport.contractpartnerid,
    contractpartnerName: transport.contractpartnername,
    comment: transport.comment,
    private: transport.private == 1 ? true : false,
    postingAccountId: transport.postingaccountid,
    postingAccountName: transport.postingaccountname,
    hasReceipt: hasReceipt,
    moneyflowSplitEntries: splitEntries?.map((mse) => {
      return mapMoneyflowSplitEntryTransportToModel(mse);
    }),
  };
  return model;
}

export function mapMoneyflowToTransport(model: Moneyflow): MoneyflowTransport {
  const [bookingDate] = model.bookingDate.toISOString().split("T");
  const invoiceDate = model.invoiceDate
    ? model.invoiceDate.toISOString().split("T")[0]
    : bookingDate;
  const transport: MoneyflowTransport = {
    id: model.id,
    userid: model.userId,
    bookingdate: bookingDate,
    invoicedate: invoiceDate,
    amount: model.amount,
    capitalsourceid: model.capitalsourceId,
    contractpartnerid: model.contractpartnerId,
    comment: model.comment,
    private: model.private ? 1 : 0,
    postingaccountid: model.postingAccountId,
  };
  return transport;
}
