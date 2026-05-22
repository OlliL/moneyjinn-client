<template>
  <div class="flex justify-center py-4">
    <div class="w-full max-w-7xl">
      <!-- Mobile View -->
      <div class="block md:hidden">
        <Accordion
          type="single"
          collapsible
          class="w-full border rounded-md"
          data-testid="etf-mobile-accordion"
        >
          <EtfTableRowMobile
            v-for="etfData in etfSummaryArray"
            :key="'mobile-' + etfData.etfId"
            v-bind="etfData"
          />
        </Accordion>
      </div>

      <!-- Desktop View -->
      <div class="hidden md:block overflow-x-auto text-center">
        <div
          class="flex flex-col rounded-md border"
          data-testid="etf-desktop-table"
        >
          <Table class="[&_tbody_tr:nth-child(even)]:bg-muted text-sm">
            <TableHeader>
              <TableRow>
                <TableHead
                  class="font-bold border-r text-foreground text-center"
                  rowspan="2"
                  id="thEtf"
                >
                  {{ $t("General.etf") }}
                </TableHead>
                <TableHead
                  class="font-bold border-r text-foreground text-center"
                  rowspan="2"
                  id="thShares"
                >
                  {{ $t("ETFFlow.shares") }}
                </TableHead>
                <TableHead
                  class="text-center hidden md:table-cell"
                  colspan="3"
                  id="thAmount"
                >
                  {{ $t("ETFFlow.amount") }}
                </TableHead>
                <TableHead
                  class="font-bold border-r text-foreground text-center"
                  colspan="3"
                  id="thOverall"
                >
                  {{ $t("ETFFlow.overall") }}
                </TableHead>
                <TableHead
                  class="text-center hidden md:table-cell"
                  rowspan="2"
                  id="thState"
                >
                  {{ $t("Reports.state") }}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead
                  class="text-center hidden md:table-cell"
                  id="thAmountPayed"
                >
                  {{ $t("ETFFlow.payed") }} &#8709;
                </TableHead>
                <TableHead
                  class="text-center hidden md:table-cell"
                  id="thAmountBid"
                >
                  {{ $t("ETFFlow.bid") }}
                </TableHead>
                <TableHead
                  class="text-center hidden md:table-cell"
                  id="thAmountAsk"
                >
                  {{ $t("ETFFlow.ask") }}
                </TableHead>
                <TableHead
                  class="font-bold border text-foreground text-center"
                  id="thOverallPayed"
                >
                  {{ $t("ETFFlow.payed") }}
                </TableHead>
                <TableHead
                  class="font-bold border text-foreground text-center"
                  id="thOverallBid"
                >
                  {{ $t("ETFFlow.bid") }}
                </TableHead>
                <TableHead
                  class="font-bold border text-foreground text-center"
                  id="thOverallProfit"
                >
                  {{ $t("ETFFlow.profit") }}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <EtfTableRowDesktop
                v-for="etfData in etfSummaryArray"
                :key="'desktop-' + etfData.etfId"
                v-bind="etfData"
              />
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EtfTableRowDesktop from "@/components/etf/EtfTableRowDesktop.vue";
import EtfTableRowMobile from "@/components/etf/EtfTableRowMobile.vue";
import { Accordion } from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import { computed, type PropType } from "vue";

const props = defineProps({
  etfSummaryArray: {
    type: Array as PropType<EtfSummary[]>,
    required: true,
  },
});

const etfSummaryArray = computed(() => props.etfSummaryArray);
</script>
