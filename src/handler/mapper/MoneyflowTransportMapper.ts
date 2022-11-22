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
    userid: transport.userid,
    bookingdate: new Date(transport.bookingdate),
    invoicedate: new Date(transport.invoicedate),
    amount: transport.amount,
    capitalsourceid: transport.capitalsourceid,
    capitalsourcecomment: transport.capitalsourcecomment,
    contractpartnerid: transport.contractpartnerid,
    contractpartnername: transport.contractpartnername,
    comment: transport.comment,
    private: transport.private == 1 ? true : false,
    postingaccountid: transport.postingaccountid,
    postingaccountname: transport.postingaccountname,
    hasReceipt: hasReceipt,
    moneyflowSplitEntries: splitEntries?.map((mse) => {
      return mapMoneyflowSplitEntryTransportToModel(mse);
    }),
  };
  return model;
}
