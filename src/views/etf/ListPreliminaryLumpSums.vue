<template>
  <CreateEtfPreliminaryLumpSumModalVue
    ref="createModal"
    @etf-preliminary-lump-sum-created="reloadView"
    @etf-preliminary-lump-sum-updated="reloadView"
  />
  <DeleteEtfPreliminaryLumpSumModalVue
    @etf-preliminary-lump-sum-deleted="reloadView"
    ref="deleteModal"
  />
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.preliminaryLumpSums") }}</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-12">
      <div class="col-xxl-3 col-xl-4 col-md-7 col-xs-12">
        <div
          class="row no-gutters flex-lg-nowrap d-flex justify-content align-items-center"
        >
          <div
            class="col-xxl-10 col-md-9 col-xs-12 justify-content-end mb-3"
            v-if="etfsLoaded"
          >
            <SelectStandard
              v-model="selectedEtf"
              id="etf"
              :field-label="$t('General.selectEtf')"
              :select-box-values="etfsSelectValues"
            />
          </div>
          <div
            class="col-xxl-2 col-md-3 col-xs-12 justify-content-start mb-3"
            v-if="selectedEtf"
          >
            <button
              type="button"
              class="btn btn-primary"
              @click="showCreateEtfPreliminaryLumpSumModal(selectedEtf)"
            >
              {{ $t("General.new") }}
            </button>
          </div>
        </div>
      </div>

      <div class="row justify-content-md-center mb-12 pb-3">
        <div class="col-xxl-1 col-xl-2 col-md-3 col-xs-12">
          <div
            class="col-xxl-12 col-xs-12 justify-content-start"
            v-if="yearsLoaded"
          >
            <SelectStandard
              v-model="selectedYear"
              id="etf"
              :field-label="$t('General.year')"
              :select-box-values="yearSelectValues"
            />
          </div>
        </div>
      </div>
    </div>

    <DivError :server-errors="serverErrors" />

    <div
      class="row justify-content-md-center mb-4"
      v-if="selectedYear && selectedEtf"
    >
      <div class="col-xl-3 col-lg-6 col-xs-12">
        <ShowEtfPreliminaryLumpSum :mep="etfPreliminaryLumpSum" />
      </div>
    </div>
    <div class="row justify-content-md-center mb-4" v-if="selectedYear">
      <div class="col-md-4 col-xs-12">
        <button
          type="button"
          class="btn btn-primary mx-2"
          @click="
            showCreateEtfPreliminaryLumpSumModal(
              selectedEtf,
              etfPreliminaryLumpSum,
            )
          "
        >
          {{ $t("General.edit") }}
        </button>
        <button
          type="button"
          class="btn btn-danger mx-2"
          @click="showDeleteEtfPreliminaryLumpSumModal"
        >
          {{ $t("General.delete") }}
        </button>
      </div>
    </div>
    <!---->
  </div>
</template>

<script lang="ts" setup>
import DeleteEtfPreliminaryLumpSumModalVue from "@/components/etf/DeleteEtfPreliminaryLumpSumModal.vue";
import DivError from "@/components/DivError.vue";
import CreateEtfPreliminaryLumpSumModalVue from "@/components/etf/CreateEtfPreliminaryLumpSumModal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import CrudEtfPreliminaryLumpSumControllerHandler from "@/handler/CrudEtfPreliminaryLumpSumControllerHandler";
import ShowEtfPreliminaryLumpSum from "@/components/etf/ShowEtfPreliminaryLumpSum.vue";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import CrudEtfControllerHandler from "@/handler/CrudEtfControllerHandler";
import SelectStandard from "@/components/SelectStandard.vue";
import type { Etf } from "@/model/etf/Etf";
import { ref, onMounted, watch, nextTick } from "vue";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import router, { Routes } from "@/router";

const serverErrors = ref(new Array<string>());

const etfsLoaded = ref(false);
const yearsLoaded = ref(false);
const selectedYear = ref(undefined as number | undefined);
const displayedYear = ref(undefined as number | undefined);
const displayedEtf = ref(undefined as number | undefined);
const selectedEtf = ref(undefined as number | undefined);
const etfsSelectValues = ref({} as Array<SelectBoxValue>);
const yearSelectValues = ref({} as Array<SelectBoxValue>);
const etfs = ref({} as Array<Etf>);
const etfPreliminaryLumpSums = ref({} as Map<number, EtfPreliminaryLumpSum>);
const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum | undefined);

const createModal = ref();
const deleteModal = ref();

