<template>
  <AccordionItem
    value="etf-overview"
    class="border rounded-lg bg-card shadow-sm overflow-hidden"
  >
    <AccordionTrigger class="hover:no-underline w-full min-w-0 py-2.5 px-3">
      <div class="flex justify-between items-center w-full gap-2">
        <h4 class="text-sm font-bold text-foreground">
          {{ $t("General.etf") }}
        </h4>
      </div>
    </AccordionTrigger>

    <AccordionContent class="p-0">
      <div class="px-3 pb-3 pt-1 border-t bg-muted/5">
        <EtfTable :etf-summary-array="etfSummaryArray" />
      </div>
    </AccordionContent>
  </AccordionItem>
</template>

<script lang="ts" setup>
import EtfTable from "@/components/etf/EtfTable.vue";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import type { PropType } from "vue";

defineProps({
  etfSummaryArray: {
    type: Array as PropType<EtfSummary[]>,
    required: true,
  },
});
</script>
