<template>
  <span>{{ dateString }}</span>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { formatDate } from "@/tools/views/FormatDate";

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
