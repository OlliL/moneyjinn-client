<template>
  <div class="grid w-full gap-1.5 relative">
    <Label v-if="fieldLabel" :for="id" class="text-left ml-1">
      {{ fieldLabel }}
    </Label>

    <Popover v-model:open="isPopoverOpen">
      <PopoverTrigger as-child>
        <div class="flex -space-x-px relative">
          <Input
            :id="id"
            :data-testid="id"
            autocomplete="off"
            type="text"
            :class="[
              'rounded-r-none bg-white z-10',
              isInvalid
                ? 'border-destructive! bg-destructive/3 focus-visible:ring-destructive/15 border-r-destructive!'
                : 'border-input focus-visible:ring-ring',
            ]"
            ref="fieldRef"
            @keyup="onKeyboardInput($event)"
            @focus="
              (e: FocusEvent) => {
                (e.target as HTMLInputElement)?.select();
                isPopoverOpen = true;
              }
            "
            @click.stop="isPopoverOpen = true"
            @pointerdown.stop="isPopoverOpen = true"
            @input="onTextInput"
            @blur="onBlur"
          />

          <div
            :class="[
              'cursor-pointer flex items-center justify-center px-2 border border-input rounded-r-md text-foreground transition-colors relative',
              isInvalid ? 'border-l-transparent' : '',
            ]"
          >
            <CalendarDays class="w-4 h-4" />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        class="p-0 w-auto"
        align="end"
        :side-offset="5"
        :style="{ zIndex: popoverZIndex }"
      >
        <div
          ref="datepickerContainer"
          class="datepicker-inline-container"
        ></div>
      </PopoverContent>
    </Popover>

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toTypedSchema } from "@vee-validate/zod";
import { CalendarDays } from "lucide-vue-next";
import { Datepicker } from "vanillajs-datepicker";
// @ts-ignore
import de from "vanillajs-datepicker/locales/de";
import { useField } from "vee-validate";
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
  type PropType,
  type Ref,
} from "vue";
import { useI18n } from "vue-i18n";
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

const { t } = useI18n();
const emit = defineEmits(["update:modelValue"]);
const viewMounted = ref(false);
const closeLabel = t("General.close");
const isPopoverOpen = ref(false);
const popoverZIndex = ref(3500); // Deine Z-Index Logik bleibt hier erhalten
const datepickerContainer = useTemplateRef<HTMLDivElement>(
  "datepickerContainer",
);
const fieldRef = useTemplateRef<typeof Input>("fieldRef");

Object.assign(Datepicker.locales, de);
const CONFIG = {
  day: { level: 0, format: "dd.mm.yyyy", dots: [2, 5] },
  month: { level: 1, format: "mm.yyyy", dots: [2] },
  year: { level: 2, format: "yyyy", dots: [] },
} as const;
const {
  level: pickLevel,
  format,
  dots: autoDots,
} = CONFIG[props.pickMode as keyof typeof CONFIG] || CONFIG.day;

const parseInput = (v: any) => {
  if (v instanceof Date) return v;
  if (typeof v !== "string" || v.length !== format.length) return v;
  const timestamp = Datepicker.parseDate(v, format, "de");
  if (timestamp !== undefined) {
    const d = new Date(timestamp);
    if (Datepicker.formatDate(d, format, "de") === v) return d;
  }
  return v;
};

const schema = computed(() => {
  if (!viewMounted.value) return undefined;
  return toTypedSchema(
    preprocess(
      parseInput,
      props.validationSchemaRef?.value ?? props.validationSchema,
    ),
  );
});

const {
  meta: fieldMeta,
  errorMessage,
  setState,
  handleChange,
  handleBlur,
  validate,
  setValue,
} = useField(props.id, schema, {
  initialValue: props.modelValue,
  syncVModel: false,
});
let datepicker = {} as Datepicker;
const getInputElement = () => fieldRef.value?.$el as HTMLInputElement;

const onBlur = (event: FocusEvent) => {
  handleBlur(event);
  validate();
};

const initDatepicker = () => {
  if (!datepickerContainer.value) return;

  if (datepicker instanceof Datepicker) {
    datepicker.destroy();
  }

  datepicker = new Datepicker(datepickerContainer.value, {
    buttonClass:
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    pickLevel: pickLevel,
    clearButton: true,
    todayButton: true,
    todayButtonMode: 1,
    autohide: true,
    language: "de",
    format: format,
    container: datepickerContainer.value,
  });

  // Customize clear button to act as close button
  const clearBtn = datepicker.picker.element.querySelector(
    ".clear-btn",
  ) as HTMLButtonElement;
  if (clearBtn) {
    clearBtn.textContent = closeLabel;
    const newClearBtn = clearBtn.cloneNode(true) as HTMLButtonElement;
    clearBtn.replaceWith(newClearBtn);
    newClearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      isPopoverOpen.value = false;
    });
  }

  if (props.modelValue) {
    datepicker.setDate(props.modelValue);
  }

  datepickerContainer.value.addEventListener("changeDate", onInput);
};

onMounted(() => {
  viewMounted.value = true;
  if (props.modelValue) {
    setDate(props.modelValue);
  }
});

