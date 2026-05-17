<template>
  <div class="flex justify-center" v-if="calcResults.etfId">
    <div class="w-full max-w-md mb-4 space-y-4">
      <div class="flex flex-col rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell class="font-bold bg-muted text-left w-3/4">
                {{ $t("ETFFlow.calculateResults.pieces") }}
              </TableCell>
              <TableCell class="text-right">{{ calcResults.pieces }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-bold bg-muted text-left">
                {{ $t("ETFFlow.calculateResults.originalBuyPrice") }}
              </TableCell>
              <TableCell class="text-right"
                ><SpanAmount :amount="calcResults.originalBuyPrice"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-bold bg-muted text-left">
                {{ $t("ETFFlow.calculateResults.sellPrice") }}
              </TableCell>
              <TableCell class="text-right"
                ><SpanAmount :amount="calcResults.sellPrice"
              /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="flex flex-col rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell class="font-bold bg-muted text-left w-3/4">
                {{ $t("ETFFlow.profit") }}
              </TableCell>
              <TableCell class="text-right"
                ><SpanAmount :amount="calcResults.profit"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-bold bg-muted text-left">
                {{
                  $t("ETFFlow.calculateResults.accumulatedPreliminaryLumpSum")
                }}
              </TableCell>
              <TableCell class="text-right"
                ><SpanAmount
                  :amount="calcResults.accumulatedPreliminaryLumpSum"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-bold bg-muted text-left">
                {{ $t("ETFFlow.calculateResults.chargeable") }}
              </TableCell>
              <TableCell class="text-right"
                ><b><SpanAmount :amount="calcResults.chargeable" /></b
              ></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="flex flex-col rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                class="font-bold bg-muted text-left"
                colspan="3"
                id="newBuyProce"
              >
                {{ $t("ETFFlow.calculateResults.newBuyPrice") }}
              </TableCell>
              <TableCell class="text-right"
                ><SpanAmount :amount="calcResults.newBuyPrice"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-muted text-left"
                colspan="3"
                id="rebuyLosses"
              >
                {{ $t("ETFFlow.calculateResults.rebuyLosses") }}
              </TableCell>
              <TableCell class="text-right"
                ><SpanAmount :amount="calcResults.rebuyLosses"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-muted text-left"
                rowspan="4"
                id="transactionCosts"
              >
                {{ $t("ETFFlow.transactionCosts") }}
              </TableCell>
              <TableCell
                class="font-bold bg-muted text-left"
                rowspan="2"
                id="transactionCostsSell"
              >
                {{ $t("ETFFlow.transactionCostsSell") }}
              </TableCell>
              <TableCell
                class="font-bold bg-muted text-left"
                id="transactionCostsSellAbsolute"
              >
                {{ $t("ETFFlow.transactionCostsAbsolute") }}
              </TableCell>
              <TableCell class="text-right"
                ><SpanAmount :amount="calcResults.transactionCostsAbsoluteSell"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-muted text-left"
                id="transactionCostsSellRelative"
              >
                {{ $t("ETFFlow.transactionCostsRelative") }}
              </TableCell>
              <TableCell class="text-right"
                ><SpanAmount :amount="calcResults.transactionCostsRelativeSell"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-muted text-left"
                rowspan="2"
                id="transactionCostsBuy"
              >
                {{ $t("ETFFlow.transactionCostsBuy") }}
              </TableCell>
              <TableCell
                class="font-bold bg-muted text-left"
                id="transactionCostsBuyAbsolute"
              >
                {{ $t("ETFFlow.transactionCostsAbsolute") }}
              </TableCell>
              <TableCell class="text-right"
                ><SpanAmount :amount="calcResults.transactionCostsAbsoluteBuy"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-muted text-left"
                id="transactionCostsBuyRelative"
              >
                {{ $t("ETFFlow.transactionCostsRelative") }}
              </TableCell>
              <TableCell class="text-right"
                ><SpanAmount :amount="calcResults.transactionCostsRelativeBuy"
              /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                class="font-bold bg-muted text-left"
                colspan="3"
                id="overallCosts"
              >
                {{ $t("ETFFlow.calculateResults.overallCosts") }}
              </TableCell>
              <TableCell class="text-right"
                ><b><SpanAmount :amount="calcResults.overallCosts" /></b
              ></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { EtfSalesCalculation } from "@/model/etf/EtfSalesCalculation";
import type { PropType } from "vue";
import SpanAmount from "../SpanAmount.vue";

defineProps({
  calcResults: {
    type: Object as PropType<EtfSalesCalculation>,
    required: true,
  },
});
</script>
