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

export function mapMoneyflowSplitEntryToTransport(
  model: MoneyflowSplitEntry
): MoneyflowSplitEntryTransport {
  const transport: MoneyflowSplitEntryTransport = {
    id: model.id,
    moneyflowid: model.moneyflowId,
    amount: model.amount,
    comment: model.comment,
    postingaccountid: model.postingAccountId,
  };
  return transport;
}
