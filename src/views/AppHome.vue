<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">
        {{ $t("AppHome.taskList") }}
      </h4>
    </div>

    <div class="max-w-3xl mx-auto space-y-2">
      <Alert
        v-if="importedMoneyflows"
        class="max-w-xl mx-auto border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900"
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
        class="max-w-xl mx-auto border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900"
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
        class="max-w-xl mx-auto border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
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
</template>

<script lang="ts" setup>
import FavoriteIcon from "@/components/common/FavoriteIcon.vue";
import SpanAmount from "@/components/common/SpanAmount.vue";
import { useCreateMoneyflowQuickModalStore } from "@/components/moneyflow/CreateMoneyflowQuickModal.store";
import { useEditMonthlySettlementModalStore } from "@/components/monthlysettlement/EditMonthlySettlementModal.store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import {
  preDefMoneyflowAlreadyUsedThisMonth,
  type PreDefMoneyflow,
} from "@/model/moneyflow/PreDefMoneyflow";
import router, { Routes } from "@/router";
import EventService from "@/service/EventService";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { AlertCircle, CheckCircle2 } from "@lucide/vue";
import { h, onMounted, ref } from "vue";
import { toast } from "vue-sonner";

const importedMoneyflows = ref(false);
const monthlySettlementMissing = ref(false);
const monthlySettlementMonth = ref(0);
const monthlySettlementYear = ref(0);
const dataLoaded = ref(false);
const favoriteMoneyflows = ref<Array<PreDefMoneyflow>>([]);
const { openEditMonthlySettlement } = useEditMonthlySettlementModalStore();
const { openCreateMoneyflowQuick } = useCreateMoneyflowQuickModalStore();

const showSuccessToast = (mmf: Moneyflow) => {
  toast.success(
    h("div", { class: "flex items-center gap-1" }, [
      h(SpanAmount, { amount: mmf.amount }),
      h("span", " • " + mmf.comment),
    ]),
  );
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
        handleBackendError(backendError);
      }),
    PreDefMoneyflowService.fetchAllPreDefMoneyflow()
      .then((mpm) => {
        const today = new Date();
        if (mpm && mpm.length > 0) {
          favoriteMoneyflows.value = mpm
            .filter((flow) => flow.isFavorite)
            .filter(
              (mpm) =>
                !mpm.onceAMonth ||
                !preDefMoneyflowAlreadyUsedThisMonth(today, mpm),
            );
        }
      })
      .catch((backendError) => {
        error = true;
        handleBackendError(backendError);
      }),
  ]).then(() => {
    if (!error) {
      dataLoaded.value = true;
    }
  });
};
const showEditMonthlySettlementModal = () => {
  openEditMonthlySettlement(
    monthlySettlementYear.value,
    monthlySettlementMonth.value,
    monthlySettlementUpserted,
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
  openCreateMoneyflowQuick(flow, showSuccessToast);
};

onMounted(() => {
  loadData();
});
</script>
