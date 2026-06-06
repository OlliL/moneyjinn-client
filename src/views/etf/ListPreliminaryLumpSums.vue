<template>
  <CreateEtfPreliminaryLumpSumModalMonthly />
  <CreateEtfPreliminaryLumpSumModalPiece />
  <CreateEtfPreliminaryLumpSumModalYearly />
  <DeleteEtfPreliminaryLumpSumModalMonthly />
  <DeleteEtfPreliminaryLumpSumModalPiece />
  <DeleteEtfPreliminaryLumpSumModalYearly />

  <div class="custom-container space-y-6">
    <h4 class="text-center text-2xl font-bold">
      {{ $t("General.preliminaryLumpSums") }}
    </h4>

    <ButtonChevrons
      test-id-prefix="preliminary-lump-sum-year"
      :show-previous-chevron="showPreviousYearLink"
      :show-next-chevron="showNextYearLink"
      @navigate-to-previous="navigateToPreviousYear"
      @navigate-to-next="navigateToNextYear"
    />

    <div>
      <ListPreliminaryLumpSumsDesktop
        class="hidden md:block"
        v-model:selectedEtfId="selectedEtfId"
        :years="years"
        :selected-year="selectedYear"
        :etf-preliminary-lump-sum="etfPreliminaryLumpSum"
        :select-box-values="etfOptions"
        @select-year="selectYearMobile"
        @select-current-month="selectCurrentMonth"
        @open-edit="
          showEditEtfPreliminaryLumpSumModal(
            selectedEtfId,
            etfPreliminaryLumpSum!.type,
            etfPreliminaryLumpSum!,
          )
        "
        @open-delete="showDeleteEtfPreliminaryLumpSumModal"
      >
        <template #create-menu="{ closeMenu }">
          <div
            class="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 flex w-56 flex-col gap-0.5 rounded-xl border bg-background p-2 text-foreground shadow-lg"
            data-testid="etf-preliminary-sump-sum-create-menu"
          >
            <Button
              v-for="config in typeConfigs"
              :key="config.type"
              variant="ghost"
              class="w-full justify-start text-sm px-3 py-2"
              :data-testid="
                'preliminary-lump-sum-desktop-create-type-' + config.id
              "
              @click="
                showCreateEtfPreliminaryLumpSumModal(
                  selectedEtfId,
                  config.type,
                );
                closeMenu();
              "
            >
              {{ $t(config.label) }}
            </Button>
          </div>
        </template>
      </ListPreliminaryLumpSumsDesktop>

      <ListPreliminaryLumpSumsMobile
        class="block md:hidden"
        v-model:selectedEtfId="selectedEtfId"
        :years-loaded="yearsLoaded"
        :years="years"
        :selected-year="selectedYear"
        :etf-preliminary-lump-sum="etfPreliminaryLumpSum"
        :select-box-values="etfOptions"
        @select-year="selectYearMobile"
        @select-current-month="selectCurrentMonth"
        @open-edit="
          showEditEtfPreliminaryLumpSumModal(
            selectedEtfId,
            etfPreliminaryLumpSum!.type,
            etfPreliminaryLumpSum!,
          )
        "
        @open-delete="showDeleteEtfPreliminaryLumpSumModal"
      >
        <template #create-menu="{ closeMenu }">
          <div
            class="fixed right-20 bottom-26 z-50 flex w-52 flex-col gap-1 rounded-md border bg-popover text-popover-foreground shadow-md p-2"
            data-testid="etf-preliminary-sump-sum-create-menu"
          >
            <Button
              v-for="config in typeConfigs"
              :key="config.type"
              variant="ghost"
              class="w-full justify-start px-3 py-2 text-left text-sm"
              :data-testid="
                'preliminary-lump-sum-mobile-create-type-' + config.id
              "
              @click="
                showCreateEtfPreliminaryLumpSumModal(
                  selectedEtfId,
                  config.type,
                );
                closeMenu();
              "
            >
              {{ $t(config.label) }}
            </Button>
          </div>
        </template>
      </ListPreliminaryLumpSumsMobile>

      <DivError :server-errors="serverErrors" />

      <div
        v-if="
          selectedYear && selectedEtfId !== undefined && etfPreliminaryLumpSum
        "
        class="flex justify-center pb-4 px-14 md:px-0"
      >
        <div class="w-full max-w-md">
          <component :is="detailComponent" :mep="etfPreliminaryLumpSum" />
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
  </div>
