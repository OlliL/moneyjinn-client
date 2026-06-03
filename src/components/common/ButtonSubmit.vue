<template>
  <Button
    variant="default"
    type="submit"
    :form="formId"
    :data-testid="testId"
    class="button-with-icon w-full md:w-auto"
  >
    <slot name="icon"></slot>
    <slot>{{ buttonLabel }}</slot>
  </Button>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";

defineProps<{
    buttonLabel?: string;
    formId?: string;
    testId?: string;
}>();
</script>
