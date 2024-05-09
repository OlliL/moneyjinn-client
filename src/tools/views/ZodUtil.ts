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
      string(zodMessage).regex(/^-?\d\d*([,.]\d{1,2})?$/),
      number(zodMessage).multipleOf(0.01),
    ],
    zodMessage,
  );
}
