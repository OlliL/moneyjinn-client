<template>
  <div class="flex justify-center w-full">
    <div class="w-full">
      <div class="block md:hidden w-full space-y-4">
        <Accordion
          type="single"
          collapsible
          class="w-full border rounded-md bg-background"
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
              <span class="text-muted-foreground text-xs block">{{
                $t("Reports.beginOfMonth")
              }}</span>
              <span class="font-semibold"
                ><SpanAmount :amount="amountBeginOfMonthFixedSum"
              /></span>
            </div>

            <div v-if="currentMonthIsSettled">
              <span class="text-muted-foreground text-xs block">{{
                $t("Reports.endOfMonthFixed")
              }}</span>
              <span class="font-semibold"
                ><SpanAmount :amount="amountEndOfMonthFixedSum"
              /></span>
            </div>

            <div>
              <span class="text-muted-foreground text-xs block">{{
                $t("Reports.endOfMonthCalculated")
              }}</span>
              <span class="font-semibold"
                ><SpanAmount :amount="amountEndOfMonthCalculatedSum"
              /></span>
            </div>

            <div v-if="currentMonthIsSettled">
              <span class="text-muted-foreground text-xs block">{{
                $t("Reports.difference")
              }}</span>
              <span class="font-semibold"
                ><SpanAmount :amount="differenceFixedCalculatedSum"
              /></span>
            </div>

            <div v-if="!currentMonthIsSettled">
              <span class="text-muted-foreground text-xs block">{{
                $t("Reports.currentAmount")
              }}</span>
              <span class="font-semibold"
                ><SpanAmount :amount="amountCurrentSum"
              /></span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="hidden md:block relative rounded-md border overflow-hidden w-full"
      >
        <div class="overflow-x-auto">
          <Table class="[&_tr:nth-child(even)]:bg-muted text-xs md:text-sm">
            <TableHeader>
              <TableRow>
                <TableHead
                  class="font-bold border-r text-foreground text-center hidden md:table-cell"
                >
                  {{ $t("Capitalsource.type") }}
                </TableHead>
                <TableHead
                  class="font-bold border-r text-foreground text-center hidden md:table-cell"
                >
                  {{ $t("Capitalsource.state") }}
                </TableHead>
                <TableHead
                  class="font-bold border-r text-foreground text-center"
                  >{{ $t("General.comment") }}</TableHead
                >
                <TableHead
                  class="font-bold border-r text-foreground text-center"
                >
                  {{ $t("Reports.beginOfMonth") }}
                </TableHead>
                <TableHead
                  class="font-bold border-r text-foreground text-center"
                  v-if="currentMonthIsSettled"
                >
                  {{ $t("Reports.endOfMonthFixed") }}
                </TableHead>
                <TableHead
                  class="font-bold border-r text-foreground text-center hidden md:table-cell"
                >
                  {{ $t("Reports.endOfMonthCalculated") }}
                </TableHead>
                <TableHead
                  class="font-bold text-foreground text-center"
                  v-if="!currentMonthIsSettled"
                >
                  {{ $t("Reports.currentAmount") }}
                </TableHead>
                <TableHead
                  class="text-center border-l hidden md:table-cell"
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
              <CapitalsourceTableDesktopRow
                v-for="data in capitalsourceData"
                :key="data.capitalsourceComment"
                v-bind="{
                  ...data,
                  currentMonthIsSettled: currentMonthIsSettled,
                }"
              />
              <TableRow class="font-bold">
                <TableCell
                  class="text-right border-r hidden md:table-cell"
                  colspan="3"
                  >&sum;</TableCell
                >
                <TableCell class="text-right border-r block md:hidden"
                  >&sum;</TableCell
                >
                <TableCell class="text-right border-r">
                  <u><SpanAmount :amount="amountBeginOfMonthFixedSum" /></u>
                </TableCell>
                <TableCell
                  class="text-right border-r"
                  v-if="currentMonthIsSettled"
                >
                  <u><SpanAmount :amount="amountEndOfMonthFixedSum" /></u>
                </TableCell>
                <TableCell class="text-right border-r hidden md:table-cell">
                  <u><SpanAmount :amount="amountEndOfMonthCalculatedSum" /></u>
                </TableCell>
                <TableCell
                  class="text-right border-r"
                  v-if="!currentMonthIsSettled"
                >
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
  </div>
</template>

<script lang="ts" setup>
// Accordion imports hinzufügen
import { Accordion } from "@/components/ui/accordion";
import CapitalsourceTableMobileRow from "./CapitalsourceTableMobileRow.vue";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import { computed } from "vue";
import SpanAmount from "@/components/SpanAmount.vue";
import CapitalsourceTableDesktopRow from "./CapitalsourceTableDesktopRow.vue";

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
