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

    <div class="row justify-content-md-center mb-4" v-if="selectedYear">
      <div class="col-xl-3 col-lg-6 col-xs-12">
        <ShowEtfPreliminaryLumpSum :etfId="selectedEtf" :year="selectedYear" />
      </div>
    </div>
    <div class="row justify-content-md-center mb-4" v-if="selectedYear">
      <div class="col-md-4 col-xs-12">
        <button
          type="button"
          class="btn btn-primary mx-2"
          @click="
            showCreateEtfPreliminaryLumpSumModal(selectedEtf, selectedYear)
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
import { ref } from "vue";
import { onMounted } from "vue";
import { watch } from "vue";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";

const serverErrors = ref(new Array<string>());

const etfsLoaded = ref(false);
const yearsLoaded = ref(false);
const selectedYear = ref(0);
const selectedEtf = ref(0);
const etfsSelectValues = ref({} as Array<SelectBoxValue>);
const yearSelectValues = ref({} as Array<SelectBoxValue>);
const etfs = ref({} as Array<Etf>);

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
  loadEtfs();
  if (selectedEtf.value !== 0) {
    loadYear(selectedEtf.value, year);
  }
});

const loadEtfs = () => {
  serverErrors.value = new Array<string>();
  etfsLoaded.value = false;
  etfsSelectValues.value = new Array<SelectBoxValue>();

  CrudEtfControllerHandler.fetchAllEtf()
    .then((response) => {
      etfs.value = response;
      for (let etf of response) {
        etfsSelectValues.value.push({ id: etf.id, value: etf.name });
        if (etf.isFavorite) selectedEtf.value = etf.id;
      }
      etfsLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
const loadYear = (etfId: number, year?: number) => {
  serverErrors.value = new Array<string>();

  yearSelectValues.value = new Array<SelectBoxValue>();
  selectedYear.value = 0;
  yearsLoaded.value = false;

  CrudEtfPreliminaryLumpSumControllerHandler.fetchEtfPreliminaryLumpSumYears(
    etfId,
  ).then((response) => {
    for (let year of response) {
      yearSelectValues.value.push({ id: year, value: year + "" });
    }

    selectedEtf.value = etfId;
    if (year === undefined) {
      selectedYear.value = response.slice(-1)[0];
    } else {
      selectedYear.value = year;
    }

    yearsLoaded.value = true;
  });
};

const showCreateEtfPreliminaryLumpSumModal = (
  etfId?: number,
  year?: number,
) => {
  (createModal.value as typeof CreateEtfPreliminaryLumpSumModalVue)._show(
    etfs.value,
    etfId,
    year,
  );
};

const showDeleteEtfPreliminaryLumpSumModal = () => {
  (deleteModal.value as typeof DeleteEtfPreliminaryLumpSumModalVue)._show(
    etfs.value,
    selectedEtf.value,
    selectedYear.value,
  );
};

watch(selectedEtf, (newVal, oldVal) => {
  if (newVal != oldVal) {
    loadYear(newVal);
  }
});

const reloadView = (etfPreliminaryLumpSum: EtfPreliminaryLumpSum) => {
  console.log(etfPreliminaryLumpSum, selectedEtf.value, selectedYear.value);
  if (etfPreliminaryLumpSum.etfId == selectedEtf.value) {
    if (selectedYear.value == 0) {
      loadYear(selectedEtf.value, etfPreliminaryLumpSum.year);
    } else {
      loadYear(selectedEtf.value, selectedYear.value);
    }
  }
};
</script>
