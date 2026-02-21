<template>
  <CreateEtfPreliminaryLumpSumModalMonthlyVue
    ref="createModalMonthly"
    @etf-preliminary-lump-sum-created="reloadView"
    @etf-preliminary-lump-sum-updated="reloadView"
  />
  <CreateEtfPreliminaryLumpSumModalPieceVue
    ref="createModalPiece"
    @etf-preliminary-lump-sum-created="reloadView"
    @etf-preliminary-lump-sum-updated="reloadView"
  />
  <CreateEtfPreliminaryLumpSumModalYearly
    ref="createModalYearly"
    @etf-preliminary-lump-sum-created="reloadView"
    @etf-preliminary-lump-sum-updated="reloadView"
  />
  <DeleteEtfPreliminaryLumpSumModalMonthlyVue
    @etf-preliminary-lump-sum-deleted="reloadView"
    ref="deleteModalMonthly"
  />
  <DeleteEtfPreliminaryLumpSumModalPieceVue
    @etf-preliminary-lump-sum-deleted="reloadView"
    ref="deleteModalPiece"
  />
  <DeleteEtfPreliminaryLumpSumModalYearly
    @etf-preliminary-lump-sum-deleted="reloadView"
    ref="deleteModalYearly"
  />
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.preliminaryLumpSums") }}</h4>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-xxl-5 col-xl-6 col-md-8 col-xs-12">
        <div class="row flex-lg-nowrap d-flex align-items-center">
          <div class="col-xxl-6 col-md-8 col-xs-12 mb-3" v-if="etfsLoaded">
            <SelectStandard
              v-model="selectedEtfId"
              id="etf"
              :field-label="$t('General.selectEtf')"
              :select-box-values="etfsSelectValues"
            />
          </div>
          <div class="col-md-auto mb-3" v-if="selectedEtf">
            <button
              type="button"
              class="btn btn-primary"
              @click="
                showCreateEtfPreliminaryLumpSumModal(
                  selectedEtfId,
                  EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH,
                )
              "
            >
              {{ $t("ETFPreliminaryLumpSum.newMonthly") }}
            </button>
          </div>
          <div class="col-md-auto mb-3" v-if="selectedEtf">
            <button
              type="button"
              class="btn btn-primary"
              @click="
                showCreateEtfPreliminaryLumpSumModal(
                  selectedEtfId,
                  EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE,
                )
              "
            >
              {{ $t("ETFPreliminaryLumpSum.newPiece") }}
            </button>
          </div>
          <div class="col-md-auto mb-3" v-if="selectedEtf">
            <button
              type="button"
              class="btn btn-primary"
              @click="
                showCreateEtfPreliminaryLumpSumModal(
                  selectedEtfId,
                  EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR,
                )
              "
            >
              {{ $t("ETFPreliminaryLumpSum.newYearly") }}
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
              id="etfYear"
              :field-label="$t('General.year')"
              :select-box-values="yearSelectValues"
            />
          </div>
        </div>
      </div>
    </div>

    <DivError :server-errors="serverErrors" />
    <div
      v-if="
        selectedYear &&
        selectedEtf &&
        etfPreliminaryLumpSum?.type ==
          EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH
      "
    >
      <div class="row justify-content-md-center mb-4">
        <div class="col-xl-3 col-lg-6 col-xs-12">
          <ShowEtfPreliminaryLumpSumMonthlyVue :mep="etfPreliminaryLumpSum" />
        </div>
      </div>
      <div class="row justify-content-md-center mb-4">
        <div class="col-md-4 col-xs-12">
          <button
            type="button"
            class="btn btn-primary mx-2"
            @click="
              showCreateEtfPreliminaryLumpSumModal(
                selectedEtfId,
                etfPreliminaryLumpSum.type,
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
    </div>
    <div
      v-if="
        selectedYear &&
        selectedEtf &&
        etfPreliminaryLumpSum?.type ==
          EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE
      "
    >
      <div class="row justify-content-md-center mb-4">
        <div class="col-xl-3 col-lg-6 col-xs-12">
          <ShowEtfPreliminaryLumpSumPieceVue :mep="etfPreliminaryLumpSum" />
        </div>
      </div>
      <div class="row justify-content-md-center mb-4">
        <div class="col-md-4 col-xs-12">
          <button
            type="button"
            class="btn btn-primary mx-2"
            @click="
              showCreateEtfPreliminaryLumpSumModal(
                selectedEtfId,
                etfPreliminaryLumpSum.type,
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
    </div>
    <div
      v-if="
        selectedYear &&
        selectedEtf &&
        etfPreliminaryLumpSum?.type == EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR
      "
    >
      <div class="row justify-content-md-center mb-4">
        <div class="col-xl-3 col-lg-6 col-xs-12">
          <ShowEtfPreliminaryLumpSumYearly :mep="etfPreliminaryLumpSum" />
        </div>
      </div>
      <div class="row justify-content-md-center mb-4">
        <div class="col-md-4 col-xs-12">
          <button
            type="button"
            class="btn btn-primary mx-2"
            @click="
              showCreateEtfPreliminaryLumpSumModal(
                selectedEtfId,
                etfPreliminaryLumpSum.type,
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
    </div>
    <!---->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, useTemplateRef } from "vue";
import router, { Routes } from "@/router";

import DeleteEtfPreliminaryLumpSumModalMonthlyVue from "@/components/etf/DeleteEtfPreliminaryLumpSumModalMonthly.vue";
import CreateEtfPreliminaryLumpSumModalMonthlyVue from "@/components/etf/CreateEtfPreliminaryLumpSumModalMonthly.vue";
import ShowEtfPreliminaryLumpSumMonthlyVue from "@/components/etf/ShowEtfPreliminaryLumpSumMonthly.vue";
import DeleteEtfPreliminaryLumpSumModalPieceVue from "@/components/etf/DeleteEtfPreliminaryLumpSumModalPiece.vue";
import CreateEtfPreliminaryLumpSumModalPieceVue from "@/components/etf/CreateEtfPreliminaryLumpSumModalPiece.vue";
import ShowEtfPreliminaryLumpSumPieceVue from "@/components/etf/ShowEtfPreliminaryLumpSumPiece.vue";
import DivError from "@/components/DivError.vue";
import SelectStandard from "@/components/SelectStandard.vue";

import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import type { Etf } from "@/model/etf/Etf";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import { useEtfStore } from "@/stores/EtfStore";
import CreateEtfPreliminaryLumpSumModalYearly from "@/components/etf/CreateEtfPreliminaryLumpSumModalYearly.vue";
import DeleteEtfPreliminaryLumpSumModalYearly from "@/components/etf/DeleteEtfPreliminaryLumpSumModalYearly.vue";
import ShowEtfPreliminaryLumpSumYearly from "@/components/etf/ShowEtfPreliminaryLumpSumYearly.vue";

const serverErrors = ref(new Array<string>());

const etfsLoaded = ref(false);
const yearsLoaded = ref(false);
const selectedYear = ref(undefined as number | undefined);
const displayedYear = ref(undefined as number | undefined);
const displayedEtf = ref(undefined as number | undefined);
const etfsSelectValues = ref({} as Array<SelectBoxValue>);
const yearSelectValues = ref({} as Array<SelectBoxValue>);

const selectedEtf = ref({} as Etf);
const selectedEtfId = ref(undefined as number | undefined);

const etfPreliminaryLumpSums = ref({} as Map<number, EtfPreliminaryLumpSum>);
const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum | undefined);

const createModalMonthly =
  useTemplateRef<typeof CreateEtfPreliminaryLumpSumModalMonthlyVue>(
    "createModalMonthly",
  );
const createModalPiece =
  useTemplateRef<typeof CreateEtfPreliminaryLumpSumModalMonthlyVue>(
    "createModalPiece",
  );
const createModalYearly =
  useTemplateRef<typeof CreateEtfPreliminaryLumpSumModalYearly>(
    "createModalYearly",
  );
const deleteModalMonthly =
  useTemplateRef<typeof CreateEtfPreliminaryLumpSumModalMonthlyVue>(
    "deleteModalMonthly",
  );
const deleteModalPiece =
  useTemplateRef<typeof CreateEtfPreliminaryLumpSumModalMonthlyVue>(
    "deleteModalPiece",
  );
const deleteModalYearly =
  useTemplateRef<typeof CreateEtfPreliminaryLumpSumModalYearly>(
    "deleteModalYearly",
  );

const etfStore = useEtfStore();

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
  etfsSelectValues.value = etfStore.getAsSelectBoxValues();
  const favoriteEtf = etfStore.getFavoriteEtf();
  if (etfId !== undefined) {
    selectedEtfId.value = etfId;
  } else if (favoriteEtf !== undefined) {
    selectedEtfId.value = favoriteEtf.id;
  }
  etfsLoaded.value = true;
};

