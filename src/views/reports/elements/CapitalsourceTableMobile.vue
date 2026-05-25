<template>
  <div class="block md:hidden w-full space-y-4">
    <Accordion
      type="single"
      collapsible
      class="w-full rounded-md bg-background space-y-3"
    >
      <CapitalsourceTableMobileRow
        v-for="data in capitalsourceData"
        :key="data.capitalsourceComment"
        v-bind="{
          ...data,
          currentMonthIsSettled: currentMonthIsSettled,
        }"
      />
    </Accordion>

    <div class="border rounded-md p-4 bg-muted/30 space-y-2 text-sm">
      <div
        class="font-bold border-b pb-1 text-xs uppercase tracking-wider text-muted-foreground"
      >
        {{ $t("Reports.overallSums") }}
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <span class="text-xs-muted block">{{
            $t("Reports.beginOfMonth")
          }}</span>
          <span class="font-semibold"
            ><SpanAmount :amount="amountBeginOfMonthFixedSum"
          /></span>
        </div>

        <div v-if="currentMonthIsSettled">
          <span class="text-xs-muted block">{{
            $t("Reports.endOfMonthFixed")
          }}</span>
          <span class="font-semibold"
            ><SpanAmount :amount="amountEndOfMonthFixedSum"
          /></span>
        </div>

        <div>
          <span class="text-xs-muted block">{{
            $t("Reports.endOfMonthCalculated")
          }}</span>
          <span class="font-semibold"
            ><SpanAmount :amount="amountEndOfMonthCalculatedSum"
          /></span>
        </div>

        <div v-if="currentMonthIsSettled">
          <span class="text-xs-muted block">{{
            $t("Reports.difference")
          }}</span>
          <span class="font-semibold"
            ><SpanAmount :amount="differenceFixedCalculatedSum"
          /></span>
        </div>

        <div v-if="!currentMonthIsSettled">
          <span class="text-xs-muted block">{{
            $t("Reports.currentAmount")
          }}</span>
          <span class="font-semibold"
            ><SpanAmount :amount="amountCurrentSum"
          /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import { Accordion } from "@/components/ui/accordion";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import CapitalsourceTableMobileRow from "./CapitalsourceTableMobileRow.vue";

const props = defineProps<{
  capitalsourceData: Array<ReportTurnoverCapitalsource>;
  currentMonthIsSettled: boolean;
  amountBeginOfMonthFixedSum: number;
  amountEndOfMonthCalculatedSum: number;
  amountEndOfMonthFixedSum: number;
  amountCurrentSum: number;
  differenceFixedCalculatedSum: number;
}>();
</script>
