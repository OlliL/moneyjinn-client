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

    <DivError :server-errors="serverErrors" />

    <ShowMontlySettlementVue
      v-if="dataLoaded"
      :year="Number(selectedYear)"
      :month="selectedMonth"
    />
    <!---->
  </div>
</template>

<script lang="ts" setup>
import DivError from "@/components/common/DivError.vue";
import { useEditMonthlySettlementModalStore } from "@/components/monthlysettlement/EditMonthlySettlementModal.store";
import { MonthlySettlementModalActionsKey } from "@/model/CrudActions";
import router, { Routes } from "@/router";
import MonthlySettlementService from "@/service/MonthlySettlementService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { computed, onMounted, provide, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import useDeleteMonthlySettlementModalStore from "./elements/DeleteMonthlySettlementModal.store";
import DeleteMonthlySettlementModal from "./elements/DeleteMonthlySettlementModal.vue";
import ListMonthlySettlementsDesktop from "./elements/ListMonthlySettlementsDesktop.vue";
import ListMonthlySettlementsMobile from "./elements/ListMonthlySettlementsMobile.vue";
import ShowMontlySettlementVue from "./elements/ShowMonthlySettlement.vue";

const serverErrors = ref(new Array<string>());

const dataLoaded = ref(false);
const months = ref([] as number[]);
const years = ref([] as number[]);
const selectedYear = ref("0");
const selectedMonth = ref(0);
const currentlyShownYear = ref("0");
const canEditOrDelete = computed(() => selectedMonth.value > 0);
const { openDeleteMonthlySettlement } = useDeleteMonthlySettlementModalStore();

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

onMounted(() => {
  const year = props.year ? props.year : undefined;
  const month: number | undefined = props.month ? +props.month : undefined;
  loadMonth(year, month);
});

const monthName = computed(() =>
  props.month ? getMonthName(+selectedMonth.value) : "",
);

const loadMonth = (year?: string, month?: number) => {
  dataLoaded.value = false;
  serverErrors.value = new Array<string>();

  MonthlySettlementService.getAvailableMonth(Number(year), month)
    .then((response) => {
      months.value = response.allMonth;
      years.value = response.allYears;

      selectedMonth.value = Number(response.month);

      selectedYear.value = response.year.toString();

      if (selectedYear.value != currentlyShownYear.value)
        currentlyShownYear.value = selectedYear.value;

      router.push({
        name: Routes.ListMonthlySettlements,
        params: { year: selectedYear.value, month: selectedMonth.value },
      });
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

onBeforeRouteUpdate((to) => {
  const year = to.params.year ? to.params.year.toString() : undefined;
  const month = to.params.month ? Number(to.params.month) : 0;
  if (
    // only reload month when switching years, deleting a settlement or creating a new settlement
    currentlyShownYear.value != year ||
    (selectedMonth.value > 0 && Number.isNaN(month)) ||
    !months.value.includes(month)
  ) {
    loadMonth(year, month);
  } else {
    selectedMonth.value = month;
  }
});

const showEditMonthlySettlementModal = (year?: number, month?: number) => {
  if (year === undefined && month === undefined) {
    openCreateMonthlySettlement(monthlySettlementUpserted);
    return;
  }

  openEditMonthlySettlement(year, month, monthlySettlementUpserted);
};

const selectYear = (year: string) => {
  router.push({
    name: Routes.ListMonthlySettlements,
    params: { year },
  });
};

const selectMonth = (month: number) => {
  const targetMonth = months.value.includes(month)
    ? month
    : months.value.at(-1);
  router.push({
    name: Routes.ListMonthlySettlements,
    params: { year: selectedYear.value, month: targetMonth },
  });
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

  router.push({
    name: Routes.ListMonthlySettlements,
    params: { year: currentYear, month: currentMonth },
  });
};

const monthlySettlementUpserted = (year: number, month: number) => {
  selectedMonth.value = 0;
  router.push({
    name: Routes.ListMonthlySettlements,
    params: { year: year, month: month },
    force: true,
  });
};

const showDeleteMonthlySettlementModal = () => {
  openDeleteMonthlySettlement(
    Number(selectedYear.value),
    selectedMonth.value,
    monthlySettlementDeleted,
  );
};

const monthlySettlementDeleted = (year: number) => {
  if (months.value.length > 1) {
    router.push({
      name: Routes.ListMonthlySettlements,
      params: { year: year },
    });
  } else {
    router.push({
      name: Routes.ListMonthlySettlements,
      params: {},
    });
  }
};
</script>
