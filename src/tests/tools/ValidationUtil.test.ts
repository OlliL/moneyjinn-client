import { AlertView, ButtonView, InputView } from "@/tests/TestViews";
import {
  createFormContext,
  useFormContext,
} from "@/tools/views/ValidationUtil";
import { globErr } from "@/tools/views/ZodUtil";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { beforeEach, test, vi } from "vitest";
import { h, ref, type Ref } from "vue";
import { string, type ZodType } from "zod";
import { assertHaveBeenCalled, assertNotHaveBeenCalled } from "../TestUtil";

const callback = vi.fn(); // Global definiert

beforeEach(() => {
  vi.clearAllMocks();
});

const TestField = {
  props: {
    schema: { type: Object as () => ZodType<any>, required: true },
    model: { type: Object as () => Ref<any>, required: true },
  },
  setup(props: { schema: ZodType<any>; model: Ref<any> }) {
    const { errorMessage } = useFormContext({
      schema: ref(props.schema),
      model: props.model,
    });
    return { errorMessage };
  },
  template: `
    <div>
      <input data-testid="input" v-model="model.value" />
      <span v-if="errorMessage" data-testid="error">{{ errorMessage }}</span>
    </div>
  `,
};

// Parent component that provides the form context
const TestForm = {
  props: {
    schema: { type: Object as () => ZodType<any>, required: true },
    model: { type: Object as () => Ref<any>, required: true },
  },
  setup(props: { schema: ZodType<any>; model: Ref<any> }) {
    const { handleSubmit } = createFormContext();
    const onSubmit = handleSubmit(callback);
    return { onSubmit };
  },
  template: `
    <form @submit.prevent="onSubmit">
      <TestField :schema="schema" :model="model" />
      <button type="submit" data-testid="submit">Submit</button>
    </form>
  `,
  components: { TestField },
};

// Page Objects
class ValidationUtilView {
  static readonly Input = new InputView("input");
  static readonly ErrorText = new AlertView("error");
  static readonly Submit = new ButtonView("submit");
}

test("handleSubmit calls callback when validation passes", async () => {
  const TestWrapper = {
    setup() {
      const { handleSubmit } = createFormContext();
      handleSubmit(callback)();
      return () => h("div");
    },
  };
  render(TestWrapper);
  await assertHaveBeenCalled(callback);
});

test.for([
  {
    test: "custom error => use custom error",
    globalError: globErr("Name is required"),
    customError: "Must be at least 5 characters",
    expectedError: "Must be at least 5 characters",
  },
  {
    test: "no custom error => use global error",
    globalError: globErr("Name is required"),
    customError: undefined,
    expectedError: "Name is required",
  },
  {
    test: "no error => use zod default error",
    globalError: undefined,
    customError: undefined,
    expectedError: "Too small: expected string to have >=5 characters",
  },
])(
  "error message hierarchy: $test",
  async ({ globalError, customError, expectedError }) => {
    const schema = string(globalError).min(5, customError);
    const model = ref("");

    render(TestForm, {
      props: { schema, model },
    });

    await ValidationUtilView.Input.setValue("abc");
    await ValidationUtilView.Submit.click();
    await ValidationUtilView.ErrorText.assertMessageContains(expectedError);
    assertNotHaveBeenCalled(callback);
  },
);
