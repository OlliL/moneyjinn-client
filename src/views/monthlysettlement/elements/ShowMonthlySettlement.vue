<template>
  <DivError :server-errors="serverErrors" />

  <div class="flex justify-center" v-if="props.month">
    <div class="w-full max-w-md">
      <div
        v-if="showHeader"
        class="flex items-center justify-between bg-background border-b p-3"
      >
        <Button
          variant="ghost"
          size="sm"
          @click="navigateToPreviousMonth"
          :disabled="!(prevMonth && prevYear)"
          class="h-8 w-8 cursor-pointer"
        >
          <ChevronLeft class="h-5 w-5" />
        </Button>
        <h5 class="text-xl flex-grow-1 text-center font-bold">
          {{
            $t("MonthlySettlement.headline", {
              month: monthName,
              year: year,
            })
          }}
        </h5>
        <Button
          variant="ghost"
          size="sm"
          @click="navigateToNextMonth"
          :disabled="!(nextMonth && nextYear)"
          class="h-8 w-8 cursor-pointer"
          border-r
        >
          <ChevronRight class="h-5 w-5" />
        </Button>
      </div>
      <div class="p-4">
        <div
          class="flex flex-col rounded-md border mb-4"
          v-if="monthlySettlementsNoCredit.length"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  class="w-2/3 font-bold border-r text-foreground text-center"
                >
                  {{ $t("General.capitalsource") }}
                </TableHead>
                <TableHead class="w-1/3 font-bold text-foreground text-center">
                  {{ $t("General.amount") }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="mms in monthlySettlementsNoCredit" :key="mms.id">
                <TableCell class="border-r text-left">{{
                  mms.capitalsourceComment
                }}</TableCell>
                <TableCell class="text-right"
                  ><SpanAmount :amount="mms.amount"
                /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="text-right border-r font-bold"
                  >&sum;</TableCell
                >
                <TableCell class="text-right">
                  <u><SpanAmount :amount="monthlySettlementNoCreditSum" /></u>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div
          class="flex flex-col rounded-md border"
          v-if="monthlySettlementsCredit.length"
        >
          <Table>
            <TableHeader v-if="monthlySettlementsNoCredit.length">
              <TableRow>
                <TableHead
                  class="w-2/3 font-bold border-r text-foreground text-center"
                  >{{ $t("General.capitalsource") }}</TableHead
                >
                <TableHead
                  class="w-1/3 font-bold text-foreground text-center"
                  >{{ $t("General.amount") }}</TableHead
                >
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="mms in monthlySettlementsCredit" :key="mms.id">
                <TableCell class="border-r text-left">{{
                  mms.capitalsourceComment
                }}</TableCell>
                <TableCell class="text-right"
                  ><SpanAmount :amount="mms.amount"
                /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="text-right border-r font-bold"
                  >&sum;</TableCell
                >
                <TableCell class="text-right">
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
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DivError from "@/components/DivError.vue";
import SpanAmount from "@/components/SpanAmount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";

import router, { Routes } from "@/router";
import MonthlySettlementService from "@/service/MonthlySettlementService";
import { getMonthName } from "@/tools/views/MonthName";

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
  showHeader: {
    type: Boolean,
    default: true,
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

const monthName = computed(() => {
  return getMonthName(props.month);
});

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
