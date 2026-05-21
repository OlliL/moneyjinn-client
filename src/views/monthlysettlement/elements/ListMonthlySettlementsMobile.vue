<template>
  <MobilePeriodSheetNavigator
    :data-loaded="dataLoaded"
    :years="years"
    :months="months"
    :selected-year="selectedYear"
    :selected-month="selectedMonth"
    test-id-prefix="monthly-settlement-mobile"
    navigator-test-id-prefix="month-year-nav-mobile"
    title-key="General.monthlysettlements"
    label-key="General.month"
    select-label-key="General.select"
    @select-year="selectYear"
    @select-month="selectMonth"
  >
    <template #actions>
      <div class="grid grid-cols-3 gap-2">
        <Button
          data-testid="monthly-settlement-mobile-new"
          type="button"
          @click="emitCreate"
        >
          {{ $t("General.new") }}
        </Button>
        <Button
          data-testid="monthly-settlement-mobile-edit"
          type="button"
          :disabled="!canEditOrDelete"
          @click="emitEdit"
        >
          {{ $t("General.edit") }}
        </Button>
        <Button
          data-testid="monthly-settlement-mobile-delete"
          type="button"
          variant="destructive"
          :disabled="!canEditOrDelete"
          @click="emitDelete"
        >
          {{ $t("General.delete") }}
        </Button>
      </div>
    </template>
  </MobilePeriodSheetNavigator>
</template>

<script lang="ts" setup>
import MobilePeriodSheetNavigator from "@/components/navigation/MobilePeriodSheetNavigator.vue";
import { Button } from "@/components/ui/button";

defineProps<{
  dataLoaded: boolean;
  years: number[];
  months: number[];
  selectedYear: string;
  selectedMonth: number;
  canEditOrDelete: boolean;
}>();

const emit = defineEmits<{
  selectYear: [year: string];
  selectMonth: [month: number];
  create: [];
  edit: [];
  delete: [];
}>();

const selectYear = (year: string) => emit("selectYear", year);
const selectMonth = (month: number) => emit("selectMonth", month);
const emitCreate = () => emit("create");
const emitEdit = () => emit("edit");
const emitDelete = () => emit("delete");
</script>
