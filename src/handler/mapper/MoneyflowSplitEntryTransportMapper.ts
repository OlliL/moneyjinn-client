import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";
import type { MoneyflowSplitEntryTransport } from "@/model/rest/transport/MoneyflowSplitEntryTransport";

export function mapMoneyflowSplitEntryTransportToModel(
  transport: MoneyflowSplitEntryTransport
): MoneyflowSplitEntry {
  const model: MoneyflowSplitEntry = {
    id: transport.id,
    moneyflowId: transport.moneyflowid,
    amount: transport.amount,
    comment: transport.comment,
    postingAccountId: transport.postingaccountid,
    postingAccountName: transport.postingaccountname,
  };
  return model;
}