</template>

<script lang="ts" setup>
import ButtonChevrons from "@/components/common/ButtonChevrons.vue";
import DivError from "@/components/common/DivError.vue";
import { Button } from "@/components/ui/button";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import type { Etf } from "@/model/etf/Etf";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import router, { Routes } from "@/router";
import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";
import { computed, ref, watch, type Component } from "vue";
import useCreateEtfPreliminaryLumpSumModalMonthlyStore from "./elements/CreateEtfPreliminaryLumpSumModalMonthly.store";
import CreateEtfPreliminaryLumpSumModalMonthly from "./elements/CreateEtfPreliminaryLumpSumModalMonthly.vue";
import useCreateEtfPreliminaryLumpSumModalPieceStore from "./elements/CreateEtfPreliminaryLumpSumModalPiece.store";
import CreateEtfPreliminaryLumpSumModalPiece from "./elements/CreateEtfPreliminaryLumpSumModalPiece.vue";
import useCreateEtfPreliminaryLumpSumModalYearlyStore from "./elements/CreateEtfPreliminaryLumpSumModalYearly.store";
import CreateEtfPreliminaryLumpSumModalYearly from "./elements/CreateEtfPreliminaryLumpSumModalYearly.vue";
import useDeleteEtfPreliminaryLumpSumModalMonthlyStore from "./elements/DeleteEtfPreliminaryLumpSumModalMonthly.store";
import DeleteEtfPreliminaryLumpSumModalMonthly from "./elements/DeleteEtfPreliminaryLumpSumModalMonthly.vue";
import useDeleteEtfPreliminaryLumpSumModalPieceStore from "./elements/DeleteEtfPreliminaryLumpSumModalPiece.store";
import DeleteEtfPreliminaryLumpSumModalPiece from "./elements/DeleteEtfPreliminaryLumpSumModalPiece.vue";
import useDeleteEtfPreliminaryLumpSumModalYearlyStore from "./elements/DeleteEtfPreliminaryLumpSumModalYearly.store";
import DeleteEtfPreliminaryLumpSumModalYearly from "./elements/DeleteEtfPreliminaryLumpSumModalYearly.vue";
import ListPreliminaryLumpSumsDesktop from "./elements/ListPreliminaryLumpSumsDesktop.vue";
import ListPreliminaryLumpSumsMobile from "./elements/ListPreliminaryLumpSumsMobile.vue";
import ShowEtfPreliminaryLumpSumMonthlyVue from "./elements/ShowEtfPreliminaryLumpSumMonthly.vue";
import ShowEtfPreliminaryLumpSumPieceVue from "./elements/ShowEtfPreliminaryLumpSumPiece.vue";
import ShowEtfPreliminaryLumpSumYearly from "./elements/ShowEtfPreliminaryLumpSumYearly.vue";

const props = withDefaults(
  defineProps<{
    etfId?: string;
    year?: string;
  }>(),
  {
    etfId: undefined,
    year: undefined,
  },
);

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
const {
  openCreateEtfPreliminaryLumpSumMonthly,
  openEditEtfPreliminaryLumpSumMonthly,
} = useCreateEtfPreliminaryLumpSumModalMonthlyStore();
const {
  openCreateEtfPreliminaryLumpSumPiece,
  openEditEtfPreliminaryLumpSumPiece,
} = useCreateEtfPreliminaryLumpSumModalPieceStore();
const {
  openCreateEtfPreliminaryLumpSumYearly,
  openEditEtfPreliminaryLumpSumYearly,
} = useCreateEtfPreliminaryLumpSumModalYearlyStore();
const { openDeleteEtfPreliminaryLumpSumMonthly } =
  useDeleteEtfPreliminaryLumpSumModalMonthlyStore();
const { openDeleteEtfPreliminaryLumpSumPiece } =
  useDeleteEtfPreliminaryLumpSumModalPieceStore();
const { openDeleteEtfPreliminaryLumpSumYearly } =
  useDeleteEtfPreliminaryLumpSumModalYearlyStore();

interface TypeConfigEntry {
  id: string;
  label: string;
  show: Component;
}

const etfOptions = computed(() => getAsSelectBoxValues());

