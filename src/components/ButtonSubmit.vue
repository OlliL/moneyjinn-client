<template>
  <button type="submit" class="btn btn-primary" :disabled="isDisabled">
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
});
const isDirty = useIsFormDirty();
const isValid = useIsFormValid();

const isDisabled = computed(() => {
  return !isDirty.value || !isValid.value;
});
</script>
