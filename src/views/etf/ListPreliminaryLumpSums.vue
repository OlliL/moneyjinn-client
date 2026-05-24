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
    <div class="text-center">
      <h4 class="text-2xl font-bold">
        {{ $t("General.preliminaryLumpSums") }}
      </h4>
    </div>

    <div class="fixed left-4 top-1/2 z-20 -translate-y-1/2">
      <Button
        data-testid="preliminary-lump-sum-year-previous"
        v-if="showPreviousYearLink"
        type="button"
        variant="outline"
        size="icon"
        class="h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md"
        @click="navigateToPreviousYear"
      >
        <ChevronLeft class="h-5 w-5" />
      </Button>
    </div>
    <div class="fixed right-4 top-1/2 z-20 -translate-y-1/2">
      <Button
        data-testid="preliminary-lump-sum-year-next"
        v-if="showNextYearLink"
        type="button"
        variant="outline"
        size="icon"
        class="h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md"
        @click="navigateToNextYear"
      >
        <ChevronRight class="h-5 w-5" />
      </Button>
    </div>

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
      class="md:hidden"
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
        selectedYear &&
        selectedEtfId !== undefined &&
        etfPreliminaryLumpSum?.type ==
          EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH
      "
    >
      <div class="flex justify-center pb-4 px-14 md:px-0">
        <div class="w-full max-w-md">
          <ShowEtfPreliminaryLumpSumMonthlyVue :mep="etfPreliminaryLumpSum" />
        </div>
      </div>
    </div>
    <div
      v-else-if="
        selectedYear &&
        selectedEtfId !== undefined &&
        etfPreliminaryLumpSum?.type ==
          EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE
      "
    >
      <div class="flex justify-center pb-4 px-14 md:px-0">
        <div class="w-full max-w-md">
          <ShowEtfPreliminaryLumpSumPieceVue :mep="etfPreliminaryLumpSum" />
        </div>
      </div>
    </div>
    <div
      v-else-if="
        selectedYear &&
        selectedEtfId !== undefined &&
        etfPreliminaryLumpSum?.type == EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR
      "
    >
      <div class="flex justify-center pb-4 px-14 md:px-0">
        <div class="w-full max-w-md">
          <ShowEtfPreliminaryLumpSumYearly :mep="etfPreliminaryLumpSum" />
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center py-10"
      data-testid="preliminary-lump-sum-empty"
    >
      <span class="text-muted-foreground text-center">{{
        $t("General.noEntries")
      }}</span>
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
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
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

const serverErrors = ref(new Array<string>());
const yearsLoaded = ref(false);
const selectedYear = ref(undefined as string | undefined);
const displayedYear = ref(undefined as string | undefined);
const displayedEtf = ref(undefined as number | undefined);
const years = ref([] as Array<string>);
const selectedEtfId = ref(undefined as number | undefined);

const etfPreliminaryLumpSums = ref({} as Map<string, EtfPreliminaryLumpSum>);
const etfPreliminaryLumpSum = ref({} as EtfPreliminaryLumpSum | undefined);

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

const { getAsSelectBoxValues, getFavoriteEtf } = useEtfStore();

const props = defineProps({
  etfId: { type: String, default: undefined },
  year: { type: String, default: undefined },
});

onMounted(() => {
  const year: string | undefined = props.year ? props.year : undefined;
  selectedYear.value = year;
});

watch(
  () => [getFavoriteEtf(), getAsSelectBoxValues()],
  ([newFavoriteEtf, newSelectBoxValues]) => {
    if (selectedEtfId.value === undefined) {
      if (
        props.etfId !== undefined &&
        newSelectBoxValues !== undefined &&
        (newSelectBoxValues as any as SelectBoxValue[]).length > 0
      ) {
        selectedEtfId.value = +props.etfId;
      } else if (newFavoriteEtf !== undefined) {
        selectedEtfId.value = (newFavoriteEtf as any as Etf).id;
      }
    }
  },
  { immediate: true },
);

const loadYears = (etfId: number, year?: string | undefined) => {
  serverErrors.value = new Array<string>();
  yearsLoaded.value = false;
  years.value = [];
  etfPreliminaryLumpSums.value = new Map<string, EtfPreliminaryLumpSum>();
  selectedEtfId.value = etfId;
  selectedYear.value = undefined;

  CrudEtfPreliminaryLumpSumService.fetchAllEtfPreliminaryLumpSum(etfId)
    .then((response) => {
      for (let _etfPreliminaryLumpSum of response) {
        let _year = _etfPreliminaryLumpSum.year.toString();
        years.value.push(_year);
        etfPreliminaryLumpSums.value.set(_year, _etfPreliminaryLumpSum);
      }

      if (year === undefined || !etfPreliminaryLumpSums.value.has(year)) {
        const _year = Array.from(etfPreliminaryLumpSums.value.keys()).pop();
        displayedYear.value = _year?.toString();
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
    createModalMonthly.value?._show(etfId, mep);
  } else if (type == EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE) {
    createModalPiece.value?._show(etfId, mep);
  } else if (type == EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR) {
    createModalYearly.value?._show(etfId, mep);
  }
};

const showDeleteEtfPreliminaryLumpSumModal = () => {
  if (
    etfPreliminaryLumpSum.value?.type ==
    EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH
  ) {
    deleteModalMonthly.value?._show(etfPreliminaryLumpSum.value);
  } else if (
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

const selectYearMobile = (year: string) => {
  selectedYear.value = year;
};
const selectCurrentMonth = () => {
  selectedYear.value = years.value[years.value.length - 1];
};

watch(
  selectedEtfId,
  (newVal, oldVal) => {
    if (
      newVal != oldVal &&
      newVal !== undefined &&
      newVal != displayedEtf.value
    ) {
      displayedEtf.value = newVal;
      loadYears(newVal, selectedYear.value);
    }
  },
  { immediate: true },
);

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
      loadYears(selectedEtfId.value, etfPreliminaryLumpSum.year.toString());
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
  selectedYear.value =
    Math.max(
      ...years.value
        .map(Number)
        .filter((year) => year < Number(selectedYear.value!)),
    ).toString() || selectedYear.value;
};
const navigateToNextYear = () => {
  selectedYear.value =
    Math.min(
      ...years.value
        .map(Number)
        .filter((year) => year > Number(selectedYear.value!)),
    ).toString() || selectedYear.value;
};
</script>
