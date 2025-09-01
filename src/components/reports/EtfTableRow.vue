<template>
  <tr>
    <td class="text-start" v-if="name">
      <a :href="chartUrl">{{ name }}</a>
    </td>
    <td class="text-end">{{ etfFlowAmountSumString }}</td>
    <td class="text-end d-none d-md-table-cell">
      <SpanAmount
        :amount="avgSpentPrice"
        :decimal-places="4"
        v-if="avgSpentPrice"
      />
    </td>
    <td class="text-end d-none d-md-table-cell">
      <SpanAmount :amount="sellPrice" :decimal-places="3" v-if="sellPrice" />
    </td>
    <td class="text-end d-none d-md-table-cell">
      <SpanAmount :amount="buyPrice" :decimal-places="3" v-if="buyPrice" />
    </td>
    <td class="text-end">
      <SpanAmount :amount="spentValue" v-if="spentValue" />
    </td>
    <td class="text-end">
      <SpanAmount :amount="sumSellPrice" v-if="sumSellPrice" />
    </td>
    <td class="text-end">
      <u><SpanAmount :amount="profit" v-if="profit" /></u>
    </td>
    <td class="text-end d-none d-md-table-cell">{{ pricesTimestampString }}</td>
  </tr>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SpanAmount from "../SpanAmount.vue";

import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber } from "@/tools/views/FormatNumber";

const props = defineProps({
  name: {
    type: String,
    required: false,
  },
  chartUrl: {
    type: String,
    required: false,
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
  return props.amount ? props.spentValue / props.amount : undefined;
});
const profit = computed(() => {
  return sumSellPrice.value ? sumSellPrice.value - props.spentValue : undefined;
});
const pricesTimestampString = computed(() => {
  return props.pricesTimestamp ? formatDateWithTime(props.pricesTimestamp) : "";
});
const etfFlowAmountSumString = computed(() => {
  return formatNumber(props.amount, 6);
});
</script>
