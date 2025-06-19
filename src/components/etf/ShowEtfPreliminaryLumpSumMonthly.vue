<template>
  <table
    class="table table-striped table-bordered table-hover"
    v-if="dataLoaded"
  >
    <colgroup>
      <col style="width: 60%" />
      <col style="width: 40%" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">{{ $t("General.month") }}</th>
        <th scope="col">{{ $t("General.amount") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="month in dataArray" :key="month.month">
        <td class="text-start">{{ month.month }}</td>
        <td class="text-end"><SpanAmount :amount="month.amount" /></td>
      </tr>
      <tr>
        <td class="text-end">&sum;</td>
        <td class="text-end">
          <u><SpanAmount :amount="sum" /></u>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { ref, watch, type PropType } from "vue";

import SpanAmount from "../SpanAmount.vue";

import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

import { getMonthName } from "@/tools/views/MonthName";

const props = defineProps({
  mep: {
    type: Object as PropType<EtfPreliminaryLumpSum>,
    required: false,
  },
});

type RowData = {
  month: string;
  amount: number | undefined;
};

const dataLoaded = ref(false);
const sum = ref(0);
const dataArray = ref({} as Array<RowData>);

const loadEtfPreliminaryLumpSums = (mep?: EtfPreliminaryLumpSum) => {
  dataLoaded.value = false;

  dataArray.value = new Array<RowData>();
  if (mep !== undefined)
    for (let i: number = 1; i <= 12; i++) {
      let amount: number | undefined = 0;
      switch (i) {
        case 1:
          amount = mep.amountJanuary;
          break;
        case 2:
          amount = mep.amountFebruary;
          break;
        case 3:
          amount = mep.amountMarch;
          break;
        case 4:
          amount = mep.amountApril;
          break;
        case 5:
          amount = mep.amountMay;
          break;
        case 6:
          amount = mep.amountJune;
          break;
        case 7:
          amount = mep.amountJuly;
          break;
        case 8:
          amount = mep.amountAugust;
          break;
        case 9:
          amount = mep.amountSeptember;
          break;
        case 10:
          amount = mep.amountOctober;
          break;
        case 11:
          amount = mep.amountNovember;
          break;
        case 12:
          amount = mep.amountDecember;
          break;
      }
      if (amount !== undefined) sum.value = sum.value + amount;
      dataArray.value.push({ month: getMonthName(i), amount: amount });
    }
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