const TYPE_CONFIG: Partial<Record<EtfPreliminaryLumpSumType, TypeConfigEntry>> =
  {
    // Changed to use local refs for visibility
    [EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH]: {
      id: "month",
      label: "ETFPreliminaryLumpSum.newMonthly",
      show: ShowEtfPreliminaryLumpSumMonthlyVue,
    },
    [EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE]: {
      id: "piece",
      label: "ETFPreliminaryLumpSum.newPiece",
      show: ShowEtfPreliminaryLumpSumPieceVue,
    },
    [EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR]: {
      id: "yearly",
      label: "ETFPreliminaryLumpSum.newYearly",
      show: ShowEtfPreliminaryLumpSumYearly,
    },
  };

const typeConfigs = computed(() =>
  Object.entries(TYPE_CONFIG).map(([type, config]) => ({
    type: Number(type) as EtfPreliminaryLumpSumType,
    ...(config as TypeConfigEntry),
  })),
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

      let targetYear =
        year && etfPreliminaryLumpSums.value.has(year) ? year : undefined;
      if (targetYear === undefined && years.value.length > 0) {
        targetYear = Math.max(...years.value.map(Number)).toString();
      }

      selectedYear.value = targetYear;
      yearsLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      routerPush();
    });
};

watch(
  () => [getFavoriteEtf(), getAsSelectBoxValues()] as const,
  ([newFavoriteEtf, newSelectBoxValues]) => {
    const optionsReady =
      newSelectBoxValues !== undefined &&
      (newSelectBoxValues as unknown as SelectBoxValue[]).length > 0;

    if (selectedEtfId.value === undefined && optionsReady) {
      if (props.etfId === undefined) {
        if (newFavoriteEtf !== undefined) {
          selectedEtfId.value = (newFavoriteEtf as unknown as Etf).id;
        }
      } else {
        selectedEtfId.value = Number(props.etfId);
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

const showEditEtfPreliminaryLumpSumModal = (
  etfId: number | undefined,
  type: EtfPreliminaryLumpSumType,
  mep: EtfPreliminaryLumpSum,
) => {
  if (type === EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH) {
    openEditEtfPreliminaryLumpSumMonthly(etfId, mep, reloadView);
  } else if (type === EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE) {
    openEditEtfPreliminaryLumpSumPiece(etfId, mep, reloadView);
  } else {
    openEditEtfPreliminaryLumpSumYearly(etfId, mep, reloadView);
  }
};

const showCreateEtfPreliminaryLumpSumModal = (
  etfId: number | undefined,
  type: EtfPreliminaryLumpSumType,
) => {
  if (type === EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH) {
    openCreateEtfPreliminaryLumpSumMonthly(etfId, reloadView);
  } else if (type === EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE) {
    openCreateEtfPreliminaryLumpSumPiece(etfId, reloadView);
  } else {
    openCreateEtfPreliminaryLumpSumYearly(etfId, reloadView);
  }
};

const showDeleteEtfPreliminaryLumpSumModal = () => {
  if (etfPreliminaryLumpSum.value) {
    if (
      etfPreliminaryLumpSum.value.type ===
      EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH
    ) {
      openDeleteEtfPreliminaryLumpSumMonthly(
        etfPreliminaryLumpSum.value,
        reloadView,
      );
    } else if (
      etfPreliminaryLumpSum.value.type ===
      EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE
    ) {
      openDeleteEtfPreliminaryLumpSumPiece(
        etfPreliminaryLumpSum.value,
        reloadView,
      );
    } else {
      openDeleteEtfPreliminaryLumpSumYearly(
        etfPreliminaryLumpSum.value,
        reloadView,
      );
    }
  }
};

const selectYearMobile = (year: string) => (selectedYear.value = year);

const selectCurrentMonth = () => {
  if (years.value.length > 0) {
    selectedYear.value = Math.max(...years.value.map(Number)).toString();
  }
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

const detailComponent = computed(() => {
  const type = etfPreliminaryLumpSum.value?.type;
  return type ? TYPE_CONFIG[type]?.show : null;
});

const reloadView = (lumpSum: EtfPreliminaryLumpSum) => {
  if (lumpSum.etfId === selectedEtfId.value) {
    loadYears(
      selectedEtfId.value,
      selectedYear.value ?? lumpSum.year.toString(),
    );
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
