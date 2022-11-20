<template>
  <tr>
    <td class="text-start">
      <a :href="chartUrl">{{ name }}</a>
    </td>
    <td class="text-end">{{ amount }}</td>
    <td class="text-end">{{ avgSpentPriceString }} &euro;</td>
    <td class="text-end">{{ sellPriceString }} &euro;</td>
    <td class="text-end">{{ buyPriceString }} &euro;</td>
    <td class="text-end">{{ spentValueString }} &euro;</td>
    <td class="text-end">{{ sumSellPriceString }} &euro;</td>
    <td :class="profitClass">
      <u>{{ profitString }} &euro;</u>
    </td>
    <td class="text-end">{{ pricesTimestampString }}</td>
  </tr>
</template>

<script lang="ts">
import { redIfNegativeEnd, formatNumber } from "@/tools/views/FormatNumber";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { defineComponent } from "vue";

export default defineComponent({
  name: "EtfTable",
  data() {
    return {};
  },
  props: {
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
      required: true,
    },
    sellPrice: {
      type: Number,
      required: true,
    },
    pricesTimestamp: {
      type: Date,
      required: true,
    },
  },
  computed: {
    sumSellPrice(): number {
      return this.amount * this.sellPrice;
    },
    sumSellPriceString(): string {
      return formatNumber(this.sumSellPrice, 2);
    },
    avgSpentPriceString(): string {
      return formatNumber(this.spentValue / this.amount, 4);
    },
    profit(): number {
      return this.sumSellPrice - this.spentValue;
    },
    profitString(): string {
      return formatNumber(this.profit, 2);
    },
    profitClass(): string {
      return redIfNegativeEnd(this.profit);
    },
    sellPriceString(): string {
      return formatNumber(this.sellPrice, 3);
    },
    buyPriceString(): string {
      return formatNumber(this.buyPrice, 3);
    },
    spentValueString(): string {
      return formatNumber(this.spentValue, 2);
    },
    pricesTimestampString(): string {
      return formatDateWithTime(this.pricesTimestamp);
    },
  },
});
</script>
