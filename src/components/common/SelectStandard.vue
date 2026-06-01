<template>
  <div class="grid w-full gap-1.5 relative">
    <Label v-if="fieldLabel" :for="id" class="text-left ml-1">
      {{ fieldLabel }}
    </Label>

    <div class="flex -space-x-px relative w-full">
      <input
        type="hidden"
        :id="id"
        :name="id"
        :data-testid="id + '-id'"
        v-model="hiddenValue"
      />

      <Popover v-model:open="isOpen" :modal="false">
        <PopoverTrigger as-child class="w-full">
          <div class="relative flex-1 flex -space-x-px w-full">
            <div class="relative flex-1">
              <Input
                autocomplete="off"
                v-model="fieldValue"
                ref="fieldRef"
                :id="id"
                :data-testid="id"
                :class="[
                  $slots.icon ? 'rounded-r-none' : '',
                  isInvalid
                    ? '!border-destructive bg-destructive/[0.03] focus-visible:ring-destructive/15 !border-r-destructive'
                    : 'bg-background border-input focus-visible:ring-ring',
                ]"
                @input="onInput"
                @click.stop="showDropdown"
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
                <X class="icon-medium stroke-[3px]" />
              </button>
            </div>

            <div
              v-if="$slots.icon"
              :class="[
                'flex items-center justify-center px-2 border border-input rounded-r-md text-foreground transition-colors relative',
                isInvalid ? 'border-l-transparent' : '',
              ]"
              @click.stop
              @pointerdown.stop
            >
              <slot name="icon"></slot>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          v-if="items.length > 0"
          class="p-0 z-[2500] flex flex-col"
          :style="{
            width: 'var(--reka-popover-trigger-width)',
            minWidth: 'var(--reka-popover-trigger-width)',
            maxWidth: 'var(--reka-popover-trigger-width)',
          }"
          align="start"
          @open-auto-focus="(e) => e.preventDefault()"
          @close-auto-focus="(e) => e.preventDefault()"
        >
          <div
            ref="dropdownRef"
            class="p-1 overflow-y-auto max-h-[300px] overscroll-contain custom-scrollbar"
          >
            <a
              v-for="selectBoxValue in items"
              :key="selectBoxValue.id"
              v-memo="[selectBoxValue.id]"
              href="#"
              class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground !text-foreground !no-underline"
              @click.prevent="onClickAnchor(selectBoxValue)"
              @keydown="onKeydownAnchor"
              :data-testid="id + '-option'"
            >
              <span class="truncate min-w-0">{{ selectBoxValue.value }}</span>
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </div>

    <p
      v-if="isInvalid"
      :data-testid="id + '-error'"
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
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { toTypedSchema } from "@vee-validate/zod";
import { X } from "lucide-vue-next";
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
import { any, type ZodType } from "zod";

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
const fieldValue = ref<string | undefined>(undefined);
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
  const searchString = fieldValue.value?.toLocaleLowerCase();
  if (searchString)
    items.value = props.selectBoxValues.filter((sbv) =>
      sbv.value.toLocaleLowerCase().includes(searchString),
    );
  else items.value = props.selectBoxValues;
};

const isOpen = ref(false);
const showDropdown = async () => {
  isOpen.value = true;

  await nextTick();

  const el = getInputElement();
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  // No need to set highlightedOptionId here, it's done by keyboard nav or onInput
};

const hideDropdown = () => {
  isOpen.value = false;
};

const focusNextInputElement = () => {
  const el = getInputElement();
  const form = el?.closest("form");
  if (!form || !el) return;

  const inputElements = Array.from(form.elements).filter(
    (i): i is HTMLInputElement =>
      i instanceof HTMLInputElement && i.type !== "hidden",
  );
  const index = inputElements.indexOf(el);
  nextTick(() => {
    inputElements[index + 1]?.focus();
  });
};

const getDropdownAnchors = () => {
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
  // filterItemList() is called by watch(props.modelValue) or onInput, which also resets highlight
  filterItemList();
};

let blurTimeout: ReturnType<typeof setTimeout> | undefined;

const onBlur = () => {
  blurTimeout = setTimeout(() => {
    if (typeof document === "undefined") return;

    const activeEl = document.activeElement;
    const isInsideDropdown =
      dropdownRef.value?.contains(activeEl) || getInputElement() === activeEl;

    if (!isInsideDropdown) {
      if (isOpen.value) {
        hideDropdown();
      }
      setFieldValue();
    }
  }, 100);
};

onUnmounted(() => {
  if (blurTimeout) clearTimeout(blurTimeout);
});

const getInputElement = () => {
  const refValue = fieldRef.value as unknown as
    | HTMLInputElement
    | { $el?: HTMLInputElement }
    | undefined;
  if (!refValue) return undefined;
  if ("$el" in refValue && refValue.$el) return refValue.$el;
  return refValue as HTMLInputElement;
};

const onFocus = () => {
  if (preventOnFocus.value || isOpen.value) {
    preventOnFocus.value = false;
    return;
  }
  showDropdown();
  getInputElement()?.select();
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
      getInputElement()?.focus();
    } else {
      const prevIndex = (currentIndex - 1 + anchors.length) % anchors.length;
      anchors[prevIndex]?.focus();
    }
  } else if (event.key === "Enter" || event.key === "Tab") {
    event.preventDefault();
    (event.target as HTMLAnchorElement).click();
  } else if (event.key === "Escape") {
    hideDropdown();
    getInputElement()?.focus();
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
    await showDropdown();
    getFirstDropdownAnchor()?.focus();
  } else if (event.key == "Enter") {
    // Select first shown element from the Dropdown-Menu if the user presses ArrowDown in the input element
    event.preventDefault();
    getFirstDropdownAnchor()?.click();
  } else if (event.key == "Escape") {
    // Close Dropdown, pretend nothing happend....
    event.preventDefault();
    hideDropdown();
  } else if (event.key == "Tab") {
    // Select first shown element from the Dropdown-Menu if the user presses ArrowDown in the input element
    // For shift+tab just continue with regular event handler (focus previous element)
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

const isInvalid = computed(() => fieldMeta.touched && !!errorMessage.value);

const fieldRef = useTemplateRef<typeof Input>("fieldRef");
const dropdownRef = useTemplateRef<HTMLDivElement>("dropdownRef");

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
      getInputElement()?.focus();
    });
  }
});

watch(
  () => props.selectBoxValues,
  (newVal) => {
    // reset the fieldValue in case its not part of the select-box. But only do that if the hiddenValue is set at all.
    if (
      newVal.length > 0 &&
      hiddenValue.value != undefined &&
      hiddenValue.value !== 0
    ) {
      if (newVal.some((sbv) => sbv.id == hiddenValue.value)) {
        setFieldValue();
      } else {
        hiddenValue.value = undefined;
        fieldValue.value = undefined;
      }
    }
    filterItemList();
  },
  { immediate: true },
);
</script>
