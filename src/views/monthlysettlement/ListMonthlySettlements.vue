<template>
  <DeleteMonthlySettlementModalVue
    ref="deleteModal"
    @monthly-settlement-deleted="monthlySettlementDeleted"
  />
  <EditMonthlySettlementModalVue
    ref="editModal"
    @monthly-settlement-upserted="monthlySettlementUpserted"
  />
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.monthlysettlements") }}</h4>
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
      @create="showEditMonthlySettlementModal()"
      @edit="showEditMonthlySettlementModal(Number(selectedYear), selectedMonth)"
      @delete="showDeleteMonthlySettlementModal"
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
      @create="showEditMonthlySettlementModal()"
      @edit="showEditMonthlySettlementModal(Number(selectedYear), selectedMonth)"
      @delete="showDeleteMonthlySettlementModal"
    />

    <DivError :server-errors="serverErrors" />

    <ShowMontlySettlementVue
      :year="Number(selectedYear)"
      :month="selectedMonth"
    />
    <!---->
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

import DivError from "@/components/DivError.vue";
import DeleteMonthlySettlementModalVue from "./elements/DeleteMonthlySettlementModal.vue";
import EditMonthlySettlementModalVue from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";
import ListMonthlySettlementsDesktop from "./elements/ListMonthlySettlementsDesktop.vue";
import ListMonthlySettlementsMobile from "./elements/ListMonthlySettlementsMobile.vue";
import ShowMontlySettlementVue from "./elements/ShowMonthlySettlement.vue";

import router, { Routes } from "@/router";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import MonthlySettlementService from "@/service/MonthlySettlementService";

const serverErrors = ref(new Array<string>());

const dataLoaded = ref(false);
const months = ref([] as number[]);
const years = ref([] as number[]);
const selectedYear = ref("0");
const selectedMonth = ref(0);
const currentlyShownYear = ref("0");
const canEditOrDelete = computed(() => selectedMonth.value > 0);

const deleteModal =
  useTemplateRef<typeof DeleteMonthlySettlementModalVue>("deleteModal");
const editModal =
  useTemplateRef<typeof EditMonthlySettlementModalVue>("editModal");

const props = defineProps({
  year: {
    type: String,
    default: undefined,
  },
  month: {
    type: String,
    default: undefined,
  },
});

onMounted(() => {
  const year = props.year ? props.year : undefined;
  const month: number | undefined = props.month ? +props.month : undefined;
  loadMonth(year, month);
});

const loadMonth = (year?: string, month?: number) => {
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

onBeforeRouteUpdate((to, from) => {
  const year = to.params.year ? to.params.year.toString() : undefined;
  const fallbackMonth = from.params.month ? Number(from.params.month) : 0;
  const month = to.params.month ? Number(to.params.month) : fallbackMonth;
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
  (editModal.value as typeof EditMonthlySettlementModalVue)._show(year, month);
};

const selectYear = (year: string) => {
  router.push({
    name: Routes.ListMonthlySettlements,
    params: { year },
  });
};

const selectMonth = (month: number) => {
  router.push({
    name: Routes.ListMonthlySettlements,
    params: { year: selectedYear.value, month },
  });
};

const monthlySettlementUpserted = (year: string, month: number) => {
  selectedMonth.value = 0;
  router.push({
    name: Routes.ListMonthlySettlements,
    params: { year: year, month: month },
    force: true,
  });
};

const showDeleteMonthlySettlementModal = () => {
  deleteModal.value?._show(Number(selectedYear.value), selectedMonth.value);
};

const monthlySettlementDeleted = (year: string) => {
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
