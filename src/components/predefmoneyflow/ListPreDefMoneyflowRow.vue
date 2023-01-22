<template>
  <tr>
    <td class="text-end"><SpanAmount :amount="mpm.amount" /></td>
    <td class="text-start">{{ mpm.contractpartnerName }}</td>
    <td class="text-start">{{ mpm.comment }}</td>
    <td class="text-start">{{ mpm.postingAccountName }}</td>
    <td class="text-start">{{ mpm.capitalsourceComment }}</td>
    <td class="text-center">
      <b :style="'color:' + onceAMonthColor">{{ onceAMonthString }}</b>
    </td>

    <td class="text-center"><SpanDate :date="mpm.createDate" /></td>
    <td class="text-center"><SpanDate :date="mpm.lastUsed" /></td>
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
<script lang="ts" setup>
import { computed, type PropType } from "vue";

import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";

const props = defineProps({
  mpm: {
    type: Object as PropType<PreDefMoneyflow>,
    required: true,
  },
});
const emit = defineEmits(["deletePreDefMoneyflow", "editPreDefMoneyflow"]);

const onceAMonthColor = computed(() => {
  return props.mpm.onceAMonth ? "green" : "red";
});
const onceAMonthString = computed(() => {
  return props.mpm.onceAMonth ? "Ja" : "Nein";
});

const deletePreDefMoneyflow = () => {
  emit("deletePreDefMoneyflow", props.mpm);
};

const editPreDefMoneyflow = () => {
  emit("editPreDefMoneyflow", props.mpm);
};
</script>
