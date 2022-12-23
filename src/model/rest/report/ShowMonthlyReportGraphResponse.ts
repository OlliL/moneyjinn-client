import type { PostingAccountAmountTransport } from "./transport/PostingAccountAmountTransport";

export type ShowMonthlyReportGraphResponse = {
  showMonthlyReportGraphResponse: {
    postingAccountAmountTransport: Array<PostingAccountAmountTransport>;
  };
};
