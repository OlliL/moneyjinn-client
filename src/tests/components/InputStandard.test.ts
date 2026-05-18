import InputStandard from "@/components/InputStandard.vue";
import { InputView, TextView } from "@/tests/TestViews";
import { globErr } from "@/tools/views/ZodUtil";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { expect, test } from "vitest";
import { computed, ref } from "vue";
import { string } from "zod";

class InputStandardView {
  static readonly Input = new InputView("inputStandard");
  static readonly ErrorText = new TextView("my error");
  static readonly RegularLabelText = new TextView("regular label");
}

test("error message and regular label get set correctly", async () => {
  const schema = string(globErr("my error")).min(5);
  render(InputStandard, {
    props: {
      id: "inputStandard",
      validationSchema: schema,
      fieldLabel: "regular label",
    },
  });
  await InputStandardView.Input.setValue("1234");
  await InputStandardView.ErrorText.assertInDocument();
  await InputStandardView.Input.setValue("12345");
  await InputStandardView.RegularLabelText.assertInDocument();
});

test("computed schema also works", async () => {
  const len = ref(5);
  const schema = computed(() => string(globErr("my error")).min(len.value));
  render(InputStandard, {
    props: {
      id: "inputStandard",
      validationSchemaRef: schema,
      fieldLabel: "regular label",
    },
  });
  await InputStandardView.Input.setValue("1234");
  await InputStandardView.ErrorText.assertInDocument();
  await InputStandardView.Input.setValue("12345");
  await InputStandardView.RegularLabelText.assertInDocument();
  len.value = 6;
  await InputStandardView.ErrorText.assertInDocument();
});

test("untouched field shows regular label", async () => {
  const schema = string(globErr("my error")).min(5);
  render(InputStandard, {
    props: {
      id: "inputStandard",
      validationSchema: schema,
      fieldLabel: "regular label",
    },
  });
  await InputStandardView.Input.assertToBeVisible();
  await InputStandardView.RegularLabelText.assertInDocument();
});

test("check that update:modelValue gets emitted", async () => {
  const { emitted } = render(InputStandard, {
    props: {
      id: "inputStandard",
      modelValue: "abcd",
    },
  });
  await InputStandardView.Input.assertValue("abcd");
  await InputStandardView.Input.setValue("1234");
  const updates = emitted()["update:modelValue"]!;
  expect((updates[updates.length - 1]! as Array<string>)[0]).toBe(
    "1234",
  );
});

test("check focus", async () => {
  render(InputStandard, {
    props: {
      id: "inputStandard",
      focus: true,
    },
  });
  await InputStandardView.Input.assertFocused();
});
