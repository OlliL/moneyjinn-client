<template>
  <tr>
    <td class="text-start">
      <a :href="flow.chartUrl">{{ flow.name }}</a>
    </td>
    <td class="text-start">
      {{ timestampString }}
    </td>
    <td :class="amountClass">{{ amountString }}</td>
    <td class="text-end"><SpanAmount :amount="flow.price" /></td>
    <td class="text-end"><SpanAmount :amount="flow.amount * flow.price" /></td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="editEtfFlow"
        >bearbeiten</span
      >
    </td>
    <td class="text-center">
      <span role="button" class="link-primary" @click="deleteEtfFlow"
        >l&ouml;schen</span
      >
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";

import SpanAmount from "../SpanAmount.vue";

import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegativeEnd } from "@/tools/views/FormatNumber";

import type { ListDepotRowData } from "./ListDepotRowData";

const props = defineProps({
  flow: {
    type: Object as PropType<ListDepotRowData>,
    required: true,
  },
});

const emit = defineEmits(["deleteEtfFlow", "editEtfFlow"]);

const amountClass = computed(() => {
  return redIfNegativeEnd(props.flow.amount);
});
const amountString = computed(() => {
  return formatNumber(props.flow.amount, 3);
});

const timestampString = computed(() => {
  return (
    formatDateWithTime(props.flow.timestamp) +
    ":" +
    String(props.flow.nanoseconds + 1000000000).substring(1, 4) //80000000 -> 1080000000 -> 080
  );
});

const deleteEtfFlow = () => {
  emit("deleteEtfFlow", props.flow, props.flow.name);
};
const editEtfFlow = () => {
  emit("editEtfFlow", props.flow);
};
</script>
