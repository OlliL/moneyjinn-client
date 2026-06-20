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

  const registerField = (field: FieldRegistration) => {
    childFields.value.push(field);
    return () => {
      childFields.value = childFields.value.filter((f) => f !== field);
    };
  };

  provide(FormSymbol, registerField);

  const handleSubmit = (callback: () => unknown) => {
    return async () => {
      const results = await Promise.all(
        childFields.value.map((field) => field.validate(true)),
      );
      const isFormValid = results.every(Boolean);
      if (isFormValid) {
        return callback();
      }
      return false;
    };
  };

  const resetAll = () => {
    nextTick(() => childFields.value.forEach((field) => field.reset()));
  };

  return { handleSubmit, resetAll };
}

export function useFormContext<T>(config: FieldConfig<T>) {
  const { schema, model } = config;
  const register = inject<
    ((field: FieldRegistration) => () => void) | undefined
  >(FormSymbol, undefined);

  const touched = ref(false);
  const errorMessage = ref<string | undefined>(undefined);

  const validate = async (setTouched?: boolean): Promise<boolean> => {
    const result = schema.value.safeParse(model.value, {
      error: (issue) => {
        (issue as ZodIssueWithDefault).__isZodDefault = true;
        return undefined;
      },
    });

    if (result.success) {
      errorMessage.value = undefined;
    } else if (touched.value || setTouched) {
      const firstIssue = result.error.issues[0] as ZodIssueWithDefault;
      const isDefaultError = firstIssue.__isZodDefault === true;
      const customGlobMessageFn = (toRaw(schema.value) as ZodType).def?.error;
      if (isDefaultError && customGlobMessageFn) {
        const result = customGlobMessageFn(firstIssue as never);
        errorMessage.value =
          typeof result === "string" ? result : result?.message;
      } else {
        errorMessage.value = firstIssue.message;
      }
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
