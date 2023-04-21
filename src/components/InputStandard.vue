<template>
  <div class="input-group" v-if="fieldLabel">
    <div class="form-floating">
      <input
        v-model="fieldValue"
        ref="fieldRef"
        :id="id"
        :type="fieldType"
        :class="'form-control ' + alignmentClass + ' ' + errorData.inputClass"
        :disabled="disabled"
        :step="step"
        :name="name"
        @input="onInput($event)"
      />
      <label :for="id" :style="'color: ' + errorData.fieldColor">{{
        errorData.fieldLabel
      }}</label>
    </div>
    <slot name="icon"></slot>
  </div>
  <div class="input-group" v-else>
    <input
      v-model="fieldValue"
      ref="fieldRef"
      :id="id"
      :type="fieldType"
      :class="'form-control ' + alignmentClass + ' ' + errorData.inputClass"
      :disabled="disabled"
      :step="step"
      :name="name"
      @input="onInput($event)"
    />
    <slot name="icon"></slot>
  </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { toFieldValidator } from "@vee-validate/zod";
import { computed, onMounted, ref, type PropType, type Ref } from "vue";
import { any, type ZodType } from "zod";

import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";

const props = defineProps({
  modelValue: {
    type: undefined,
    required: false,
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
  name: {
    type: String,
    required: false,
  },
  fieldLabel: {
    type: String,
    required: false,
  },
  fieldType: {
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
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  step: {
    type: String,
    requred: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const schema = computed(() => {
  if (props.validationSchemaRef) {
    return toFieldValidator(props.validationSchemaRef.value);
  }
  return toFieldValidator(props.validationSchema);
});

const {
  value: fieldValue,
  meta: fieldMeta,
  errorMessage,
  setState,
  handleChange,
} = useField(props.id, schema);

const onInput = (event: Event) => {
  setState({ touched: true });
  handleChange(event, true);
  emit("update:modelValue", fieldValue.value);
};

const errorData = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    fieldMeta.touched,
    props.fieldLabel ? props.fieldLabel : "",
    errorMessage.value
  );
});

const alignmentClass = props.align ? "text-" + props.align : "";

const fieldRef = ref(null);

onMounted(() => {
  fieldValue.value = props.modelValue;

  if (props.focus) {
    (fieldRef.value as any).focus();
  }
});
</script>
