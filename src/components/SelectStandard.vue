<template>
  <div class="input-group">
    <div class="form-floating">
      <select
        v-model="fieldValue"
        ref="fieldRef"
        :id="id"
        :class="'form-select form-control ' + errorData.inputClass"
        @input="onInput($event)"
      >
        <option
          v-for="selectBoxValue in selectBoxValues"
          :key="selectBoxValue.id"
          :value="selectBoxValue.id"
        >
          {{ selectBoxValue.value }}
        </option>
      </select>

      <label :for="id" :style="'color: ' + errorData.fieldColor">{{
        errorData.fieldLabel
      }}</label>
    </div>
    <span class="input-group-text" v-if="iconProvided">
      <slot name="icon"></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { toFieldValidator } from "@vee-validate/zod";
import { computed, onMounted, ref, useSlots, type PropType } from "vue";
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

const {
  value: fieldValue,
  meta: fieldMeta,
  errorMessage,
  setState,
  handleChange,
} = useField(props.id, toFieldValidator(props.validationSchema), {
  initialValue: props.modelValue,
});

const onInput = (event: Event) => {
  setState({ touched: true });
  handleChange(event, true);
  emit("update:modelValue", fieldValue.value);
};

const errorData = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    fieldMeta.touched,
    props.fieldLabel,
    errorMessage.value
  );
});

const slots = useSlots();
const iconProvided = slots["icon"] !== undefined;

const fieldRef = ref(null);

onMounted(() => {
  if (props.focus) {
    (fieldRef.value as any).focus();
  }
});
</script>