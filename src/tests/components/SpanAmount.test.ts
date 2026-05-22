import SpanAmount from "@/components/common/SpanAmount.vue";
import { ValueView } from "@/tests/TestViews";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { test } from "vitest";

class SpanAmountView {
  static readonly Amount = new ValueView("amountSpan");
}

test("fill up number with 2 decimal places", async () => {
  render(SpanAmount, { props: { amount: 2 } });
  await SpanAmountView.Amount.assertTextEquals("2,00 €");
});

test("fill up number with 3 decimal places and thousand seperator", async () => {
  render(SpanAmount, { props: { amount: 123456789, decimalPlaces: 3 } });
  await SpanAmountView.Amount.assertTextEquals("123.456.789,000 €");
  await SpanAmountView.Amount.assertNotHasClass("text-destructive");
});

test("decimal Places 0 works", async () => {
  render(SpanAmount, { props: { amount: 2, decimalPlaces: 0 } });
  await SpanAmountView.Amount.assertTextEquals("2 €");
});

test("reduce too much decimal places by rounding up", async () => {
  render(SpanAmount, { props: { amount: -2.999999 } });
  await SpanAmountView.Amount.assertTextEquals("-3,00 €");
});

test("reduce too much decimal places by rounding down", async () => {
  render(SpanAmount, { props: { amount: -2.11111 } });
  await SpanAmountView.Amount.assertTextEquals("-2,11 €");
});

test("format negative number red", async () => {
  render(SpanAmount, { props: { amount: -2 } });
  await SpanAmountView.Amount.assertHasClass("text-destructive");
});

test("format positive number not red", async () => {
  render(SpanAmount, { props: { amount: 2 } });
  await SpanAmountView.Amount.assertNotHasClass("text-destructive");
});
