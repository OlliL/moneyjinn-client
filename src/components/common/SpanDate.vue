<template>
  <span data-testid="dateSpan" class="truncate min-w-0">{{
    fullDateString
  }}</span>
</template>

<script lang="ts" setup>
import { formatDate } from "@/tools/views/FormatDate";
import { computed } from "vue";

const props = defineProps<{
    date?: Date;
}>();

const fullDateString = computed(() =>
  props.date ? formatDate(props.date) : "",
);
</script>
