<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("Reports.title.reports") }}</h4>
    </div>

    <div class="flex justify-center">
      <div class="flex flex-wrap items-center justify-center gap-4">
        <div>
          <Select v-model="selectedYear">
            <SelectTrigger class="w-[120px] h-9">
              <SelectValue
                :placeholder="selectedYear ? selectedYear.toString() : ''"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="year in years" :key="year" :value="year">
                {{ year }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <nav aria-label="Month navigation" v-if="dataLoaded">
            <ul class="flex flex-wrap justify-center -space-x-px">
              <li v-for="(month, index) in months" :key="month">
                <router-link
                  :to="{
                    name: Routes.ListReports,
                    params: {
                      year: selectedYear,
                      month: month,
                      sortBy: [...sortByMap.keys()][0],
                      sortDirection: [...sortByMap.values()][0]
                        ? 'desc'
                        : 'asc',
                    },
                  }"
                  :class="[
                    // Gemeinsame Basis-Klassen (Höhe, Text, Borders, Übergänge)
                    'inline-flex h-9 items-center justify-center px-4 text-sm font-medium border border-input transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',

                    // Aktiver Zustand vs. Inaktiver Zustand
                    $props.month == month + ''
                      ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground'
                      : 'bg-background text-foreground',

                    // Steuerung der Ecken (Erstes Element rundet links, letztes rechts, Mitte bleibt eckig)
                    index === 0 ? 'rounded-l-md' : '',
                    index === months!.length - 1 ? 'rounded-r-md' : '',
                    index > 0 && index < months!.length - 1
                      ? 'rounded-none'
                      : '',
                  ]"
                >
                  {{ getMonthName(month) }}
                </router-link>
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
import { onMounted, ref, watch } from "vue";
import { onBeforeRouteUpdate, type RouteParamsGeneric } from "vue-router";

import router, { Routes } from "@/router";

import DivError from "@/components/DivError.vue";
import EtfTableVue from "@/components/reports/EtfTable.vue";
import ReportTableVue from "@/components/reports/ReportTable.vue";

import ReportService from "@/service/ReportService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMonthName } from "@/tools/views/MonthName";

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

watch(
  () => selectedYear.value,
  (newYear) => {
    if (newYear != currentlyShownYear.value) {
      selectMonth(newYear + "");
    }
  },
);

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
