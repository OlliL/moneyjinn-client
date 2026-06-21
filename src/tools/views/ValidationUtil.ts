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
  return {
    /**
     * Creates a submit handler that validates all registered fields before executing the callback.
     * Uses forceValidation=true to ensure all fields show their errors on submit attempt.
     *
     * @param {() => unknown} callback - The function to call if all validations pass
     * @returns {() => Promise<boolean>} Async function that returns true if validation passes and callback was executed, false otherwise
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

  /**
   * Resolves the error message for a validation issue.
   *
   * Resolution order:
   * 1. If __isZodDefault is NOT set → custom error from schema definition (use issue.message)
   * 2. If __isZodDefault IS set → default error, check for global custom error (globErr)
   * 3. If no global custom error → use Zod's default message (issue.message)
   */
  const getErrorMessage = (issue: ZodIssueWithDefault) => {
    // Local custom error from schema definition (e.g., z.string().min(1, "custom message"))
    if (!issue.__isZodDefault) {
      return issue.message;
    }
    // Global custom error on schema (globErr) if set
    const customFn = (toRaw(schema.value) as ZodType).def?.error;
    if (customFn) {
      const result = customFn(issue as never);
      return typeof result === "string" ? result : result?.message;
    }
    // Neither a local nor a global custom error → use Zod's default message
    return issue.message;
  };

  /**
   * Validates the field against the Zod schema.
   *
   * @param {boolean} [forceValidation] - If true, sets error message even if field hasn't been touched yet used during handleSubmit
   * @returns {Promise<boolean>} True if validation passes, false otherwise
   *
   * Error message resolution hierarchy:
   * 1. If validation passes → errorMessage is cleared, returns true
   * 2. If validation fails and (field is touched OR forceValidation is true):
   *    a. Custom error from schema definition → use custom error message
   *    b. No custom error, but global custom error on schema (globErr) → use global error message
   *    c. Neither custom nor global error → use Zod's default error message
   *
   * Implementation details:
   * - During safeParse, every default Zod issue receives the __isZodDefault flag.
   *   Custom errors from schema definitions bypass this because the errorMap is only
   *   invoked when no custom error message exists.
   * - getErrorMessage checks __isZodDefault to distinguish between custom and default errors:
   *   - If __isZodDefault is NOT set → it's a custom error from the schema
   *   - If __isZodDefault IS set → it's a default error, check for global custom error (globErr)
   */
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
