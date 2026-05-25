<template>
  <div
    class="hidden md:flex md:flex-col w-full max-w-lg mx-auto mt-6 mb-4 rounded-md border"
  >
    <Table class="[&_tr:nth-child(even)]:bg-muted [&_td]:!py-1 [&_th]:!py-1">
      <TableHeader>
        <TableRow>
          <TableHead class="table-head-cell"> </TableHead>
          <TableHead class="table-head-cell">
            {{ $t("General.month") }}
          </TableHead>
          <TableHead class="text-center">
            {{ $t("General.year") }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="currentMonthIsSettled">
          <TableHead class="table-head-cell">
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
          <TableHead class="table-head-cell">
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
          <TableHead class="text-center border-r">
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
import SpanAmount from "@/components/common/SpanAmount.vue";
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
import { computed } from "vue";

const props = defineProps<{
  report: Report;
}>();

const assetSourcesWithMovement = computed(() => {
  return (props.report.reportTurnoverCapitalsources ?? []).filter(
    (data) =>
      data.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
      data.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET,
  );
});

const assetSummary = computed(() => {
  return assetSourcesWithMovement.value.reduce(
    (summary, data) => {
      summary.fixedEnding += data.amountEndOfMonthFixed ?? 0;
      summary.fixedBeginning += data.amountBeginOfMonthFixed;
      summary.calculatedDelta +=
        data.amountEndOfMonthCalculated - data.amountBeginOfMonthFixed;
      if (!summary.hasFixedEnd && data.amountEndOfMonthFixed) {
        summary.hasFixedEnd = true;
      }
      return summary;
    },
    {
      fixedEnding: 0,
      fixedBeginning: 0,
      calculatedDelta: 0,
      hasFixedEnd: false,
    } as {
      fixedEnding: number;
      fixedBeginning: number;
      calculatedDelta: number;
      hasFixedEnd: boolean;
    },
  );
});

const assetsMonthlyCalculatedTurnover = computed(
  () => assetSummary.value.calculatedDelta,
);
const assetsMonthlyDifference = computed(
  () =>
    +(assetsMonthlyFixedTurnover.value - assetsMonthlyCalculatedTurnover.value),
);
const assetsYearlyDifference = computed(
  () =>
    +(
      assetsYearlyFixedTurnover.value -
      (props.report.turnoverEndOfYearCalculated ?? 0)
    ),
);

const currentMonthIsSettled = computed(() => assetSummary.value.hasFixedEnd);
const assetsMonthlyFixedTurnover = computed(
  () => +(assetSummary.value.fixedEnding - assetSummary.value.fixedBeginning),
);
const assetsYearlyFixedTurnover = computed(
  () =>
    +(assetSummary.value.fixedEnding - (props.report.amountBeginOfYear ?? 0)),
);
</script>
