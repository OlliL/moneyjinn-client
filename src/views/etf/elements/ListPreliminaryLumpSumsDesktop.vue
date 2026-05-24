<template>
  <div class="space-y-6">
    <div class="flex justify-center">
      <div class="w-full max-w-md items-center">
        <div class="grid gap-3 grid-cols-12 items-end w-full">
          <div class="col-span-12 md:col-span-9">
            <SelectStandard
              v-model="localSelectedEtfId"
              id="etf-desktop"
              :field-label="$t('General.selectEtf')"
              :select-box-values="selectBoxValues"
            />
          </div>

          <div class="hidden md:grid md:col-span-3">
            <MonthYearDesktopNavigator
              v-if="localSelectedEtfId !== undefined"
              :years="years"
              :months="[]"
              :selected-year="selectedYear ?? ''"
              @select-year="$emit('select-year', $event)"
              @select-current-month="$emit('select-current-month')"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex w-full flex-wrap items-center justify-center gap-3"
      ref="createButtonRefDesktop"
      v-if="localSelectedEtfId !== undefined"
    >
      <div class="relative">
        <Button
          data-testid="preliminary-lump-sum-create"
          type="button"
          @click="showTypeSelection"
        >
          {{ $t("General.new") }}
        </Button>

        <div
          v-if="showTypeSelector"
          data-testid="etf-preliminary-sump-sum-create-menu"
          class="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 w-56 rounded-xl border bg-background text-foreground shadow-lg p-2"
        >
          <div class="flex flex-col">
            <Button
              type="button"
              data-testid="preliminary-lump-sum-mobile-create-type-month"
              variant="ghost"
              class="w-full justify-start text-sm px-3 py-2 hover:bg-muted rounded"
              @click="
                selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH)
              "
            >
              {{ $t("ETFPreliminaryLumpSum.newMonthly") }}
            </Button>
            <Button
              type="button"
              data-testid="preliminary-lump-sum-mobile-create-type-piece"
              variant="ghost"
              class="w-full justify-start text-sm px-3 py-2 hover:bg-muted rounded"
              @click="
                selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE)
              "
            >
              {{ $t("ETFPreliminaryLumpSum.newPiece") }}
            </Button>
            <Button
              type="button"
              data-testid="preliminary-lump-sum-mobile-create-type-yearly"
              variant="ghost"
              class="w-full justify-start text-sm px-3 py-2 hover:bg-muted rounded"
              @click="
                selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR)
              "
            >
              {{ $t("ETFPreliminaryLumpSum.newYearly") }}
            </Button>
          </div>
        </div>
      </div>

      <Button
        v-if="etfPreliminaryLumpSum !== undefined"
        data-testid="preliminary-lump-sum-edit"
        type="button"
        @click="$emit('open-edit')"
      >
        {{ $t("General.edit") }}
      </Button>
      <Button
        v-if="etfPreliminaryLumpSum !== undefined"
        data-testid="preliminary-lump-sum-delete"
        type="button"
        variant="destructive"
        @click="$emit('open-delete')"
      >
        {{ $t("General.delete") }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SelectStandard from "@/components/common/SelectStandard.vue";
import MonthYearDesktopNavigator from "@/components/navigation/MonthYearDesktopNavigator.vue";
import { Button } from "@/components/ui/button";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  selectedEtfId: number | undefined;
  years: string[];
  selectedYear: string | undefined;
  etfPreliminaryLumpSum: EtfPreliminaryLumpSum | undefined;
  selectBoxValues: any[];
}>();

const emit = defineEmits<{
  (e: "update:selectedEtfId", value: number | undefined): void;
  (e: "select-year", year: string): void;
  (e: "select-current-month"): void;
  (e: "open-create", type: EtfPreliminaryLumpSumType): void;
  (e: "open-edit"): void;
  (e: "open-delete"): void;
}>();

const localSelectedEtfId = computed({
  get: () => props.selectedEtfId,
  set: (val) => emit("update:selectedEtfId", val),
});

const showTypeSelector = ref(false);
const createButtonRefDesktop = ref<HTMLElement | null>(null);

const showTypeSelection = () => {
  showTypeSelector.value = !showTypeSelector.value;
};
const selectCreateType = (type: EtfPreliminaryLumpSumType) => {
  showTypeSelector.value = false;
  emit("open-create", type);
};

const docClickHandler = (e: MouseEvent) => {
  if (!showTypeSelector.value) return;
  const target = e.target as Node | null;
  if (!target) return;
  if (createButtonRefDesktop.value?.contains(target)) return;
  showTypeSelector.value = false;
};

onMounted(() => {
  document.addEventListener("click", docClickHandler);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", docClickHandler);
});
</script>
