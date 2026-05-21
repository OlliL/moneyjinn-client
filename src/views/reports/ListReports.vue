<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">
        {{ $t("Reports.title.report", { month: monthName, year: year }) }}
      </h4>
    </div>

    <div class="mx-auto flex w-full max-w-4xl flex-col items-center gap-3">
      <div class="hidden md:flex w-full justify-center">
        <MonthYearNavigator
          v-if="dataLoaded"
          :years="years ?? []"
          :months="months ?? []"
          :selected-year="selectedYear"
          :selected-month="month"
          @select-year="handleYearSelect"
          @select-month="handleMonthSelect"
        />
      </div>

      <MobilePeriodSheetNavigator
        :data-loaded="dataLoaded"
        :years="years ?? []"
        :months="months ?? []"
        :selected-year="selectedYear"
        :selected-month="Number(month)"
        test-id-prefix="reports-mobile"
        navigator-test-id-prefix="month-year-nav-mobile"
        title-key="Reports.filterData"
        label-key="General.month"
        select-label-key="General.select"
        @select-year="handleYearSelect"
        @select-month="handleMonthSelect"
      >
        <template #actions>
          <Button
            data-testid="reports-mobile-create"
            type="button"
            @click="navigateToCreateMoneyflow"
          >
            {{ $t("General.new") }}
          </Button>
        </template>
      </MobilePeriodSheetNavigator>

      <DivError :server-errors="serverErrors" />
    </div>

    <div class="hidden md:block">
      <div class="fixed left-4 top-1/2 z-20 -translate-y-1/2">
        <Button
          data-testid="reports-previous-month"
          v-if="previousMonthLink"
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
          v-if="nextMonthLink"
          type="button"
          variant="outline"
          size="icon"
          class="h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md focus-visible:shadow-md supports-backdrop-filter:bg-background/70"
          @click="navigateToNextMonth"
        >
          <ChevronRight class="h-5 w-5" />
        </Button>
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
import { computed, onMounted, ref, watch } from "vue";
import { onBeforeRouteUpdate, type RouteParamsGeneric } from "vue-router";

import router, { Routes } from "@/router";

import DivError from "@/components/DivError.vue";
import MobilePeriodSheetNavigator from "@/components/navigation/MobilePeriodSheetNavigator.vue";
import MonthYearNavigator from "@/components/navigation/MonthYearNavigator.vue";
import { Button } from "@/components/ui/button";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import ReportService from "@/service/ReportService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import EtfTableVue from "./elements/EtfTable.vue";
import ReportTableVue from "./elements/ReportTable.vue";

const serverErrors = ref(new Array<string>());

const dataLoaded = ref(false);
const months = ref([] as number[] | undefined);
const years = ref([] as string[] | undefined);
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
      years.value = response.allYears?.map(String);

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

const navigateToCreateMoneyflow = () => {
  router.push({ name: Routes.CreateMoneyflow });
};

const handleYearSelect = (year: string) => {
  selectMonth(year);
};

const handleMonthSelect = (selectedMonth: number) => {
  selectMonth(String(selectedYear.value), String(selectedMonth));
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

onBeforeRouteUpdate((to) => {
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

watch(
  () => selectedYear.value,
  (newYear) => {
    if (newYear != currentlyShownYear.value) {
      selectMonth(newYear + "");
    }
  },
);

const monthName = computed(() => {
  return props.month && !Number.isNaN(props.month)
    ? getMonthName(Number(props.month))
    : undefined;
});

const selectMonth = (year: string, month?: string) => {
  router.push({
    name: Routes.ListReports,
    params: {
      year: year,
      month: month,
      sortBy: [...sortByMap.value.keys()][0],
      sortDirection: [...sortByMap.value.values()][0] ? "asc" : "desc",
    },
  });
};
</script>
