import type { ErrorResponse } from "../ErrorResponse";
import type { PostingAccountAmountTransport } from "./transport/PostingAccountAmountTransport";

export type ShowMonthlyReportGraphResponse = ErrorResponse & {
  postingAccountAmountTransports: Array<PostingAccountAmountTransport>;
};
