<template>
  <span :class="amountClass">{{ amountString }} &euro;</span>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";

const props = defineProps({
  amount: {
    type: Number,
  },
  decimalPlaces: {
    type: Number,
    default: 2,
  },
});

const amountClass = computed(() => {
  return redIfNegative(props.amount);
});

const amountString = computed(() => {
  return props.amount !== undefined
    ? formatNumber(props.amount, props.decimalPlaces)
    : "";
});
</script>
