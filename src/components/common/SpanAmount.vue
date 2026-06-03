<template>
  <span :class="[amountClass, 'whitespace-nowrap']" data-testid="amountSpan">{{
    amountString
  }}</span>
</template>

<script lang="ts" setup>
import { toFixed } from "@/tools/math";
import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    amount?: number;
    decimalPlaces?: number;
  }>(),
  {
    decimalPlaces: 2,
  },
);

const amountClass = computed(() => {
  return redIfNegative(toFixed(props.amount ?? 0, props.decimalPlaces));
});

const amountString = computed(() => {
  return props.amount === undefined
    ? ""
    : formatNumber(props.amount, props.decimalPlaces) +
        " " +
        t("General.currency");
});
</script>
