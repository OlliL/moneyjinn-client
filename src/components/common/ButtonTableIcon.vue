<template>
  <TableCell class="w-0 border-l whitespace-nowrap text-center p-0">
    <Button
      variant="ghost"
      size="icon"
      :title="title"
      :aria-label="title"
      :data-testid="testId"
      class="action-icon-button"
      @click="emit('click')"
    >
      <slot />
    </Button>
  </TableCell>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";

withDefaults(defineProps<{
    title: string;
    testId?: string;
}>(), {
  testId: ""
});

const emit = defineEmits(["click"]);
</script>
