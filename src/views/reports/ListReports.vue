<template>
  <ButtonMobileCreate
    v-if="dataLoadedMonth && dataLoadedReport && dataLoadedEtf"
    data-testid="reports-mobile-create"
    @click="navigateToCreateMoneyflow"
  />
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold hidden md:block">
        {{ $t("Reports.title.report", { month: monthName, year: year }) }}
      </h4>
      <h4 class="text-2xl font-bold md:hidden">
        {{ $t("Reports.title.report") }}
      </h4>
    </div>

    <div class="mx-auto flex w-full max-w-6xl flex-col items-center gap-3">
      <div class="hidden md:flex w-full justify-center">
        <MonthYearDesktopNavigator
          v-show="dataLoadedMonth"
          :years="years ?? []"
          :months="months ?? []"
          :selected-year="selectedYear"
          :selected-month="month"
          @select-year="handleYearSelect"
          @select-month="handleMonthSelect"
        />
      </div>

      <MonthYearMobileNavigator
        :data-loaded="dataLoadedMonth"
        :years="years ?? []"
        :months="months ?? []"
        :selected-year="selectedYear"
        :selected-month="Number(month)"
        test-id-prefix="reports-mobile"
        navigator-test-id-prefix="month-year-nav-mobile"
        title-key="General.displayOptions"
        label-key="General.month"
        select-label-key="General.select"
        @select-year="handleYearSelect"
        @select-month="handleMonthSelect"
        @select-current-month="handleCurrentMonthSelect"
      />
    </div>

    <ButtonChevrons
      test-id-prefix="reports-month"
      :show-previous-chevron="previousMonthLink"
      :show-next-chevron="nextMonthLink"
      @navigate-to-previous="navigateToPreviousMonth"
      @navigate-to-next="navigateToNextMonth"
    />

    <div
      :class="{
        'opacity-100 transition-opacity duration-200':
          dataLoadedEtf && dataLoadedReport,
        'opacity-0 pointer-events-none': !(dataLoadedEtf && dataLoadedReport),
      }"
    >
      <ReportTableVue
        :year="year"
        :month="month"
        v-model:sort-by="sortByMap"
        v-model:data-loaded="dataLoadedReport"
        v-if="year && month"
      />
      <ReportEtfTable
        :year="year"
        :month="month"
        v-if="year && month"
        v-model="dataLoadedEtf"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { onBeforeRouteUpdate, type RouteParamsGeneric } from "vue-router";

import router, { Routes } from "@/router";

import ButtonChevrons from "@/components/common/ButtonChevrons.vue";
import ButtonMobileCreate from "@/components/common/ButtonMobileCreate.vue";
import MonthYearDesktopNavigator from "@/components/navigation/MonthYearDesktopNavigator.vue";
import MonthYearMobileNavigator from "@/components/navigation/MonthYearMobileNavigator.vue";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import ReportService from "@/service/ReportService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import ReportEtfTable from "./elements/ReportEtfTable.vue";
import ReportTableVue from "./elements/ReportTable.vue";

const dataLoadedMonth = ref(false);
const dataLoadedEtf = ref(false);
const dataLoadedReport = ref(false);
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

const props = withDefaults(
  defineProps<{
    year?: string;
    month?: string;
    sortBy?: string;
    sortDirection?: string;
  }>(),
  {
    year: "",
    month: "",
    sortBy: "",
    sortDirection: "",
  },
);

const sortByMap = ref(new Map<keyof Moneyflow, boolean>());

onMounted(() => {
  const year: number | undefined = props.year ? +props.year : undefined;
  const month: number | undefined = props.month ? +props.month : undefined;
  loadData(year, month);
  updateSortByParams(props);
});

const loadData = (year?: number, month?: number) => {
  dataLoadedMonth.value = false;
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

      dataLoadedMonth.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError);
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

const handleCurrentMonthSelect = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  selectMonth(String(currentYear), String(currentMonth));
};

const updateSortByParams = (params: RouteParamsGeneric) => {
  sortByMap.value.clear();
  if (params.sortBy) {
    sortByMap.value.set(
      params.sortBy as keyof Moneyflow,
      params.sortDirection === "asc",
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

const monthName = computed(() =>
  props.month && !Number.isNaN(props.month)
    ? getMonthName(Number(props.month))
    : undefined,
);

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
