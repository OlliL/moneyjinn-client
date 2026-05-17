<template>
  <div class="grid w-full gap-1.5 relative">
    <Label v-if="fieldLabel" :for="id" class="text-left ml-1">
      {{ fieldLabel }}
    </Label>

    <Input
      type="file"
      :id="id"
      :data-testid="id"
      multiple
      ref="fileUpload"
      :class="[
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        errorData.inputClass === 'is-invalid'
          ? '!border-destructive bg-destructive/[0.03] focus-visible:ring-destructive/15'
          : 'border-input focus-visible:ring-ring',
      ]"
      @change="onInput"
    />

    <p
      v-if="errorData.inputClass === 'is-invalid'"
      class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Label } from "@/components/ui/label";
import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";
import { toTypedSchema } from "@vee-validate/zod";
import { useField } from "vee-validate";
import {
  computed,
  onMounted,
  useTemplateRef,
  type PropType,
  type Ref,
} from "vue";
import { any, type ZodType } from "zod";
import Input from "./ui/input/Input.vue";

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
const fileUpload = useTemplateRef<HTMLInputElement>("fileUpload");
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
  const files = fileUpload.value?.files;

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
