<template>
  <tr v-if="mmf">
    <th>Datenbank</th>
    <td>{{ mmfBookingdateString }}</td>
    <td>{{ mmfInvoicedateString }}</td>
    <td :class="mmfAmountClass">{{ mmfAmountString }} &euro;</td>
    <td class="text-start">{{ mmf.contractpartnerName }}</td>
    <td class="text-start">{{ mmf.comment }}</td>
    <td class="text-start">
      {{ mmf.capitalsourceComment }}
    </td>
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
  <tr v-if="importData">
    <th>Quelle</th>
    <td>{{ importDataBookingdateString }}</td>
    <td>{{ importDataInvoicedateString }}</td>
    <td :class="mmfAmountClass">{{ importDataAmountString }} &euro;</td>
    <td class="text-start">{{ importData.partner }}</td>
    <td class="text-start">{{ importData.comment }}</td>
    <td class="text-start">
      {{ capitalsourceComment }}
    </td>
    <td colspan="2"></td>
  </tr>
  <tr style="border-bottom: 2px solid #000"></tr>
</template>
<script lang="ts">
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { defineComponent, type PropType } from "vue";
import { formatDate } from "@/tools/views/FormatDate";
import { redIfNegativeEnd, formatNumber } from "@/tools/views/FormatNumber";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import type { CompareDataDataset } from "@/model/comparedata/CompareDataDataset";

export default defineComponent({
  name: "CompareDataResultRow",
  props: {
    mmf: {
      type: Object as PropType<Moneyflow>,
      required: false,
    },
    importData: {
      type: Object as PropType<CompareDataDataset>,
      required: false,
    },
    capitalsourceComment: {
      type: String,
      required: true,
    },
  },
  emits: ["deleteMoneyflow", "editMoneyflow"],
  computed: {
    mmfBookingdateString() {
      return this.mmf ? formatDate(this.mmf.bookingDate) : "";
    },
    mmfInvoicedateString() {
      return this.mmf && this.mmf.invoiceDate
        ? formatDate(this.mmf.invoiceDate)
        : "";
    },
    mmfAmountClass(): string {
      return this.mmf ? redIfNegativeEnd(this.mmf.amount) : "";
    },
    mmfAmountString(): string {
      return this.mmf ? formatNumber(this.mmf.amount, 2) : "";
    },
    isOwnMoneyflow(): boolean {
      const userSessionStore = useUserSessionStore();
      return this.mmf ? this.mmf.userId === userSessionStore.getUserId : false;
    },
    importDataBookingdateString() {
      return this.importData ? formatDate(this.importData.bookingDate) : "";
    },
    importDataInvoicedateString() {
      return this.importData && this.importData.invoiceDate
        ? formatDate(this.importData.invoiceDate)
        : "";
    },
    importDataAmountClass(): string {
      return this.importData ? redIfNegativeEnd(this.importData.amount) : "";
    },
    importDataAmountString(): string {
      return this.importData ? formatNumber(this.importData.amount, 2) : "";
    },
  },
  methods: {
    deleteMoneyflow() {
      if (this.mmf) this.$emit("deleteMoneyflow", this.mmf.id);
    },
    editMoneyflow() {
      if (this.mmf) this.$emit("editMoneyflow", this.mmf.id);
    },
  },
});
</script>
