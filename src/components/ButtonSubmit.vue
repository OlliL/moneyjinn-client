<template>
  <Button
    type="submit"
    :form="formId"
    class="flex items-center gap-2 !rounded-md px-6"
  >
    <slot name="icon"></slot>
    {{ buttonLabel }}
  </Button>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";

defineProps({
  buttonLabel: {
    type: String,
    required: false,
  },
  formId: {
    type: String,
    required: false,
  },
});
</script>
