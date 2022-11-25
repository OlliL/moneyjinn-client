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
