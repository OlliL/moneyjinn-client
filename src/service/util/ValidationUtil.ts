import {
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  type Ref,
} from "vue";
import { type ZodType } from "zod";

const FormSymbol = Symbol("FormContext");

type ValidateFn = () => Promise<boolean>;

interface FieldConfig<T> {
  schema: ZodType<T>;
  model: Ref<T>;
}

export function createFormContext() {
  const childValidations = ref<ValidateFn[]>([]);

  const registerField = (validateFn: ValidateFn) => {
    childValidations.value.push(validateFn);
    return () => {
      childValidations.value = childValidations.value.filter(
        (fn) => fn !== validateFn,
      );
    };
  };

  provide(FormSymbol, registerField);

  const handleSubmit = (callback: () => unknown) => {
    return async () => {
      const results = await Promise.all(
        childValidations.value.map((validate) => validate()),
      );
      const isFormValid = results.every(Boolean);
      if (isFormValid) {
        return callback();
      }
      return false;
    };
  };

  return { handleSubmit };
}

export function useFormContext<T>(config: FieldConfig<T>) {
  const { schema, model } = config;
  const register = inject<(validateFn: ValidateFn) => () => void>(FormSymbol);

  const errorMessage = ref<string | undefined>(undefined);
  let initialValue: unknown;

  const validate = async (): Promise<boolean> => {
    const result = schema.safeParse(model.value);
    errorMessage.value = result.success
      ? undefined
      : result.error.errors[0]?.message;
    return !errorMessage.value;
  };

  const setInitialValue = () => {
    initialValue = structuredClone(model.value);
  };

  const handleBlur = () => {
    if (JSON.stringify(model.value) !== JSON.stringify(initialValue)) {
      validate();
      setInitialValue();
    }
  };

  const reset = () => {
    errorMessage.value = undefined;
    setInitialValue();
  };

  let unregister: (() => void) | null = null;

  onMounted(() => {
    setInitialValue();
    if (register) {
      unregister = register(validate);
    }
    watch(
      model,
      () => {
        validate();
      },
      { deep: true },
    );
  });

  onUnmounted(() => {
    if (unregister) unregister();
  });

  return { errorMessage, validate, handleBlur, reset };
}
