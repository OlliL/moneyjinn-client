<template>
  <div class="grid w-full gap-1.5 relative">
    <Label v-if="fieldLabel" :for="id" class="text-left ml-1">
      {{ fieldLabel }}
    </Label>

    <div class="flex -space-x-px relative">
      <input
        type="hidden"
        :id="id"
        :name="id"
        :data-testid="id + '-id'"
        ref="hiddenRef"
        v-model="hiddenValue"
      />

      <div class="relative flex-1">
        <Input
          autocomplete="off"
          v-model="fieldValue"
          ref="fieldRef"
          :id="id"
          :data-testid="id"
          :class="[
            'bg-white z-10',
            $slots.icon ? 'rounded-r-none' : '',
            errorData.inputClass == 'is-invalid'
              ? '!border-destructive bg-destructive/[0.03] focus-visible:ring-destructive/15 !border-r-destructive'
              : 'border-input focus-visible:ring-ring',
          ]"
          @input="onInput"
          @keydown="onKeydownInput"
          @keyup="onKeyupInput"
          @focus="onFocus"
          @blur="onBlur"
        />

        <button
          v-if="fieldValue"
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          @click="clearInput"
          :data-testid="id + '-clear'"
        >
          <X class="h-4 w-4 stroke-[3px]" />
        </button>
      </div>

      <div
        v-if="$slots.icon"
        :class="[
          'flex items-center justify-center px-2 border border-input rounded-r-md text-foreground transition-colors relative',
          errorData.inputClass == 'is-invalid' ? 'border-l-transparent' : '',
        ]"
      >
        <slot name="icon"></slot>
      </div>

      <div
        v-if="isOpen && items.length > 0"
        ref="dropdownRef"
        class="absolute z-50 top-[calc(100%+4px)] left-0 min-w-[8rem] w-full max-h-[300px] rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 flex flex-col"
      >
        <div class="p-1 overflow-y-auto overscroll-contain custom-scrollbar">
          <a
            v-for="selectBoxValue in items"
            :key="selectBoxValue.id"
            v-memo="[selectBoxValue.id]"
            ref="dropdownItemRef"
            href="#"
            class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground !text-foreground !no-underline"
            @click.prevent="onClickAnchor(selectBoxValue)"
            @keydown="onKeydownAnchor"
            :data-testid="id + '-option'"
          >
            {{ selectBoxValue.value }}
          </a>
        </div>
      </div>
    </div>

    <p
      v-if="errorData.inputClass === 'is-invalid'"
      class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-vue-next";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type PropType,
  type Ref,
} from "vue";
import { any, type ZodType } from "zod";

import type { SelectBoxValue } from "@/model/SelectBoxValue";

import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";

