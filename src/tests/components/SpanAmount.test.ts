import SpanAmount from "@/components/SpanAmount.vue";
import { render, screen } from "@testing-library/vue";
import { expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";

test("fill up number with 2 decimal places", async () => {
  render(SpanAmount, { props: { amount: 2 } });
  const amountSpan = screen.getByTestId<HTMLSpanElement>("amountSpan");
  expect(amountSpan.textContent).toEqual("2,00 €");
});

test("fill up number with 3 decimal places and thousand seperator", async () => {
  render(SpanAmount, { props: { amount: 123456789, decimalPlaces: 3 } });
  const amountSpan = screen.getByTestId<HTMLSpanElement>("amountSpan");
  expect(amountSpan.textContent).toEqual("123.456.789,000 €");
  expect(amountSpan).not.toHaveClass("text-danger");
});

test("decimal Places 0 works", async () => {
  render(SpanAmount, { props: { amount: 2, decimalPlaces: 0 } });
  const amountSpan = screen.getByTestId<HTMLSpanElement>("amountSpan");
  expect(amountSpan.textContent).toEqual("2 €");
});

test("reduce too much decimal places by rounding up", async () => {
  render(SpanAmount, { props: { amount: -2.999999 } });
  const amountSpan = screen.getByTestId<HTMLSpanElement>("amountSpan");
  expect(amountSpan.textContent).toEqual("-3,00 €");
});

test("reduce too much decimal places by rounding down", async () => {
  render(SpanAmount, { props: { amount: -2.11111 } });
  const amountSpan = screen.getByTestId<HTMLSpanElement>("amountSpan");
  expect(amountSpan.textContent).toEqual("-2,11 €");
});

test("format negative number red", async () => {
  render(SpanAmount, { props: { amount: -2 } });
  const amountSpan = screen.getByTestId<HTMLSpanElement>("amountSpan");
  expect(amountSpan).toHaveClass("text-danger");
});

test("format positive number not red", async () => {
  render(SpanAmount, { props: { amount: 2 } });
  const amountSpan = screen.getByTestId<HTMLSpanElement>("amountSpan");
  expect(amountSpan).not.toHaveClass("text-danger");
});
