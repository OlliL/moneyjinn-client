<template>
  <div
    data-testid="monthly-settlement-desktop-controls"
    class="hidden md:block w-full"
  >
    <div class="mx-auto flex w-full max-w-5xl flex-col items-center pb-6">
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

    <div class="flex flex-wrap items-center justify-center gap-3 pb-6">
      <Button
        data-testid="monthly-settlement-new"
        type="button"
        class="button-with-icon"
        @click="actions.create()"
      >
        <PlusSquare class="mr-2 icon-medium" />
        {{ $t("General.new") }}
      </Button>
      <Button
        data-testid="monthly-settlement-edit"
        type="button"
        :disabled="!canEditOrDelete"
        class="button-with-icon"
        @click="actions.edit()"
      >
        <SquarePen class="icon-medium mr-2" />
        {{ $t("General.edit") }}
      </Button>
      <Button
        data-testid="monthly-settlement-delete"
        type="button"
        variant="destructive"
        :disabled="!canEditOrDelete"
        class="button-with-icon"
        @click="actions.delete()"
      >
        <Trash2 class="icon-medium mr-2" />
        {{ $t("General.delete") }}
      </Button>
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
import { MonthlySettlementModalActionsKey } from "@/model/CrudActions";
import { PlusSquare, SquarePen, Trash2 } from "@lucide/vue";
import { inject } from "vue";

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
}>();

const actions = inject(MonthlySettlementModalActionsKey)!;

const selectYear = (year: string) => emit("selectYear", year);
const selectMonth = (month: number) => emit("selectMonth", month);
</script>
