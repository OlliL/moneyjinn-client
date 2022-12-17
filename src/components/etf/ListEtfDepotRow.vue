<template>
  <tr>
    <td class="text-start">
      <a :href="flow.chartUrl">{{ flow.name }}</a>
    </td>
    <td class="text-start">
      {{ timestampString }}
    </td>
    <td :class="amountClass">{{ amountString }}</td>
    <td class="text-end">{{ priceString }} &euro;</td>
    <td :class="amountPriceClass">{{ amountPriceString }} &euro;</td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="editEtfFlow"
        >bearbeiten</span
      >
    </td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="deleteEtfFlow"
        >l&ouml;schen</span
      >
    </td>
  </tr>
</template>
<script lang="ts">
import type { ListDepotRowData } from "./ListDepotRowData";
import { defineComponent, type PropType } from "vue";
import { formatNumber, redIfNegativeEnd } from "@/tools/views/FormatNumber";
import { formatDateWithTime } from "@/tools/views/FormatDate";

export default defineComponent({
  name: "ListEtfFlowRow",
  props: {
    flow: {
      type: Object as PropType<ListDepotRowData>,
      required: true,
    },
  },
  emits: ["deleteEtfFlow", "editEtfFlow"],
  computed: {
    amountClass() {
      return redIfNegativeEnd(this.flow.amount);
    },
    amountPriceClass() {
      return redIfNegativeEnd(this.flow.amount);
    },
    amountString() {
      return formatNumber(this.flow.amount, 3);
    },
    priceString() {
      return formatNumber(this.flow.price, 3);
    },
    amountPriceString() {
      return formatNumber(this.flow.amount * this.flow.price, 2);
    },
    timestampString() {
      return (
        formatDateWithTime(this.flow.timestamp) +
        ":" +
        String(this.flow.nanoseconds + 1000000000).substring(1, 4) //80000000 -> 1080000000 -> 080
      );
    },
  },
  methods: {
    deleteEtfFlow() {
      this.$emit("deleteEtfFlow", this.flow, this.flow.name);
    },
    editEtfFlow() {
      this.$emit("editEtfFlow", this.flow, this.flow.name);
    },
  },
});
</script>
