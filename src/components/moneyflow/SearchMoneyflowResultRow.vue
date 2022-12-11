<template>
  <tr>
    <td>{{ bookingdateString }}</td>
    <td :class="amountClass">{{ amountString }} &euro;</td>
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
</template>
<script lang="ts">
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { defineComponent, type PropType } from "vue";
import { formatDate } from "@/tools/views/FormatDate";
import { redIfNegativeEnd, formatNumber } from "@/tools/views/FormatNumber";
import { useUserSessionStore } from "@/stores/UserSessionStore";

export default defineComponent({
  name: "SearchMoneyflowResultRow",
  props: {
    mmf: {
      type: Object as PropType<Moneyflow>,
      required: true,
    },
  },
  emits: ["deleteMoneyflow", "editMoneyflow"],
  computed: {
    bookingdateString() {
      return formatDate(this.mmf.bookingDate);
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
  },
});
</script>
