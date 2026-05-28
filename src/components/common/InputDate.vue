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
          isInvalid
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
          isInvalid ? 'border-l-transparent' : '',
        ]"
      >
        <CalendarDays class="w-4 h-4" />
      </div>
    </div>

    <p
      v-if="isInvalid"
      class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      buttonClass:
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      pickLevel: pickLevel,
      clearButton: true,
      todayButton: true,
      todayButtonMode: 1,
      autohide: true,
      language: navigator.language,
      format: format,
    });
    viewMounted.value = true;

    getInputElement().addEventListener("show", () => {
      const clearBtn = datepicker.picker.element.querySelector(
        ".clear-btn",
      ) as HTMLButtonElement;
      if (clearBtn && clearBtn.textContent !== "Schließen") {
        clearBtn.textContent = "Schließen";

        const newClearBtn = clearBtn.cloneNode(true) as HTMLButtonElement;
        clearBtn.replaceWith(newClearBtn);

        newClearBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          datepicker.hide();
        });
      }
    });

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

const isInvalid = computed(() => fieldMeta.touched && !!errorMessage.value);

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
div.datepicker.datepicker-dropdown {
  @apply bg-background border border-border shadow-lg overflow-hidden p-0;
  border-radius: var(--radius, 0.75rem);
}

div.datepicker .datepicker-main {
  @apply p-3;
}

div.datepicker .datepicker-header {
  @apply p-0 flex bg-muted border-b border-border;
}

div.datepicker .datepicker-header .datepicker-controls {
  @apply w-full flex items-stretch;
}

div.datepicker .datepicker-header .view-switch,
div.datepicker .datepicker-header .prev-btn,
div.datepicker .datepicker-header .next-btn {
  @apply h-11 bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground font-medium text-sm border-none rounded-none transition-colors shadow-none;
}

div.datepicker .datepicker-header .prev-btn {
  @apply border-r border-border/60;
}
div.datepicker .datepicker-header .next-btn {
  @apply border-l border-border/60;
}
div.datepicker .datepicker-header .view-switch {
  @apply flex-1;
}

div.datepicker .datepicker-footer {
  @apply p-0 border-t border-border mt-0 flex;
}

div.datepicker .datepicker-footer .datepicker-controls {
  @apply w-full flex gap-0 m-0 p-0;
}

div.datepicker .datepicker-footer .today-btn,
div.datepicker .datepicker-footer .clear-btn {
  @apply h-11 flex-1 text-sm font-medium transition-colors rounded-none border-none shadow-none bg-transparent m-0 p-0 cursor-pointer flex items-center justify-center;
}

div.datepicker .datepicker-footer .today-btn {
  @apply bg-[#007a9b] text-white hover:bg-[#006682];
  border-bottom-left-radius: calc(var(--radius, 0.75rem) - 1px);
}

div.datepicker .datepicker-footer .clear-btn {
  @apply bg-background text-foreground hover:bg-accent hover:text-accent-foreground border-l border-border;
  border-bottom-right-radius: calc(var(--radius, 0.75rem) - 1px);
}

div.datepicker .datepicker-cell {
  @apply rounded-md text-foreground transition-colors;
}

div.datepicker .datepicker-cell.selected {
  @apply bg-[#007a9b] text-white hover:bg-[#006682];
}

div.datepicker .datepicker-cell.today:not(.selected) {
  @apply bg-accent text-accent-foreground font-bold;
}
</style>
