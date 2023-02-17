import type { PreDefMoneyflowTransport } from "@/api";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { getISOStringDate } from "@/tools/views/FormatDate";

export function mapPreDefMoneyflowTransportToModel(
  transport: PreDefMoneyflowTransport
): PreDefMoneyflow {
  const model: PreDefMoneyflow = {
    id: transport.id,
    userId: transport.userid,
    amount: transport.amount,
    capitalsourceId: transport.capitalsourceid,
    capitalsourceComment: transport.capitalsourcecomment,
    contractpartnerId: transport.contractpartnerid,
    contractpartnerName: transport.contractpartnername,
    comment: transport.comment,
    createDate: transport.createdate
      ? new Date(transport.createdate)
      : undefined,
    onceAMonth: transport.onceAMonth == 1 ? true : false,
    lastUsed: transport.lastUsed ? new Date(transport.lastUsed) : undefined,
    postingAccountId: transport.postingaccountid,
    postingAccountName: transport.postingaccountname,
  };
  model.createDate?.setHours(0, 0, 0, 0);
  model.lastUsed?.setHours(0, 0, 0, 0);
  return model;
}

export function mapPreDefMoneyflowToTransport(
  model: PreDefMoneyflow
): PreDefMoneyflowTransport {
  const transport: PreDefMoneyflowTransport = {
    id: model.id,
    userid: model.userId,
    amount: model.amount,
    capitalsourceid: model.capitalsourceId,
    capitalsourcecomment: model.capitalsourceComment,
    contractpartnerid: model.contractpartnerId,
    contractpartnername: model.contractpartnerName,
    comment: model.comment,
    onceAMonth: model.onceAMonth ? 1 : 0,
    postingaccountid: model.postingAccountId,
    postingaccountname: model.postingAccountName,
    createdate: model.createDate
      ? getISOStringDate(model.createDate)
      : getISOStringDate(new Date()),
    lastUsed: model.lastUsed
      ? getISOStringDate(model.lastUsed)
      : getISOStringDate(new Date()),
  };
  return transport;
}
