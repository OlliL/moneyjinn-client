<template>
  <div :data-testid="`${testIdPrefix}-controls`" class="md:hidden w-full">
    <div class="mx-auto flex w-full max-w-md flex-col gap-3 px-2">
      <div
        :data-testid="`${testIdPrefix}-header`"
        class="rounded-lg border bg-card p-3 flex items-center justify-between gap-2"
      >
        <div>
          <p class="text-xs text-muted-foreground">
            {{ $t(resolvedLabelKey) }}
          </p>
          <p
            :data-testid="`${testIdPrefix}-period-label`"
            class="font-semibold"
          >
            {{ periodLabel }}
          </p>
        </div>
        <Button
          :data-testid="`${testIdPrefix}-open-period-sheet`"
          type="button"
          variant="outline"
          @click="isSheetOpen = true"
        >
          {{ $t(resolvedSelectLabelKey) }}
        </Button>
      </div>

      <div v-if="$slots.actions" class="grid grid-cols-1 gap-2">
        <slot name="actions" />
      </div>
    </div>

    <Sheet v-model:open="isSheetOpen">
      <SheetContent
        :data-testid="`${testIdPrefix}-period-sheet`"
        side="bottom"
        class="h-[65vh] rounded-t-xl p-6 flex flex-col"
      >
        <SheetHeader class="text-left pb-4 border-b shrink-0">
          <SheetTitle>{{ $t(resolvedTitleKey) }}</SheetTitle>
          <SheetDescription class="sr-only">
            {{ $t(resolvedTitleKey) }}
          </SheetDescription>
        </SheetHeader>

        <div class="flex-1 overflow-y-auto py-4">
          <MonthYearNavigator
            v-if="dataLoaded"
            :years="years"
            :months="months"
            :selected-year="selectedYear"
            :selected-month="selectedMonth > 0 ? selectedMonth : undefined"
            :test-id-prefix="navigatorTestIdPrefix"
            @select-year="selectYear"
            @select-month="selectMonth"
          />
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script lang="ts" setup>
import MonthYearNavigator from "@/components/navigation/MonthYearNavigator.vue";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getMonthName } from "@/tools/views/MonthName";
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    dataLoaded: boolean;
    years: Array<number | string>;
    months: number[];
    selectedYear: number | string;
    selectedMonth: number;
    testIdPrefix: string;
    navigatorTestIdPrefix?: string;
    titleKey?: string;
    labelKey?: string;
    selectLabelKey?: string;
  }>(),
  {
    navigatorTestIdPrefix: "month-year-nav-mobile",
    titleKey: "General.month",
    labelKey: "General.month",
    selectLabelKey: "General.select",
  },
);

const emit = defineEmits<{
  selectYear: [year: string];
  selectMonth: [month: number];
}>();

const isSheetOpen = ref(false);

const periodLabel = computed(() => {
  if (props.selectedMonth > 0) {
    return `${getMonthName(props.selectedMonth)} ${props.selectedYear}`;
  }
  return String(props.selectedYear);
});

const resolvedTitleKey = computed(() => props.titleKey ?? "General.month");
const resolvedLabelKey = computed(() => props.labelKey ?? "General.month");
const resolvedSelectLabelKey = computed(
  () => props.selectLabelKey ?? "General.select",
);

const selectYear = (year: string) => emit("selectYear", year);
const selectMonth = (month: number) => emit("selectMonth", month);
</script>
