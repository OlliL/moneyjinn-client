<template>
  <div class="row justify-content-md-center" v-if="etfSummary">
    <div class="col-xxl-6 col-xs-12 mb-4">
      <table class="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th scope="col" class="text-center" rowspan="2" id="thShares">
              {{ $t("ETFFlow.shares") }}
            </th>
            <th
              scope="colgroup"
              class="text-center d-none d-md-table-cell"
              colspan="3"
              id="thAmount"
            >
              {{ $t("ETFFlow.amount") }}
            </th>
            <th scope="colgroup" class="text-center" colspan="3" id="thOverall">
              {{ $t("ETFFlow.overall") }}
            </th>
            <th
              scope="col"
              class="text-center d-none d-md-table-cell"
              rowspan="2"
              id="thState"
            >
              {{ $t("Reports.state") }}
            </th>
          </tr>
          <tr>
            <th
              scope="col"
              class="text-center d-none d-md-table-cell"
              id="thAmountPayed"
            >
              {{ $t("ETFFlow.payed") }} &#8709;
            </th>
            <th
              scope="col"
              class="text-center d-none d-md-table-cell"
              id="thAmountBid"
            >
              {{ $t("ETFFlow.bid") }}
            </th>
            <th
              scope="col"
              class="text-center d-none d-md-table-cell"
              id="thAmountAsk"
            >
              {{ $t("ETFFlow.ask") }}
            </th>
            <th scope="col" class="text-center" id="thOverallPayed">
              {{ $t("ETFFlow.payed") }}
            </th>
            <th scope="col" class="text-center" id="thOverallBid">
              {{ $t("ETFFlow.bid") }}
            </th>
            <th scope="col" class="text-center" id="thOverallProfit">
              {{ $t("ETFFlow.profit") }}
            </th>
          </tr>
        </thead>

        <tbody v-if="etfSummary">
          <EtfTableRow v-bind="etfSummary" />
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import EtfTableRow from "../reports/EtfTableRow.vue";
import type { EtfSummary } from "@/model/etf/EtfSummary";

defineProps({
  etfSummary: {
    type: Object as PropType<EtfSummary>,
    required: false,
  },
});
</script>
