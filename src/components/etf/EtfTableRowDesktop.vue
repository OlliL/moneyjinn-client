<template>
  <TableRow
    :data-testid="etfId ? `report-etf-desktop-row-${etfId}` : undefined"
  >
    <TableCell class="text-left border-r" v-if="name">
      <a :href="chartUrl">{{ name }}</a>
    </TableCell>
    <TableCell class="text-right border-r">{{
      etfFlowAmountSumString
    }}</TableCell>
    <TableCell class="text-right border-r">
      <SpanAmount
        :amount="avgSpentPrice"
        :decimal-places="4"
        v-if="avgSpentPrice"
      />
    </TableCell>
    <TableCell class="text-right border-r">
      <SpanAmount :amount="sellPrice" :decimal-places="3" v-if="sellPrice" />
    </TableCell>
    <TableCell class="text-right border-r">
      <SpanAmount :amount="buyPrice" :decimal-places="3" v-if="buyPrice" />
    </TableCell>
    <TableCell class="text-right border-r">
      <SpanAmount :amount="spentValue" v-if="spentValue" />
    </TableCell>
    <TableCell class="text-right border-r">
      <SpanAmount :amount="sumSellPrice" v-if="sumSellPrice" />
    </TableCell>
    <TableCell class="text-right border-r">
      <u><SpanAmount :amount="profit" v-if="profit" /></u>
    </TableCell>
    <TableCell class="text-right">{{ pricesTimestampString }}</TableCell>
  </TableRow>
</template>

<script lang="ts" setup>
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDateWithTime } from "@/tools/views/FormatDate";
import { formatNumber } from "@/tools/views/FormatNumber";
import { computed } from "vue";
import SpanAmount from "../common/SpanAmount.vue";

const props = defineProps<{
  etfId?: number;
  name?: string;
  chartUrl?: string;
  amount: number;
  spentValue: number;
  buyPrice?: number;
  sellPrice?: number;
  pricesTimestamp?: Date;
}>();

const sumSellPrice = computed(() =>
  props.sellPrice ? props.amount * props.sellPrice : undefined,
);
const avgSpentPrice = computed(() =>
  props.amount ? props.spentValue / props.amount : undefined,
);
const profit = computed(() =>
  sumSellPrice.value ? sumSellPrice.value - props.spentValue : undefined,
);
const pricesTimestampString = computed(() =>
  props.pricesTimestamp ? formatDateWithTime(props.pricesTimestamp) : "",
);
const etfFlowAmountSumString = computed(() => formatNumber(props.amount, 6));
</script>
