<template>
  <label
    for="input"
    :style="'opacity: .65; color: ' + errorData.fieldColor"
    v-if="errorData.fieldLabel"
    ><small>{{ errorData.fieldLabel }}</small></label
  >
  <input
    type="file"
    :class="' form-control ' + errorData.inputClass"
    :id="id"
    multiple
    ref="fileUpload"
    @change="onInput"
  />
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
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
  fieldLabel: {
    type: String,
    required: false,
  },
});
const fileUpload = ref();
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
  syncVModel: true,
});

const onInput = (event: Event) => {
  const filesElement = fileUpload.value as HTMLInputElement;
  const files = filesElement.files;

  setState({ touched: true });
  handleChange(event, true);
  emit("update:modelValue", files);
};

const errorData = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    fieldMeta.touched,
    props.fieldLabel ? props.fieldLabel : "",
    errorMessage.value,
  );
});

onMounted(() => {
  fieldValue.value = props.modelValue;
});
</script>
