<template>
  <span>{{ dateString }}</span>
</template>

<script lang="ts" setup>
import { formatDate } from "@/tools/views/FormatDate";
import { computed } from "vue";

const props = defineProps({
  date: {
    type: Date,
    required: false,
  },
});

const dateString = computed(() => {
  return props.date ? formatDate(props.date) : "";
});
</script>
