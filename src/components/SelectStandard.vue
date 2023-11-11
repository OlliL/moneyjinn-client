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
    <slot name="icon"></slot>
  </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { computed, onMounted, ref, watch, type PropType, type Ref } from "vue";
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

const {
  value: fieldValue,
  meta: fieldMeta,
  errorMessage,
  setState,
  handleChange,
} = useField(props.id, schema, {
  initialValue: props.modelValue,
  syncVModel: true,
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
    errorMessage.value,
  );
});

const fieldRef = ref(null);

onMounted(() => {
  if (props.focus) {
    (fieldRef.value as any).focus();
  }
});

watch(
  () => props.selectBoxValues,
  (newVal, oldVal) => {
    // reset the fieldValue in case its not part of the select-box. But only do that if the fieldValue is set at all.
    if (newVal != oldVal && fieldValue.value) {
      const foundElement = newVal.filter((sbv) => sbv.id == fieldValue.value);
      if (foundElement.length === 0) {
        fieldValue.value = undefined;
      }
    }
  },
);
</script>
