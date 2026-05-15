<template>
  <DeleteMonthlySettlementModalVue
    ref="deleteModal"
    @monthly-settlement-deleted="monthlySettlementDeleted"
  />
  <EditMonthlySettlementModalVue
    ref="editModal"
    @monthly-settlement-upserted="monthlySettlementUpserted"
  />
  <div class="container mx-auto py-6 space-y-6 text-center">
    <div>
      <h4 class="text-2xl font-bold">{{ $t("General.monthlysettlements") }}</h4>
    </div>

    <div class="flex justify-center">
      <div class="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" @click="showEditMonthlySettlementModal()">
          {{ $t("General.new") }}
        </Button>
        <div>
          <select
            class="h-9 rounded-md border border-input bg-background px-3 text-sm"
            v-model="selectedYear"
            @change="selectMonth(selectedYear + '', selectedMonth + '')"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div>
          <nav aria-label="Month navigation" v-if="dataLoaded">
            <ul class="month-selection flex flex-wrap justify-center gap-2">
              <li v-for="month in months" :key="month">
                <router-link
                  :class="
                    selectedMonth == month
                      ? 'inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm text-primary-foreground'
                      : 'inline-flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-accent'
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

    <DivError :server-errors="serverErrors" />

    <ShowMontlySettlementVue :year="selectedYear" :month="selectedMonth" />

    <div class="flex justify-center pb-4" v-if="selectedMonth">
      <div class="flex flex-wrap justify-center gap-2">
        <Button
          type="button"
          @click="showEditMonthlySettlementModal(selectedYear, selectedMonth)"
        >
          {{ $t("General.edit") }}
        </Button>
        <Button
          type="button"
          variant="destructive"
          @click="showDeleteMonthlySettlementModal"
        >
          {{ $t("General.delete") }}
        </Button>
      </div>
    </div>
    <!---->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

import DeleteMonthlySettlementModalVue from "@/components/monthlysettlement/DeleteMonthlySettlementModal.vue";
import DivError from "@/components/DivError.vue";
import EditMonthlySettlementModalVue from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";
import ShowMontlySettlementVue from "@/components/monthlysettlement/ShowMonthlySettlement.vue";
import { Button } from "@/components/ui/button";

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
