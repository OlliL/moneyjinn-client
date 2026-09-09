import { v4 as uuidv4 } from "uuid";
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

const FormSymbol = Symbol("FormContext");

interface FieldRegistration {
  uuid: string;
  validate: (setTouched?: boolean) => Promise<boolean>;
  reset: () => void;
}

interface FieldConfig<T> {
  schema: Ref<ZodType<T>>;
  model: Ref<T>;
}

/**
 * Creates a form context that manages validation for multiple form fields.
 * Uses Vue's provide/inject pattern to allow child components to register themselves.
 *
 * @example
 * const { handleSubmit, resetAll } = createFormContext();
 * const onSubmit = handleSubmit(() => saveData());
 */
export function createFormContext() {
  const childFields = ref<FieldRegistration[]>([]);

  const validateAll = async (setTouched = true) =>
    (
      await Promise.all(childFields.value.map((f) => f.validate(setTouched)))
    ).every(Boolean);

  const handleSubmit =
    <T>(callback: () => T | Promise<T> = () => true as T) =>
    async (): Promise<T | false> =>
      (await validateAll()) ? await callback() : false;

  const resetAll = () =>
    nextTick(() => childFields.value.forEach((field) => field.reset()));

  const unregisterField = (field: FieldRegistration) =>
    (childFields.value = childFields.value.filter(
      (f) => f.uuid !== field.uuid,
    ));

  const registerField = (field: FieldRegistration) => {
    childFields.value.push(field);
    return () => unregisterField(field);
  };

  provide(FormSymbol, registerField);
  return {
    /**
     * Creates a submit handler that validates all registered fields before executing the callback.
     * Uses forceValidation=true to ensure all fields show their errors on submit attempt.
     *
     * @param {() => unknown} [callback] - Optional function to call if all validations pass (defaults to `() => true`)
     * @returns {() => Promise<boolean>} Async function that returns false if validation fails,
     * otherwise the callback result (default: true)
     */
    handleSubmit,
    /**
     * Resets all registered fields to their initial state.
     * Calls each field's reset() function which clears touched state and error message.
     * Uses nextTick to ensure DOM updates are processed first.
     */
    resetAll,
  };
}

/**
 * Provides form field validation using Zod schemas with Vue's provide/inject pattern.
 * Each field using this hook registers itself with the parent form context created by createFormContext().
 *
 * @template T - The type of the form model being validated
 * @param {FieldConfig<T>} config - Configuration object containing the Zod schema and model reference
 * @param {Ref<ZodType<T>>} config.schema - A reactive reference to the Zod schema for validation
 * @param {Ref<T>} config.model - A reactive reference to the form model data
 *
 * @example
 * import { globErr } from "@/tools/views/ZodUtil";
 * const schema = ref(z.string(globErr("Name is required")).min(1).max(100, "max length is 100"));
 * const model = ref("");
 * const { errorMessage, validate, handleBlur, reset, handleInput } = useFormContext({ schema, model });
 */
export function useFormContext<T>(config: FieldConfig<T>) {
  const { schema, model } = config;
  const register = inject<
    ((field: FieldRegistration) => () => void) | undefined
  >(FormSymbol, undefined);

  const touched = ref(false);
  const errorMessage = ref<string | undefined>(undefined);
  let initialValue: unknown;

  const getRawSchema = () => toRaw(schema.value) as ZodType<T, T>;

  /**
   * Validates the field against the Zod schema.
   *
   * @param {boolean} [forceValidation] - If true, sets the error message even if the field has not been touched yet;
   *   used during submit handling to show all validation errors immediately.
   * @returns {Promise<boolean>} True if validation passes, false otherwise
   *
   * Error message resolution hierarchy is handled by Zod itself.
   * `issue.message` already contains the final message according to Zod's
   * precedence rules (lokale Check-Fehler > schemaweite Fehler > Default-Fehler).
   *
   * The error message is only written when the field was already touched by the
   * user or when validation is forced explicitly (for example on submit).
   */
  const validate = async (forceValidation?: boolean): Promise<boolean> => {
    const result = getRawSchema().safeParse(model.value);

    if (result.success) {
      errorMessage.value = undefined;
    } else if (touched.value || forceValidation) {
      errorMessage.value = result.error.issues[0]?.message;
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
      unregister = register({
        uuid: uuidv4(),
        validate,
        reset,
      });
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

  return {
    /**
     * The errorMessage to display.
     * Gets only set if the field was touched by the user or the validation was forced by handleSubmit.
     */
    errorMessage,
    /**
     * Triggers validation when the field loses focus.
     * Calls validate() without forceValidation to show errors only after user interaction.
     */
    handleBlur,
    /**
     * Resets the field's touched state and clears the error message.
     * Call this when resetting the form or clearing field values.
     */
    reset,
    /**
     * Marks the field as touched. Call this on input/change events.
     * This ensures validation errors are shown after user interaction.
     */
    handleInput,
  };
}
