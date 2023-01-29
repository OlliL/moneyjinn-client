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
        <h4>Monatsabschl&uuml;sse</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-9 col-xs-12">
        <form action="#">
          <table style="margin: 0 auto">
            <tr>
              <td class="text-right pe-2">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="showEditMonthlySettlementModal()"
                >
                  Neu
                </button>
              </td>

              <td class="text-right pe-2">
                <select
                  class="form-select"
                  v-model="selectedYear"
                  @change="selectMonth(selectedYear + '')"
                >
                  <option v-for="year in years" :key="year" :value="year">
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
                          $props.month === month + ''
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
    <div class="row justify-content-md-center mb-4" v-if="selectedMonth">
      <div class="col-md-4 col-xs-12">
        <div class="card">
          <div class="card-header text-center p-3">
            <h5>Monatsabschluss {{ monthName }} {{ year }}</h5>
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
          Bearbeiten
        </button>
        <button
          type="button"
          class="btn btn-danger mx-2"
          @click="showDeleteMonthlySettlementModal"
        >
          L&ouml;schen
        </button>
      </div>
    </div>
    <!---->
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";

import DeleteMonthlySettlementModalVue from "@/components/monthlysettlement/DeleteMonthlySettlementModal.vue";
import EditMonthlySettlementModalVue from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";
import ShowMontlySettlementVue from "@/components/monthlysettlement/ShowMonthlySettlement.vue";

import router, { Routes } from "@/router";

import { getMonthName } from "@/tools/views/MonthName";

import MonthlySettlementControllerHandler from "@/handler/MonthlySettlementControllerHandler";
import { onBeforeRouteUpdate } from "vue-router";

const dataLoaded = ref(false);
const months = ref([] as number[]);
const years = ref([] as number[]);
const selectedYear = ref(0);
const selectedMonth = ref(0);
const currentlyShownYear = ref(0);

const editModal = ref();
const deleteModal = ref();

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
  MonthlySettlementControllerHandler.getAvailableMonth(year, month).then(
    (response) => {
      months.value = response.allMonth;
      years.value = response.allYears;

      selectedYear.value = response.year;
      selectedMonth.value = response.month;

      if (selectedYear.value != currentlyShownYear.value)
        currentlyShownYear.value = selectedYear.value;

      dataLoaded.value = true;
    }
  );
};

onBeforeRouteUpdate((to, from, next) => {
  const year = +to.params.year;
  const month = +to.params.month;
  if (currentlyShownYear.value != year) {
    loadMonth(year, month);
  }

  if (month) {
    selectedMonth.value = month;
  } else {
    selectedMonth.value = 0;
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
    selectedMonth.value
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
