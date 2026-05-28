<template>
  <EditMonthlySettlementModalVue
    ref="editModal"
    @monthly-settlement-upserted="monthlySettlementUpserted"
  />
  <QuickBookingModal
    ref="quickBookingModal"
    @booking-finished="showSuccessToast"
  />
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">
        {{ $t("AppHome.taskList") }}
      </h4>
    </div>

    <DivError :server-errors="serverErrors" />

    <div class="max-w-3xl mx-auto space-y-2">
      <Alert
        v-if="importedMoneyflows"
        class="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900"
      >
        <AlertCircle class="h-4 w-4 text-orange-600" />
        <AlertTitle>{{ $t("AppHome.importableMoneyflows") }}</AlertTitle>
        <AlertDescription>
          <button
            type="button"
            class="text-sm font-medium underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
            data-testid="app-home-import-moneyflows"
            @click="navigateImportMoneyflows"
          >
            {{ $t("General.edit") }}
          </button>
        </AlertDescription>
      </Alert>

      <Alert
        v-if="monthlySettlementMissing"
        class="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900"
      >
        <AlertCircle class="h-4 w-4 text-orange-600" />
        <AlertTitle>{{ $t("AppHome.createSettlements") }}</AlertTitle>
        <AlertDescription>
          <button
            type="button"
            class="text-sm font-medium underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
            data-testid="app-home-edit-monthly-settlement"
            @click="showEditMonthlySettlementModal"
          >
            {{ $t("General.edit") }}
          </button>
        </AlertDescription>
      </Alert>

      <Alert
        v-if="dataLoaded && !importedMoneyflows && !monthlySettlementMissing"
        class="max-w-xl border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
      >
        <CheckCircle2 />
        <AlertTitle>
          {{ $t("AppHome.allDone") }}
        </AlertTitle>
      </Alert>
    </div>

    <div
      v-if="dataLoaded && favoriteMoneyflows.length > 0"
      class="flex flex-wrap justify-center gap-4 py-0 max-w-3xl mx-auto"
    >
      <FavoriteIcon
        v-for="flow in favoriteMoneyflows"
        :key="flow.id"
        :text="flow.favoriteAbbreviation"
        :color="flow.favoriteColor!"
        size="lg"
        class="transition-transform active:scale-90 cursor-pointer"
        @click="openQuickBooking(flow)"
      />
    </div>
  </div>

  <!-- Success Toast -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-10 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="toast.show"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[3000] w-[90%] max-w-sm"
    >
      <Alert
        class="shadow-2xl border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900 flex items-center justify-between py-3"
      >
        <div class="flex items-center gap-3">
          <CheckCircle2 class="h-5 w-5 text-green-600" />
          <div
            v-if="toast.mmf"
            class="text-sm font-medium flex items-center gap-1"
          >
            <SpanAmount :amount="toast.mmf.amount" />
            <span> • {{ toast.mmf.comment }}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-900"
          @click="toast.show = false"
        >
          <X class="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import DivError from "@/components/common/DivError.vue";
import FavoriteIcon from "@/components/common/FavoriteIcon.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import EditMonthlySettlementModalVue from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import {
  preDefMoneyflowAlreadyUsedThisMonth,
  type PreDefMoneyflow,
} from "@/model/moneyflow/PreDefMoneyflow";
import router, { Routes } from "@/router";
import EventService from "@/service/EventService";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { AlertCircle, CheckCircle2, X } from "lucide-vue-next";
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

const toast = ref({
  show: false,
  mmf: undefined as Moneyflow | undefined,
});
let toastTimer: number | undefined;

const showSuccessToast = (mmf: Moneyflow) => {
  toast.value.mmf = mmf;
  toast.value.show = true;

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = globalThis.setTimeout(() => {
    toast.value.show = false;
  }, 5000);
};

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
        const today = new Date();
        if (mpm && mpm.length > 0) {
          favoriteMoneyflows.value = mpm
            .filter((flow) => flow.isFavorite)
            .filter((mpm) => {
              return (
                !mpm.onceAMonth ||
                !preDefMoneyflowAlreadyUsedThisMonth(today, mpm)
              );
            });
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
</script>
