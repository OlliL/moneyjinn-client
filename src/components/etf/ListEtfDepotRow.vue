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
    <td class="text-end mytooltip" v-if="showLumpSum">
      <SpanAmount
        :amount="flow.accumulatedPreliminaryLumpSum * (partial / 100)"
        :decimalPlaces="3"
      />
      <span class="tooltiptext p-3">
        <table class="table table-striped table-bordered table-hover">
          <tr>
            <th scope="col"></th>
            <th scope="col" class="text-center">100%</th>
            <th scope="col" class="text-center" v-if="partial < 100">
              {{ formatNumber(partial, 0) }}%
            </th>
          </tr>
          <tr
            v-for="entry of flow.preliminaryLumpSumPerYear.entries()"
            :key="entry[0]"
          >
            <th scope="row">{{ entry[0] }}</th>
            <td class="text-end">
              <SpanAmount :amount="entry[1]" :decimalPlaces="3" />
            </td>
            <td class="text-end" v-if="partial < 100">
              <SpanAmount
                :amount="entry[1] * (partial / 100)"
                :decimalPlaces="3"
              />
            </td>
          </tr>
          <tr>
            <th class="text-end" scope="row">&sum;</th>
            <td class="text-end">
              <u
                ><SpanAmount
                  :amount="flow.accumulatedPreliminaryLumpSum"
                  :decimalPlaces="3"
              /></u>
            </td>
            <td class="text-end" v-if="partial < 100">
              <u
                ><SpanAmount
                  :amount="flow.accumulatedPreliminaryLumpSum * (partial / 100)"
                  :decimalPlaces="3"
              /></u>
            </td>
          </tr>
        </table>
      </span>
    </td>
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
import { useEtfStore } from "@/stores/EtfStore";

const props = defineProps({
  etfName: {
    type: String,
    required: true,
  },
  flow: {
    type: Object as PropType<EtfFlow>,
    required: true,
  },
  showLumpSum: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["deleteEtfFlow", "editEtfFlow"]);
const etfStore = useEtfStore();
const partial =
  100 - (etfStore.getEtf(props.flow.etfId)?.partialTaxExemption ?? 0);

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

<style scoped>
.mytooltip {
  cursor: pointer;
}

.tooltiptext {
  border-radius: 10px;
  visibility: hidden;
  background-color: #f2f2f2;
  position: absolute;
  z-index: 1;
  border: 1px solid grey;
}

.mytooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
