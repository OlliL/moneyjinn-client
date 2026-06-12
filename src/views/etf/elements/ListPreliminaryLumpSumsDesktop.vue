<template>
  <div>
    <div class="mx-auto w-full max-w-md grid grid-cols-12 gap-3 items-end pb-6">
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
          @select-year="$emit('selectYear', $event)"
          @select-current-month="$emit('selectCurrentMonth')"
        />
      </div>
    </div>

    <div
      class="flex flex-wrap items-center justify-center gap-3 pb-6"
      ref="createButtonRefDesktop"
      v-if="selectedEtfId !== undefined"
    >
      <div class="relative">
        <Button
          data-testid="preliminary-lump-sum-create"
          type="button"
          class="button-with-icon"
          @click="toggleTypeSelector"
        >
          <PlusSquare class="icon-medium mr-2" />
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
        class="button-with-icon"
        @click="$emit('openEdit')"
      >
        <SquarePen class="icon-medium" />
        {{ $t("General.edit") }}
      </Button>
      <Button
        v-if="etfPreliminaryLumpSum !== undefined"
        data-testid="preliminary-lump-sum-delete"
        type="button"
        variant="destructive"
        class="button-with-icon"
        @click="$emit('openDelete')"
      >
        <Trash2 class="icon-medium" />
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
import { PlusSquare, SquarePen, Trash2 } from "@lucide/vue";
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

const selectedEtfId = defineModel<number | undefined>("selectedEtfId");

defineProps<{
  years: string[];
  selectedYear: string | undefined;
  etfPreliminaryLumpSum: EtfPreliminaryLumpSum | undefined;
  selectBoxValues: SelectBoxValue[];
}>();

defineEmits<{
  selectYear: [year: string];
  selectCurrentMonth: [];
  openEdit: [];
  openDelete: [];
}>();

const showTypeSelector = ref(false);
const createButtonRefDesktop = ref<HTMLElement | null>(null);

const toggleTypeSelector = () =>
  (showTypeSelector.value = !showTypeSelector.value);

onClickOutside(createButtonRefDesktop, () => (showTypeSelector.value = false));
</script>
