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

  <div class="custom-container space-y-6">
    <h4 class="text-center text-2xl font-bold">
      {{ $t("General.preliminaryLumpSums") }}
    </h4>

    <Button
      data-testid="preliminary-lump-sum-year-previous"
      v-if="showPreviousYearLink"
      type="button"
      variant="outline"
      size="icon"
      class="fixed left-4 top-1/2 z-20 -translate-y-1/2 h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md"
      @click="navigateToPreviousYear"
    >
      <ChevronLeft class="h-5 w-5" />
    </Button>

    <Button
      data-testid="preliminary-lump-sum-year-next"
      v-if="showNextYearLink"
      type="button"
      variant="outline"
      size="icon"
      class="fixed right-4 top-1/2 z-20 -translate-y-1/2 h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md"
      @click="navigateToNextYear"
    >
      <ChevronRight class="h-5 w-5" />
    </Button>

    <ListPreliminaryLumpSumsDesktop
      class="hidden md:block"
      v-model:selectedEtfId="selectedEtfId"
      :years="years"
      :selected-year="selectedYear"
      :etf-preliminary-lump-sum="etfPreliminaryLumpSum"
      :select-box-values="getAsSelectBoxValues()"
      @select-year="selectYearMobile"
      @select-current-month="selectCurrentMonth"
      @open-create="showCreateEtfPreliminaryLumpSumModal(selectedEtfId, $event)"
      @open-edit="
        showCreateEtfPreliminaryLumpSumModal(
          selectedEtfId,
          etfPreliminaryLumpSum!.type,
          etfPreliminaryLumpSum,
        )
      "
      @open-delete="showDeleteEtfPreliminaryLumpSumModal"
    />

    <ListPreliminaryLumpSumsMobile
      class="block md:hidden"
      v-model:selectedEtfId="selectedEtfId"
      :years-loaded="yearsLoaded"
      :years="years"
      :selected-year="selectedYear"
      :etf-preliminary-lump-sum="etfPreliminaryLumpSum"
      :select-box-values="getAsSelectBoxValues()"
      @select-year="selectYearMobile"
      @select-current-month="selectCurrentMonth"
      @open-create="showCreateEtfPreliminaryLumpSumModal(selectedEtfId, $event)"
      @open-edit="
        showCreateEtfPreliminaryLumpSumModal(
          selectedEtfId,
          etfPreliminaryLumpSum!.type,
          etfPreliminaryLumpSum,
        )
      "
      @open-delete="showDeleteEtfPreliminaryLumpSumModal"
    />

    <DivError :server-errors="serverErrors" />

    <div
      v-if="
        selectedYear && selectedEtfId !== undefined && etfPreliminaryLumpSum
      "
      class="flex justify-center pb-4 px-14 md:px-0"
    >
      <div class="w-full max-w-md">
        <ShowEtfPreliminaryLumpSumMonthlyVue
          v-if="
            etfPreliminaryLumpSum.type ===
            EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH
          "
          :mep="etfPreliminaryLumpSum"
        />
        <ShowEtfPreliminaryLumpSumPieceVue
          v-else-if="
            etfPreliminaryLumpSum.type ===
            EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE
          "
          :mep="etfPreliminaryLumpSum"
        />
        <ShowEtfPreliminaryLumpSumYearly
          v-else-if="
            etfPreliminaryLumpSum.type ===
            EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR
          "
          :mep="etfPreliminaryLumpSum"
        />
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center py-10"
      data-testid="preliminary-lump-sum-empty"
    >
      <span class="text-muted-foreground text-center">
        {{ $t("General.noEntries") }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DivError from "@/components/common/DivError.vue";
import { Button } from "@/components/ui/button";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import type { Etf } from "@/model/etf/Etf";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import router, { Routes } from "@/router";
import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed, ref, useTemplateRef, watch } from "vue";
import CreateEtfPreliminaryLumpSumModalMonthlyVue from "./elements/CreateEtfPreliminaryLumpSumModalMonthly.vue";
import CreateEtfPreliminaryLumpSumModalPieceVue from "./elements/CreateEtfPreliminaryLumpSumModalPiece.vue";
import CreateEtfPreliminaryLumpSumModalYearly from "./elements/CreateEtfPreliminaryLumpSumModalYearly.vue";
import DeleteEtfPreliminaryLumpSumModalMonthlyVue from "./elements/DeleteEtfPreliminaryLumpSumModalMonthly.vue";
import DeleteEtfPreliminaryLumpSumModalPieceVue from "./elements/DeleteEtfPreliminaryLumpSumModalPiece.vue";
import DeleteEtfPreliminaryLumpSumModalYearly from "./elements/DeleteEtfPreliminaryLumpSumModalYearly.vue";
import ListPreliminaryLumpSumsDesktop from "./elements/ListPreliminaryLumpSumsDesktop.vue";
import ListPreliminaryLumpSumsMobile from "./elements/ListPreliminaryLumpSumsMobile.vue";
import ShowEtfPreliminaryLumpSumMonthlyVue from "./elements/ShowEtfPreliminaryLumpSumMonthly.vue";
import ShowEtfPreliminaryLumpSumPieceVue from "./elements/ShowEtfPreliminaryLumpSumPiece.vue";
import ShowEtfPreliminaryLumpSumYearly from "./elements/ShowEtfPreliminaryLumpSumYearly.vue";

