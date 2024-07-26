<template>
  <div ref="fieldRef">
    <InputTest @input="buttonClicked2" :error-message="errorMessage" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, type PropType } from "vue";
import InputTest from "@/components/InputTest.vue";
import { any, type ZodType } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useField } from "vee-validate";

const props = defineProps({
  validationSchema: {
    type: Object as PropType<ZodType>,
    required: false,
    default: any().optional(),
  },
});

const fieldRef = ref();

const fieldId = computed(() => {
  if (fieldRef.value) {
    const inputField = (fieldRef.value as HTMLElement).querySelector("input");
    if (inputField) return inputField.id;
  }
  return "";
});

const {
  meta: fieldMeta,
  errorMessage,
  setState,
  handleChange,
} = useField(fieldId, toTypedSchema(props.validationSchema), {
  syncVModel: true,
});

const buttonClicked2 = (event: Event) => {
  console.log("input", event);
  console.log(fieldMeta);
  setState({ touched: true });
  handleChange(event, true);
};
</script>
