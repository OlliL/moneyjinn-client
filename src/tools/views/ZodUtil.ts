import { number, ZodType } from "zod";

export function globErr(message: string) {
  return {
    errorMap: () => {
      return { message: message };
    },
  };
}

export function amountSchema(
  message: string,
  decimalPlaces: number = 2,
): ZodType {
  const zodMessage = globErr(message);
  return number(zodMessage).multipleOf(Math.pow(10, decimalPlaces * -1));
}
