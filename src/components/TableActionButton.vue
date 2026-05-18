<template>
  <TableCell :class="cellClass">
    <Button
      variant="ghost"
      size="icon"
      :title="title"
      :aria-label="ariaLabel || title"
      :class="buttonClass"
      @click="emit('click')"
    >
      <slot />
    </Button>
  </TableCell>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";

defineProps({
  title: {
    type: String,
    required: true,
  },
  ariaLabel: {
    type: String,
    required: false,
  },
  cellClass: {
    type: String,
    required: false,
    default: "w-0 whitespace-nowrap text-center p-0",
  },
  buttonClass: {
    type: String,
    required: false,
    default: "action-icon-button",
  },
});

const emit = defineEmits(["click"]);
</script>


