<template>
  <div class="space-y-6">
    <div class="flex justify-center">
      <div class="w-full max-w-md items-center">
        <SelectStandard
          v-model="localSelectedEtfId"
          id="etf-mobile"
          :field-label="$t('General.selectEtf')"
          :select-box-values="selectBoxValues"
        />
      </div>
    </div>

    <MonthYearMobileNavigator
      v-if="localSelectedEtfId !== undefined"
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
      class="inline-block"
      ref="createButtonRef"
      v-if="localSelectedEtfId !== undefined"
    >
      <ButtonMobileCreate
        data-testid="preliminary-lump-sum-mobile-create"
        @click="showTypeSelection"
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
        ref="typeSelectorRef"
        class="fixed right-20 bottom-26 z-50 w-52 rounded-md border bg-popover text-popover-foreground shadow-md p-2"
        data-testid="etf-preliminary-sump-sum-create-menu"
      >
        <div class="flex flex-col">
          <Button
            type="button"
            data-testid="preliminary-lump-sum-mobile-create-type-month"
            class="text-sm px-3 py-2 text-left hover:bg-muted rounded"
            @click="
              selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH)
            "
          >
            {{ $t("ETFPreliminaryLumpSum.newMonthly") }}
          </Button>
          <Button
            type="button"
            data-testid="preliminary-lump-sum-mobile-create-type-piece"
            class="text-sm px-3 py-2 text-left hover:bg-muted rounded"
            @click="
              selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE)
            "
          >
            {{ $t("ETFPreliminaryLumpSum.newPiece") }}
          </Button>
          <Button
            type="button"
            data-testid="preliminary-lump-sum-mobile-create-type-yearly"
            class="text-sm px-3 py-2 text-left hover:bg-muted rounded"
            @click="selectCreateType(EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR)"
          >
            {{ $t("ETFPreliminaryLumpSum.newYearly") }}
          </Button>
        </div>
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  selectedEtfId: number | undefined;
  yearsLoaded: boolean;
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
const typeSelectorRef = ref<HTMLElement | null>(null);
const createButtonRef = ref<HTMLElement | null>(null);

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
  if (
    typeSelectorRef.value?.contains(target) ||
    createButtonRef.value?.contains(target)
  )
    return;
  showTypeSelector.value = false;
};

onMounted(() => {
  document.addEventListener("click", docClickHandler);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", docClickHandler);
});
</script>
