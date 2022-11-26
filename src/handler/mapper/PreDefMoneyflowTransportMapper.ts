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
    createDate: new Date(transport.createdate),
    onceAMonth: transport.onceAMonth == 1 ? true : false,
    lastUsed: new Date(transport.lastUsed),
    postingAccountId: transport.postingaccountid,
    postingAccountName: transport.postingaccountname,
  };
  return model;
}
