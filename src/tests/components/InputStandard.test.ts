import { computed, ref } from "vue";
import { string } from "zod";
import InputStandard from "@/components/InputStandard.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import { expect, test } from "vitest";
import { globErr } from "@/tools/views/ZodUtil";
import { setInputValueAndWait, waitForInputHasValue } from "../TestUtil";
import "@testing-library/jest-dom/vitest";

test("error message and regular label get set correctly", async () => {
  const schema = string(globErr("my error")).min(5);
  render(InputStandard, {
    props: {
      id: "inputStandard",
      validationSchema: schema,
      fieldLabel: "regular label",
    },
  });
  const inputStandard = screen.getByTestId<HTMLInputElement>("inputStandard");
  setInputValueAndWait(inputStandard, "1234");
  await screen.findByLabelText("my error");
  setInputValueAndWait(inputStandard, "12345");
  await screen.findByLabelText("regular label");
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
  const inputStandard = screen.getByTestId<HTMLInputElement>("inputStandard");
  setInputValueAndWait(inputStandard, "1234");
  await screen.findByLabelText("my error");
  setInputValueAndWait(inputStandard, "12345");
  await screen.findByLabelText("regular label");
  len.value = 6;
  await screen.findByLabelText("my error");
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
  screen.getByTestId<HTMLInputElement>("inputStandard");
  await screen.findByLabelText("regular label");
});

test("check that update:modelValue gets emitted", async () => {
  const { emitted } = render(InputStandard, {
    props: {
      id: "inputStandard",
      modelValue: "abcd",
    },
  });
  const inputStandard = screen.getByTestId<HTMLInputElement>("inputStandard");
  waitForInputHasValue(inputStandard, "abcd");
  setInputValueAndWait(inputStandard, "1234");
  expect((emitted()["update:modelValue"]![0]! as Array<string>)[0]).toBe(
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
  const inputStandard = screen.getByTestId<HTMLInputElement>("inputStandard");
  await waitFor(() => expect(document.activeElement).toBe(inputStandard));
});
