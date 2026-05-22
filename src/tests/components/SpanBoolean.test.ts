import SpanBoolean from "@/components/common/SpanBoolean.vue";
import { ValueView } from "@/tests/TestViews";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { test } from "vitest";

class SpanBooleanView {
  static readonly Boolean = new ValueView("booleanSpan");
}

test("test true", async () => {
  render(SpanBoolean, { props: { value: true } });
  await SpanBooleanView.Boolean.assertTextEquals("yes");
  await SpanBooleanView.Boolean.assertHasClass("text-green-600");
});

test("test false", async () => {
  render(SpanBoolean, { props: { value: false } });
  await SpanBooleanView.Boolean.assertTextEquals("no");
  await SpanBooleanView.Boolean.assertHasClass("text-red-600");
});
