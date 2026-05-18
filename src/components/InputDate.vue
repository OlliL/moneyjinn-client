<template>
  <div class="grid w-full gap-1.5 relative">
    <Label v-if="fieldLabel" :for="id" class="text-left ml-1">
      {{ fieldLabel }}
    </Label>

    <div class="flex -space-x-px relative">
      <Input
        :id="id"
        :data-testid="id"
        type="text"
        :class="[
          'rounded-r-none bg-white z-10',
          errorData.inputClass == 'is-invalid'
            ? 'border-destructive! bg-destructive/3 focus-visible:ring-destructive/15 border-r-destructive!'
            : 'border-input focus-visible:ring-ring',
        ]"
        ref="fieldRef"
        @keyup="onKeyboardInput($event)"
        @focus="(($event as FocusEvent)?.target as HTMLInputElement)?.select()"
        @blur="onBlur"
      />

      <div
        :class="[
          'flex items-center justify-center px-2 border border-input rounded-r-md text-foreground transition-colors relative',
          errorData.inputClass == 'is-invalid' ? 'border-l-transparent' : '',
        ]"
      >
        <CalendarDays class="w-4 h-4" />
      </div>
    </div>

    <p
      v-if="errorData.inputClass == 'is-invalid'"
      class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";
import { toTypedSchema } from "@vee-validate/zod";
import { CalendarDays } from "lucide-vue-next";
import { Datepicker } from "vanillajs-datepicker";
// @ts-ignore
import de from "vanillajs-datepicker/locales/de";
import { useField } from "vee-validate";
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
  type PropType,
  type Ref,
} from "vue";
import { date, preprocess, type ZodType } from "zod";

const props = defineProps({
  validationSchema: {
    type: Object as PropType<ZodType>,
    required: false,
    default: date().optional(),
  },
  validationSchemaRef: {
    type: Object as PropType<Ref<ZodType>>,
    required: false,
  },
  id: {
    type: String,
    required: true,
  },
  fieldLabel: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Date,
    required: false,
  },
  pickMode: {
    type: String,
    default: "day",
  },
});
const emit = defineEmits(["update:modelValue"]);
const viewMounted = ref(false);

const schema = computed(() => {
  if (viewMounted.value) {
    if (props.validationSchemaRef) {
      return toTypedSchema(
        preprocess(() => datepicker.getDate(), props.validationSchemaRef.value),
      );
    }
    return toTypedSchema(
      preprocess(() => datepicker.getDate(), props.validationSchema),
    );
  }
  return undefined;
});

const {
  meta: fieldMeta,
  errorMessage,
  setState,
  handleChange,
} = useField(props.id, schema, {
  initialValue: props.modelValue,
  syncVModel: false,
});

Object.assign(Datepicker.locales, de);
let pickLevel = 0;
let format = "dd.mm.yyyy";

switch (props.pickMode) {
  case "day": {
    pickLevel = 0;
    format = "dd.mm.yyyy";
    break;
  }
  case "month": {
    pickLevel = 1;
    format = "mm.yyyy";
    break;
  }
  case "year": {
    pickLevel = 2;
    format = "yyyy";
    break;
  }
}

const fieldRef = useTemplateRef<typeof Input>("fieldRef");
let datepicker = {} as Datepicker;

const getInputElement = () => {
  return fieldRef.value?.$el as HTMLInputElement;
};

onMounted(() => {
  if (!(datepicker instanceof Datepicker) && fieldRef.value) {
    datepicker = new Datepicker(getInputElement(), {
      buttonClass: "btn",
      pickLevel: pickLevel,
      clearButton: true,
      todayButton: true,
      todayButtonMode: 1,
      autohide: true,
      language: navigator.language,
      format: format,
    });
    viewMounted.value = true;

    if (props.modelValue) {
      setDate(props.modelValue);
    }
  }

  if (getInputElement()) {
    getInputElement().addEventListener("changeDate", onInput);
  }
});

onUnmounted(() => {
  if (getInputElement()) {
    getInputElement().removeEventListener("changeDate", onInput);
  }
});

const onBlur = () => {
  if (datepicker && typeof datepicker.hide === "function") {
    datepicker.hide();
  }
};

const setDate = (newVal?: Date) => {
  if (datepicker instanceof Datepicker) {
    if (newVal === undefined) {
      if (datepicker.dates.length > 0) {
        datepicker.setDate({ clear: true, forceRefresh: true });
      }
    } else {
      const normalizedDate = new Date(newVal);

      if (props.pickMode === "month") {
        normalizedDate.setDate(1);
      } else if (props.pickMode === "year") {
        normalizedDate.setDate(1);
        normalizedDate.setMonth(0);
      }
      normalizedDate.setHours(0, 0, 0, 0);

      if (
        datepicker.dates.length === 0 ||
        (datepicker.getDate() as Date).toISOString() !=
          normalizedDate.toISOString()
      ) {
        datepicker.setDate(normalizedDate);
      }
    }
  }
};
const onKeyboardInput = (event: KeyboardEvent) => {
  if (["Backspace", "Delete"].includes(event.key)) {
    return;
  }
  switch (props.pickMode) {
    case "day": {
      if (
        datepicker.inputField.value.length == 2 ||
        datepicker.inputField.value.length == 5
      ) {
        datepicker.inputField.value = datepicker.inputField.value + ".";
      }
      break;
    }
    case "month": {
      if (datepicker.inputField.value.length == 2) {
        datepicker.inputField.value = datepicker.inputField.value + ".";
      }
      break;
    }
  }
};

const onInput = (event: Event) => {
  handleChange(event, true);
  if (datepicker.dates.length === 0) {
    if (props.modelValue !== undefined) {
      setState({ touched: true });
      emit("update:modelValue", undefined);
    }
  } else if (
    (datepicker.getDate() as Date).toISOString() !=
    props.modelValue?.toISOString()
  ) {
    setState({ touched: true });
    emit("update:modelValue", datepicker.getDate());
  }
};

const errorData = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    fieldMeta.touched,
    props.fieldLabel,
    errorMessage.value,
  );
});

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      setDate(newVal);
    }
  },
  { immediate: true },
);
</script>

<style>
@reference "@/style.css";

.datepicker-footer .datepicker-controls {
  @apply flex! w-full! gap-2! p-2! box-border! float-none! clear-both!;
}

.datepicker-footer {
  @apply w-full! p-0! float-none! clear-both!;
}

.datepicker-footer .btn {
  @apply flex-1! w-1/2! min-w-0! max-w-none! inline-flex! items-center! justify-center! rounded-md! border! px-3! py-1.5! text-sm! font-medium! transition-colors! shadow-none! float-none!;
}

.datepicker-footer .today-btn {
  @apply border-input! bg-background! text-foreground! hover:bg-accent! hover:text-accent-foreground!;
}

.datepicker-footer .clear-btn {
  @apply border-transparent! bg-transparent! text-muted-foreground! hover:bg-destructive/10! hover:text-destructive!;
}
</style>
