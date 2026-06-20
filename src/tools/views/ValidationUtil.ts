import {
  computed,
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

const FormSymbol = Symbol("FormContext");

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
  const validationError = ref<string | undefined>(undefined);
  const errorMessage = computed(() =>
    touched.value ? validationError.value : undefined,
  );

  const validate = async (setTouched?: boolean): Promise<boolean> => {
    if (setTouched) touched.value = setTouched;
    const result = schema.value.safeParse(model.value, {
      error: (issue) => {
        (issue as any).__isZodDefault = true;
        return undefined;
      },
    });

    if (result.success) {
      validationError.value = undefined;
    } else {
      const firstIssue = result.error.issues[0];
      const isDefaultError = (firstIssue as any).__isZodDefault === true;
      const customGlobMessageFn = (toRaw(schema.value) as any)._def?.error;
      if (isDefaultError && customGlobMessageFn) {
        validationError.value = customGlobMessageFn().message;
      } else {
        validationError.value = firstIssue.message;
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
    validationError.value = undefined;
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