const props = defineProps({
  etfId: { type: String, default: undefined },
  year: { type: String, default: undefined },
});

const { getAsSelectBoxValues, getFavoriteEtf } = useEtfStore();

const serverErrors = ref<string[]>([]);
const yearsLoaded = ref(false);
const selectedYear = ref<string | undefined>(props.year);
const years = ref<string[]>([]);
const selectedEtfId = ref<number | undefined>(undefined);

const etfPreliminaryLumpSums = ref<Map<string, EtfPreliminaryLumpSum>>(
  new Map(),
);
const etfPreliminaryLumpSum = ref<EtfPreliminaryLumpSum | undefined>(undefined);

const createModalMonthly =
  useTemplateRef<typeof CreateEtfPreliminaryLumpSumModalMonthlyVue>(
    "createModalMonthly",
  );
const createModalPiece =
  useTemplateRef<typeof CreateEtfPreliminaryLumpSumModalPieceVue>(
    "createModalPiece",
  );
const createModalYearly =
  useTemplateRef<typeof CreateEtfPreliminaryLumpSumModalYearly>(
    "createModalYearly",
  );
const deleteModalMonthly =
  useTemplateRef<typeof DeleteEtfPreliminaryLumpSumModalMonthlyVue>(
    "deleteModalMonthly",
  );
const deleteModalPiece =
  useTemplateRef<typeof DeleteEtfPreliminaryLumpSumModalPieceVue>(
    "deleteModalPiece",
  );
const deleteModalYearly =
  useTemplateRef<typeof DeleteEtfPreliminaryLumpSumModalYearly>(
    "deleteModalYearly",
  );

const loadYears = (etfId: number, year?: string | undefined) => {
  serverErrors.value = [];
  yearsLoaded.value = false;
  years.value = [];
  etfPreliminaryLumpSums.value.clear();
  selectedEtfId.value = etfId;
  selectedYear.value = undefined;

  CrudEtfPreliminaryLumpSumService.fetchAllEtfPreliminaryLumpSum(etfId)
    .then((response) => {
      for (const item of response) {
        const _year = item.year.toString();
        years.value.push(_year);
        etfPreliminaryLumpSums.value.set(_year, item);
      }

      let targetYear = year;
      if (
        targetYear === undefined ||
        !etfPreliminaryLumpSums.value.has(targetYear)
      ) {
        targetYear = Array.from(etfPreliminaryLumpSums.value.keys())
          .pop()
          ?.toString();
      }

      selectedYear.value = targetYear;
      yearsLoaded.value = true;
    })
    .catch(() => {
      routerPush();
    });
};

