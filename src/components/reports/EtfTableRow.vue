<template>
  <tr>
    <td class="text-left">
      <a :href="chartUrl">{{ name }}</a>
    </td>
    <td class="text-right">{{ amount }}</td>
    <td class="text-right">{{ avgSpentPriceString }} &euro;</td>
    <td class="text-right">{{ sellPriceString }} &euro;</td>
    <td class="text-right">{{ buyPriceString }} &euro;</td>
    <td class="text-right">{{ spentValueString }} &euro;</td>
    <td class="text-right">{{ sumSellPriceString }} &euro;</td>
    <td class="text-right">
      <u>{{ profitString }} &euro;</u>
    </td>
    <td class="text-right">{{ pricesTimestampString }}</td>
  </tr>
</template>

<script lang="ts">
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
      type: String,
      required: true,
    },
  },
  computed: {
    sumSellPrice(): number {
      return this.amount * this.sellPrice;
    },
    sumSellPriceString(): string {
      return new Intl.NumberFormat("de-DE", {
        style: "decimal",
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(this.sumSellPrice);
    },
    avgSpentPriceString(): string {
      return new Intl.NumberFormat("de-DE", {
        style: "decimal",
        useGrouping: true,
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(this.spentValue / this.amount);
    },
    profitString(): string {
      return new Intl.NumberFormat("de-DE", {
        style: "decimal",
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(this.sumSellPrice - this.spentValue);
    },
    sellPriceString(): string {
      return new Intl.NumberFormat("de-DE", {
        style: "decimal",
        useGrouping: true,
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(this.sellPrice);
    },
    buyPriceString(): string {
      return new Intl.NumberFormat("de-DE", {
        style: "decimal",
        useGrouping: true,
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(this.buyPrice);
    },
    spentValueString(): string {
      return new Intl.NumberFormat("de-DE", {
        style: "decimal",
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(this.spentValue);
    },
    pricesTimestampString(): string {
      const dateObj = new Date(this.pricesTimestamp);
      //avoid comma between date and time
      const date = new Intl.DateTimeFormat("default", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(dateObj);
      const time = new Intl.DateTimeFormat("default", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(dateObj);
      return date + " " + time;
    },
  },
});
</script>
