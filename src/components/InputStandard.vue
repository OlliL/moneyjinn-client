<template>
  <div class="grid w-full gap-1.5 relative">
    <Label v-if="fieldLabel" :for="id" class="text-left ml-1">
      {{ fieldLabel }}
    </Label>

    <div class="flex -space-x-px relative">
      <Input
        v-model="fieldValue"
        :id="id"
        :type="fieldType"
        :class="[
          alignmentClass,
          $slots.icon ? 'rounded-r-none' : '',
          errorData.inputClass == 'is-invalid'
            ? '!border-destructive bg-destructive/[0.03] focus-visible:ring-destructive/15'
            : 'border-input focus-visible:ring-ring',
        ]"
        @input="onInput($event)"
      />

      <div
        v-if="$slots.icon"
        class="flex items-center justify-center px-2 border border-input rounded-r-md text-foreground transition-colors relative"
      >
        <slot name="icon"></slot>
      </div>
    </div>

    <p
      v-if="errorData.inputClass == 'is-invalid'"
      class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  computed,
  nextTick,
  onMounted,
  useTemplateRef,
  type PropType,
  type Ref,
} from "vue";
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
  setState({ touched: true });
  handleChange(event, true);
  emit("update:modelValue", fieldValue.value);
};

const errorData = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    fieldMeta.touched,
    props.fieldLabel ? props.fieldLabel : "",
    errorMessage.value,
  );
});

const alignmentClass = props.align ? "text-" + props.align : "";

const fieldRef = useTemplateRef<HTMLInputElement>("fieldRef");
onMounted(() => {
  fieldValue.value = props.modelValue;

  if (props.focus) {
    nextTick(() => {
      fieldRef.value?.focus();
    });
  }
});
</script>