watch(
  () => [getFavoriteEtf(), getAsSelectBoxValues()] as const,
  ([newFavoriteEtf, newSelectBoxValues]) => {
    const optionsReady =
      newSelectBoxValues !== undefined &&
      (newSelectBoxValues as unknown as SelectBoxValue[]).length > 0;

    if (selectedEtfId.value === undefined) {
      if (props.etfId === undefined) {
        if (optionsReady && newFavoriteEtf !== undefined) {
          selectedEtfId.value = (newFavoriteEtf as unknown as Etf).id;
        }
      } else {
        if (optionsReady) {
          selectedEtfId.value = Number(props.etfId);
        }
      }
    }
  },
  { immediate: true },
);

watch(
  () => [props.etfId, props.year] as const,
  ([newEtfId, newYear]) => {
    if (newEtfId !== undefined) selectedEtfId.value = Number(newEtfId);
    if (newYear !== undefined) selectedYear.value = newYear;
  },
);

watch(
  selectedEtfId,
  (newVal) => {
    if (newVal !== undefined) {
      loadYears(newVal, selectedYear.value);
    }
  },
  { immediate: true },
);

watch(selectedYear, (newVal) => {
  if (newVal !== undefined) {
    etfPreliminaryLumpSum.value = etfPreliminaryLumpSums.value.get(newVal);
    routerPush();
  }
});

const showCreateEtfPreliminaryLumpSumModal = (
  etfId: number | undefined,
  type: EtfPreliminaryLumpSumType,
  mep?: EtfPreliminaryLumpSum,
) => {
  if (type === EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH) {
    createModalMonthly.value?._show(etfId, mep);
  } else if (type === EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE) {
    createModalPiece.value?._show(etfId, mep);
  } else if (type === EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR) {
    createModalYearly.value?._show(etfId, mep);
  }
};

const showDeleteEtfPreliminaryLumpSumModal = () => {
  const type = etfPreliminaryLumpSum.value?.type;
  if (type === EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH) {
    deleteModalMonthly.value?._show(etfPreliminaryLumpSum.value);
  } else if (type === EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE) {
    deleteModalPiece.value?._show(etfPreliminaryLumpSum.value);
  } else if (type === EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR) {
    deleteModalYearly.value?._show(etfPreliminaryLumpSum.value);
  }
};

const selectYearMobile = (year: string) => {
  selectedYear.value = year;
};

const selectCurrentMonth = () => {
  selectedYear.value = years.value[years.value.length - 1];
};

const routerPush = () => {
  const currentEtfIdStr =
    selectedEtfId.value === undefined ? "" : String(selectedEtfId.value);
  const propEtfIdStr = props.etfId || "";
  const currentYearStr = selectedYear.value || "";
  const propYearStr = props.year || "";

  if (currentEtfIdStr !== propEtfIdStr || currentYearStr !== propYearStr) {
    router.push({
      name: Routes.ListEtfPreliminaryLumpSums,
      params: { etfId: selectedEtfId.value, year: selectedYear.value },
    });
  }
};

const reloadView = (lumpSum: EtfPreliminaryLumpSum) => {
  if (lumpSum.etfId === selectedEtfId.value) {
    if (selectedYear.value === undefined) {
      loadYears(selectedEtfId.value, lumpSum.year.toString());
    } else {
      loadYears(selectedEtfId.value, selectedYear.value);
    }
  }
};

const showPreviousYearLink = computed(() =>
  years.value.some((year) => year < selectedYear.value!),
);
const showNextYearLink = computed(() =>
  years.value.some((year) => year > selectedYear.value!),
);

const navigateToPreviousYear = () => {
  if (!selectedYear.value) return;
  const current = Number(selectedYear.value);
  const filtered = years.value.map(Number).filter((year) => year < current);
  if (filtered.length > 0) {
    selectedYear.value = Math.max(...filtered).toString();
  }
};

const navigateToNextYear = () => {
  if (!selectedYear.value) return;
  const current = Number(selectedYear.value);
  const filtered = years.value.map(Number).filter((year) => year > current);
  if (filtered.length > 0) {
    selectedYear.value = Math.min(...filtered).toString();
  }
};
</script>
