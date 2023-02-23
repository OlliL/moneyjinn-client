<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Reports</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col">
        <form action="#">
          <table style="margin: 0 auto">
            <tr>
              <td class="text-right pe-2">
                <select
                  class="form-select"
                  v-model="selectedYear"
                  @change="selectMonth(selectedYear + '')"
                >
                  <option v-for="year in years" :key="year">
                    {{ year }}
                  </option>
                </select>
              </td>
              <td>
                <nav aria-label="Month navigation" v-if="dataLoaded">
                  <ul class="pagination month-selection">
                    <li class="page-item" v-for="month in months" :key="month">
                      <a
                        :class="
                          $props.month == month + ''
                            ? 'page-link active'
                            : 'page-link'
                        "
                        href="#"
                        @click="selectMonth(selectedYear + '', month + '')"
                        >{{ getMonthName(month) }}</a
                      >
                    </li>
                  </ul>
                </nav>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="row">
      <div
        class="col-md-3 text-start g-0"
        style="position: fixed; z-index: 1030; margin-top: 35vh"
      >
        <h1>
          <i
            role="button"
            @click="navigateToPreviousMonth"
            v-if="previousMonthLink"
            class="bi bi-caret-left-fill link-primary"
          ></i>
        </h1>
      </div>
      <div
        class="col-md-3 text-end g-0 offset-md-9"
        style="position: fixed; z-index: 1030; margin-top: 35vh"
      >
        <h1>
          <i
            role="button"
            @click="navigateToNextMonth"
            v-if="nextMonthLink"
            class="bi bi-caret-right-fill link-primary"
          ></i>
        </h1>
      </div>
    </div>
    <ReportTableVue :year="year" :month="month" v-if="year && month" />
    <EtfTableVue :year="year" :month="month" v-if="year && month" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

import router, { Routes } from "@/router";

import DivError from "@/components/DivError.vue";
import EtfTableVue from "@/components/reports/EtfTable.vue";
import ReportTableVue from "@/components/reports/ReportTable.vue";

import { getMonthName } from "@/tools/views/MonthName";

import ReportControllerHandler from "@/handler/ReportControllerHandler";
import { handleBackendError } from "@/tools/views/ThrowError";

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
});

onMounted(() => {
  const year: number | undefined = props.year ? +props.year : undefined;
  const month: number | undefined = props.month ? +props.month : undefined;
  loadData(year, month);
});

const loadData = (year?: number, month?: number) => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  ReportControllerHandler.getAvailableMonth(year, month)
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

onBeforeRouteUpdate((to, from, next) => {
  const year = +to.params.year;
  const month = +to.params.month;
  const isFirstMonth = months.value ? months.value.indexOf(month) == 0 : true;
  const isLastMonth = months.value
    ? months.value.indexOf(month) == months.value.length - 1
    : true;

  if (year != currentlyShownYear.value || isFirstMonth || isLastMonth) {
    loadData(year, month);
  } else {
    nextMonth.value = month + 1;
    nextYear.value = currentlyShownYear.value;

    previousMonth.value = month - 1;
    previousYear.value = currentlyShownYear.value;
  }
  next();
});

const selectMonth = (year: string, month?: string) => {
  router.push({
    name: Routes.ListReports,
    params: { year: year, month: month },
  });
};
</script>
