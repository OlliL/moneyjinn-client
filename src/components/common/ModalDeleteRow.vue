<template>
  <TableRow class="hover:bg-transparent border-b last:border-0">
    <TableCell
      class="font-normal text-muted-foreground max-w-[11rem] w-44 pl-4 pr-2 py-3 whitespace-normal break-words"
    >
      {{ label }}
    </TableCell>
    <TableCell :class="valueClassName">
      <slot />
    </TableCell>
  </TableRow>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TableCell, TableRow } from "@/components/ui/table";

const props = withDefaults(
  defineProps<{
    label: string;
    highlightValue?: boolean;
  }>(),
  {
    highlightValue: false,
  },
);

const valueClassName = computed(() => {
  return props.highlightValue
    ? "font-semibold text-foreground pr-4 py-3 text-base"
    : "modal-detail-value";
});
</script>
