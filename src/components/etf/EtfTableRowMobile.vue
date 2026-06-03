<template>
  <AccordionItem
    :value="String(etfId)"
    :data-testid="`report-etf-mobile-item-${etfId}`"
    class="border rounded-lg bg-background shadow-sm overflow-hidden"
  >
    <AccordionTrigger class="hover:no-underline w-full min-w-0 py-2 px-3">
      <div
        :data-testid="`report-etf-mobile-trigger-${etfId}`"
        class="grid grid-cols-[1fr_auto] items-center w-full gap-2"
      >
        <div class="flex flex-col items-start text-left overflow-hidden">
          <span class="font-bold text-sm truncate w-full">{{ name }}</span>
          <span class="text-xs text-muted-foreground"
            >{{ etfFlowAmountSumString }} {{ $t("ETFFlow.shares") }}</span
          >
        </div>
        <div class="flex flex-col items-end gap-1">
          <span class="text-xs text-muted-foreground">{{
            $t("ETFFlow.profit")
          }}</span>
          <span class="font-bold underline decoration-primary text-sm">
            <SpanAmount :amount="profit" v-if="profit" />
          </span>
        </div>
      </div>
    </AccordionTrigger>

    <AccordionContent
      :data-testid="`report-etf-mobile-content-${etfId}`"
      class="px-2 pb-4"
    >
      <div class="grid grid-cols-2 gap-4 text-sm bg-muted/40 p-3 rounded-md">
        <div class="flex flex-col gap-2">
          <div>
            <span class="text-muted-foreground text-xs block">{{
              $t("ETFFlow.payedOverall")
            }}</span>
            <SpanAmount :amount="spentValue" v-if="spentValue" />
          </div>
          <div v-if="buyPrice">
            <span class="text-muted-foreground text-xs block">{{
              $t("ETFFlow.ask")
            }}</span>
            <SpanAmount :amount="buyPrice" :decimal-places="3" />
          </div>
          <div>
            <span class="text-muted-foreground text-xs block">{{
              $t("ETFFlow.payedAverage")
            }}</span>
            <SpanAmount
              :amount="avgSpentPrice"
              :decimal-places="4"
              v-if="avgSpentPrice"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div>
            <span class="text-muted-foreground text-xs block">{{
              $t("ETFFlow.currentValue")
            }}</span>
            <SpanAmount :amount="sumSellPrice" v-if="sumSellPrice" />
          </div>
          <div v-if="sellPrice">
            <span class="text-muted-foreground text-xs block">{{
              $t("ETFFlow.bid")
            }}</span>
            <SpanAmount :amount="sellPrice" :decimal-places="3" />
          </div>
          <div>
            <span class="text-muted-foreground text-xs block">{{
              $t("Reports.state")
            }}</span>
            <span>{{ pricesTimestampString }}</span>
          </div>
        </div>
      </div>

      <div class="mt-3 text-center" v-if="chartUrl">
        <a
          :data-testid="`report-etf-mobile-chart-link-${etfId}`"
          :href="chartUrl"
          class="text-sm text-primary hover:underline inline-flex items-center gap-1"
          target="_blank"
        >
          {{ $t("ETFFlow.linkToChart") }}
        </a>
      </div>
    </AccordionContent>
  </AccordionItem>
</template>

<script lang="ts" setup>
import SpanAmount from "@/components/common/SpanAmount.vue";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber } from "@/tools/views/FormatNumber";
import { computed } from "vue";

const props = defineProps<{
  etfId: string | number;
  name?: string;
  chartUrl?: string;
  amount: number;
  spentValue: number;
  buyPrice?: number;
  sellPrice?: number;
  pricesTimestamp?: Date;
}>();

const sumSellPrice = computed(() => {
  return props.sellPrice ? props.amount * props.sellPrice : undefined;
});
const avgSpentPrice = computed(() => {
  return props.amount ? props.spentValue / props.amount : undefined;
});
const profit = computed(() => {
  return sumSellPrice.value ? sumSellPrice.value - props.spentValue : undefined;
});
const pricesTimestampString = computed(() => {
  return props.pricesTimestamp ? formatDateWithTime(props.pricesTimestamp) : "";
});
const etfFlowAmountSumString = computed(() => {
  return formatNumber(props.amount, 6);
});
</script>
