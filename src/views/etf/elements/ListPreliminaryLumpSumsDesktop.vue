<template>
  <div class="space-y-6">
    <div class="mx-auto w-full max-w-md grid grid-cols-12 gap-3 items-end">
      <div class="col-span-9">
        <SelectStandard
          v-model="selectedEtfId"
          id="etf-desktop"
          :field-label="$t('General.selectEtf')"
          :select-box-values="selectBoxValues"
        />
      </div>

      <div class="col-span-3 grid" v-if="selectedEtfId !== undefined">
        <MonthYearDesktopNavigator
          :years="years"
          :months="[]"
          :selected-year="selectedYear ?? ''"
          @select-year="$emit('select-year', $event)"
          @select-current-month="$emit('select-current-month')"
        />
      </div>
    </div>

    <div
      class="flex flex-wrap items-center justify-center gap-3"
      ref="createButtonRefDesktop"
      v-if="selectedEtfId !== undefined"
    >
      <div class="relative">
        <Button
          data-testid="preliminary-lump-sum-create"
          type="button"
          @click="toggleTypeSelector"
        >
          {{ $t("General.new") }}
        </Button>

        <div
          v-if="showTypeSelector"
          data-testid="etf-preliminary-sump-sum-create-menu"
          class="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 flex w-56 flex-col gap-0.5 rounded-xl border bg-background p-2 text-foreground shadow-lg"
        >
          <Button
            type="button"
            data-testid="preliminary-lump-sum-mobile-create-type-month"
            variant="ghost"
            class="w-full justify-start text-sm px-3 py-2"
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
            class="w-full justify-start text-sm px-3 py-2"
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
            class="w-full justify-start text-sm px-3 py-2"
            @click="selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR)"
          >
            {{ $t("ETFPreliminaryLumpSum.newYearly") }}
          </Button>
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
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

const selectedEtfId = defineModel<number | undefined>("selectedEtfId");

defineProps<{
  years: string[];
  selectedYear: string | undefined;
  etfPreliminaryLumpSum: EtfPreliminaryLumpSum | undefined;
  selectBoxValues: SelectBoxValue[];
}>();

const emit = defineEmits<{
  (e: "select-year", year: string): void;
  (e: "select-current-month"): void;
  (e: "open-create", type: EtfPreliminaryLumpSumType): void;
  (e: "open-edit"): void;
  (e: "open-delete"): void;
}>();

const showTypeSelector = ref(false);
const createButtonRefDesktop = ref<HTMLElement | null>(null);

const toggleTypeSelector = () => {
  showTypeSelector.value = !showTypeSelector.value;
};

const selectCreateType = (type: EtfPreliminaryLumpSumType) => {
  showTypeSelector.value = false;
  emit("open-create", type);
};

onClickOutside(createButtonRefDesktop, () => {
  showTypeSelector.value = false;
});
</script>
