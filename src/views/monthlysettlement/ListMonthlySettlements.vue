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

    <div class="flex flex-wrap items-center justify-center gap-4">
      <Button type="button" @click="showEditMonthlySettlementModal()">
        {{ $t("General.new") }}
      </Button>
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
                  name: Routes.ListMonthlySettlements,
                  params: { year: selectedYear, month: month },
                  force: true,
                }"
                :class="[
                  'inline-flex h-9 items-center justify-center px-4 text-sm font-medium border border-input transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',

                  $props.month == month + ''
                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground'
                    : 'bg-background text-foreground',

                  index === 0 ? 'rounded-l-md' : '',
                  index === months!.length - 1 ? 'rounded-r-md' : '',
                  index > 0 && index < months!.length - 1 ? 'rounded-none' : '',
                ]"
              >
                {{ getMonthName(month) }}
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <DivError :server-errors="serverErrors" />

    <ShowMontlySettlementVue
      :year="Number(selectedYear)"
      :month="selectedMonth"
    />

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import router, { Routes } from "@/router";

import { getMonthName } from "@/tools/views/MonthName";
import { handleBackendError } from "@/tools/views/HandleBackendError";

import MonthlySettlementService from "@/service/MonthlySettlementService";

const serverErrors = ref(new Array<string>());

const dataLoaded = ref(false);
const months = ref([] as number[]);
const years = ref([] as number[]);
const selectedYear = ref("0");
const selectedMonth = ref(0);
const currentlyShownYear = ref("0");

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

const selectMonth = (year: string, month?: string) => {
  router.push({
    name: Routes.ListMonthlySettlements,
    params: { year: year, month: month },
  });
};

const showEditMonthlySettlementModal = (year?: string, month?: number) => {
  (editModal.value as typeof EditMonthlySettlementModalVue)._show(year, month);
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
  (deleteModal.value as typeof DeleteMonthlySettlementModalVue)._show(
    selectedYear.value,
    selectedMonth.value,
  );
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
