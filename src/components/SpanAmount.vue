<template>
  <span
    :class="amountClass"
    style="white-space: nowrap"
    data-testid="amountSpan"
    >{{ amountString }}</span
  >
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";

const { t } = useI18n();

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
    ? formatNumber(props.amount, props.decimalPlaces) +
        " " +
        t("General.currency")
    : "";
});
</script>
