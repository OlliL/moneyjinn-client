import type { PostingAccount } from "../postingaccount/PostingAccount";

export type ReportingParameter = {
  startDate: Date;
  endDate: Date;
  selectedPostingAccounts: Array<PostingAccount>;
  unselectedPostingAccounts: Array<PostingAccount>;
};
