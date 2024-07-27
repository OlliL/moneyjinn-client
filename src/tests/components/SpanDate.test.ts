import { render, screen } from "@testing-library/vue";
import { expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";
import SpanDate from "@/components/SpanDate.vue";

const date = new Date(Date.parse("2020-03-04"));

test("test date locale formatting", async () => {
  render(SpanDate, { props: { date: date } });
  const dateSpan = screen.getByTestId<HTMLSpanElement>("dateSpan");
  expect(dateSpan.textContent).toEqual("03/04/2020");
});

test("test date empty no error", async () => {
  render(SpanDate);
  const dateSpan = screen.getByTestId<HTMLSpanElement>("dateSpan");
  expect(dateSpan).toBeEmptyDOMElement();
});
