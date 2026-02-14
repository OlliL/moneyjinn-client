<template>
  <tr>
    <td
      :class="redIfPrivate"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow"
    >
      <span class="link-primary" @click="showReceipt" v-if="mmf.hasReceipt"
        ><i class="bi bi-card-image"></i
      ></span>
    </td>
    <td :rowspan="rowspan" v-if="isFirstOfMultipleRowsForSameMoneyflow">
      <SpanDate :date="mmf.bookingDate" />
    </td>
    <td class="text-end"><SpanAmount :amount="mmf.amount" /></td>
    <td
      class="text-start"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow"
    >
      {{ mmf.contractpartnerName }}
    </td>
    <td class="text-start">{{ mmf.comment }}</td>
    <td class="text-start">{{ mmf.postingAccountName }}</td>
    <td
      class="text-start"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow"
    >
      {{ mmf.capitalsourceComment }}
    </td>
    <td
      class="text-center"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && isOwnMoneyflow"
    >
      <span class="link-primary" @click="editMoneyflow"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td
      class="text-center"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && isOwnMoneyflow"
    >
      <span class="link-primary" @click="deleteMoneyflow"
        ><i class="bi bi-trash"></i
      ></span>
    </td>
    <td
      class="text-center"
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && !isOwnMoneyflow"
    >
      <span class="link-primary" @click="listMoneyflow"
        ><i class="bi bi-eye"></i
      ></span>
    </td>
    <td
      :rowspan="rowspan"
      v-if="isFirstOfMultipleRowsForSameMoneyflow && !isOwnMoneyflow"
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
  rowspan: {
    type: Number,
    default: 1,
  },
  isFirstOfMultipleRowsForSameMoneyflow: {
    type: Boolean,
    default: false,
  },
});
const userSessionStore = useUserSessionStore();
const emit = defineEmits([
  "showReceipt",
  "deleteMoneyflow",
  "editMoneyflow",
  "listMoneyflow",
]);
const redIfPrivate = computed(() => {
  return props.mmf.private
    ? "table-danger d-none d-md-table-cell"
    : "d-none d-md-table-cell";
});

const isOwnMoneyflow = computed(() => {
  return props.mmf.userId === userSessionStore.getUserId;
});
const showReceipt = () => {
  emit("showReceipt", props.mmf.id);
};
const deleteMoneyflow = () => {
  emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  emit("editMoneyflow", props.mmf.id);
};
const listMoneyflow = () => {
  emit("listMoneyflow", props.mmf.id);
};
</script>
