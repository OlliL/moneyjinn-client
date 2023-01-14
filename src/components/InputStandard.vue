<template>
  <div class="input-group">
    <div class="form-floating">
      <input
        v-model="fieldValue"
        ref="fieldRef"
        :id="id"
        :type="type"
        :class="'form-control ' + alignmentClass + ' ' + errorData.inputClass"
        @input="onInput($event)"
      />
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
import type { ZodType } from "zod";

import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
  validationSchema: {
    type: Object as PropType<ZodType>,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  fieldLabel: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  focus: {
    type: Boolean,
    required: false,
    default: false,
  },
  align: {
    type: String,
    required: false,
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

const onInput = (event: any) => {
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
const alignmentClass = props.align ? "text-" + props.align : "";

const fieldRef = ref(null);

onMounted(() => {
  if (props.focus) {
    (fieldRef.value as any).focus();
  }
});
</script>
