import {
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  toRaw,
  watch,
  type Ref,
} from "vue";
import { type ZodType } from "zod";
import type { $ZodIssueBase } from "zod/v4/core";

const FormSymbol = Symbol("FormContext");

interface ZodIssueWithDefault extends $ZodIssueBase {
  __isZodDefault?: true;
}

interface FieldRegistration {
  validate: (setTouched?: boolean) => Promise<boolean>;
  reset: () => void;
}

interface FieldConfig<T> {
  schema: Ref<ZodType<T>>;
  model: Ref<T>;
}

export function createFormContext() {
  const childFields = ref<FieldRegistration[]>([]);

  const validateAll = async (setTouched = true) =>
    (
      await Promise.all(childFields.value.map((f) => f.validate(setTouched)))
    ).every(Boolean);

  const handleSubmit = (callback: () => unknown) => async () =>
    (await validateAll()) ? callback() : false;

  const resetAll = () =>
    nextTick(() => childFields.value.forEach((field) => field.reset()));

  const unregisterField = (field: FieldRegistration) =>
    (childFields.value = childFields.value.filter((f) => f !== field));

  const registerField = (field: FieldRegistration) => {
    childFields.value.push(field);
    return unregisterField;
  };

  provide(FormSymbol, registerField);
  return { handleSubmit, resetAll };
}

export function useFormContext<T>(config: FieldConfig<T>) {
  const { schema, model } = config;
  const register = inject<
    ((field: FieldRegistration) => () => void) | undefined
  >(FormSymbol, undefined);

  const touched = ref(false);
  const errorMessage = ref<string | undefined>(undefined);

  const getErrorMessage = (issue: ZodIssueWithDefault) => {
    const customFn = (toRaw(schema.value) as ZodType).def?.error;
    if (issue.__isZodDefault && customFn) {
      const result = customFn(issue as never);
      return typeof result === "string" ? result : result?.message;
    }
    return issue.message;
  };

  const validate = async (forceValidation?: boolean): Promise<boolean> => {
    const result = schema.value.safeParse(model.value, {
      error: (issue) => {
        (issue as ZodIssueWithDefault).__isZodDefault = true;
      },
    });

    if (result.success) {
      errorMessage.value = undefined;
    } else if (touched.value || forceValidation) {
      errorMessage.value = getErrorMessage(result.error.issues[0]);
    }

    return result.success;
  };

  const handleInput = () => {
    touched.value = true;
  };

  const handleBlur = () => {
    validate();
  };

  const reset = () => {
    touched.value = false;
    errorMessage.value = undefined;
  };

  let unregister: (() => void) | null = null;

  onMounted(() => {
    if (register) {
      unregister = register({ validate, reset });
    }
    watch(
      [model, schema],
      () => {
        validate();
      },
      { deep: true },
    );
  });

  onUnmounted(() => {
    if (unregister) unregister();
  });

  return { errorMessage, validate, handleBlur, reset, handleInput };
}
