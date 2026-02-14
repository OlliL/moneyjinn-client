<template>
  <div class="container-fluid">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4 text-center">
        <h4>{{ $t("Reports.title.reports") }}</h4>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-auto mb-3">
        <div class="row">
          <div class="col-md-auto">
            <select
              class="form-select"
              v-model="selectedYear"
              @change="selectMonth(selectedYear + '')"
            >
              <option v-for="year in years" :key="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="col">
            <nav aria-label="Month navigation" v-if="dataLoaded">
              <ul class="pagination month-selection flex-wrap">
                <li class="page-item" v-for="month in months" :key="month">
                  <router-link
                    :class="
                      $props.month == month + ''
                        ? 'page-link active'
                        : 'page-link'
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
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="row d-none d-md-block">
      <div
        class="col-md-3 text-start g-0"
        style="position: fixed; z-index: 1030; margin-top: 35vh"
      >
        <span
          @click="navigateToPreviousMonth"
          v-if="previousMonthLink"
          class="bi bi-caret-left-fill link-primary"
        ></span>
      </div>
      <div
        class="col-md-3 text-end g-0 offset-md-9"
        style="position: fixed; z-index: 1030; margin-top: 35vh"
      >
        <span
          @click="navigateToNextMonth"
          v-if="nextMonthLink"
          class="bi bi-caret-right-fill link-primary"
        ></span>
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
});

const loadData = (year?: number, month?: number) => {
  serverErrors.value = new Array<string>();
  updateSortByParams(props);

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

onBeforeRouteUpdate((to, from, next) => {
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
  next();
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

<style scoped>
span.bi {
  font-size: 2.5rem;
}
</style>
