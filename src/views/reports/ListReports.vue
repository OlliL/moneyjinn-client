<template>
  <div class="container mx-auto py-6 space-y-6">
    <div class="text-center">
      <h4 class="text-xl font-bold">{{ $t("Reports.title.reports") }}</h4>
    </div>
    <div class="flex justify-center">
      <div class="flex flex-wrap items-center justify-center gap-3">
          <div>
            <select
              class="h-9 rounded-md border border-input bg-background px-3 text-sm"
              v-model="selectedYear"
              @change="selectMonth(selectedYear + '')"
            >
              <option v-for="year in years" :key="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div>
            <nav aria-label="Month navigation" v-if="dataLoaded">
              <ul class="month-selection flex flex-wrap justify-center gap-2">
                <li v-for="month in months" :key="month">
                  <router-link
                    :class="
                      $props.month == month + ''
                        ? 'inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm text-primary-foreground'
                        : 'inline-flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-accent'
                    "
                    :to="{
                      name: Routes.ListReports,
                      params: {
                        year: selectedYear,
                        month: month,
                        sortBy: [...sortByMap.keys()][0],
                        sortDirection: [...sortByMap.values()][0]
                          ? 'asc'
                          : 'decs',
                      },
                      force: true,
                    }"
                    >{{ getMonthName(month) }}</router-link
                  >
                </li>
              </ul>
            </nav>
          </div>
      </div>
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="hidden md:block">
      <div class="fixed left-4 top-1/2 z-20 -translate-y-1/2">
        <ChevronLeft
          v-if="previousMonthLink"
          class="h-10 w-10 cursor-pointer text-primary"
          @click="navigateToPreviousMonth"
        />
      </div>
      <div class="fixed right-4 top-1/2 z-20 -translate-y-1/2">
        <ChevronRight
          v-if="nextMonthLink"
          class="h-10 w-10 cursor-pointer text-primary"
          @click="navigateToNextMonth"
        />
      </div>
    </div>
    <ReportTableVue
      :year="year"
      :month="month"
      v-model="sortByMap"
      v-if="year && month"
    />
    <EtfTableVue :year="year" :month="month" v-if="year && month" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { onBeforeRouteUpdate, type RouteParamsGeneric } from "vue-router";

import router, { Routes } from "@/router";

import DivError from "@/components/DivError.vue";
import EtfTableVue from "@/components/reports/EtfTable.vue";
import ReportTableVue from "@/components/reports/ReportTable.vue";

import { getMonthName } from "@/tools/views/MonthName";

import ReportService from "@/service/ReportService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const serverErrors = ref(new Array<string>());

const dataLoaded = ref(false);
const months = ref([] as number[] | undefined);
const years = ref([] as number[] | undefined);
const previousMonth = ref(0 as number | undefined);
const previousYear = ref(0 as number | undefined);
const nextMonth = ref(0 as number | undefined);
const nextYear = ref(0 as number | undefined);
const previousMonthLink = ref(false);
const nextMonthLink = ref(false);
const selectedYear = ref(0);
const currentlyShownYear = ref(0);

const props = defineProps({
  year: {
    type: String,
    default: "",
  },
  month: {
    type: String,
    default: "",
  },
  sortBy: {
    type: String,
    default: "",
  },
  sortDirection: {
    type: String,
    default: "",
  },
});

const sortByMap = ref(new Map<keyof Moneyflow, boolean>());

onMounted(() => {
  const year: number | undefined = props.year ? +props.year : undefined;
  const month: number | undefined = props.month ? +props.month : undefined;
  loadData(year, month);
  updateSortByParams(props);
});

const loadData = (year?: number, month?: number) => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  ReportService.getAvailableMonth(year, month)
    .then((response) => {
      months.value = response.allMonth;
      years.value = response.allYears;

      previousMonth.value = response.previousMonth;
      previousMonthLink.value = response.previousMonthHasMoneyflows === 1;
      previousYear.value = response.previousYear;

      nextMonth.value = response.nextMonth;
      nextMonthLink.value = response.nextMonthHasMoneyflows === 1;
      nextYear.value = response.nextYear;

      selectedYear.value = response.year;

      if (selectedYear.value != currentlyShownYear.value)
        currentlyShownYear.value = selectedYear.value;

      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const navigateToPreviousMonth = () => {
  selectMonth(previousYear.value + "", previousMonth.value + "");
};

const navigateToNextMonth = () => {
  selectMonth(nextYear.value + "", nextMonth.value + "");
};

const updateSortByParams = (params: RouteParamsGeneric) => {
  sortByMap.value.clear();
  if (params.sortBy) {
    sortByMap.value.set(
      params.sortBy as keyof Moneyflow,
      params.sortDirection === "desc",
    );
  } else {
    sortByMap.value.set("bookingDate", false);
  }
};

onBeforeRouteUpdate((to, from) => {
  const year = to.params.year ? +to.params.year : undefined;
  const month = to.params.month ? +to.params.month : 0;
  const isFirstMonth = months.value ? months.value.indexOf(month) == 0 : true;
  const isLastMonth = months.value
    ? months.value.indexOf(month) == months.value.length - 1
    : true;

  updateSortByParams(to.params);

  if (year != currentlyShownYear.value || isFirstMonth || isLastMonth) {
    loadData(year, month);
  } else {
    nextMonth.value = month + 1;
    nextYear.value = currentlyShownYear.value;

    previousMonth.value = month - 1;
    previousYear.value = currentlyShownYear.value;

    if (months.value) {
      if (months.value.indexOf(month) + 1 < months.value.length) {
        nextMonthLink.value = true;
      }
      if (months.value.indexOf(month) > 0) {
        // Check if the list of month has a month before the currently selected month
        previousMonthLink.value = true;
      }
    }
  }
});

const selectMonth = (year: string, month?: string) => {
  router.push({
    name: Routes.ListReports,
    params: {
      year: year,
      month: month,
      sortBy: [...sortByMap.value.keys()][0],
      sortDirection: [...sortByMap.value.values()][0] ? "asc" : "decs",
    },
  });
};
</script>

