<template>
  <tr
    v-if="
      mmf.moneyflowSplitEntries == null || mmf.moneyflowSplitEntries.length == 0
    "
  >
    <td :class="redIfPrivate">
      <i
        class="bi bi-card-image link-primary"
        v-if="mmf.hasReceipt"
        @click="showReceipt"
      ></i>
    </td>
    <td><SpanDate :date="mmf.bookingDate" /></td>
    <td class="d-none d-md-table-cell"><SpanDate :date="mmf.invoiceDate" /></td>
    <td colspan="2" class="text-end">
      <SpanAmount :amount="mmf.amount" />
    </td>
    <td class="text-start d-none d-md-table-cell">
      {{ mmf.contractpartnerName }}
    </td>
    <td class="text-start">{{ mmf.comment }}</td>
    <td class="text-start d-none d-md-table-cell">
      {{ mmf.postingAccountName }}
    </td>
    <td class="text-start d-none d-md-table-cell">
      {{ mmf.capitalsourceComment }}
    </td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span class="link-primary" @click="editMoneyflow"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span class="link-primary" @click="deleteMoneyflow"
        ><i class="bi bi-trash"></i
      ></span>
    </td>
    <td colspan="2" v-if="!isOwnMoneyflow"></td>
  </tr>
  <tr v-for="(mse, index) in mmf.moneyflowSplitEntries" :key="mse.id">
    <td :rowspan="rowspan" v-if="index == 0" :class="redIfPrivate">
      <i
        class="bi bi-card-image link-primary"
        v-if="mmf.hasReceipt"
        @click="showReceipt"
      ></i>
    </td>
    <td :rowspan="rowspan" v-if="index == 0">
      <SpanDate :date="mmf.bookingDate" />
    </td>
    <td :rowspan="rowspan" v-if="index == 0" class="d-none d-md-table-cell">
      <SpanDate :date="mmf.invoiceDate" />
    </td>
    <td :rowspan="rowspan" v-if="index == 0" class="text-end">
      <SpanAmount :amount="mmf.amount" />
    </td>
    <td class="text-end">
      <SpanAmount :amount="mse.amount" />
    </td>
    <td
      :rowspan="rowspan"
      v-if="index == 0"
      class="text-start d-none d-md-table-cell"
    >
      {{ mmf.contractpartnerName }}
    </td>
    <td class="text-start">{{ mse.comment }}</td>
    <td class="text-start d-none d-md-table-cell">
      {{ mse.postingAccountName }}
    </td>
    <td
      :rowspan="rowspan"
      v-if="index == 0"
      class="text-start d-none d-md-table-cell"
    >
      {{ mmf.capitalsourceComment }}
    </td>
    <td
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      class="text-center"
    >
      <span class="link-primary" @click="editMoneyflow"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td
      :rowspan="rowspan"
      v-if="index == 0 && isOwnMoneyflow"
      class="text-center"
    >
      <span class="link-primary" @click="deleteMoneyflow"
        ><i class="bi bi-trash"></i
      ></span>
    </td>
    <td
      :rowspan="rowspan"
      colspan="2"
      v-if="index == 0 && !isOwnMoneyflow"
    ></td>
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

const redIfPrivate = computed(() => {
  return props.mmf.private
    ? "table-danger d-none d-md-table-cell"
    : "d-none d-md-table-cell";
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

<style scoped>
@media (max-width: 768px) {
  td {
    padding: 0.25em !important;
  }
}
</style>
