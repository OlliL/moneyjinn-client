<template>
  <EditMonthlySettlementModalVue
    ref="editModal"
    @monthly-settlement-upserted="monthlySettlementUpserted"
  />
  <div class="container-fluid">
    <div class="row justify-content-md-center text-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("AppHome.taskList") }}</h4>
      </div>
    </div>
    <DivError :server-errors="serverErrors" />
    <div class="row justify-content-md-center" v-if="importedMoneyflows">
      <div class="col-4 col-sm-2 col-lg-2 col-xl-1 col-xxl-1 mb-4 text-end">
        <button
          type="button"
          class="btn btn-primary"
          @click="navigateImportMoneyflows()"
        >
          {{ $t("General.edit") }}
        </button>
      </div>
      <div
        class="col-8 col-sm-10 col-lg-8 col-xl-6 col-xxl-4 mb-4 d-flex align-items-center"
      >
        {{ $t("AppHome.importableMoneyflows") }}
      </div>
    </div>
    <div class="row justify-content-md-center" v-if="monthlySettlementMissing">
      <div class="col-4 col-sm-2 col-lg-2 col-xl-1 col-xxl-1 mb-4 text-end">
        <button
          type="button"
          class="btn btn-primary"
          @click="showEditMonthlySettlementModal()"
        >
          {{ $t("General.edit") }}
        </button>
      </div>
      <div
        class="col-8 col-sm-10 col-lg-8 col-xl-6 col-xxl-4 mb-4 d-flex align-items-center"
      >
        {{ $t("AppHome.createSettlements") }}
      </div>
    </div>
    <div
      class="text-center text-success"
      v-if="dataLoaded && !importedMoneyflows && !monthlySettlementMissing"
    >
      {{ $t("AppHome.allDone") }} <i class="bi bi-emoji-smile"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import EditMonthlySettlementModalVue from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";

import router, { Routes } from "@/router";

import EventService from "@/service/EventService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import DivError from "@/components/DivError.vue";

const serverErrors = ref(new Array<string>());

const importedMoneyflows = ref(false);
const monthlySettlementMissing = ref(false);
const monthlySettlementMonth = ref(0);
const monthlySettlementYear = ref(0);
const editModal = ref();
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
  editModal.value._show(
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
