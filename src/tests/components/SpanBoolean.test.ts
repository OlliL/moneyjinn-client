import { render, screen } from "@testing-library/vue";
import { expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";
import SpanBoolean from "@/components/SpanBoolean.vue";

test("test true", async () => {
  render(SpanBoolean, { props: { value: true } });
  const booleanSpan = screen.getByTestId<HTMLElement>("booleanSpan");
  expect(booleanSpan.textContent).toEqual("yes");
  expect(booleanSpan).toHaveClass("text-green-600");
});

test("test false", async () => {
  render(SpanBoolean, { props: { value: false } });
  const booleanSpan = screen.getByTestId<HTMLElement>("booleanSpan");
  expect(booleanSpan.textContent).toEqual("no");
  expect(booleanSpan).toHaveClass("text-red-600");
});
