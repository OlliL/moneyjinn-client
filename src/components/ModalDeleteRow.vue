<template>
  <TableRow class="modal-detail-row">
    <TableCell class="modal-detail-label">
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

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  highlightValue: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const valueClassName = computed(() => {
  return props.highlightValue ? "modal-detail-value-emphasis" : "modal-detail-value";
});
</script>


