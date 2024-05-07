<template>
  <table class="table table-bordered table-hover" v-if="dataLoaded">
    <col style="width: 60%" />
    <col style="width: 40%" />
    <tbody>
      <tr>
        <th>{{ $t("ETFPreliminaryLumpSum.price") }}</th>
        <td class="text-end">
          <SpanAmount
            :amount="etfPreliminaryLumpSum.amountPerPiece"
            :decimal-places="8"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { ref, watch, type PropType } from "vue";

import SpanAmount from "../SpanAmount.vue";

import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

const props = defineProps({
  mep: {
    type: Object as PropType<EtfPreliminaryLumpSum>,
    required: true,
  },
});

const dataLoaded = ref(false);
const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum);

const loadEtfPreliminaryLumpSums = (mep: EtfPreliminaryLumpSum) => {
  dataLoaded.value = false;
  etfPreliminaryLumpSum.value = mep;
  dataLoaded.value = true;
};

watch(
  () => props.mep,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      loadEtfPreliminaryLumpSums(newVal);
    }
  },
  { immediate: true },
);
</script>
