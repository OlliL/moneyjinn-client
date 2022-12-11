import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PreDefMoneyflowTransport } from "@/model/rest/transport/PreDefMoneyflowTransport";

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
      ? model.createDate.toISOString()
      : new Date().toISOString(),
    lastUsed: model.lastUsed
      ? model.lastUsed.toISOString()
      : new Date().toISOString(),
  };
  return transport;
}
