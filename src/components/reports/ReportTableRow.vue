<template>
  <tr>
    <td><i class="bi bi-card-image" v-if="mmf.hasReceipt"></i></td>
    <td>{{ bookingdateString }}</td>
    <td>{{ invoicedateString }}</td>
    <td colspan="2" :class="amountClass">{{ amountString }} &euro;</td>
    <td class="text-start">{{ mmf.contractpartnername }}</td>
    <td class="text-start">{{ mmf.comment }}</td>
    <td class="text-start">{{ mmf.postingaccountname }}</td>
    <td class="text-start">{{ mmf.capitalsourcecomment }}</td>
    <td class="text-start">bearbeiten</td>
    <td class="text-start">l&ouml;schen</td>
  </tr>
</template>
<script lang="ts">
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { defineComponent, type PropType } from "vue";
import { formatDate } from "@/tools/views/FormatDate";
import { redIfNegativeEnd, formatNumber } from "@/tools/views/FormatNumber";

export default defineComponent({
  name: "ReportTableRow",
  props: {
    mmf: {
      type: Object as PropType<Moneyflow>,
      required: true,
    },
  },
  computed: {
    bookingdateString() {
      return formatDate(this.mmf.bookingdate);
    },
    invoicedateString() {
      return formatDate(this.mmf.invoicedate);
    },
    amountClass(): string {
      return redIfNegativeEnd(this.mmf.amount);
    },
    amountString(): string {
      return formatNumber(this.mmf.amount, 2);
    },
  },
});
</script>
