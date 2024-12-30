import { amountSchema } from "@/tools/views/ZodUtil";
import { expect, test } from "vitest";

const decimalPlacesDefaultSchema = amountSchema("error");
const decimalPlaces8Schema = amountSchema("error", 8);

test.each([
  [decimalPlacesDefaultSchema, 2, true],
  [decimalPlacesDefaultSchema, 2.1, true],
  [decimalPlacesDefaultSchema, 2.12, true],
  [decimalPlacesDefaultSchema, 2.123, false],
  [decimalPlaces8Schema, 2, true],
  [decimalPlaces8Schema, 2.1, true],
  [decimalPlaces8Schema, 2.12345678, true],
  [decimalPlaces8Schema, 2.123456789, false],
  [decimalPlacesDefaultSchema, -2, true],
  [decimalPlacesDefaultSchema, -2.1, true],
  [decimalPlacesDefaultSchema, -2.12, true],
  [decimalPlacesDefaultSchema, -2.123, false],
  [decimalPlaces8Schema, -2, true],
  [decimalPlaces8Schema, -2.1, true],
  [decimalPlaces8Schema, -2.12345678, true],
  [decimalPlaces8Schema, -2.123456789, false],
])("amountSchema, decimalPlaces", async (schema, num, expectedResult) => {
  const result = schema.safeParse(num);
  expect(result.success).toBe(expectedResult);
});
