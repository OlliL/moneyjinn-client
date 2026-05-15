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
  <div class="container mx-auto py-6 space-y-6 text-center">
    <div>
      <h4 class="text-2xl font-bold">
        {{ $t("General.preliminaryLumpSums") }}
      </h4>
    </div>
    <div class="flex justify-center">
      <div class="w-full max-w-5xl space-y-4">
        <div class="grid gap-3 md:grid-cols-12 items-end">
          <div class="md:col-span-6">
            <SelectStandard
              v-model="selectedEtfId"
              id="etf"
              :field-label="$t('General.selectEtf')"
              :select-box-values="getAsSelectBoxValues()"
            />
          </div>
          <div class="md:col-span-2" v-if="selectedEtf">
            <Button
              type="button"
              @click="
                showCreateEtfPreliminaryLumpSumModal(
                  selectedEtfId,
                  EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH,
                )
              "
            >
              {{ $t("ETFPreliminaryLumpSum.newMonthly") }}
            </Button>
          </div>
          <div class="md:col-span-2" v-if="selectedEtf">
            <Button
              type="button"
              @click="
                showCreateEtfPreliminaryLumpSumModal(
                  selectedEtfId,
                  EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE,
                )
              "
            >
              {{ $t("ETFPreliminaryLumpSum.newPiece") }}
            </Button>
          </div>
          <div class="md:col-span-2" v-if="selectedEtf">
            <Button
              type="button"
              @click="
                showCreateEtfPreliminaryLumpSumModal(
                  selectedEtfId,
                  EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR,
                )
              "
            >
              {{ $t("ETFPreliminaryLumpSum.newYearly") }}
            </Button>
          </div>
        </div>
      </div>

      <div class="flex justify-center pb-3">
        <div class="w-full max-w-xs">
          <div class="flex items-center justify-start" v-if="yearsLoaded">
            <button
              @click="navigateToPreviousYear"
              :class="['mr-2', { invisible: !showPreviousYearLink }]"
            >
              <ChevronLeft class="h-6 w-6 text-primary" />
            </button>
            <select
              class="h-9 grow rounded-md border border-input bg-background px-3 text-sm"
              v-model="selectedYear"
              style="min-width: 6rem"
            >
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>

            <button
              @click="navigateToNextYear"
              :class="['ml-2', { invisible: !showNextYearLink }]"
            >
              <ChevronRight class="h-6 w-6 text-primary" />
            </button>
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
      <div class="flex justify-center pb-4">
        <div class="w-full max-w-md">
          <ShowEtfPreliminaryLumpSumMonthlyVue :mep="etfPreliminaryLumpSum" />
        </div>
      </div>
      <div class="flex justify-center pb-4">
        <div class="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            @click="
              showCreateEtfPreliminaryLumpSumModal(
                selectedEtfId,
                etfPreliminaryLumpSum.type,
                etfPreliminaryLumpSum,
              )
            "
          >
            {{ $t("General.edit") }}
          </Button>
          <Button
            type="button"
            variant="destructive"
            @click="showDeleteEtfPreliminaryLumpSumModal"
          >
            {{ $t("General.delete") }}
          </Button>
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
      <div class="flex justify-center pb-4">
        <div class="w-full max-w-md">
          <ShowEtfPreliminaryLumpSumPieceVue :mep="etfPreliminaryLumpSum" />
        </div>
      </div>
      <div class="flex justify-center pb-4">
        <div class="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            @click="
              showCreateEtfPreliminaryLumpSumModal(
                selectedEtfId,
                etfPreliminaryLumpSum.type,
                etfPreliminaryLumpSum,
              )
            "
          >
            {{ $t("General.edit") }}
          </Button>
          <Button
            type="button"
            variant="destructive"
            @click="showDeleteEtfPreliminaryLumpSumModal"
          >
            {{ $t("General.delete") }}
          </Button>
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
      <div class="flex justify-center pb-4">
        <div class="w-full max-w-md">
          <ShowEtfPreliminaryLumpSumYearly :mep="etfPreliminaryLumpSum" />
        </div>
      </div>
      <div class="flex justify-center pb-4">
        <div class="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            @click="
              showCreateEtfPreliminaryLumpSumModal(
                selectedEtfId,
                etfPreliminaryLumpSum.type,
                etfPreliminaryLumpSum,
              )
            "
          >
            {{ $t("General.edit") }}
          </Button>
          <Button
            type="button"
            variant="destructive"
            @click="showDeleteEtfPreliminaryLumpSumModal"
          >
            {{ $t("General.delete") }}
          </Button>
        </div>
      </div>
    </div>
    <!---->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, useTemplateRef, computed } from "vue";
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
import type { Etf } from "@/model/etf/Etf";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import { useEtfStore } from "@/stores/EtfStore";
import CreateEtfPreliminaryLumpSumModalYearly from "@/components/etf/CreateEtfPreliminaryLumpSumModalYearly.vue";
import DeleteEtfPreliminaryLumpSumModalYearly from "@/components/etf/DeleteEtfPreliminaryLumpSumModalYearly.vue";
import ShowEtfPreliminaryLumpSumYearly from "@/components/etf/ShowEtfPreliminaryLumpSumYearly.vue";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const serverErrors = ref(new Array<string>());

const yearsLoaded = ref(false);
const selectedYear = ref(undefined as number | undefined);
const displayedYear = ref(undefined as number | undefined);
const displayedEtf = ref(undefined as number | undefined);
const years = ref({} as Array<number>);

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

const { getAsSelectBoxValues, getFavoriteEtf } = useEtfStore();

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

  serverErrors.value = new Array<string>();
  const favoriteEtf = getFavoriteEtf();
  if (etfId !== undefined) {
    selectedEtfId.value = etfId;
  } else if (favoriteEtf !== undefined) {
    selectedEtfId.value = favoriteEtf.id;
  }
});

const loadYears = (etfId: number, year?: number) => {
  serverErrors.value = new Array<string>();
  yearsLoaded.value = false;

  years.value = [];
  etfPreliminaryLumpSums.value = new Map<number, EtfPreliminaryLumpSum>();
  selectedEtfId.value = etfId;
  selectedYear.value = undefined;
  CrudEtfPreliminaryLumpSumService.fetchAllEtfPreliminaryLumpSum(etfId)
    .then((response) => {
      for (let _etfPreliminaryLumpSum of response) {
        let _year = _etfPreliminaryLumpSum.year;
        years.value.push(_year);
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

const showPreviousYearLink = computed(() => {
  return years.value.some((year) => year < selectedYear.value!);
});
const showNextYearLink = computed(() => {
  return years.value.some((year) => year > selectedYear.value!);
});

const navigateToPreviousYear = () => {
  selectedYear.value =
    Math.max(
      ...years.value
        .filter((year) => year < selectedYear.value!)
        .map((year) => year),
    ) || selectedYear.value;
};
const navigateToNextYear = () => {
  selectedYear.value =
    Math.min(
      ...years.value
        .filter((year) => year > selectedYear.value!)
        .map((year) => year),
    ) || selectedYear.value;
};
</script>
