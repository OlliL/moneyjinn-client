<template>
  <div
    class="w-full max-w-[260px] p-3 border border-border rounded-xl bg-card shadow-sm mx-auto"
    :data-testid="testIdPrefix"
  >
    <div
      class="flex items-center justify-between pb-2 mb-2 border-b border-border"
    >
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7"
        @click="prevYear"
        :disabled="currentYearIdx <= 0"
        :data-testid="`${testIdPrefix}-prev-year`"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>

      <Select v-model="selectedYearModel">
        <SelectTrigger
          :data-testid="`${testIdPrefix}-year-trigger`"
          class="w-25 h-8 shrink-0"
        >
          <SelectValue :placeholder="selectedYearModel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="year in years"
            :key="String(year)"
            :value="String(year)"
            :data-testid="`${testIdPrefix}-year-item-${year}`"
          >
            {{ year }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7"
        @click="nextYear"
        :disabled="currentYearIdx === -1 || currentYearIdx >= years.length - 1"
        :data-testid="`${testIdPrefix}-next-year`"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>

    <div v-if="months.length > 0" class="grid grid-cols-3 gap-1.5">
      <Button
        v-for="month in months"
        :key="month"
        variant="ghost"
        class="h-9 text-xs px-1"
        :class="{
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-semibold':
            String(month) === String(selectedMonth),
        }"
        @click="emit('selectMonth', Number(month))"
        :data-testid="`${testIdPrefix}-month-${month}`"
      >
        {{ getMonthName(month) }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { getMonthName } from "@/tools/views/MonthName";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed } from "vue";
import Select from "../ui/select/Select.vue";
import SelectContent from "../ui/select/SelectContent.vue";
import SelectItem from "../ui/select/SelectItem.vue";
import SelectTrigger from "../ui/select/SelectTrigger.vue";
import SelectValue from "../ui/select/SelectValue.vue";

const props = defineProps<{
  years: Array<number | string>;
  months: number[];
  selectedYear: number | string;
  selectedMonth?: number | string;
  testIdPrefix?: string;
}>();

const testIdPrefix = props.testIdPrefix ?? "month-year-nav";

const emit = defineEmits<{
  selectYear: [year: string];
  selectMonth: [month: number];
}>();

const currentYearIdx = computed(() => {
  return props.years.map(String).indexOf(String(props.selectedYear));
});

const selectedYearModel = computed({
  get: () => String(props.selectedYear ?? ""),
  set: (value: string) => {
    emit("selectYear", value);
  },
});

const prevYear = () => {
  if (currentYearIdx.value > 0) {
    emit("selectYear", String(props.years[currentYearIdx.value - 1]));
  } else {
    emit("selectYear", String(Number(props.selectedYear) - 1));
  }
};

const nextYear = () => {
  if (
    currentYearIdx.value !== -1 &&
    currentYearIdx.value < props.years.length - 1
  ) {
    emit("selectYear", String(props.years[currentYearIdx.value + 1]));
  } else {
    emit("selectYear", String(Number(props.selectedYear) + 1));
  }
};
</script>
