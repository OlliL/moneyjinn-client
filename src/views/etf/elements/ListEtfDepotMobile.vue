<template>
  <div
    data-testid="etf-depot-mobile-accordion"
    class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3"
  >
    <Accordion type="multiple" class="space-y-2">
      <AccordionItem
        v-for="flow in flows"
        :key="flow.etfflowid"
        :value="`item-${flow.etfflowid}`"
        :data-testid="`etf-depot-mobile-row-${flow.etfflowid}`"
        class="not-last:border-b border rounded-lg bg-background shadow-sm px-3 pt-2 pb-3 text-left relative overflow-hidden"
      >
        <AccordionTrigger
          class="hover:no-underline pt-1 pb-0 [&>svg]:hidden w-full"
        >
          <div
            :data-testid="`etf-depot-mobile-trigger-${flow.etfflowid}`"
            class="grid grid-cols-[1fr_auto] gap-2 items-start min-h-[40px] w-full text-left"
          >
            <div class="flex flex-col gap-0.5 min-w-0">
              <span class="text-xs text-muted-foreground font-normal truncate">
                {{ timestampString(flow) }}
              </span>
              <span class="font-bold text-sm text-foreground truncate">
                {{ amountString(flow) }} {{ $t("ETFFlow.amount") }}
              </span>
            </div>

            <div class="flex flex-col items-end gap-1 shrink-0 text-right">
              <span class="font-extrabold text-sm text-foreground">
                <SpanAmount :amount="flow.amount * flow.price" />
              </span>

              <div class="flex gap-0.5 mt-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7"
                  :data-testid="`etf-depot-mobile-edit-${flow.etfflowid}`"
                  @click.stop="editEtfFlow(flow)"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7 text-destructive"
                  :data-testid="`etf-depot-mobile-delete-${flow.etfflowid}`"
                  @click.stop="deleteEtfFlow(flow)"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent
          :data-testid="`etf-depot-mobile-content-${flow.etfflowid}`"
          class="pt-3 pb-1 border-t mt-2"
        >
          <div class="grid grid-cols-1 gap-2 text-xs bg-muted/40 p-2 rounded">
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("ETFFlow.price")
              }}</span>
              <SpanAmount :amount="flow.price" :decimal-places="3" />
            </div>
            <div v-if="showLumpSum" class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("ETFFlow.preliminaryLumpSum")
              }}</span>
              <SpanAmount
                :amount="flow.accumulatedPreliminaryLumpSum * (partial / 100)"
                :decimal-places="3"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/SpanAmount.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber, redIfNegative } from "@/tools/views/FormatNumber";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

const props = defineProps({
  flows: {
    type: Array as PropType<EtfFlow[]>,
    required: true,
  },
  partial: {
    type: Number,
    required: true,
  },
  showLumpSum: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["deleteEtfFlow", "editEtfFlow"]);

const amountClass = (flow: EtfFlow): string => {
  return redIfNegative(flow.amount);
};

const amountString = (flow: EtfFlow): string => {
  return formatNumber(flow.amount, 6);
};

const timestampString = (flow: EtfFlow): string => {
  return (
    formatDateWithTime(flow.timestamp) +
    ":" +
    String(flow.nanoseconds + 1000000000).substring(1, 4)
  );
};

const deleteEtfFlow = (flow: EtfFlow) => {
  emit("deleteEtfFlow", flow);
};

const editEtfFlow = (flow: EtfFlow) => {
  emit("editEtfFlow", flow);
};
</script>
