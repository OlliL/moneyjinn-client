<template>
  <AccordionItem
    :value="titleKey"
    class="border rounded-lg bg-card shadow-sm overflow-hidden"
  >
    <AccordionTrigger class="hover:no-underline w-full min-w-0 p-4">
      <div class="flex justify-between items-center w-full gap-2">
        <h4 class="text-lg font-bold text-foreground">
          {{ $t(titleKey) }}
        </h4>
        <span class="font-extrabold text-base">
          <!--<SpanAmount :amount="displaySum" /> -->
        </span>
      </div>
    </AccordionTrigger>

    <AccordionContent class="p-0">
      <div class="px-4 pb-4 pt-2 border-t bg-muted/5">
        <CapitalsourceTable
          :capitalsource-data="capitalsourceData"
          :current-month-is-settled="currentMonthIsSettled"
        />
      </div>
    </AccordionContent>
  </AccordionItem>
</template>

<script lang="ts" setup>
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import { type PropType } from "vue";
import CapitalsourceTable from "./CapitalsourceTable.vue";

const props = defineProps({
  titleKey: {
    type: String,
    required: true,
  },
  capitalsourceData: {
    type: Array as PropType<ReportTurnoverCapitalsource[]>,
    required: true,
  },
  currentMonthIsSettled: {
    type: Boolean,
    required: true,
  },
});
/*
const displaySum = computed(() => {
  return props.currentMonthIsSettled
    ? props.amountEndOfMonthFixedSum
    : props.amountCurrentSum;
});
*/
</script>
