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
      @open-edit="
        showCreateEtfPreliminaryLumpSumModal(
          selectedEtfId,
          etfPreliminaryLumpSum!.type,
          etfPreliminaryLumpSum,
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
            v-for="(config, type) in TYPE_CONFIG"
            :key="type"
            variant="ghost"
            class="w-full justify-start text-sm px-3 py-2"
            :data-testid="
              'preliminary-lump-sum-desktop-create-type-' + config.id
            "
            @click="
              showCreateEtfPreliminaryLumpSumModal(selectedEtfId, Number(type));
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
      :select-box-values="getAsSelectBoxValues()"
      @select-year="selectYearMobile"
      @select-current-month="selectCurrentMonth"
      @open-edit="
        showCreateEtfPreliminaryLumpSumModal(
          selectedEtfId,
          etfPreliminaryLumpSum!.type,
          etfPreliminaryLumpSum,
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
            v-for="(config, type) in TYPE_CONFIG"
            :key="type"
            variant="ghost"
            class="w-full justify-start px-3 py-2 text-left text-sm"
            :data-testid="
              'preliminary-lump-sum-mobile-create-type-' + config.id
            "
            @click="
              showCreateEtfPreliminaryLumpSumModal(selectedEtfId, Number(type));
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

const TYPE_CONFIG: Partial<Record<EtfPreliminaryLumpSumType, any>> = {
  [EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH]: {
    id: "month",
    label: "ETFPreliminaryLumpSum.newMonthly",
    create: createModalMonthly,
    delete: deleteModalMonthly,
    show: ShowEtfPreliminaryLumpSumMonthlyVue,
  },
  [EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE]: {
    id: "piece",
    label: "ETFPreliminaryLumpSum.newPiece",
    create: createModalPiece,
    delete: deleteModalPiece,
    show: ShowEtfPreliminaryLumpSumPieceVue,
  },
  [EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR]: {
    id: "yearly",
    label: "ETFPreliminaryLumpSum.newYearly",
    create: createModalYearly,
    delete: deleteModalYearly,
    show: ShowEtfPreliminaryLumpSumYearly,
  },
};

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

const showCreateEtfPreliminaryLumpSumModal = (
  etfId: number | undefined,
  type: EtfPreliminaryLumpSumType,
  mep?: EtfPreliminaryLumpSum,
) => {
  TYPE_CONFIG[type]?.create.value?._show(etfId, mep);
};

const showDeleteEtfPreliminaryLumpSumModal = () => {
  const type = etfPreliminaryLumpSum.value?.type;
  if (type) {
    TYPE_CONFIG[type]?.delete.value?._show(etfPreliminaryLumpSum.value);
  }
};

const selectYearMobile = (year: string) => {
  selectedYear.value = year;
};

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
