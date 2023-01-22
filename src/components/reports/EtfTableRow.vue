<template>
  <tr>
    <td class="text-start">
      <a :href="chartUrl">{{ name }}</a>
    </td>
    <td class="text-end">{{ amount }}</td>
    <td class="text-end">
      <SpanAmount :amount="avgSpentPrice" :decimal-places="4" />
    </td>
    <td class="text-end">
      <SpanAmount :amount="sellPrice" :decimal-places="3" />
    </td>
    <td class="text-end">
      <SpanAmount :amount="buyPrice" :decimal-places="3" />
    </td>
    <td class="text-end"><SpanAmount :amount="spentValue" /></td>
    <td class="text-end"><SpanAmount :amount="sumSellPrice" /></td>
    <td class="text-end">
      <u><SpanAmount :amount="profit" /></u>
    </td>
    <td class="text-end">{{ pricesTimestampString }}</td>
  </tr>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SpanAmount from "../SpanAmount.vue";

import { formatDateWithTime } from "@/tools/views/FormatDate";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  chartUrl: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  spentValue: {
    type: Number,
    required: true,
  },
  buyPrice: {
    type: Number,
    required: false,
  },
  sellPrice: {
    type: Number,
    required: false,
  },
  pricesTimestamp: {
    type: Date,
    required: false,
  },
});

const sumSellPrice = computed(() => {
  return props.sellPrice ? props.amount * props.sellPrice : undefined;
});
const avgSpentPrice = computed(() => {
  return props.spentValue / props.amount;
});
const profit = computed(() => {
  return sumSellPrice.value ? sumSellPrice.value - props.spentValue : undefined;
});
const pricesTimestampString = computed(() => {
  return props.pricesTimestamp ? formatDateWithTime(props.pricesTimestamp) : "";
});
</script>