const props = defineProps({
  etfId: {
    type: String,
    default: undefined,
  },
  year: {
    type: String,
    default: undefined,
  },
});

onMounted(() => {
  const etfId: number | undefined = props.etfId ? +props.etfId : undefined;
  const year: number | undefined = props.year ? +props.year : undefined;
  displayedEtf.value = etfId;
  displayedYear.value = year;

  loadEtfs(etfId, year);
});

const loadEtfs = (etfId?: number, year?: number) => {
  serverErrors.value = new Array<string>();
  etfsLoaded.value = false;
  etfsSelectValues.value = new Array<SelectBoxValue>();

  CrudEtfControllerHandler.fetchAllEtf()
    .then((response) => {
      etfs.value = response;
      let favoriteEtfId;
      for (let etf of response) {
        etfsSelectValues.value.push({ id: etf.id, value: etf.name });
        if (etf.isFavorite && etfId === undefined) favoriteEtfId = etf.id;
      }
      if (etfId !== undefined) {
        displayedEtf.value = etfId;
        loadYears(etfId, year);
      } else if (favoriteEtfId !== undefined) {
        displayedEtf.value = favoriteEtfId;
        loadYears(favoriteEtfId);
      }
      etfsLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const loadYears = (etfId: number, year?: number) => {
  serverErrors.value = new Array<string>();
  yearsLoaded.value = false;

  yearSelectValues.value = new Array<SelectBoxValue>();
  etfPreliminaryLumpSums.value = new Map<number, EtfPreliminaryLumpSum>();
  selectedEtf.value = etfId;
  selectedYear.value = undefined;
  CrudEtfPreliminaryLumpSumControllerHandler.fetchAllEtfPreliminaryLumpSum(
    etfId,
  )
    .then((response) => {
      for (let _etfPreliminaryLumpSum of response) {
        let _year = _etfPreliminaryLumpSum.year;
        yearSelectValues.value.push({ id: _year, value: _year + "" });
        etfPreliminaryLumpSums.value.set(_year, _etfPreliminaryLumpSum);
      }

      if (year === undefined || !etfPreliminaryLumpSums.value.has(year)) {
        const _year = Array.from(etfPreliminaryLumpSums.value.keys()).pop();
        displayedYear.value = _year;
        if (_year !== undefined)
          etfPreliminaryLumpSum.value = etfPreliminaryLumpSums.value.get(_year);
      } else {
        displayedYear.value = year;
        etfPreliminaryLumpSum.value = etfPreliminaryLumpSums.value.get(year);
      }
      selectedYear.value = displayedYear.value;
      routerPush();

      yearsLoaded.value = true;
    })
    .catch(() => {
      routerPush();
    });
};

const showCreateEtfPreliminaryLumpSumModal = (
  etfId?: number,
  mep?: EtfPreliminaryLumpSum,
) => {
  (createModal.value as typeof CreateEtfPreliminaryLumpSumModalVue)._show(
    etfs.value,
    etfId,
    mep,
  );
};

const showDeleteEtfPreliminaryLumpSumModal = () => {
  (deleteModal.value as typeof DeleteEtfPreliminaryLumpSumModalVue)._show(
    etfs.value,
    etfPreliminaryLumpSum.value,
  );
};

watch(selectedEtf, (newVal, oldVal) => {
  if (
    newVal != oldVal &&
    newVal !== undefined &&
    newVal != displayedEtf.value
  ) {
    displayedEtf.value = newVal;
    loadYears(newVal);
  }
});

watch(selectedYear, (newVal, oldVal) => {
  if (
    newVal != oldVal &&
    newVal !== undefined &&
    newVal !== displayedYear.value
  ) {
    displayedYear.value = newVal;
    etfPreliminaryLumpSum.value = etfPreliminaryLumpSums.value.get(newVal);
    routerPush();
  }
});

const routerPush = () => {
  if (
    (selectedEtf.value || "") != (props.etfId || "") ||
    (selectedYear.value || "") != (props.year || "")
  ) {
    router.push({
      name: Routes.ListEtfPreliminaryLumpSums,
      params: { etfId: selectedEtf.value, year: selectedYear.value },
    });
  }
};

const reloadView = (etfPreliminaryLumpSum: EtfPreliminaryLumpSum) => {
  if (etfPreliminaryLumpSum.etfId == selectedEtf.value) {
    if (selectedYear.value === undefined) {
      loadYears(selectedEtf.value, etfPreliminaryLumpSum.year);
    } else {
      loadYears(selectedEtf.value, selectedYear.value);
    }
  }
};
</script>
