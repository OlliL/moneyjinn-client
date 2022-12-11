<template>
  <tr>
    <td :class="amountClass">{{ amountString }} &euro;</td>
    <td class="text-start">{{ mpm.contractpartnerName }}</td>
    <td class="text-start">{{ mpm.comment }}</td>
    <td class="text-start">{{ mpm.postingAccountName }}</td>
    <td class="text-start">{{ mpm.capitalsourceComment }}</td>
    <td class="text-center">
      <b :style="'color:' + onceAMonthColor">{{ onceAMonthString }}</b>
    </td>

    <td class="text-center">{{ createDateString }}</td>
    <td class="text-center">{{ lastUsedString }}</td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="editPreDefMoneyflow"
        >bearbeiten</span
      >
    </td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="deletePreDefMoneyflow"
        >l&ouml;schen</span
      >
    </td>
  </tr>
</template>
<script lang="ts">
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { formatDate } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegativeEnd } from "@/tools/views/FormatNumber";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "ListPreDefMoneyflowRow",
  props: {
    mpm: {
      type: Object as PropType<PreDefMoneyflow>,
      required: true,
    },
  },
  emits: [
    "deletePreDefMoneyflow",
    "editPreDefMoneyflow",
    "listPreDefMoneyflowAccounts",
  ],
  computed: {
    createDateString(): string {
      return formatDate(this.mpm.createDate);
    },
    lastUsedString(): string {
      return formatDate(this.mpm.lastUsed);
    },
    onceAMonthColor(): string {
      return this.mpm.onceAMonth ? "green" : "red";
    },
    onceAMonthString(): string {
      return this.mpm.onceAMonth ? "Ja" : "Nein";
    },
    amountClass(): string {
      return redIfNegativeEnd(this.mpm.amount);
    },
    amountString(): string {
      return formatNumber(this.mpm.amount, 2);
    },
  },
  methods: {
    deletePreDefMoneyflow() {
      this.$emit("deletePreDefMoneyflow", this.mpm);
    },
    editPreDefMoneyflow() {
      this.$emit("editPreDefMoneyflow", this.mpm);
    },
  },
});
</script>
