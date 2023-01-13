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
    <td><SpanDate :date="mmf.bookingDate" /></td>
    <td><SpanDate :date="mmf.invoiceDate" /></td>
    <td colspan="2" class="text-end">
      <SpanAmount :amount="mmf.amount" />
    </td>
    <td class="text-start">{{ mmf.contractpartnerName }}</td>
    <td class="text-start">{{ mmf.comment }}</td>
    <td class="text-start">{{ mmf.postingAccountName }}</td>
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
  <tr v-for="(mse, index) in mmf.moneyflowSplitEntries" :key="mse.id">
    <td :rowspan="rowspan" v-if="index == 0">
      <i
        class="bi bi-card-image link-primary"
        v-if="mmf.hasReceipt"
        role="button"
        @click="showReceipt"
      ></i>
    </td>
    <td :rowspan="rowspan" v-if="index == 0">
      <SpanDate :date="mmf.bookingDate" />
    </td>
    <td :rowspan="rowspan" v-if="index == 0">
      <SpanDate :date="mmf.invoiceDate" />
    </td>
    <td :rowspan="rowspan" v-if="index == 0" class="text-end">
      <SpanAmount :amount="mmf.amount" />
    </td>
    <td class="text-end">
      <SpanAmount :amount="mse.amount" />
    </td>
    <td :rowspan="rowspan" v-if="index == 0" class="text-start">
      {{ mmf.contractpartnerName }}
    </td>
    <td class="text-start">{{ mse.comment }}</td>
    <td class="text-start">{{ mse.postingAccountName }}</td>
    <td :rowspan="rowspan" v-if="index == 0" class="text-start">
      {{ mmf.capitalsourceComment }}
    </td>
    <td
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      class="text-center"
    >
      <span role="button" class="link-primary" @click="editMoneyflow"
        >bearbeiten</span
      >
    </td>
    <td
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      class="text-center"
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
import { useUserSessionStore } from "@/stores/UserSessionStore";
import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

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
  components: { SpanAmount, SpanDate },
});
</script>
