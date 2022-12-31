<template>
  <tr>
    <td class="text-start">
      <a :href="chartUrl">{{ name }}</a>
    </td>
    <td class="text-end">{{ amount }}</td>
    <td class="text-end">{{ avgSpentPriceString }}</td>
    <td class="text-end">{{ sellPriceString }}</td>
    <td class="text-end">{{ buyPriceString }}</td>
    <td class="text-end">{{ spentValueString }}</td>
    <td class="text-end">{{ sumSellPriceString }}</td>
    <td :class="profitClass">
      <u>{{ profitString }} </u>
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
  },
  computed: {
    sumSellPrice(): number | undefined {
      return this.sellPrice ? this.amount * this.sellPrice : undefined;
    },
    sumSellPriceString(): string {
      return this.sumSellPrice
        ? formatNumber(this.sumSellPrice, 2) + " \u20AC"
        : "";
    },
    avgSpentPriceString(): string {
      return formatNumber(this.spentValue / this.amount, 4) + " \u20AC";
    },
    profit(): number | undefined {
      return this.sumSellPrice
        ? this.sumSellPrice - this.spentValue
        : undefined;
    },
    profitString(): string {
      return this.profit ? formatNumber(this.profit, 2) + " \u20AC" : "";
    },
    profitClass(): string {
      return redIfNegativeEnd(this.profit);
    },
    sellPriceString(): string {
      return this.sellPrice ? formatNumber(this.sellPrice, 3) + " \u20AC" : "";
    },
    buyPriceString(): string {
      return this.buyPrice ? formatNumber(this.buyPrice, 3) + " \u20AC" : "";
    },
    spentValueString(): string {
      return formatNumber(this.spentValue, 2) + " \u20AC";
    },
    pricesTimestampString(): string {
      return this.pricesTimestamp
        ? formatDateWithTime(this.pricesTimestamp)
        : "";
    },
  },
});
</script>
