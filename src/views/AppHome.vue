<template>
  <EditMonthlySettlementModalVue
    ref="editModal"
    @monthly-settlement-upserted="monthlySettlementUpserted"
  />
  <div class="custom-container space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h4 class="text-2xl font-bold tracking-tight">
        {{ $t("AppHome.taskList") }}
      </h4>
      <Separator class="my-4" />
    </div>

    <DivError :server-errors="serverErrors" />

    <div class="max-w-3xl mx-auto space-y-4">
      <div
        v-if="importedMoneyflows"
        class="grid grid-cols-12 items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors"
      >
        <div class="col-span-4 sm:col-span-3 flex justify-end">
          <Button variant="default" @click="navigateImportMoneyflows">
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
        class="grid grid-cols-12 items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors"
      >
        <div class="col-span-4 sm:col-span-3 flex justify-end">
          <Button variant="default" @click="navigateImportMoneyflows">
            <ExternalLink />
            {{ $t("General.edit") }}
          </Button>
        </div>
        <div class="col-span-8 sm:col-span-9">
          {{ $t("AppHome.createSettlements") }}
        </div>
      </div>
    </div>

    <Alert
      v-if="dataLoaded && !importedMoneyflows && !monthlySettlementMissing"
      class="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
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
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from "vue";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import EditMonthlySettlementModalVue from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";

import router, { Routes } from "@/router";

import EventService from "@/service/EventService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import DivError from "@/components/DivError.vue";

import { ExternalLink, CheckCircle2 } from "lucide-vue-next";

const serverErrors = ref(new Array<string>());

const importedMoneyflows = ref(false);
const monthlySettlementMissing = ref(false);
const monthlySettlementMonth = ref(0);
const monthlySettlementYear = ref(0);
const editModal =
  useTemplateRef<typeof EditMonthlySettlementModalVue>("editModal");
const dataLoaded = ref(false);

const loadData = () => {
  dataLoaded.value = false;
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
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
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
onMounted(() => {
  loadData();
});
</script>
