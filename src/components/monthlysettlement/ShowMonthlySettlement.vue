<template>
  <DivError :server-errors="serverErrors" />

  <div class="row justify-content-md-center mb-4" v-if="props.month">
    <div class="col-xl-4 col-md-6 col-xs-12">
      <div class="card">
        <div
          class="card-header text-center p-3 d-flex align-items-center justify-content-center"
        >
          <span
            @click="navigateToPreviousMonth"
            :class="[
              'bi bi-caret-left-fill link-primary me-2 fs-3',
              { invisible: !(prevMonth && prevYear) },
            ]"
            style="width: 1.5rem; display: inline-block"
          ></span>
          <h5 class="flex-grow-1 mb-0 text-center">
            {{
              $t("MonthlySettlement.headline", {
                month: monthName,
                year: year,
              })
            }}
          </h5>
          <span
            @click="navigateToNextMonth"
            :class="[
              'bi bi-caret-right-fill link-primary ms-2 fs-3',
              { invisible: !(nextMonth && nextYear) },
            ]"
            style="width: 1.5rem; display: inline-block"
          ></span>
        </div>
        <div class="card-body">
          <table
            class="table table-striped table-bordered table-hover"
            v-if="monthlySettlementsNoCredit.length"
          >
            <colgroup>
              <col style="width: 70%" />
              <col style="width: 30%" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">{{ $t("General.capitalsource") }}</th>
                <th scope="col">{{ $t("General.amount") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mms in monthlySettlementsNoCredit" :key="mms.id">
                <td class="text-start">{{ mms.capitalsourceComment }}</td>
                <td class="text-end"><SpanAmount :amount="mms.amount" /></td>
              </tr>
              <tr>
                <td class="text-end">&sum;</td>
                <td class="text-end">
                  <u><SpanAmount :amount="monthlySettlementNoCreditSum" /></u>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            class="table table-striped table-bordered table-hover"
            v-if="monthlySettlementsCredit.length"
          >
            <colgroup>
              <col style="width: 70%" />
              <col style="width: 30%" />
            </colgroup>
            <thead v-if="!monthlySettlementsNoCredit.length">
              <tr>
                <th scope="col">{{ $t("General.capitalsource") }}</th>
                <th scope="col">{{ $t("General.amount") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mms in monthlySettlementsCredit" :key="mms.id">
                <td class="text-start">{{ mms.capitalsourceComment }}</td>
                <td class="text-end"><SpanAmount :amount="mms.amount" /></td>
              </tr>
              <tr>
                <td class="text-end">&sum;</td>
                <td class="text-end">
                  <u>
                    <SpanAmount :amount="monthlySettlementCreditSum" />
                  </u>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";

import DivError from "../DivError.vue";
import SpanAmount from "../SpanAmount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";

import MonthlySettlementService from "@/service/MonthlySettlementService";
import { getMonthName } from "@/tools/views/MonthName";
import router, { Routes } from "@/router";

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
const monthlySettlementsNoCredit = ref({} as Array<MonthlySettlement>);
const monthlySettlementsCredit = ref({} as Array<MonthlySettlement>);
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
