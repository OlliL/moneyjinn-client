import { number, string, union, ZodType } from "zod";

export function globErr(message: string) {
  return {
    errorMap: () => {
      return { message: message };
    },
  };
}

export function amountSchema(message: string): ZodType {
  const zodMessage = globErr(message);
  return union(
    [
      string(zodMessage).regex(
        new RegExp("^-{0,1}[0-9][0-9]*(.[0-9]{1,2}){0,1}$"),
      ),
      number(zodMessage),
    ],
    zodMessage,
  );
}
