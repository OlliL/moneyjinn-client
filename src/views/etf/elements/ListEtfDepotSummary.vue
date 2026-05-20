<template>
  <div class="flex justify-center py-4" v-if="etfSummary">
    <div class="w-full max-w-5xl">
      <div class="flex flex-col rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                class="font-bold text-foreground text-center"
                rowspan="2"
              >
                {{ $t("ETFFlow.shares") }}
              </TableHead>
              <TableHead
                class="text-center border-l hidden md:table-cell"
                colspan="3"
              >
                {{ $t("ETFFlow.amount") }}
              </TableHead>
              <TableHead
                class="font-bold border-l border-r text-foreground text-center"
                colspan="3"
              >
                {{ $t("ETFFlow.overall") }}
              </TableHead>
              <TableHead class="text-center hidden md:table-cell" rowspan="2">
                {{ $t("Reports.state") }}
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead
                class="font-bold border text-foreground text-center hidden md:table-cell"
              >
                {{ $t("ETFFlow.payed") }} &#8709;
              </TableHead>
              <TableHead
                class="font-bold border text-foreground text-center hidden md:table-cell"
              >
                {{ $t("ETFFlow.bid") }}
              </TableHead>
              <TableHead
                class="font-bold border text-foreground text-center hidden md:table-cell"
              >
                {{ $t("ETFFlow.ask") }}
              </TableHead>
              <TableHead class="font-bold border text-foreground text-center">
                {{ $t("ETFFlow.payed") }}
              </TableHead>
              <TableHead class="font-bold border text-foreground text-center">
                {{ $t("ETFFlow.bid") }}
              </TableHead>
              <TableHead class="font-bold border text-foreground text-center">
                {{ $t("ETFFlow.profit") }}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody v-if="etfSummary">
            <EtfTableRow v-bind="etfSummary" />
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import type { PropType } from "vue";
import EtfTableRow from "@/components/reports/EtfTableRow.vue";

defineProps({
  etfSummary: {
    type: Object as PropType<EtfSummary>,
    required: false,
  },
});
</script>
