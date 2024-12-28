import { amountSchema } from "@/tools/views/ZodUtil";
import { expect, test } from "vitest";

test("amount with default decimapPlaces", async () => {
  const zodAmount = amountSchema("error");
  const result = zodAmount.safeParse(2.45);
  console.log(result);
  expect(result.success).true;
});
