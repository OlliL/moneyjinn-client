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
      <span role="button" class="link-primary" @click="editMoneyflow">{{
        $t("General.edit")
      }}</span>
    </td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span role="button" class="link-primary" @click="deleteMoneyflow">{{
        $t("General.delete")
      }}</span>
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
      <span role="button" class="link-primary" @click="editMoneyflow">{{
        $t("General.edit")
      }}</span>
    </td>
    <td
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      class="text-center"
    >
      <span role="button" class="link-primary" @click="deleteMoneyflow">{{
        $t("General.delete")
      }}</span>
    </td>
    <td colspan="2" v-if="index == 0 && !isOwnMoneyflow"></td>
  </tr>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";

import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import { useUserSessionStore } from "@/stores/UserSessionStore";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

const props = defineProps({
  mmf: {
    type: Object as PropType<Moneyflow>,
    required: true,
  },
});

const emit = defineEmits(["showReceipt", "deleteMoneyflow", "editMoneyflow"]);

const rowspan = computed(() => {
  if (props.mmf.moneyflowSplitEntries != null) {
    return props.mmf.moneyflowSplitEntries.length;
  }
  return 1;
});
const isOwnMoneyflow = computed(() => {
  const userSessionStore = useUserSessionStore();
  return props.mmf.userId === userSessionStore.getUserId;
});

const showReceipt = () => {
  emit("showReceipt", props.mmf.id);
};
const deleteMoneyflow = () => {
  emit("deleteMoneyflow", props.mmf);
};
const editMoneyflow = () => {
  emit("editMoneyflow", props.mmf);
};
</script>
