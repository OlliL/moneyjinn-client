<template>
  <div class="row justify-content-md-center" v-if="calcResults.etfId">
    <div class="col-xxl-3 col-md-6 col-xs-12 mb-4">
      <table class="table table-bordered table-hover">
        <colgroup>
          <col style="width: 75%" />
          <col style="width: 25%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="text-start">
              {{ $t("ETFFlow.calculateResults.pieces") }}
            </th>
            <td class="text-end">{{ calcResults.pieces }}</td>
          </tr>
          <tr>
            <th class="text-start">
              {{ $t("ETFFlow.calculateResults.originalBuyPrice") }}
            </th>
            <td class="text-end">
              <SpanAmount :amount="calcResults.originalBuyPrice" />
            </td>
          </tr>
          <tr>
            <th class="text-start">
              {{ $t("ETFFlow.calculateResults.sellPrice") }}
            </th>
            <td class="text-end">
              <SpanAmount :amount="calcResults.sellPrice" />
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table table-bordered table-hover">
        <colgroup>
          <col style="width: 75%" />
          <col style="width: 25%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="text-start">
              {{ $t("ETFFlow.profit") }}
            </th>
            <td class="text-end">
              <SpanAmount :amount="calcResults.profit" />
            </td>
          </tr>
          <tr>
            <th class="text-start">
              {{ $t("ETFFlow.calculateResults.accumulatedPreliminaryLumpSum") }}
            </th>
            <td class="text-end">
              <SpanAmount :amount="calcResults.accumulatedPreliminaryLumpSum" />
            </td>
          </tr>
          <tr>
            <th class="text-start">
              {{ $t("ETFFlow.calculateResults.chargeable") }}
            </th>
            <td class="text-end">
              <b><SpanAmount :amount="calcResults.chargeable" /></b>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table table-bordered table-hover">
        <colgroup>
          <col style="width: 38%" />
          <col style="width: 19%" />
          <col style="width: 18%" />
          <col style="width: 25%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="text-start" colspan="3" id="newBuyProce">
              {{ $t("ETFFlow.calculateResults.newBuyPrice") }}
            </th>
            <td class="text-end">
              <SpanAmount :amount="calcResults.newBuyPrice" />
            </td>
          </tr>
          <tr>
            <th class="text-start" colspan="3" id="rebuyLosses">
              {{ $t("ETFFlow.calculateResults.rebuyLosses") }}
            </th>
            <td class="text-end">
              <SpanAmount :amount="calcResults.rebuyLosses" />
            </td>
          </tr>
          <tr>
            <th class="text-start" rowspan="4" id="transactionCosts">
              {{ $t("ETFFlow.transactionCosts") }}
            </th>
            <th class="text-start" rowspan="2" id="transactionCostsSell">
              {{ $t("ETFFlow.transactionCostsSell") }}
            </th>
            <th class="text-start" id="transactionCostsSellAbsolute">
              {{ $t("ETFFlow.transactionCostsAbsolute") }}
            </th>
            <td class="text-end">
              <SpanAmount :amount="calcResults.transactionCostsAbsoluteSell" />
            </td>
          </tr>
          <tr>
            <th class="text-start" id="transactionCostsSellRelative">
              {{ $t("ETFFlow.transactionCostsRelative") }}
            </th>
            <td class="text-end">
              <SpanAmount :amount="calcResults.transactionCostsRelativeSell" />
            </td>
          </tr>
          <tr>
            <th class="text-start" rowspan="2" id="transactionCostsBuy">
              {{ $t("ETFFlow.transactionCostsBuy") }}
            </th>
            <th class="text-start" id="transactionCostsBuyAbsolute">
              {{ $t("ETFFlow.transactionCostsAbsolute") }}
            </th>
            <td class="text-end">
              <SpanAmount :amount="calcResults.transactionCostsAbsoluteBuy" />
            </td>
          </tr>
          <tr>
            <th class="text-start" id="transactionCostsBuyRelative">
              {{ $t("ETFFlow.transactionCostsRelative") }}
            </th>
            <td class="text-end">
              <SpanAmount :amount="calcResults.transactionCostsRelativeBuy" />
            </td>
          </tr>
          <tr>
            <th class="text-start" colspan="3" id="overallCosts">
              {{ $t("ETFFlow.calculateResults.overallCosts") }}
            </th>
            <td class="text-end">
              <b><SpanAmount :amount="calcResults.overallCosts" /></b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
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

<style scoped>
th {
  background-color: #f2f2f2;
}
</style>