const loadYears = (etfId: number, year?: number) => {
  serverErrors.value = new Array<string>();
  yearsLoaded.value = false;

  yearSelectValues.value = new Array<SelectBoxValue>();
  etfPreliminaryLumpSums.value = new Map<number, EtfPreliminaryLumpSum>();
  selectedEtfId.value = etfId;
  selectedYear.value = undefined;
  CrudEtfPreliminaryLumpSumService.fetchAllEtfPreliminaryLumpSum(etfId)
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
  etfId: number | undefined,
  type: EtfPreliminaryLumpSumType,
  mep?: EtfPreliminaryLumpSum,
) => {
  if (type == EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH) {
    (
      createModalMonthly.value as typeof CreateEtfPreliminaryLumpSumModalMonthlyVue
    )._show(etfId, mep);
  } else if (type == EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE) {
    (
      createModalPiece.value as typeof CreateEtfPreliminaryLumpSumModalPieceVue
    )._show(etfId, mep);
  } else if (type == EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR) {
    (
      createModalYearly.value as typeof CreateEtfPreliminaryLumpSumModalYearly
    )._show(etfId, mep);
  }
};

const showDeleteEtfPreliminaryLumpSumModal = () => {
  if (
    etfPreliminaryLumpSum.value?.type ==
    EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH
  ) {
    deleteModalMonthly.value?._show(etfPreliminaryLumpSum.value);
  }
  if (
    etfPreliminaryLumpSum.value?.type ==
    EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE
  ) {
    deleteModalPiece.value?._show(etfPreliminaryLumpSum.value);
  } else if (
    etfPreliminaryLumpSum.value?.type ==
    EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR
  ) {
    deleteModalYearly.value?._show(etfPreliminaryLumpSum.value);
  }
};

watch(selectedEtfId, (newVal, oldVal) => {
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
    (selectedEtfId.value || "") != (props.etfId || "") ||
    (selectedYear.value || "") != (props.year || "")
  ) {
    router.push({
      name: Routes.ListEtfPreliminaryLumpSums,
      params: { etfId: selectedEtfId.value, year: selectedYear.value },
    });
  }
};

const reloadView = (etfPreliminaryLumpSum: EtfPreliminaryLumpSum) => {
  if (etfPreliminaryLumpSum.etfId == selectedEtfId.value) {
    if (selectedYear.value === undefined) {
      loadYears(selectedEtfId.value, etfPreliminaryLumpSum.year);
    } else {
      loadYears(selectedEtfId.value, selectedYear.value);
    }
  }
};
</script>
