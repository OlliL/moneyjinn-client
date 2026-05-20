<template>
  <div
    class="hidden md:flex md:flex-col w-full max-w-lg mx-auto mt-6 mb-4 rounded-md border"
  >
    <Table class="[&_tr:nth-child(even)]:bg-muted [&_td]:!py-1 [&_th]:!py-1">
      <TableHeader>
        <TableRow>
          <TableHead id="thEmpty"></TableHead>
          <TableHead id="thMonth" class="text-center border-l font-bold">
            {{ $t("General.month") }}
          </TableHead>
          <TableHead id="thYear" class="text-center border-l font-bold">
            {{ $t("General.year") }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="currentMonthIsSettled">
          <TableHead class="text-end font-bold border-r" id="thFixedProfit">
            {{ $t("Reports.fixedProfit") }}
          </TableHead>
          <TableCell class="text-end border-r">
            <SpanAmount :amount="assetsMonthlyFixedTurnover" />
          </TableCell>
          <TableCell class="text-end">
            <SpanAmount :amount="assetsYearlyFixedTurnover" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead
            class="text-end font-bold border-r"
            id="thCalculatedProfit"
          >
            {{ $t("Reports.calculatedProfit") }}
          </TableHead>
          <TableCell class="text-end border-r">
            <SpanAmount :amount="assetsMonthlyCalculatedTurnover" />
          </TableCell>
          <TableCell class="text-end">
            <SpanAmount :amount="report.turnoverEndOfYearCalculated" />
          </TableCell>
        </TableRow>
        <TableRow v-if="currentMonthIsSettled">
          <TableHead class="text-end font-bold border-r" id="thDifference">
            {{ $t("Reports.difference") }}
          </TableHead>
          <TableCell class="text-end border-r">
            <SpanAmount :amount="assetsMonthlyDifference" />
          </TableCell>
          <TableCell class="text-end">
            <SpanAmount :amount="assetsYearlyDifference" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
<script lang="ts" setup>
import SpanAmount from "@/components/SpanAmount.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { Report } from "@/model/report/Report";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import { computed } from "vue";

const props = defineProps<{
  report: Report;
}>();

const assetsMonthlyCalculatedTurnover = computed(() => {
  return assetSourcesWithMovement.value.reduce((sum, data) => {
    return (
      sum + (data.amountEndOfMonthCalculated - data.amountBeginOfMonthFixed)
    );
  }, 0);
});
const assetsMonthlyDifference = computed(() => {
  return +(
    assetsMonthlyFixedTurnover.value - assetsMonthlyCalculatedTurnover.value
  );
});
const assetsYearlyDifference = computed(() => {
  return +(
    assetsYearlyFixedTurnover.value -
    (props.report.turnoverEndOfYearCalculated
      ? props.report.turnoverEndOfYearCalculated
      : 0)
  );
});

const currentMonthIsSettled = computed(() => {
  if (props.report.reportTurnoverCapitalsources) {
    for (let data of props.report.reportTurnoverCapitalsources) {
      if (data.amountEndOfMonthFixed) {
        return true;
      }
    }
  }
  return false;
});
const assetSourcesWithMovement = computed(() => {
  if (!props.report.reportTurnoverCapitalsources) {
    return [] as ReportTurnoverCapitalsource[];
  }

  return props.report.reportTurnoverCapitalsources.filter(
    (data) =>
      data.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
      data.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET,
  );
});
const assetsFixAmount = computed(() => {
  return assetSourcesWithMovement.value.reduce((sum, data) => {
    return sum + (data.amountEndOfMonthFixed ?? 0);
  }, 0);
});
const assetsMonthlyFixedTurnover = computed(() => {
  const assetsLastAmount = assetSourcesWithMovement.value.reduce(
    (sum, data) => sum + data.amountBeginOfMonthFixed,
    0,
  );
  return +(assetsFixAmount.value - assetsLastAmount);
});
const assetsYearlyFixedTurnover = computed(() => {
  return +(
    assetsFixAmount.value -
    (props.report.amountBeginOfYear ? props.report.amountBeginOfYear : 0)
  );
});
</script>
