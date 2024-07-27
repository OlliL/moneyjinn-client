import { render, screen } from "@testing-library/vue";
import { expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";
import SpanBoolean from "@/components/SpanBoolean.vue";

const green = "rgb(0, 128, 0)";
const red = "rgb(255, 0, 0)";

test("test true", async () => {
  render(SpanBoolean, { props: { value: true } });
  const booleanSpan = screen.getByTestId<HTMLElement>("booleanSpan");
  expect(booleanSpan.textContent).toEqual("yes");
  const styles = getComputedStyle(booleanSpan);
  expect(styles.color).toBe(green);
});

test("test false", async () => {
  render(SpanBoolean, { props: { value: false } });
  const booleanSpan = screen.getByTestId<HTMLElement>("booleanSpan");
  expect(booleanSpan.textContent).toEqual("no");
  const styles = getComputedStyle(booleanSpan);
  expect(styles.color).toBe(red);
});
