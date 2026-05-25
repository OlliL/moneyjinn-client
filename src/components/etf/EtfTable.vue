<template>
  <div class="flex justify-center py-0">
    <div class="w-full max-w-7xl">
      <!-- Mobile View -->
      <div class="block md:hidden">
        <Accordion
          type="single"
          collapsible
          class="w-full space-y-2"
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
                <TableHead class="table-head-cell" rowspan="2" id="thEtf">
                  {{ $t("General.etf") }}
                </TableHead>
                <TableHead class="table-head-cell" rowspan="2" id="thShares">
                  {{ $t("ETFFlow.shares") }}
                </TableHead>
                <TableHead class="table-head-cell" colspan="3" id="thAmount">
                  {{ $t("ETFFlow.amount") }}
                </TableHead>
                <TableHead class="table-head-cell" colspan="3" id="thOverall">
                  {{ $t("ETFFlow.overall") }}
                </TableHead>
                <TableHead class="table-head-cell" rowspan="2" id="thState">
                  {{ $t("Reports.state") }}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead class="table-head-cell" id="thAmountPayed">
                  {{ $t("ETFFlow.payed") }} &#8709;
                </TableHead>
                <TableHead class="table-head-cell" id="thAmountBid">
                  {{ $t("ETFFlow.bid") }}
                </TableHead>
                <TableHead class="table-head-cell" id="thAmountAsk">
                  {{ $t("ETFFlow.ask") }}
                </TableHead>
                <TableHead class="table-head-cell" id="thOverallPayed">
                  {{ $t("ETFFlow.payed") }}
                </TableHead>
                <TableHead class="table-head-cell" id="thOverallBid">
                  {{ $t("ETFFlow.bid") }}
                </TableHead>
                <TableHead class="table-head-cell" id="thOverallProfit">
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
