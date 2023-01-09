import type { AbstractResponse } from "../AbstractResponse";
import type { PostingAccountAmountTransport } from "./transport/PostingAccountAmountTransport";

export type ShowMonthlyReportGraphResponse = AbstractResponse & {
  postingAccountAmountTransports: Array<PostingAccountAmountTransport>;
};
