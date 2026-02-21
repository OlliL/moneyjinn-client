<template>
  <table class="table table-striped table-bordered table-hover">
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
import { computed, type PropType } from "vue";

import SpanAmount from "../SpanAmount.vue";

import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

import { getMonthName } from "@/tools/views/MonthName";

const props = defineProps({
  mep: {
    type: Object as PropType<EtfPreliminaryLumpSum>,
    required: true,
  },
});

type RowData = {
  month: string;
  amount: number | undefined;
};

const dataArray = computed<Array<RowData>>(() => {
  const amounts = [
    props.mep.amountJanuary,
    props.mep.amountFebruary,
    props.mep.amountMarch,
    props.mep.amountApril,
    props.mep.amountMay,
    props.mep.amountJune,
    props.mep.amountJuly,
    props.mep.amountAugust,
    props.mep.amountSeptember,
    props.mep.amountOctober,
    props.mep.amountNovember,
    props.mep.amountDecember,
  ];
  return amounts.map((amount, idx) => ({
    month: getMonthName(idx + 1),
    amount,
  }));
});

const sum = computed(() => {
  return dataArray.value.reduce((acc, row) => acc + (row.amount ?? 0), 0);
});
</script>