onUnmounted(() => {
  if (datepickerContainer.value) {
    datepickerContainer.value.removeEventListener("changeDate", onInput);
  }
});

const onTextInput = (event: Event) => {
  const v = (event.target as HTMLInputElement).value;
  handleChange(event, false); // No validation while typing

  // Nur wenn das Datum vollständig ist, den Picker aktualisieren und modelValue emittieren
  if (v.length === format.length) {
    const d = parseInput(v);
    if (d instanceof Date && !Number.isNaN(d.getTime())) {
      if (datepicker instanceof Datepicker) datepicker.setDate(d);
      if (d.getTime() !== props.modelValue?.getTime()) {
        emit("update:modelValue", d);
        setValue(d, false);
      }
    } else {
      emit("update:modelValue", new Date(Number.NaN));
      // Wir rufen hier kein setValue auf, damit der String im vee-validate State bleibt.
      // Das Schema erhält so den String und nutzt die konfigurierte invalid_type_error Message.
    }
  } else if (v === "" && props.modelValue !== undefined) {
    if (datepicker instanceof Datepicker) datepicker.setDate({ clear: true });
    emit("update:modelValue", undefined);
    setValue(undefined, false);
  }
};

const setDate = (newVal?: Date) => {
  const inputEl = getInputElement();
  if (inputEl) {
    inputEl.value = newVal
      ? Datepicker.formatDate(new Date(newVal), format, "de")
      : "";
  }

  if (!(datepicker instanceof Datepicker)) return;

  if (newVal === undefined) {
    if (datepicker.dates.length > 0) {
      datepicker.setDate({ clear: true, forceRefresh: true });
    }
    return;
  }

  const normalizedDate = new Date(newVal);
  if (props.pickMode === "month") {
    normalizedDate.setDate(1);
  } else if (props.pickMode === "year") {
    normalizedDate.setDate(1);
    normalizedDate.setMonth(0);
  }
  normalizedDate.setHours(0, 0, 0, 0);

  const current = datepicker.getDate() as Date;
  const needsUpdate =
    datepicker.dates.length === 0 ||
    current.getTime() !== normalizedDate.getTime();

  if (needsUpdate) {
    datepicker.setDate(normalizedDate);
  }
};

const onKeyboardInput = (event: KeyboardEvent) => {
  if (["Backspace", "Delete"].includes(event.key)) return;
  const el = event.target as HTMLInputElement;
  if ((autoDots as readonly number[]).includes(el.value.length)) {
    el.value += ".";
  }
};

const onInput = (event: Event) => {
  if (datepicker.dates.length === 0) {
    if (props.modelValue !== undefined) {
      setState({ touched: true });
      emit("update:modelValue", undefined);
      setValue(undefined);
      const el = getInputElement();
      if (el) el.value = "";
    }
  } else {
    const selectedDate = datepicker.getDate() as Date;
    if (selectedDate.getTime() !== props.modelValue?.getTime()) {
      setState({ touched: true });
      emit("update:modelValue", selectedDate);
      setValue(selectedDate);
      const el = getInputElement();
      if (el) el.value = Datepicker.formatDate(selectedDate, format, "de");
    }

    // Close popover after selection
    isPopoverOpen.value = false;
  }
};

const isInvalid = computed(() => fieldMeta.touched && !!errorMessage.value);

watch(isPopoverOpen, async (val) => {
  if (val) {
    await nextTick();
    initDatepicker();
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    // Wenn der Benutzer gerade tippt, ignorieren wir Änderungen von außen,
    // um den Cursor-Sprung / Overwrite-Bug zu verhindern.
    const el = getInputElement();
    if (el && document.activeElement === el) return;

    const current =
      datepicker instanceof Datepicker
        ? (datepicker.getDate() as Date | undefined)
        : undefined;

    if (newVal?.getTime() !== current?.getTime()) {
      setDate(newVal);
      setValue(newVal, false);
    }
  },
);
</script>

<style>
@reference "@/style.css";
div.datepicker {
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
  @apply h-8 bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground font-medium text-sm border-none rounded-none transition-colors shadow-none;
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
  @apply h-8 flex-1 text-sm font-medium transition-colors rounded-none border-none shadow-none bg-transparent m-0 p-0 cursor-pointer flex items-center justify-center;
}

div.datepicker .datepicker-footer .today-btn {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
  border-bottom-left-radius: calc(var(--radius, 0.75rem) - 1px);
}

div.datepicker .datepicker-footer .clear-btn {
  @apply bg-background text-foreground hover:bg-accent hover:text-accent-foreground border-l border-border;
  border-bottom-right-radius: calc(var(--radius, 0.75rem) - 1px);
}

div.datepicker .datepicker-cell {
  @apply rounded-md text-foreground transition-colors h-8 leading-8 text-sm;
}

div.datepicker .datepicker-cell.selected {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

div.datepicker .datepicker-cell.today:not(.selected) {
  @apply bg-accent text-accent-foreground font-bold;
}

.datepicker-inline-container div.datepicker {
  @apply border-none shadow-none;
}
</style>
