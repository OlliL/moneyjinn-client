import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";
import type { MoneyflowSplitEntryTransport } from "@/model/rest/transport/MoneyflowSplitEntryTransport";

export function mapMoneyflowSplitEntryTransportToModel(
  transport: MoneyflowSplitEntryTransport
): MoneyflowSplitEntry {
  const model: MoneyflowSplitEntry = {
    id: transport.id,
    moneyflowid: transport.moneyflowid,
    amount: transport.amount,
    comment: transport.comment,
    postingaccountid: transport.postingaccountid,
    postingaccountname: transport.postingaccountname,
  };
  return model;
}
