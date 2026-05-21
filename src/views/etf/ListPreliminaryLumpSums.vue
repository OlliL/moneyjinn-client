<template>
  <div class="inline-block" ref="createButtonRef">
    <ButtonCreate
      data-testid="etf-preliminary-sump-sum-create"
      v-if="selectedEtfId !== undefined"
      @click="showTypeSelection"
    />

    <div
      v-if="showTypeSelector"
      ref="typeSelectorRef"
      class="fixed md:hidden right-20 bottom-[calc(3rem+3rem)] z-50 w-52 rounded-md border bg-popover text-popover-foreground shadow-md p-2"
      data-testid="etf-preliminary-sump-sum-create-menu"
    >
      <div class="flex flex-col">
        <button
          type="button"
          class="text-sm px-3 py-2 text-left hover:bg-muted rounded"
          @click="selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH)"
        >
          {{ $t("ETFPreliminaryLumpSum.newMonthly") }}
        </button>
        <button
          type="button"
          class="text-sm px-3 py-2 text-left hover:bg-muted rounded"
          @click="selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE)"
        >
          {{ $t("ETFPreliminaryLumpSum.newPiece") }}
        </button>
        <button
          type="button"
          class="text-sm px-3 py-2 text-left hover:bg-muted rounded"
          @click="selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR)"
        >
          {{ $t("ETFPreliminaryLumpSum.newYearly") }}
        </button>
      </div>
    </div>
  </div>

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
    <div class="flex justify-center">
      <div class="w-full max-w-3xl flex flex-col items-center gap-6">
        <div class="grid gap-3 md:grid-cols-24 items-end w-full">
          <div class="md:col-span-9">
            <SelectStandard
              v-model="selectedEtfId"
              id="etf"
              :field-label="$t('General.selectEtf')"
              :select-box-values="getAsSelectBoxValues()"
            />
          </div>
          <div
            class="md:col-span-5 hidden md:block"
            v-if="selectedEtfId !== undefined"
          >
            <Button
              data-testid="preliminary-lump-sum-create-monthly"
              type="button"
              class="w-full"
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
          <div
            class="md:col-span-5 hidden md:block"
            v-if="selectedEtfId !== undefined"
          >
            <Button
              data-testid="preliminary-lump-sum-create-piece"
              type="button"
              class="w-full"
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
          <div
            class="md:col-span-5 hidden md:block"
            v-if="selectedEtfId !== undefined"
          >
            <Button
              data-testid="preliminary-lump-sum-create-yearly"
              type="button"
              class="w-full"
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

        <MobilePeriodSheetNavigator
          v-if="selectedEtfId !== undefined"
          :data-loaded="yearsLoaded"
          :years="years"
          :months="[]"
          :selected-year="selectedYear ?? ''"
          :selected-month="0"
          test-id-prefix="preliminary-lump-sum-mobile"
          navigator-test-id-prefix="preliminary-lump-sum-year-mobile"
          title-key="General.preliminaryLumpSums"
          label-key="General.year"
          select-label-key="General.select"
          @select-year="selectYearMobile"
        />

        <div class="fixed left-4 top-1/2 z-20 -translate-y-1/2">
          <Button
            data-testid="reports-previous-month"
            v-if="showPreviousYearLink"
            type="button"
            variant="outline"
            size="icon"
            class="h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md focus-visible:shadow-md supports-backdrop-filter:bg-background/70"
            @click="navigateToPreviousYear"
          >
            <ChevronLeft class="h-5 w-5" />
          </Button>
        </div>
        <div class="fixed right-4 top-1/2 z-20 -translate-y-1/2">
          <Button
            data-testid="reports-next-month"
            v-if="showNextYearLink"
            type="button"
            variant="outline"
            size="icon"
            class="h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md focus-visible:shadow-md supports-backdrop-filter:bg-background/70"
            @click="navigateToNextYear"
          >
            <ChevronRight class="h-5 w-5" />
          </Button>
        </div>

        <div
          class="hidden md:flex justify-center pb-3 w-full"
          v-if="yearsLoaded"
        >
          <div class="w-full max-w-xs flex items-center justify-center">
            <Button
              data-testid="preliminary-lump-sum-year-previous"
              variant="outline"
              size="icon"
              type="button"
              @click="navigateToPreviousYear"
              :class="['mr-2', { invisible: !showPreviousYearLink }]"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>

            <Select v-model="selectedYear">
              <SelectTrigger class="h-9 w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              data-testid="preliminary-lump-sum-year-next"
              variant="outline"
              size="icon"
              type="button"
              @click="navigateToNextYear"
              :class="['ml-2', { invisible: !showNextYearLink }]"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <DivError :server-errors="serverErrors" />
    <div
      v-if="
        selectedYear &&
        selectedEtfId !== undefined &&
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
            data-testid="preliminary-lump-sum-edit"
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
            data-testid="preliminary-lump-sum-delete"
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
        selectedEtfId !== undefined &&
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
            data-testid="preliminary-lump-sum-edit"
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
            data-testid="preliminary-lump-sum-delete"
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
        selectedEtfId !== undefined &&
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
            data-testid="preliminary-lump-sum-edit"
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
            data-testid="preliminary-lump-sum-delete"
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
import ButtonCreate from "@/components/ButtonCreate.vue";
import DivError from "@/components/DivError.vue";
import MobilePeriodSheetNavigator from "@/components/navigation/MobilePeriodSheetNavigator.vue";
import SelectStandard from "@/components/SelectStandard.vue";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import router, { Routes } from "@/router";
import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { useEtfStore } from "@/stores/EtfStore";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import CreateEtfPreliminaryLumpSumModalMonthlyVue from "./elements/CreateEtfPreliminaryLumpSumModalMonthly.vue";
import CreateEtfPreliminaryLumpSumModalPieceVue from "./elements/CreateEtfPreliminaryLumpSumModalPiece.vue";
import CreateEtfPreliminaryLumpSumModalYearly from "./elements/CreateEtfPreliminaryLumpSumModalYearly.vue";
import DeleteEtfPreliminaryLumpSumModalMonthlyVue from "./elements/DeleteEtfPreliminaryLumpSumModalMonthly.vue";
import DeleteEtfPreliminaryLumpSumModalPieceVue from "./elements/DeleteEtfPreliminaryLumpSumModalPiece.vue";
import DeleteEtfPreliminaryLumpSumModalYearly from "./elements/DeleteEtfPreliminaryLumpSumModalYearly.vue";
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
const createType = ref(EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH);

