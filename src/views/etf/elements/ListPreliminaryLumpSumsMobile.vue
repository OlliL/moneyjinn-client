<template>
  <div class="space-y-6">
    <div class="mx-auto w-full max-w-md">
      <SelectStandard
        v-model="selectedEtfId"
        id="etf-mobile"
        :field-label="$t('General.selectEtf')"
        :select-box-values="selectBoxValues"
      />
    </div>

    <MonthYearMobileNavigator
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
      @select-year="$emit('select-year', $event)"
      @select-current-month="$emit('select-current-month')"
    />

    <div
      class="inline-block relative"
      ref="createButtonRef"
      v-if="selectedEtfId !== undefined"
    >
      <ButtonMobileCreate
        data-testid="preliminary-lump-sum-mobile-create"
        @click="toggleTypeSelector"
      />
      <ButtonMobileDelete
        data-testid="preliminary-lump-sum-mobile-delete"
        v-if="etfPreliminaryLumpSum !== undefined"
        @click="$emit('open-delete')"
      />
      <ButtonMobileEdit
        data-testid="preliminary-lump-sum-mobile-edit"
        v-if="etfPreliminaryLumpSum !== undefined"
        @click="$emit('open-edit')"
      />

      <div
        v-if="showTypeSelector"
        class="fixed right-20 bottom-26 z-50 flex w-52 flex-col gap-1 rounded-md border bg-popover text-popover-foreground shadow-md p-2"
        data-testid="etf-preliminary-sump-sum-create-menu"
      >
        <Button
          type="button"
          data-testid="preliminary-lump-sum-mobile-create-type-month"
          variant="ghost"
          class="w-full justify-start px-3 py-2 text-left text-sm"
          @click="selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH)"
        >
          {{ $t("ETFPreliminaryLumpSum.newMonthly") }}
        </Button>
        <Button
          type="button"
          data-testid="preliminary-lump-sum-mobile-create-type-piece"
          variant="ghost"
          class="w-full justify-start px-3 py-2 text-left text-sm"
          @click="selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE)"
        >
          {{ $t("ETFPreliminaryLumpSum.newPiece") }}
        </Button>
        <Button
          type="button"
          data-testid="preliminary-lump-sum-mobile-create-type-yearly"
          variant="ghost"
          class="w-full justify-start px-3 py-2 text-left text-sm"
          @click="selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR)"
        >
          {{ $t("ETFPreliminaryLumpSum.newYearly") }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonMobileCreate from "@/components/common/ButtonMobileCreate.vue";
import ButtonMobileDelete from "@/components/common/ButtonMobileDelete.vue";
import ButtonMobileEdit from "@/components/common/ButtonMobileEdit.vue";
import SelectStandard from "@/components/common/SelectStandard.vue";
import MonthYearMobileNavigator from "@/components/navigation/MonthYearMobileNavigator.vue";
import { Button } from "@/components/ui/button";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

const selectedEtfId = defineModel<number | undefined>("selectedEtfId");

defineProps<{
  yearsLoaded: boolean;
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
const createButtonRef = ref<HTMLElement | null>(null);

const toggleTypeSelector = () => {
  showTypeSelector.value = !showTypeSelector.value;
};

const selectCreateType = (type: EtfPreliminaryLumpSumType) => {
  showTypeSelector.value = false;
  emit("open-create", type);
};

onClickOutside(createButtonRef, () => {
  showTypeSelector.value = false;
});
</script>
