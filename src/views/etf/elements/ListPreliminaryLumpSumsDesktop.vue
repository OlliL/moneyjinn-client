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

        <slot
          v-if="showTypeSelector"
          name="create-menu"
          :close-menu="() => (showTypeSelector = false)"
        />
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
  (e: "open-edit"): void;
  (e: "open-delete"): void;
}>();

const showTypeSelector = ref(false);
const createButtonRefDesktop = ref<HTMLElement | null>(null);

const toggleTypeSelector = () => {
  showTypeSelector.value = !showTypeSelector.value;
};

onClickOutside(createButtonRefDesktop, () => {
  showTypeSelector.value = false;
});
</script>
