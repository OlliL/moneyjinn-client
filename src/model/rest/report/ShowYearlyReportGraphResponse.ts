import type { PostingAccountAmountTransport } from "./transport/PostingAccountAmountTransport";

export type ShowYearlyReportGraphResponse = {
  showYearlyReportGraphResponse: {
    postingAccountAmountTransport: Array<PostingAccountAmountTransport>;
  };
};
