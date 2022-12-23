import type { ReportingMonthAmount } from "@/model/report/ReportingMonthAmount";
import type { PostingAccountAmountTransport } from "@/model/rest/report/transport/PostingAccountAmountTransport";

export function mapPostingAccountAmountTransportToModel(
  transport: PostingAccountAmountTransport
): ReportingMonthAmount {
  const date = new Date(transport.date);
  const model: ReportingMonthAmount = {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    amount: transport.amount,
    postingAccountId: transport.postingaccountid,
    postingAccountName: transport.postingaccountname,
  };
  return model;
}
