<template>
  <DeleteMonthlySettlementModal />
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">
        {{
          $t("MonthlySettlement.headline", {
            month: monthName,
            year: selectedYear,
          })
        }}
      </h4>
    </div>

    <ListMonthlySettlementsMobile
      :data-loaded="dataLoaded"
      :years="years"
      :months="months"
      :selected-year="selectedYear"
      :selected-month="selectedMonth"
      :can-edit-or-delete="canEditOrDelete"
      @select-year="selectYear"
      @select-month="selectMonth"
      @select-current-month="selectCurrentMonth"
    />

    <ListMonthlySettlementsDesktop
      :data-loaded="dataLoaded"
      :years="years"
      :months="months"
      :selected-year="selectedYear"
      :selected-month="selectedMonth"
      :can-edit-or-delete="canEditOrDelete"
      @select-year="selectYear"
      @select-month="selectMonth"
    />

    <div v-if="dataLoaded" class="space-y-4">
      <ButtonChevrons
        test-id-prefix="show-monthlysettlement-month"
        :show-previous-chevron="prevMonth > 0 && prevYear > 0"
        :show-next-chevron="nextMonth > 0 && nextYear > 0"
        @navigate-to-previous="navigateToPreviousMonth"
        @navigate-to-next="navigateToNextMonth"
      />
      <ShowMontlySettlementVue :monthly-settlements="monthlySettlements" />
    </div>
    <!---->
  </div>
</template>

<script lang="ts" setup>
import ButtonChevrons from "@/components/common/ButtonChevrons.vue";
import { useEditMonthlySettlementModalStore } from "@/components/monthlysettlement/EditMonthlySettlementModal.store";
import { MonthlySettlementModalActionsKey } from "@/model/CrudActions";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import router, { Routes } from "@/router";
import MonthlySettlementService from "@/service/MonthlySettlementService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { computed, onMounted, provide, ref, toRaw } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useDeleteMonthlySettlementModalStore } from "./elements/DeleteMonthlySettlementModal.store";
import DeleteMonthlySettlementModal from "./elements/DeleteMonthlySettlementModal.vue";
import ListMonthlySettlementsDesktop from "./elements/ListMonthlySettlementsDesktop.vue";
import ListMonthlySettlementsMobile from "./elements/ListMonthlySettlementsMobile.vue";
import ShowMontlySettlementVue from "./elements/ShowMonthlySettlement.vue";

const props = withDefaults(
  defineProps<{
    year?: string;
    month?: string;
  }>(),
  {
    year: undefined,
    month: undefined,
  },
);

const dataLoaded = ref(false);
const months = ref([] as number[]);
const years = ref([] as number[]);
const selectedYear = ref("0");
const selectedMonth = ref(0);
const monthlySettlements = ref([] as Array<MonthlySettlement>);
const prevMonth = ref(0);
const prevYear = ref(0);
const nextMonth = ref(0);
const nextYear = ref(0);
const canEditOrDelete = computed(() => selectedMonth.value > 0);
const { openDelete: openDeleteMonthlySettlement } =
  useDeleteMonthlySettlementModalStore();
const { openCreateMonthlySettlement, openEditMonthlySettlement } =
  useEditMonthlySettlementModalStore();

provide(MonthlySettlementModalActionsKey, {
  create: () => showEditMonthlySettlementModal(),
  edit: () =>
    showEditMonthlySettlementModal(
      Number(selectedYear.value),
      selectedMonth.value,
    ),
  delete: () => showDeleteMonthlySettlementModal(),
});

onMounted(() => {
  const year = props.year ? props.year : undefined;
  const month: number | undefined = props.month ? +props.month : undefined;
  loadMonth(year, month);
});

const monthName = computed(() =>
  selectedMonth.value ? getMonthName(selectedMonth.value) : "",
);

const loadMonth = (year?: string, month?: number) => {
  dataLoaded.value = false;
  MonthlySettlementService.getAvailableMonth(Number(year), month)
    .then((response) => {
      months.value = response.allMonth;
      years.value = response.allYears;
      selectedYear.value = response.year.toString();
      selectedMonth.value = Number(response.month);

      return loadSettlements(Number(selectedYear.value), selectedMonth.value);
    })
    .then(() => {
      if (year !== selectedYear.value || month !== selectedMonth.value) {
        updateRoute(selectedYear.value, selectedMonth.value);
      }
      dataLoaded.value = true;
    })
    .catch((e) => {
      handleBackendError(e);
    });
};

const loadSettlements = (year: number, month: number) =>
  MonthlySettlementService.getMonthlySettlementList(year, month)
    .then((response) => {
      monthlySettlements.value = response.monthlySettlements;
      prevMonth.value = response.prevMonth;
      prevYear.value = response.prevYear;
      nextMonth.value = response.nextMonth;
      nextYear.value = response.nextYear;
    })
    .catch((e) => {
      handleBackendError(e);
    });

onBeforeRouteUpdate((to) => {
  const year = to.params.year?.toString();
  const month = to.params.month ? Number(to.params.month) : 0;
  if (selectedYear.value !== year || !months.value.includes(month)) {
    loadMonth(year, month);
  } else {
    selectedMonth.value = month;
    loadSettlements(Number(selectedYear.value), month);
  }
});

const updateRoute = (year?: string | number, month?: string | number) => {
  router.push({
    name: Routes.ListMonthlySettlements,
    params: { year: year, month: month },
  });
};

const navigateToPreviousMonth = () =>
  updateRoute(prevYear.value, prevMonth.value);
const navigateToNextMonth = () => updateRoute(nextYear.value, nextMonth.value);

const showEditMonthlySettlementModal = (year?: number, month?: number) => {
  if (year === undefined && month === undefined) {
    openCreateMonthlySettlement(monthlySettlementUpserted);
    return;
  }

  openEditMonthlySettlement(year, month, monthlySettlementUpserted);
};

const selectYear = (year: string) => updateRoute(year);

const selectMonth = (month: number) => {
  const targetMonth = months.value.includes(month)
    ? month
    : months.value.at(-1);
  updateRoute(selectedYear.value, targetMonth);
};

const selectCurrentMonth = () => {
  const today = new Date();
  const currentYear = String(today.getFullYear());
  let currentMonth = today.getMonth() + 1;

  if (
    currentYear == selectedYear.value &&
    months.value.length > 0 &&
    !months.value.includes(currentMonth)
  ) {
    currentMonth = months.value.at(-1)!;
  }
  updateRoute(currentYear, currentMonth);
};

const monthlySettlementUpserted = (year: number, month: number) => {
  selectedMonth.value = 0;
  updateRoute(year, month);
};

const showDeleteMonthlySettlementModal = () => {
  openDeleteMonthlySettlement(
    structuredClone(toRaw(monthlySettlements.value)),
    monthlySettlementDeleted,
  );
};

const monthlySettlementDeleted = (settlements: MonthlySettlement[]) => {
  const params = months.value.length > 1 ? { year: settlements[0].year } : {};
  updateRoute(params.year);
};
</script>
