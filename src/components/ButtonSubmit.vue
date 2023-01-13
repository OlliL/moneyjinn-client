<template>
  <button
    type="submit"
    class="btn btn-primary"
    :disabled="isDisabled"
    :form="formId"
  >
    <slot name="icon"></slot>{{ buttonLabel }}
  </button>
</template>

<script lang="ts" setup>
import { useIsFormDirty, useIsFormValid } from "vee-validate";
import { computed } from "vue";

defineProps({
  buttonLabel: {
    type: String,
    required: true,
  },
  formId: {
    type: String,
    required: false,
  },
});

const isDirty = useIsFormDirty();
const isValid = useIsFormValid();

const isDisabled = computed(() => {
  return !isDirty.value || !isValid.value;
});
</script>
