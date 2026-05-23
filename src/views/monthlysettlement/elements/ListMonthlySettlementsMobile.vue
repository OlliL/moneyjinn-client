<template>
  <div>
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
  </div>

  <MonthYearMobileNavigator
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
  <div
    v-if="years.length === 0 || months.length === 0"
    data-testid="monthly-settlement-empty-mobile"
    class="w-full text-center text-muted-foreground mt-4"
  >
    {{ $t("General.noEntries") }}
  </div>
</template>

<script lang="ts" setup>
import ButtonMobileCreate from "@/components/common/ButtonMobileCreate.vue";
import ButtonMobileDelete from "@/components/common/ButtonMobileDelete.vue";
import ButtonMobileEdit from "@/components/common/ButtonMobileEdit.vue";
import MonthYearMobileNavigator from "@/components/navigation/MonthYearMobileNavigator.vue";

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
