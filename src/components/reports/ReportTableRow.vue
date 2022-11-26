<template>
  <tr v-if="mmf.moneyflowSplitEntries == null">
    <td>
      <i
        class="bi bi-card-image link-primary"
        v-if="mmf.hasReceipt"
        role="button"
        @click="showReceipt"
      ></i>
    </td>
    <td>{{ bookingdateString }}</td>
    <td>{{ invoicedateString }}</td>
    <td colspan="2" :class="amountClass">{{ amountString }} &euro;</td>
    <td class="text-start">{{ mmf.contractpartnerName }}</td>
    <td class="text-start">{{ mmf.comment }}</td>
    <td class="text-start">{{ mmf.postingAccountName }}</td>
    <td class="text-start">
      {{ mmf.capitalsourceComment }}
    </td>
    <td class="text-start" v-if="isOwnMoneyflow">
      <span role="button" class="link-primary" @click="editMoneyflow"
        >bearbeiten</span
      >
    </td>
    <td class="text-start" v-if="isOwnMoneyflow">
      <span role="button" class="link-primary" @click="deleteMoneyflow"
        >l&ouml;schen</span
      >
    </td>
    <td colspan="2" v-if="!isOwnMoneyflow"></td>
  </tr>
  <tr v-for="(mse, index) in mmf.moneyflowSplitEntries" :key="mse.id">
    <td :rowspan="rowspan" v-if="index == 0">
      <i
        class="bi bi-card-image link-primary"
        v-if="mmf.hasReceipt"
        role="button"
        @click="showReceipt"
      ></i>
    </td>
    <td :rowspan="rowspan" v-if="index == 0">{{ bookingdateString }}</td>
    <td :rowspan="rowspan" v-if="index == 0">{{ invoicedateString }}</td>
    <td :rowspan="rowspan" v-if="index == 0" :class="amountClass">
      {{ amountString }} &euro;
    </td>
    <td :class="mseAmountClass(mse.amount)">
      {{ mseAmountString(mse.amount) }} &euro;
    </td>
    <td :rowspan="rowspan" v-if="index == 0" class="text-start">
      {{ mmf.contractpartnerName }}
    </td>
    <td class="text-start">{{ mse.comment }}</td>
    <td class="text-start">{{ mse.postingaccountname }}</td>
    <td :rowspan="rowspan" v-if="index == 0" class="text-start">
      {{ mmf.capitalsourceComment }}
    </td>
    <td
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      class="text-start"
    >
      <span role="button" class="link-primary" @click="editMoneyflow"
        >bearbeiten</span
      >
    </td>
    <td
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      class="text-start"
    >
      <span role="button" class="link-primary" @click="deleteMoneyflow"
        >l&ouml;schen</span
      >
    </td>
    <td colspan="2" v-if="index == 0 && !isOwnMoneyflow"></td>
  </tr>
</template>
<script lang="ts">
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { defineComponent, type PropType } from "vue";
import { formatDate } from "@/tools/views/FormatDate";
import { redIfNegativeEnd, formatNumber } from "@/tools/views/FormatNumber";
import { useUserSessionStore } from "@/stores/UserSessionStore";

export default defineComponent({
  name: "ReportTableRow",
  props: {
    mmf: {
      type: Object as PropType<Moneyflow>,
      required: true,
    },
  },
  emits: ["showReceipt", "deleteMoneyflow", "editMoneyflow"],
  computed: {
    bookingdateString() {
      return formatDate(this.mmf.bookingDate);
    },
    invoicedateString() {
      return formatDate(this.mmf.invoiceDate);
    },
    amountClass(): string {
      return redIfNegativeEnd(this.mmf.amount);
    },
    amountString(): string {
      return formatNumber(this.mmf.amount, 2);
    },
    rowspan(): number {
      if (this.mmf.moneyflowSplitEntries != null) {
        return this.mmf.moneyflowSplitEntries.length;
      }
      return 1;
    },
    amountColspan(): number {
      if (this.mmf.moneyflowSplitEntries == null) {
        return 2;
      }
      return 1;
    },
    isOwnMoneyflow(): boolean {
      const userSessionStore = useUserSessionStore();
      return this.mmf.userId === userSessionStore.getUserId;
    },
  },
  methods: {
    mseAmountString(amount: number): string {
      return formatNumber(amount, 2);
    },
    mseAmountClass(amount: number): string {
      return redIfNegativeEnd(amount);
    },
    showReceipt() {
      this.$emit("showReceipt", this.mmf.id);
    },
    deleteMoneyflow() {
      this.$emit("deleteMoneyflow", this.mmf);
    },
    editMoneyflow() {
      this.$emit("editMoneyflow", this.mmf);
    },
  },
});
</script>
