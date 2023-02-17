import type { MoneyflowSplitEntryTransport } from "@/api";
import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";

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
