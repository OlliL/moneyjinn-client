<template>
  <div
    class="hidden md:block relative rounded-md border overflow-hidden w-full"
  >
    <div class="overflow-x-auto">
      <Table class="[&_tr:nth-child(even)]:bg-muted text-xs md:text-sm">
        <TableHeader>
          <TableRow>
            <TableHead class="table-head-cell">
              {{ $t("Capitalsource.type") }}
            </TableHead>
            <TableHead class="table-head-cell">
              {{ $t("Capitalsource.state") }}
            </TableHead>
            <TableHead class="table-head-cell">{{
              $t("General.comment")
            }}</TableHead>
            <TableHead class="table-head-cell">
              {{ $t("Reports.beginOfMonth") }}
            </TableHead>
            <TableHead class="table-head-cell" v-if="currentMonthIsSettled">
              {{ $t("Reports.endOfMonthFixed") }}
            </TableHead>
            <TableHead class="table-head-cell">
              {{ $t("Reports.endOfMonthCalculated") }}
            </TableHead>
            <TableHead
              class="font-bold text-foreground text-center"
              v-if="!currentMonthIsSettled"
            >
              {{ $t("Reports.currentAmount") }}
            </TableHead>
            <TableHead
              class="text-center border-l"
              v-if="!currentMonthIsSettled"
            >
              {{ $t("Reports.state") }}
            </TableHead>
            <TableHead class="text-center" v-if="currentMonthIsSettled">
              {{ $t("Reports.difference") }}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <CapitalsourceTableDesktopRow
            v-for="data in capitalsourceData"
            :key="data.capitalsourceComment"
            v-bind="{
              ...data,
              currentMonthIsSettled: currentMonthIsSettled,
            }"
          />
          <TableRow class="font-bold">
            <TableCell class="text-right border-r" colspan="3">&sum;</TableCell>
            <TableCell class="text-right border-r">
              <u><SpanAmount :amount="amountBeginOfMonthFixedSum" /></u>
            </TableCell>
            <TableCell class="text-right border-r" v-if="currentMonthIsSettled">
              <u><SpanAmount :amount="amountEndOfMonthFixedSum" /></u>
            </TableCell>
            <TableCell class="text-right border-r">
              <u><SpanAmount :amount="amountEndOfMonthCalculatedSum" /></u>
            </TableCell>
            <TableCell
              class="text-right border-r"
              v-if="!currentMonthIsSettled"
            >
              <u><SpanAmount :amount="amountCurrentSum" /></u>
            </TableCell>
            <TableCell class="text-right" v-if="currentMonthIsSettled">
              <u><SpanAmount :amount="differenceFixedCalculatedSum" /></u>
            </TableCell>
            <TableCell class="text-right" v-if="!currentMonthIsSettled">
              &nbsp;
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
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
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import CapitalsourceTableDesktopRow from "./CapitalsourceTableDesktopRow.vue";

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
