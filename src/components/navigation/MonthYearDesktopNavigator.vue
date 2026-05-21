<template>
  <div
    class="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:flex-nowrap sm:items-start"
  >
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

    <ToggleGroup
      v-if="months.length > 0"
      v-model="selectedMonthModel"
      type="single"
      variant="outline"
      :roving-focus="true"
      class="min-w-0 max-w-full flex-wrap justify-center"
    >
      <ToggleGroupItem
        v-for="month in months"
        :key="month"
        :value="String(month)"
        :data-testid="`${testIdPrefix}-month-${month}`"
        class="h-9 min-w-16 px-3 text-sm"
      >
        {{ getMonthName(month) }}
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
</template>

<script lang="ts" setup>
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getMonthName } from "@/tools/views/MonthName";
import { computed } from "vue";

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

const selectedYearModel = computed({
  get: () => String(props.selectedYear ?? ""),
  set: (value: string) => {
    emit("selectYear", value);
  },
});

const selectedMonthModel = computed<string | undefined>({
  get: () => {
    if (props.selectedMonth === undefined) {
      return undefined;
    }
    return String(props.selectedMonth);
  },
  set: (value) => {
    if (!value) {
      return;
    }
    emit("selectMonth", Number(value));
  },
});
</script>
