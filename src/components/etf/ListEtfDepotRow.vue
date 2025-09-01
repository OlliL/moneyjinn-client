<template>
  <tr>
    <td class="text-start">
      {{ timestampString }}
    </td>
    <td class="text-end">
      <span :class="amountClass">{{ amountString }}</span>
    </td>
    <td class="text-end">
      <SpanAmount :amount="flow.price" :decimalPlaces="3" />
    </td>
    <td class="text-end"><SpanAmount :amount="flow.amount * flow.price" /></td>
    <td class="text-center">
      <span class="link-primary" @click="editEtfFlow"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td class="text-center">
      <span class="link-primary" @click="deleteEtfFlow"
        ><i class="bi bi-trash"></i
      ></span>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";

import SpanAmount from "../SpanAmount.vue";

import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";
import type { EtfFlow } from "@/model/etf/EtfFlow";

const props = defineProps({
  etfName: {
    type: String,
    required: true,
  },
  flow: {
    type: Object as PropType<EtfFlow>,
    required: true,
  },
});

const emit = defineEmits(["deleteEtfFlow", "editEtfFlow"]);

const amountClass = computed(() => {
  return redIfNegative(props.flow.amount);
});
const amountString = computed(() => {
  return formatNumber(props.flow.amount, 6);
});

const timestampString = computed(() => {
  return (
    formatDateWithTime(props.flow.timestamp) +
    ":" +
    String(props.flow.nanoseconds + 1000000000).substring(1, 4) //80000000 -> 1080000000 -> 080
  );
});

const deleteEtfFlow = () => {
  emit("deleteEtfFlow", props.flow, props.etfName);
};
const editEtfFlow = () => {
  emit("editEtfFlow", props.flow);
};
</script>
