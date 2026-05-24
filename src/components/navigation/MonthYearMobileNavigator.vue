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

        <div class="flex-1 overflow-y-auto pt-2">
          <div
            class="w-full max-w-[260px] p-3 border rounded-xl bg-card shadow-sm mx-auto"
            :data-testid="navigatorTestIdPrefix"
          >
            <div
              class="flex items-center justify-between"
              :class="{ 'pb-2 mb-2 border-b': months.length > 0 }"
            >
              <Button
                variant="ghost"
                size="icon"
                class="h-7 w-7"
                type="button"
                @click="prevYear"
                :disabled="currentYearIdx <= 0"
                :data-testid="`${navigatorTestIdPrefix}-prev-year`"
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>

              <Select v-model="selectedYearModel">
                <SelectTrigger
                  :data-testid="`${navigatorTestIdPrefix}-year-trigger`"
                  class="w-25 h-8 shrink-0"
                >
                  <SelectValue :placeholder="selectedYearModel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="year in years"
                    :key="String(year)"
                    :value="String(year)"
                    :data-testid="`${navigatorTestIdPrefix}-year-item-${year}`"
                  >
                    {{ year }}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                class="h-7 w-7"
                type="button"
                @click="nextYear"
                :disabled="
                  currentYearIdx === -1 || currentYearIdx >= years.length - 1
                "
                :data-testid="`${navigatorTestIdPrefix}-next-year`"
              >
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>

            <div v-if="months.length > 0" class="grid grid-cols-3 gap-1.5">
              <Button
                v-for="month in months"
                :key="month"
                type="button"
                variant="ghost"
                class="h-9 text-xs px-1"
                :class="{
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-semibold':
                    String(month) === String(selectedMonth),
                }"
                @click="selectMonth(Number(month))"
                :data-testid="`${navigatorTestIdPrefix}-month-${month}`"
              >
                {{ getMonthName(month) }}
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            class="w-full max-w-[260px] mx-auto mt-4 h-8 text-xs font-medium gap-2 flex items-center justify-center"
            @click="setToCurrentMonth"
            :data-testid="`${testIdPrefix}-current-month-btn`"
          >
            <CalendarDays class="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {{
              months.length === 0
                ? $t("General.currentYear")
                : $t("General.currentMonth")
            }}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getMonthName } from "@/tools/views/MonthName";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-vue-next";
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
  selectCurrentMonth: [];
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

const currentYearIdx = computed(() => {
  return props.years.map(String).indexOf(String(props.selectedYear));
});

const selectedYearModel = computed({
  get: () => String(props.selectedYear ?? ""),
  set: (value: string) => selectYear(value),
});

const prevYear = () => {
  selectYear(String(props.years[currentYearIdx.value - 1]));
};

const nextYear = () => {
  selectYear(String(props.years[currentYearIdx.value + 1]));
};

const setToCurrentMonth = () => {
  isSheetOpen.value = false;
  setTimeout(() => {
    emit("selectCurrentMonth");
  }, 100);
};

const selectYear = (year: string) => {
  if (props.months.length === 0) {
    isSheetOpen.value = false;
    setTimeout(() => {
      emit("selectYear", year);
    }, 100);
  } else {
    emit("selectYear", year);
  }
};
const selectMonth = (month: number) => {
  isSheetOpen.value = false;
  setTimeout(() => {
    emit("selectMonth", month);
  }, 100);
};
</script>
