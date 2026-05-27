<template>
  <EditMonthlySettlementModalVue
    ref="editModal"
    @monthly-settlement-upserted="monthlySettlementUpserted"
  />
  <QuickBookingModal ref="quickBookingModal" />
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">
        {{ $t("AppHome.taskList") }}
      </h4>
    </div>

    <DivError :server-errors="serverErrors" />

    <div class="max-w-3xl mx-auto space-y-4">
      <div
        v-if="importedMoneyflows"
        class="grid grid-cols-12 items-center gap-4 p-2"
      >
        <div class="col-span-4 sm:col-span-3 flex justify-end">
          <Button
            variant="default"
            class="cursor-pointer"
            data-testid="app-home-import-moneyflows"
            @click="navigateImportMoneyflows"
          >
            <ExternalLink />
            {{ $t("General.edit") }}
          </Button>
        </div>
        <div class="col-span-8 sm:col-span-9">
          {{ $t("AppHome.importableMoneyflows") }}
        </div>
      </div>

      <div
        v-if="monthlySettlementMissing"
        class="grid grid-cols-12 items-center gap-4 p-2"
      >
        <div class="col-span-4 sm:col-span-3 flex justify-end">
          <Button
            variant="default"
            class="cursor-pointer"
            data-testid="app-home-edit-monthly-settlement"
            @click="showEditMonthlySettlementModal"
          >
            <ExternalLink />
            {{ $t("General.edit") }}
          </Button>
        </div>
        <div class="col-span-8 sm:col-span-9">
          {{ $t("AppHome.createSettlements") }}
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <Alert
        v-if="dataLoaded && !importedMoneyflows && !monthlySettlementMissing"
        class="max-w-xl border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
      >
        <CheckCircle2 />
        <AlertTitle>
          {{ $t("AppHome.allDoneTitle") }}
        </AlertTitle>
        <AlertDescription>
          {{ $t("AppHome.allDone") }}
        </AlertDescription>
      </Alert>
    </div>
  </div>

  <div
    v-if="dataLoaded && favoriteMoneyflows.length > 0"
    class="flex flex-wrap justify-center gap-4 py-6 max-w-3xl mx-auto"
  >
    <div
      v-for="flow in favoriteMoneyflows"
      :key="flow.id"
      class="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-md transition-transform active:scale-90 cursor-pointer select-none"
      @click="openQuickBooking(flow)"
      :style="{
        backgroundColor: flow.favoriteColor,
        color: getContrastColor(flow.favoriteColor!),
      }"
    >
      {{ flow.favoriteAbbreviation }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import DivError from "@/components/common/DivError.vue";
import EditMonthlySettlementModalVue from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { type PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import router, { Routes } from "@/router";
import EventService from "@/service/EventService";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { CheckCircle2, ExternalLink } from "lucide-vue-next";
import { onMounted, ref, useTemplateRef } from "vue";
import QuickBookingModal from "./QuickBookingModal.vue";

const serverErrors = ref(new Array<string>());

const importedMoneyflows = ref(false);
const monthlySettlementMissing = ref(false);
const monthlySettlementMonth = ref(0);
const monthlySettlementYear = ref(0);
const editModal =
  useTemplateRef<typeof EditMonthlySettlementModalVue>("editModal");
const quickBookingModal =
  useTemplateRef<typeof QuickBookingModal>("quickBookingModal");
const dataLoaded = ref(false);
const favoriteMoneyflows = ref<Array<PreDefMoneyflow>>([]);

const loadData = () => {
  dataLoaded.value = false;
  let error = false;

  Promise.all([
    EventService.showEventList()
      .then((events) => {
        if (
          events.numberOfImportedMoneyflows &&
          events.numberOfImportedMoneyflows > 0
        ) {
          importedMoneyflows.value = true;
        }
        monthlySettlementMissing.value = events.monthlySettlementMissing
          ? events.monthlySettlementMissing
          : false;
        monthlySettlementMonth.value = events.monthlySettlementMonth
          ? events.monthlySettlementMonth
          : 0;
        monthlySettlementYear.value = events.monthlySettlementYear
          ? events.monthlySettlementYear
          : 0;
      })
      .catch((backendError) => {
        error = true;
        handleBackendError(backendError, serverErrors);
      }),
    PreDefMoneyflowService.fetchAllPreDefMoneyflow()
      .then((mpm) => {
        if (mpm && mpm.length > 0) {
          favoriteMoneyflows.value = mpm.filter((flow) => flow.isFavorite);
          console.log(favoriteMoneyflows.value);
          console.log(mpm);
        }
      })
      .catch((backendError) => {
        error = true;
        handleBackendError(backendError, serverErrors);
      }),
  ]).then(() => {
    if (!error) {
      dataLoaded.value = true;
    }
  });
};
const showEditMonthlySettlementModal = () => {
  editModal.value?._show(
    monthlySettlementYear.value,
    monthlySettlementMonth.value,
  );
};
const monthlySettlementUpserted = () => {
  monthlySettlementMissing.value = false;
};
const navigateImportMoneyflows = () => {
  router.push({
    name: Routes.ImportMoneyflows,
  });
};

const openQuickBooking = (flow: PreDefMoneyflow) => {
  quickBookingModal.value?._show(flow);
};

onMounted(() => {
  loadData();
});

const getContrastColor = (hexColor: string) => {
  if (!hexColor || hexColor.length < 7) return "white";

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};
</script>
