<template>
  <DivError :server-errors="serverErrors" />
  <div class="fixed left-4 top-1/2 z-20 -translate-y-1/2">
    <Button
      data-testid="reports-previous-month"
      v-if="prevMonth && prevYear"
      type="button"
      variant="outline"
      size="icon"
      class="h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md focus-visible:shadow-md supports-backdrop-filter:bg-background/70"
      @click="navigateToPreviousMonth"
    >
      <ChevronLeft class="h-5 w-5" />
    </Button>
  </div>
  <div class="fixed right-4 top-1/2 z-20 -translate-y-1/2">
    <Button
      data-testid="reports-next-month"
      v-if="nextMonth && nextYear"
      type="button"
      variant="outline"
      size="icon"
      class="h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md focus-visible:shadow-md supports-backdrop-filter:bg-background/70"
      @click="navigateToNextMonth"
    >
      <ChevronRight class="h-5 w-5" />
    </Button>
  </div>

  <div class="flex justify-center" v-if="props.month">
    <div class="w-full max-w-md">
      <div class="px-13 md:px-0">
        <div
          class="rounded-md border mb-4"
          v-if="monthlySettlementsNoCredit.length"
        >
          <Table class="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead class="table-head-cell w-2/3">
                  {{ $t("General.capitalsource") }}
                </TableHead>
                <TableHead
                  class="table-head-cell w-1/3 whitespace-nowrap text-right"
                >
                  {{ $t("General.amount") }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="mms in monthlySettlementsNoCredit" :key="mms.id">
                <TableCell
                  class="border-r text-left truncate"
                  :title="mms.capitalsourceComment"
                >
                  {{ mms.capitalsourceComment }}
                </TableCell>
                <TableCell class="text-right whitespace-nowrap">
                  <SpanAmount :amount="mms.amount" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="text-right border-r font-bold"
                  >&sum;</TableCell
                >
                <TableCell class="text-right whitespace-nowrap">
                  <u><SpanAmount :amount="monthlySettlementNoCreditSum" /></u>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div class="rounded-md border" v-if="monthlySettlementsCredit.length">
          <Table class="table-fixed w-full">
            <TableHeader v-if="monthlySettlementsNoCredit.length">
              <TableRow>
                <TableHead class="table-head-cell w-2/3">
                  {{ $t("General.capitalsource") }}
                </TableHead>
                <TableHead
                  class="table-head-cell w-1/3 whitespace-nowrap text-right"
                >
                  {{ $t("General.amount") }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="mms in monthlySettlementsCredit" :key="mms.id">
                <TableCell
                  class="border-r text-left truncate"
                  :title="mms.capitalsourceComment"
                >
                  {{ mms.capitalsourceComment }}
                </TableCell>
                <TableCell class="text-right whitespace-nowrap">
                  <SpanAmount :amount="mms.amount" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="text-right border-r font-bold"
                  >&sum;</TableCell
                >
                <TableCell class="text-right whitespace-nowrap">
                  <u>
                    <SpanAmount :amount="monthlySettlementCreditSum" />
                  </u>
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
import DivError from "@/components/common/DivError.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import router, { Routes } from "@/router";
import MonthlySettlementService from "@/service/MonthlySettlementService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";

const serverErrors = ref(new Array<string>());

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
});

const dataLoaded = ref(false);
const monthlySettlementsNoCredit = ref([] as Array<MonthlySettlement>);
const monthlySettlementsCredit = ref([] as Array<MonthlySettlement>);
const monthlySettlementNoCreditSum = ref(0);
const monthlySettlementCreditSum = ref(0);
const prevMonth = ref(0);
const prevYear = ref(0);
const nextMonth = ref(0);
const nextYear = ref(0);

const loadMonthlySettlements = (year: number, month: number) => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  MonthlySettlementService.getMonthlySettlementList(year, month)
    .then((response) => {
      monthlySettlementsCredit.value = new Array<MonthlySettlement>();
      monthlySettlementsNoCredit.value = new Array<MonthlySettlement>();
      monthlySettlementCreditSum.value = 0;
      monthlySettlementNoCreditSum.value = 0;
      prevMonth.value = response.prevMonth;
      prevYear.value = response.prevYear;
      nextMonth.value = response.nextMonth;
      nextYear.value = response.nextYear;

      const monthlySettlements = response.monthlySettlements;

      for (let mms of monthlySettlements) {
        if (mms.capitalsourceType === CapitalsourceType.CREDIT) {
          monthlySettlementsCredit.value.push(mms);
          monthlySettlementCreditSum.value += mms.amount;
        } else {
          monthlySettlementsNoCredit.value.push(mms);
          monthlySettlementNoCreditSum.value += mms.amount;
        }
      }
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const navigateToPreviousMonth = () => {
  if (prevMonth.value && prevYear.value)
    router.push({
      name: Routes.ListMonthlySettlements,
      params: {
        year: prevYear.value.toString(),
        month: prevMonth.value.toString(),
      },
    });
};

const navigateToNextMonth = () => {
  if (nextMonth.value && nextYear.value)
    router.push({
      name: Routes.ListMonthlySettlements,
      params: {
        year: nextYear.value.toString(),
        month: nextMonth.value.toString(),
      },
    });
};

onMounted(() => {
  loadMonthlySettlements(props.year, props.month);
});

watch([() => props.year, () => props.month], () => {
  loadMonthlySettlements(props.year, props.month);
});
</script>
