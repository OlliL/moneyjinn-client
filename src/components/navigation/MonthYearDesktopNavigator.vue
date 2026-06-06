<template>
  <div class="flex items-center gap-4">
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
      orientation="horizontal"
      class="min-w-0 max-w-full flex-wrap justify-center"
    >
      <ToggleGroupItem
        v-for="month in months"
        :key="month"
        :value="String(month)"
        :data-testid="`${testIdPrefix}-month-${month}`"
        class="h-9 min-w-16 !px-3 text-sm first:rounded-l-md last:rounded-r-md -ml-px first:ml-0"
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

const props = withDefaults(
  defineProps<{
    years: Array<number | string>;
    months: number[];
    selectedYear: number | string;
    selectedMonth?: number | string;
    testIdPrefix?: string;
  }>(),
  {
    testIdPrefix: "month-year-nav",
  },
);

const emit = defineEmits<{
  selectYear: [year: string];
  selectMonth: [month: number];
}>();

const selectedYearModel = computed({
  get: () => String(props.selectedYear),
  set: (value) => emit("selectYear", value),
});

const selectedMonthModel = computed({
  get: () =>
    props.selectedMonth === undefined ? undefined : String(props.selectedMonth),
  set: (value) => {
    if (value) emit("selectMonth", Number(value));
  },
});
</script>
