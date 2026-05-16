<template>
  <div class="flex flex-col rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border-r text-foreground text-center">{{
            $t("General.month")
          }}</TableHead>
          <TableHead class="font-bold text-foreground text-center">{{
            $t("General.amount")
          }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="month in dataArray" :key="month.month">
          <TableCell class="text-left">{{ month.month }}</TableCell>
          <TableCell class="text-right"
            ><SpanAmount :amount="month.amount"
          /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="text-right font-bold">&sum;</TableCell>
          <TableCell class="text-right">
            <u><SpanAmount :amount="sum" /></u>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
