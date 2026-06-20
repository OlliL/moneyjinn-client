import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  type Ref,
} from "vue";
import { type ZodType } from "zod";

const FormSymbol = Symbol("FormContext");

interface FieldRegistration {
  validate: () => Promise<boolean>;
  reset: () => void;
}

interface FieldConfig<T> {
  schema: ZodType<T>;
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
        childFields.value.map((field) => field.validate()),
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
  const register = inject<(field: FieldRegistration) => () => void>(FormSymbol);

  const touched = ref(false);
  const validationError = ref<string | undefined>(undefined);
  const errorMessage = computed(() =>
    touched.value ? validationError.value : undefined,
  );
  let initialValue: unknown;

  const validate = async (): Promise<boolean> => {
    const result = schema.safeParse(model.value);
    validationError.value = result.success
      ? undefined
      : result.error.errors[0]?.message;
    return !validationError.value;
  };

  const setInitialValue = () => {
    initialValue = structuredClone(model.value);
  };

  const handleBlur = () => {
    touched.value = true;
    if (JSON.stringify(model.value) !== JSON.stringify(initialValue)) {
      validate();
      setInitialValue();
    }
  };

  const reset = () => {
    touched.value = false;
    validationError.value = undefined;
    setInitialValue();
  };

  let unregister: (() => void) | null = null;

  onMounted(() => {
    setInitialValue();
    if (register) {
      unregister = register({ validate, reset });
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
