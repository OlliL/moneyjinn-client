<template>
  <div class="flex justify-center w-full my-4">
    <div :class="[clazz, 'rounded-md border overflow-hidden']">
      <Table
        class="[&_tr:nth-child(even)]:bg-primary/[0.10] [&_td]:!py-1 [&_th]:!py-1"
      >
        <slot name="default"></slot>
      </Table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Table } from "@/components/ui/table";

defineProps({
  clazz: {
    type: String,
    default: "w-full lg:w-3/4",
  },
});
</script>
