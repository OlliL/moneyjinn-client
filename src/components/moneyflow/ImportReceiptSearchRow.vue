<template>
  <tr>
    <td class="">
      <div class="form-check d-flex align-items-center justify-content-center">
        <input
          class="form-check-input"
          type="radio"
          :name="'selectMoneyflow' + receiptId"
          value="{{mmf.id}}"
          :checked="preselected"
          @change="emitSelection"
        />
      </div>
    </td>
    <td>{{ invoicedateString }}</td>
    <td :class="amountClass">{{ amountString }} &euro;</td>
    <td class="text-start">{{ mmf.contractpartnerName }}</td>
    <td class="text-start">{{ mmf.comment }}</td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span role="button" class="link-primary" @click="editMoneyflow"
        >bearbeiten</span
      >
    </td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span role="button" class="link-primary" @click="deleteMoneyflow"
        >l&ouml;schen</span
      >
    </td>
    <td colspan="2" v-if="!isOwnMoneyflow"></td>
  </tr>
</template>
<script lang="ts">
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { defineComponent, type PropType } from "vue";
import { formatDate } from "@/tools/views/FormatDate";
import { redIfNegativeEnd, formatNumber } from "@/tools/views/FormatNumber";
import { useUserSessionStore } from "@/stores/UserSessionStore";

export default defineComponent({
  name: "ImportReceiptSearchRow",
  props: {
    mmf: {
      type: Object as PropType<Moneyflow>,
      required: true,
    },
    preselected: {
      type: Boolean,
      required: true,
    },
    receiptId: {
      type: Number,
      required: true,
    },
  },
  emits: ["deleteMoneyflow", "editMoneyflow", "emitSelection"],
  computed: {
    invoicedateString() {
      return formatDate(this.mmf.invoiceDate);
    },
    amountClass(): string {
      return redIfNegativeEnd(this.mmf.amount);
    },
    amountString(): string {
      return formatNumber(this.mmf.amount, 2);
    },
    isOwnMoneyflow(): boolean {
      const userSessionStore = useUserSessionStore();
      return this.mmf.userId === userSessionStore.getUserId;
    },
  },
  methods: {
    deleteMoneyflow() {
      this.$emit("deleteMoneyflow", this.mmf.id);
    },
    editMoneyflow() {
      this.$emit("editMoneyflow", this.mmf.id);
    },
    emitSelection() {
      this.$emit("emitSelection", this.mmf.id);
    },
  },
});
</script>
