<template>
  <div class="input-group">
    <div class="form-floating">
      <input
        type="hidden"
        :id="id"
        :name="id"
        ref="hiddenRef"
        v-model="hiddenValue"
      />
      <input
        :class="'form-control dropdown-toggle ' + errorData.inputClass"
        style="scroll-margin-top: 56px"
        data-bs-toggle="dropdown"
        v-model="fieldValue"
        ref="fieldRef"
        :data-testid="id"
        @input="onInput"
        @keydown="onKeydownInput"
        @keyup="onKeyupInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <div
        class="dropdown-menu"
        style="max-height: 400px; overflow: scroll"
        ref="dropdownRef"
      >
        <a
          class="dropdown-item"
          :href="'#' + selectBoxValue.value"
          v-for="selectBoxValue in items"
          :key="selectBoxValue.id"
          ref="dropdownItemRef"
          @click.prevent="onClickAnchor(selectBoxValue)"
          @keydown="onKeydownAnchor"
        >
          {{ selectBoxValue.value }}
        </a>
      </div>

      <label :for="id" :style="'color: ' + errorData.fieldColor">{{
        errorData.fieldLabel
      }}</label>
    </div>
    <slot name="icon"></slot>
  </div>
</template>

<script lang="ts" setup>
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
const emit = defineEmits(["update:modelValue"]);

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

const showDropdown = () => {
  if (!dropdownRef.value?.classList.contains("show"))
    dropdownRef.value?.classList.add("show");
  fieldRef.value?.scrollIntoView();
};

const hideDropdown = () => {
  if (dropdownRef.value?.classList.contains("show"))
    dropdownRef.value?.classList.remove("show");
};

const focusNextInputElement = () => {
  const form = fieldRef.value?.closest("form");
  const inputElements = Array.prototype.filter.call(
    form,
    (i) => i instanceof HTMLInputElement && i.type != "hidden",
  );
  const index = inputElements.indexOf(fieldRef.value);
  nextTick(() => {
    inputElements[index + 1].focus();
  });
};

const getFirstDropdownAnchor = () => {
  return dropdownRef.value?.children
    ? [...dropdownRef.value.children].find(
        (c) => c instanceof HTMLAnchorElement,
      )
    : undefined;
};

const setFieldValue = () => {
  fieldValue.value = props.selectBoxValues.find(
    (sbv) => sbv.id == hiddenValue.value,
  )?.value;
  filterItemList();
};

const onBlur = (event: FocusEvent) => {
  // hide dropdown if the input was left except if the target is the Dropdown-Menu itself
  if (
    dropdownItemRef.value &&
    dropdownItemRef.value?.indexOf(event.relatedTarget as HTMLAnchorElement) < 0
  ) {
    hideDropdown();
    setFieldValue();
  }
};

const onFocus = (event: Event) => {
  // select whole text on focus to easily overtype it, show Dropdown-Menu - needed if source was not a click but a <tab> navigation
  fieldRef.value?.select();
  setTimeout(() => {
    // If onFocus is triggered from ESC inside Dropdown-Menu don't reopen it again.
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

const onKeydownAnchor = async (event: KeyboardEvent) => {
  // select currently focused Dropdown-Menu element
  if (event.key == "Tab") {
    event.preventDefault();
    (event.target as HTMLAnchorElement).click();
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

const onInput = (event: Event) => {
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

const fieldRef = useTemplateRef<HTMLInputElement>("fieldRef");
const hiddenRef = useTemplateRef<HTMLInputElement>("hiddenRef");
const dropdownRef = useTemplateRef<HTMLDivElement>("dropdownRef");
const dropdownItemRef =
  useTemplateRef<Array<HTMLAnchorElement>>("dropdownItemRef");

watch(
  () => props.modelValue,
  () => {
    setFieldValue();
  },
);

onMounted(() => {
  if (props.focus) {
    nextTick(() => {
      fieldRef.value?.focus();
    });
  }
});

watch(
  () => props.selectBoxValues,
  (newVal) => {
    // reset the fieldValue in case its not part of the select-box. But only do that if the hiddenValue is set at all.
    if (hiddenValue.value != undefined) {
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
