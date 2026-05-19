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
        'file:mr-2 file:cursor-pointer file:rounded-md file:border file:border-input file:bg-background file:px-2 file:py-1 file:text-sm file:font-medium hover:file:bg-accent',
        isInvalid
          ? 'border-destructive! bg-destructive/3 focus-visible:ring-destructive/15'
          : 'border-input focus-visible:ring-ring',
      ]"
      @change="onInput"
    />

    <p
      v-if="isInvalid"
      class="text-[0.8rem] font-medium text-destructive mt-0.5 text-left ml-1"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toTypedSchema } from "@vee-validate/zod";
import { useField } from "vee-validate";
import { computed, useTemplateRef, type PropType, type Ref } from "vue";
import { any, type ZodType } from "zod";

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

const isInvalid = computed(() => fieldMeta.touched && !!errorMessage.value);
</script>
