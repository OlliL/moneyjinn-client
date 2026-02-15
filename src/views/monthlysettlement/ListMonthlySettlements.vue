<template>
  <DeleteMonthlySettlementModalVue
    ref="deleteModal"
    @monthly-settlement-deleted="monthlySettlementDeleted"
  />
  <EditMonthlySettlementModalVue
    ref="editModal"
    @monthly-settlement-upserted="monthlySettlementUpserted"
  />
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.monthlysettlements") }}</h4>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-md-auto mb-3">
        <div class="row">
          <div class="col-md-auto mb-3">
            <button
              type="button"
              class="btn btn-primary"
              @click="showEditMonthlySettlementModal()"
            >
              {{ $t("General.new") }}
            </button>
          </div>
          <div class="col-md-auto">
            <select
              class="form-select"
              v-model="selectedYear"
              @change="selectMonth(selectedYear + '', selectedMonth + '')"
            >
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="col">
            <nav aria-label="Month navigation" v-if="dataLoaded">
              <ul class="pagination month-selection">
                <li class="page-item" v-for="month in months" :key="month">
                  <router-link
                    :class="
                      $props.month == month + ''
                        ? 'page-link active'
                        : 'page-link'
                    "
                    :to="{
                      name: Routes.ListMonthlySettlements,
                      params: { year: selectedYear, month: month },
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

    <div class="row justify-content-md-center mb-4" v-if="selectedMonth">
      <div class="col-xl-4 col-md-6 col-xs-12">
        <div class="card">
          <div class="card-header text-center p-3">
            <h5>
              {{
                $t("MonthlySettlement.headline", {
                  month: monthName,
                  year: year,
                })
              }}
            </h5>
          </div>
          <div class="card-body">
            <ShowMontlySettlementVue
              :year="selectedYear"
              :month="selectedMonth"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4" v-if="selectedMonth">
      <div class="col-md-4 col-xs-12">
        <button
          type="button"
          class="btn btn-primary mx-2"
          @click="showEditMonthlySettlementModal(selectedYear, selectedMonth)"
        >
          {{ $t("General.edit") }}
        </button>
        <button
          type="button"
          class="btn btn-danger mx-2"
          @click="showDeleteMonthlySettlementModal"
        >
          {{ $t("General.delete") }}
        </button>
      </div>
    </div>
    <!---->
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

import DeleteMonthlySettlementModalVue from "@/components/monthlysettlement/DeleteMonthlySettlementModal.vue";
import DivError from "@/components/DivError.vue";
import EditMonthlySettlementModalVue from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";
import ShowMontlySettlementVue from "@/components/monthlysettlement/ShowMonthlySettlement.vue";

import router, { Routes } from "@/router";

import { getMonthName } from "@/tools/views/MonthName";
import { handleBackendError } from "@/tools/views/HandleBackendError";

import MonthlySettlementService from "@/service/MonthlySettlementService";

const serverErrors = ref(new Array<string>());

const dataLoaded = ref(false);
const months = ref([] as number[]);
const years = ref([] as number[]);
const selectedYear = ref(0);
const selectedMonth = ref(0);
const currentlyShownYear = ref(0);

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
  const year: number | undefined = props.year ? +props.year : undefined;
  const month: number | undefined = props.month ? +props.month : undefined;
  loadMonth(year, month);
});

const monthName = computed(() => {
  return getMonthName(selectedMonth.value);
});

const loadMonth = (year?: number, month?: number) => {
  serverErrors.value = new Array<string>();

  MonthlySettlementService.getAvailableMonth(year, month)
    .then((response) => {
      months.value = response.allMonth;
      years.value = response.allYears;

      selectedYear.value = Number(response.year);
      selectedMonth.value = Number(response.month);

      if (selectedYear.value != currentlyShownYear.value)
        currentlyShownYear.value = selectedYear.value;

      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

onBeforeRouteUpdate((to, from, next) => {
  const year = to.params.year ? Number(to.params.year) : undefined;
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

  next();
});

const selectMonth = (year: string, month?: string) => {
  router.push({
    name: Routes.ListMonthlySettlements,
    params: { year: year, month: month },
  });
};

const showEditMonthlySettlementModal = (year?: number, month?: number) => {
  (editModal.value as typeof EditMonthlySettlementModalVue)._show(year, month);
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
  (deleteModal.value as typeof DeleteMonthlySettlementModalVue)._show(
    selectedYear.value,
    selectedMonth.value,
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
