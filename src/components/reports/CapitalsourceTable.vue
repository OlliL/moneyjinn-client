<template>
  <div class="flex justify-center w-full my-4">
    <div class="relative rounded-md border overflow-hidden w-full">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="text-center hidden md:table-cell">
                {{ $t("Capitalsource.type") }}
              </TableHead>
              <TableHead class="text-center hidden md:table-cell">
                {{ $t("Capitalsource.state") }}
              </TableHead>
              <TableHead class="text-center">{{ $t("General.comment") }}</TableHead>
              <TableHead class="text-center">
                {{ $t("Reports.beginOfMonth") }}
              </TableHead>
              <TableHead class="text-center" v-if="currentMonthIsSettled">
                {{ $t("Reports.endOfMonthFixed") }}
              </TableHead>
              <TableHead class="text-center hidden md:table-cell">
                {{ $t("Reports.endOfMonthCalculated") }}
              </TableHead>
              <TableHead class="text-center" v-if="!currentMonthIsSettled">
                {{ $t("Reports.currentAmount") }}
              </TableHead>
              <TableHead
                class="text-center hidden md:table-cell"
                v-if="!currentMonthIsSettled"
              >
                {{ $t("Reports.state") }}
              </TableHead>
              <TableHead
                class="text-center hidden md:table-cell"
                v-if="currentMonthIsSettled"
              >
                {{ $t("Reports.difference") }}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <CapitalsourceTableRowVue
              v-for="data in capitalsourceData"
              :key="data.capitalsourceComment"
              v-bind="{
                ...data,
                currentMonthIsSettled: currentMonthIsSettled,
              }"
            />
            <TableRow class="font-bold bg-primary/[0.10]">
              <TableCell class="text-right hidden md:table-cell" colspan="3"
                >&sum;</TableCell
              >
              <TableCell class="text-right block md:hidden">&sum;</TableCell>
              <TableCell class="text-right">
                <u><SpanAmount :amount="amountBeginOfMonthFixedSum" /></u>
              </TableCell>
              <TableCell class="text-right" v-if="currentMonthIsSettled">
                <u><SpanAmount :amount="amountEndOfMonthFixedSum" /></u>
              </TableCell>
              <TableCell class="text-right hidden md:table-cell">
                <u><SpanAmount :amount="amountEndOfMonthCalculatedSum" /></u>
              </TableCell>
              <TableCell class="text-right" v-if="!currentMonthIsSettled">
                <u><SpanAmount :amount="amountCurrentSum" /></u>
              </TableCell>
              <TableCell
                class="text-right hidden md:table-cell"
                v-if="currentMonthIsSettled"
              >
                <u><SpanAmount :amount="differenceFixedCalculatedSum" /></u>
              </TableCell>
              <TableCell
                class="text-right hidden md:table-cell"
                v-if="!currentMonthIsSettled"
              >
                &nbsp;
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import CapitalsourceTableRowVue from "./CapitalsourceTableRow.vue";
import SpanAmount from "../SpanAmount.vue";

import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";

const props = defineProps({
  capitalsourceData: {
    type: Array<ReportTurnoverCapitalsource>,
    required: true,
  },
  currentMonthIsSettled: {
    type: Boolean,
    required: true,
  },
});

const amountBeginOfMonthFixedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) => acc + cur.amountBeginOfMonthFixed,
    0,
  );
});
const amountEndOfMonthCalculatedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) => acc + cur.amountEndOfMonthCalculated,
    0,
  );
});
const amountEndOfMonthFixedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) =>
      acc + (cur.amountEndOfMonthFixed ? cur.amountEndOfMonthFixed : 0),
    0,
  );
});
const amountCurrentSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) => acc + (cur.amountCurrent ? cur.amountCurrent : 0),
    0,
  );
});
const differenceFixedCalculatedSum = computed(() => {
  return props.capitalsourceData.reduce(
    (acc, cur) =>
      acc +
      ((cur.amountEndOfMonthFixed ? cur.amountEndOfMonthFixed : 0) -
        cur.amountEndOfMonthCalculated),
    0,
  );
});
</script>
