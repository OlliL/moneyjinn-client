<template>
  <span data-testid="dateSpan" class="hidden md:inline">{{
    fullDateString
  }}</span>
  <span data-testid="dateSpanShort" class="inline md:hidden">{{
    shortDateString
  }}</span>
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

const fullDateString = computed(() =>
  props.date ? formatDate(props.date) : "",
);

const shortDateString = computed(() =>
  props.date ? formatDate(props.date).slice(0, 6) : "",
);
</script>
