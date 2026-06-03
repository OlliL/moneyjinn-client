<template>
  <div :class="[$attrs.class, 'mx-auto', 'border rounded-md overflow-hidden']">
    <Table :class="[clazz, '[&_td]:!py-1 [&_th]:!py-1']">
      <slot name="default"></slot>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { Table } from "@/components/ui/table";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    alternateRowBackground?: boolean;
  }>(),
  {
    alternateRowBackground: true,
  },
);

defineOptions({
  inheritAttrs: false,
});

const clazz = computed(() => {
  return props.alternateRowBackground ? "[&_tr:nth-child(even)]:bg-muted" : "";
});
</script>
