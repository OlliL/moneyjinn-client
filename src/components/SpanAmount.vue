<template>
  <span :class="amountClass">{{ amountString }} &euro;</span>
</template>

<script lang="ts" setup>
import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";
import { computed } from "vue";

const props = defineProps({
  amount: {
    type: Number,
    required: true,
  },
});

const amountClass = computed(() => {
  return redIfNegative(props.amount);
});

const amountString = computed(() => {
  return formatNumber(props.amount, 2);
});
</script>