const props = defineProps({
  modelValue: {
    type: undefined,
    required: false,
  },
  selectBoxValues: {
    type: Array<SelectBoxValue>,
    required: true,
  },
  validationSchema: {
    type: Object as PropType<ZodType>,
    required: false,
    default: any().optional(),
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
  focus: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const schema = computed(() => {
  if (props.validationSchemaRef) {
    return toTypedSchema(props.validationSchemaRef.value);
  }
  return toTypedSchema(props.validationSchema);
});

const items: Ref<Array<SelectBoxValue>> = ref([]);
const fieldValue = ref(undefined as string | undefined);
const preventOnFocus = ref(false);
const {
  value: hiddenValue,
  meta: fieldMeta,
  errorMessage,
  setState,
  setValue,
} = useField(props.id, schema, {
  initialValue: props.modelValue,
  syncVModel: true,
});

const filterItemList = () => {
  const searchString = fieldValue.value;
  if (searchString)
    items.value = props.selectBoxValues.filter((sbv) =>
      sbv.value.toLocaleLowerCase().includes(searchString.toLocaleLowerCase()),
    );
  else items.value = props.selectBoxValues;
};

const isOpen = ref(false);
const showDropdown = async () => {
  isOpen.value = true;

  await nextTick();

  if (getInputElement()) {
    getInputElement().scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
};

const hideDropdown = () => {
  isOpen.value = false;
};

const focusNextInputElement = () => {
  const form = getInputElement().closest("form");
  const inputElements = Array.prototype.filter.call(
    form,
    (i) => i instanceof HTMLInputElement && i.type != "hidden",
  );
  const index = inputElements.indexOf(getInputElement());
  nextTick(() => {
    inputElements[index + 1].focus();
  });
};

const getDropdownAnchors = () => {
  // Findet alle Anker innerhalb des Dropdowns
  return dropdownRef.value?.querySelectorAll("a") || [];
};

const getFirstDropdownAnchor = () => {
  return getDropdownAnchors()[0] as HTMLAnchorElement | undefined;
};

const clearInput = () => {
  if (fieldValue.value) setState({ touched: true });
  hiddenValue.value = undefined;
  fieldValue.value = undefined;
};
const setFieldValue = () => {
  fieldValue.value = props.selectBoxValues.find(
    (sbv) => sbv.id == hiddenValue.value,
  )?.value;
  filterItemList();
};

const onBlur = (event: FocusEvent) => {
  setTimeout(() => {
    const activeEl = document.activeElement;
    const isInsideDropdown =
      dropdownRef.value?.contains(activeEl) || getInputElement() === activeEl;

    if (!isInsideDropdown) {
      preventOnFocus.value = true;
      hideDropdown();
      setFieldValue();
    }
  }, 100);
};

const getInputElement = () => {
  return fieldRef.value?.$el as HTMLInputElement;
};

const onFocus = (event: Event) => {
  showDropdown();
  getInputElement().select();

  setTimeout(() => {
    if (!preventOnFocus.value) {
      preventOnFocus.value = false;
      showDropdown();
    }
  }, 200);
};

const onClickAnchor = (selectBoxValue: SelectBoxValue) => {
  setState({ touched: true });
  setValue(selectBoxValue.id);
  hideDropdown();
};

const onKeydownAnchor = (event: KeyboardEvent) => {
  const anchors = Array.from(getDropdownAnchors());
  const currentIndex = anchors.indexOf(event.target as HTMLAnchorElement);

  if (event.key === "ArrowDown") {
    event.preventDefault();
    const nextIndex = (currentIndex + 1) % anchors.length;
    anchors[nextIndex]?.focus();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (currentIndex === 0) {
      getInputElement().focus();
    } else {
      const prevIndex = (currentIndex - 1 + anchors.length) % anchors.length;
      anchors[prevIndex]?.focus();
    }
  } else if (event.key === "Tab" || event.key === "Enter") {
    event.preventDefault();
    (event.target as HTMLAnchorElement).click();
  } else if (event.key === "Escape") {
    hideDropdown();
    getInputElement().focus();
  }
};

const onKeyupInput = (event: KeyboardEvent) => {
  // prevent onFocus Event which will occur when ESC is pressed inside Dropdown-Menu
  if (event.key == "Escape") preventOnFocus.value = true;
};

const onKeydownInput = async (event: KeyboardEvent) => {
  if (event.key == "ArrowDown") {
    // Enter Dropdown-Menu to navigate if the user presses ArrowDown in the input element
    event.preventDefault();
    nextTick(() => {
      showDropdown();
      getFirstDropdownAnchor()?.focus();
    });
  } else if (event.key == "Enter") {
    // Select first shown element from the Dropdown-Menu if the user presses ArrowDown in the input element
    event.preventDefault();
    getFirstDropdownAnchor()?.click();
  } else if (event.key == "Tab") {
    // Select first shown element from the Dropdown-Menu if the user presses ArrowDown in the input element
    // For shift+tab just continue with regular event handler (focus previous element)
    setTimeout(() => {
      hideDropdown();
    }, 200);
    if (!event.shiftKey) {
      event.preventDefault();
      getFirstDropdownAnchor()?.click();
      focusNextInputElement();
    }
  }
};

const onInput = () => {
  showDropdown();
  filterItemList();
};

const errorData = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    fieldMeta.touched,
    props.fieldLabel,
    errorMessage.value,
  );
});

const fieldRef = useTemplateRef<typeof Input>("fieldRef");
const hiddenRef = useTemplateRef<HTMLInputElement>("hiddenRef");
const dropdownRef = useTemplateRef<HTMLDivElement>("dropdownRef");
const dropdownItemRef =
  useTemplateRef<Array<HTMLAnchorElement>>("dropdownItemRef");

watch(
  () => props.modelValue,
  () => {
    setFieldValue();
  },
  { immediate: true },
);

onMounted(() => {
  if (props.focus) {
    nextTick(() => {
      getInputElement().focus();
    });
  }
});

watch(
  () => props.selectBoxValues,
  (newVal) => {
    // reset the fieldValue in case its not part of the select-box. But only do that if the hiddenValue is set at all.
    if (hiddenValue.value != undefined && hiddenValue.value !== 0) {
      const foundElement = newVal.find((sbv) => sbv.id == hiddenValue.value);
      if (!foundElement) {
        hiddenValue.value = undefined;
        fieldValue.value = undefined;
      }
    }
    filterItemList();
  },
  { immediate: true },
);
</script>
