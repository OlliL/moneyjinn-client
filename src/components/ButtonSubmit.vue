<template>
  <Button
    variant="default"
    type="submit"
    :form="formId"
    class="button-with-icon"
  >
    <slot name="icon"></slot>
    <slot>{{ buttonLabel }}</slot>
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
