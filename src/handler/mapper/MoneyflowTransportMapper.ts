import type { MoneyflowSplitEntryTransport, MoneyflowTransport } from "@/api";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { getISOStringDate } from "@/tools/views/FormatDate";
import { mapMoneyflowSplitEntryTransportToModel } from "./MoneyflowSplitEntryTransportMapper";

export function mapMoneyflowTransportToModel(
  transport: MoneyflowTransport,
  hasReceipt: boolean,
  splitEntries?: Array<MoneyflowSplitEntryTransport>,
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
    private: transport.privat == 1,
    postingAccountId: transport.postingaccountid,
    postingAccountName: transport.postingaccountname,
    hasReceipt: hasReceipt,
    moneyflowSplitEntries: splitEntries?.map((mse) => {
      return mapMoneyflowSplitEntryTransportToModel(mse);
    }),
  };
  model.bookingDate.setHours(0, 0, 0, 0);
  model.bookingDate.setHours(0, 0, 0, 0);
  return model;
}

export function mapMoneyflowToTransport(model: Moneyflow): MoneyflowTransport {
  const bookingDate = getISOStringDate(model.bookingDate);
  const invoiceDate = model.invoiceDate
    ? getISOStringDate(model.invoiceDate)
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
    privat: model.private ? 1 : 0,
    postingaccountid: model.postingAccountId,
  };
  return transport;
}
