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
        class="border rounded-lg bg-background shadow-sm px-3 py-2"
      >
        <AccordionTrigger class="hover:no-underline">
          <div
            :data-testid="`etf-depot-mobile-trigger-${flow.etfflowid}`"
            class="flex items-center justify-between w-full gap-2"
          >
            <div class="flex flex-col items-start text-left min-w-0">
              <span class="font-bold text-sm truncate">{{
                timestampString(flow)
              }}</span>
              <span :class="amountClass(flow)" class="text-xs">{{
                amountString(flow)
              }}</span>
            </div>
            <div class="flex items-center gap-1 pr-2">
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`etf-depot-mobile-edit-${flow.etfflowid}`"
                @click.stop="editEtfFlow(flow)"
              >
                <Pencil class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`etf-depot-mobile-delete-${flow.etfflowid}`"
                @click.stop="deleteEtfFlow(flow)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent
          :data-testid="`etf-depot-mobile-content-${flow.etfflowid}`"
          class="pt-2"
        >
          <div
            class="grid grid-cols-1 gap-2 text-sm bg-muted/40 p-3 rounded-md"
          >
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("ETFFlow.price")
              }}</span>
              <SpanAmount :amount="flow.price" :decimal-places="3" />
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted-foreground">{{
                $t("ETFFlow.sumprice")
              }}</span>
              <SpanAmount :amount="flow.amount * flow.price" />
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