const etfPreliminaryLumpSums = ref({} as Map<string, EtfPreliminaryLumpSum>);
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

const showTypeSelector = ref(false);
const typeSelectorRef = ref<HTMLElement | null>(null);
const createButtonRef = ref<HTMLElement | null>(null);

const docClickHandler = (e: MouseEvent) => {
  if (!showTypeSelector.value) return;
  const target = e.target as Node | null;
  if (!target) return;
  if (
    typeSelectorRef.value?.contains(target) ||
    createButtonRef.value?.contains(target)
  ) {
    return;
  }
  showTypeSelector.value = false;
};

onMounted(() => {
  document.addEventListener("click", docClickHandler);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", docClickHandler);
});

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
  const year: string | undefined = props.year ? props.year : undefined;
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

const showTypeSelection = () => {
  showTypeSelector.value = !showTypeSelector.value;
};

const selectCreateType = (type: EtfPreliminaryLumpSumType) => {
  createType.value = type;
  showTypeSelector.value = false;
  createSelectedPreliminaryLumpSum();
};

const updateCreateType = (value?: any) => {
  if (!value) {
    return;
  }
  createType.value = Number(value) as EtfPreliminaryLumpSumType;
};

const createSelectedPreliminaryLumpSum = () => {
  showCreateEtfPreliminaryLumpSumModal(selectedEtfId.value, createType.value);
};

const selectYearMobile = (year: string) => {
  selectedYear.value = year;
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
      loadYears(selectedEtfId.value, etfPreliminaryLumpSum.year.toString());
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
        .map(Number)
        .filter((year) => Number(year) < Number(selectedYear.value!))
        .map((year) => year),
    ).toString() || selectedYear.value;
};
const navigateToNextYear = () => {
  selectedYear.value =
    Math.min(
      ...years.value
        .map(Number)
        .filter((year) => Number(year) > Number(selectedYear.value!))
        .map((year) => year),
    ).toString() || selectedYear.value;
};
</script>
