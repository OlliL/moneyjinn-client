<template>
  <div class="mx-auto rounded-md border w-full">
    <Table :class="[clazz, '[&_td]:!py-1 [&_th]:!py-1', $attrs.class]">
      <slot name="default"></slot>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { Table } from "@/components/ui/table";
import { computed } from "vue";

const props = defineProps({
  alternateRowBackground: {
    type: Boolean,
    default: true,
  },
});

defineOptions({
  inheritAttrs: false,
});

const clazz = computed(() => {
  return props.alternateRowBackground
    ? "[&_tr:nth-child(even)]:bg-primary/7"
    : "";
});
</script>
