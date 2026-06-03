<template>
  <div>
    <div class="mx-auto w-full max-w-md pb-6">
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
      @select-year="$emit('selectYear', $event)"
      @select-current-month="$emit('selectCurrentMonth')"
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
        @click="$emit('openDelete')"
      />
      <ButtonMobileEdit
        data-testid="preliminary-lump-sum-mobile-edit"
        v-if="etfPreliminaryLumpSum !== undefined"
        @click="$emit('openEdit')"
      />

      <slot
        v-if="showTypeSelector"
        name="create-menu"
        :close-menu="() => (showTypeSelector = false)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonMobileCreate from "@/components/common/ButtonMobileCreate.vue";
import ButtonMobileDelete from "@/components/common/ButtonMobileDelete.vue";
import ButtonMobileEdit from "@/components/common/ButtonMobileEdit.vue";
import SelectStandard from "@/components/common/SelectStandard.vue";
import MonthYearMobileNavigator from "@/components/navigation/MonthYearMobileNavigator.vue";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
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
  selectYear: [year: string];
  selectCurrentMonth: [];
  openEdit: [];
  openDelete: [];
}>();

const showTypeSelector = ref(false);
const createButtonRef = ref<HTMLElement | null>(null);

const toggleTypeSelector = () => {
  showTypeSelector.value = !showTypeSelector.value;
};

onClickOutside(createButtonRef, () => {
  showTypeSelector.value = false;
});
</script>
