<template>
  <span data-testid="dateSpan">{{ fullDateString }}</span>
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

const fullDateString = computed(() =>
  props.date ? formatDate(props.date) : "",
);
</script>
