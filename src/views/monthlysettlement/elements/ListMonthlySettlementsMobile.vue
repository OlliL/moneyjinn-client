<template>
  <ButtonMobileCreate
    data-testid="monthly-settlement-mobile-new"
    @click="emitCreate"
  />
  <ButtonMobileDelete
    data-testid="monthly-settlement-mobile-delete"
    @click="emitDelete"
  />
  <ButtonMobileEdit
    data-testid="monthly-settlement-mobile-edit"
    @click="emitEdit"
  />

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
  />
</template>

<script lang="ts" setup>
import ButtonMobileCreate from "@/components/ButtonMobileCreate.vue";
import ButtonMobileDelete from "@/components/ButtonMobileDelete.vue";
import ButtonMobileEdit from "@/components/ButtonMobileEdit.vue";
import MobilePeriodSheetNavigator from "@/components/navigation/MobilePeriodSheetNavigator.vue";

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
