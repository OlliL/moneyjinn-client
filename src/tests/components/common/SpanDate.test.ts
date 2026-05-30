import SpanDate from "@/components/common/SpanDate.vue";
import { ValueView } from "@/tests/TestViews";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { test } from "vitest";

const date = new Date(Date.parse("2020-03-04"));

class SpanDateView {
  static readonly Date = new ValueView("dateSpan");
}

test("test date locale formatting", async () => {
  render(SpanDate, { props: { date: date } });
  await SpanDateView.Date.assertTextEquals("03/04/2020");
});

test("test date empty no error", async () => {
  render(SpanDate);
  await SpanDateView.Date.assertEmpty();
});
