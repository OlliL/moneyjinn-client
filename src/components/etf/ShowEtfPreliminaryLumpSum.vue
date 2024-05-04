<template>
  <DivError :server-errors="serverErrors" />
  <table
    class="table table-striped table-bordered table-hover"
    v-if="dataLoaded"
  >
    <col style="width: 60%" />
    <col style="width: 40%" />
    <thead>
      <tr>
        <th>{{ $t("General.month") }}</th>
        <th>{{ $t("General.amount") }}</th>
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
import { ref, watch } from "vue";

import DivError from "../DivError.vue";
import SpanAmount from "../SpanAmount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

import CrudEtfPreliminaryLumpSumControllerHandler from "@/handler/CrudEtfPreliminaryLumpSumControllerHandler";
import { getMonthName } from "@/tools/views/MonthName";

const serverErrors = ref(new Array<string>());

const props = defineProps({
  etfId: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

type RowData = {
  month: string;
  amount: number;
};

const dataLoaded = ref(false);
const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum);
const sum = ref(0);
const dataArray = ref({} as Array<RowData>);

const loadEtfPreliminaryLumpSums = (etfId: number, year: number) => {
  serverErrors.value = new Array<string>();
  dataLoaded.value = false;
  CrudEtfPreliminaryLumpSumControllerHandler.fetchEtfPreliminaryLumpSum(
    etfId,
    year,
  )
    .then((_etfPreliminaryLumpSum: EtfPreliminaryLumpSum) => {
      etfPreliminaryLumpSum.value = _etfPreliminaryLumpSum;
      dataArray.value = new Array<RowData>();
      for (let i: number = 1; i <= 12; i++) {
        let amount = 0;
        switch (i) {
          case 1:
            amount = etfPreliminaryLumpSum.value.amountJanuary;
            break;
          case 2:
            amount = etfPreliminaryLumpSum.value.amountFebruary;
            break;
          case 3:
            amount = etfPreliminaryLumpSum.value.amountMarch;
            break;
          case 4:
            amount = etfPreliminaryLumpSum.value.amountApril;
            break;
          case 5:
            amount = etfPreliminaryLumpSum.value.amountMay;
            break;
          case 6:
            amount = etfPreliminaryLumpSum.value.amountJune;
            break;
          case 7:
            amount = etfPreliminaryLumpSum.value.amountJuly;
            break;
          case 8:
            amount = etfPreliminaryLumpSum.value.amountAugust;
            break;
          case 9:
            amount = etfPreliminaryLumpSum.value.amountSeptember;
            break;
          case 10:
            amount = etfPreliminaryLumpSum.value.amountOctober;
            break;
          case 11:
            amount = etfPreliminaryLumpSum.value.amountNovember;
            break;
          case 12:
            amount = etfPreliminaryLumpSum.value.amountDecember;
            break;
        }
        sum.value = sum.value + amount;
        dataArray.value.push({ month: getMonthName(i), amount: amount });
      }
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

watch(
  () => props.year,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      loadEtfPreliminaryLumpSums(props.etfId, newVal);
    }
  },
  { immediate: true },
);
</script>
