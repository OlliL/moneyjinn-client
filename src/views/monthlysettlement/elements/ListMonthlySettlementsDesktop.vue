<template>
  <div
    data-testid="monthly-settlement-desktop-controls"
    class="hidden md:block w-full"
  >
    <div class="mx-auto flex w-full max-w-5xl flex-col items-center gap-3">
      <div class="flex w-full justify-center">
        <MonthYearDesktopNavigator
          v-if="dataLoaded"
          :years="years"
          :months="months"
          :selected-year="selectedYear"
          :selected-month="selectedMonth > 0 ? selectedMonth : undefined"
          @select-year="selectYear"
          @select-month="selectMonth"
        />
      </div>

      <div class="flex w-full flex-wrap items-center justify-center gap-3">
        <Button
          data-testid="monthly-settlement-new"
          type="button"
          @click="emitCreate"
        >
          {{ $t("General.new") }}
        </Button>
        <Button
          data-testid="monthly-settlement-edit"
          type="button"
          :disabled="!canEditOrDelete"
          @click="emitEdit"
        >
          {{ $t("General.edit") }}
        </Button>
        <Button
          data-testid="monthly-settlement-delete"
          type="button"
          variant="destructive"
          :disabled="!canEditOrDelete"
          @click="emitDelete"
        >
          {{ $t("General.delete") }}
        </Button>
      </div>
      <div
        v-if="years.length === 0 || months.length === 0"
        data-testid="monthly-settlement-empty-desktop"
        class="w-full text-center text-muted-foreground mt-4"
      >
        {{ $t("General.noEntries") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MonthYearDesktopNavigator from "@/components/navigation/MonthYearDesktopNavigator.vue";
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
