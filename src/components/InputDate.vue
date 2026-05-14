<template>
  <div class="grid w-full gap-1.5 relative">
    <Label v-if="fieldLabel" :for="id" class="text-left ml-1">
      {{ fieldLabel }}
    </Label>

    <div class="flex -space-x-px relative">
      <Input
        autocomplete="off"
        :id="id"
        :data-testid="id"
        type="text"
        @changeDate="onInput($event)"
        :class="[
          'rounded-r-none',
          errorData.inputClass == 'is-invalid'
            ? '!border-destructive bg-destructive/[0.03] focus-visible:ring-destructive/15'
            : 'border-input focus-visible:ring-ring',
        ]"
        ref="fieldRef"
        @keyup="onKeyboardInput($event)"
        @focus="(($event as FocusEvent)?.target as HTMLInputElement)?.select()"
      />

      <div
        class="flex items-center justify-center px-2 border border-input rounded-r-md text-foreground transition-colors relative"
      >
        <CalendarDays />
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
import { CalendarDays } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Datepicker } from "vanillajs-datepicker";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
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

// @ts-ignore
import de from "../../node_modules/vanillajs-datepicker/js/i18n/locales/de.js";

import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";

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
  labelStyle: {
    type: String,
    default: "",
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
  // Shadcn Komponenten-Instanz -> HTML Element
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
  }

  if (getInputElement()) {
    // Manuellen Listener für den Custom Event der Bibliothek hinzufügen
    getInputElement().addEventListener("changeDate", onInput);
  }
});

onUnmounted(() => {
  if (getInputElement()) {
    getInputElement().removeEventListener("changeDate", onInput);
  }
});

const setDate = (newVal?: Date) => {
  if (datepicker instanceof Datepicker) {
    if (newVal === undefined) {
      if (datepicker.dates.length > 0) {
        datepicker.setDate({ clear: true, forceRefresh: true });
      }
    } else {
      if (props.pickMode === "month") {
        newVal.setDate(1);
      } else if (props.pickMode === "year") {
        newVal.setDate(1);
        newVal.setMonth(0);
      }
      newVal.setHours(0, 0, 0, 0);

      if (
        datepicker.dates.length === 0 ||
        (datepicker.getDate() as Date).toISOString() != newVal?.toISOString()
      ) {
        datepicker.setDate(newVal);
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
