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

// 1. Das normale, volle Datum (z.B. "04.05.2026")
const fullDateString = computed(() => {
  return props.date ? formatDate(props.date) : "";
});

// 2. Das gekürzte Datum für kleine Bildschirme (Schneidet das Jahr ab, z.B. "04.05.")
const shortDateString = computed(() => {
  if (!props.date) return "";
  const fullStr = formatDate(props.date); // Liefert z.B. "04.05.2026"

  // Da das Format immer DD.MM.YYYY ist, nehmen wir einfach die ersten 6 Zeichen ("04.05.")
  return fullStr.slice(0, 6);
});
</script>
