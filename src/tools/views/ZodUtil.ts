import { number, ZodType } from "zod";

export function globErr(message: string) {
  return {
    errorMap: () => {
      return { message: message };
    },
  };
}

const regExpCache = new Map<number, RegExp>();

export function amountSchema(
  message: string,
  decimalPlaces: number = 2,
): ZodType {
  const zodMessage = globErr(message);

  let pattern = regExpCache.get(decimalPlaces);
  if (pattern === undefined) {
    pattern = new RegExp("^\\d*\\.\\d{0," + decimalPlaces + "}$");
    regExpCache.set(decimalPlaces, pattern);
  }

  return number(zodMessage).refine((num) => pattern.test("" + num));

  // broken: https://github.com/colinhacks/zod/issues/3486
  //multipleOf(Math.pow(10, decimalPlaces * -1));
}
