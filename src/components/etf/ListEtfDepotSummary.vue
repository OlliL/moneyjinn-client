<template>
  <div class="row justify-content-md-center" v-if="etfSummary">
    <div class="col-xxl-6 col-xs-12 mb-4">
      <table class="table table-striped table-bordered table-hover">
        <col style="width: 10%" />
        <col style="width: 12%" />
        <col style="width: 12%" />
        <col style="width: 12%" />
        <col style="width: 12%" />
        <col style="width: 12%" />
        <col style="width: 12%" />
        <col style="width: 18%" />
        <thead>
          <tr>
            <th class="text-center" rowspan="2" id="thShares">
              {{ $t("ETFFlow.shares") }}
            </th>
            <th class="text-center" colspan="3" id="thAmount">
              {{ $t("ETFFlow.amount") }}
            </th>
            <th class="text-center" colspan="3" id="thOverall">
              {{ $t("ETFFlow.overall") }}
            </th>
            <th class="text-center" rowspan="2" id="thState">
              {{ $t("Reports.state") }}
            </th>
          </tr>
          <tr>
            <th class="text-center" id="thAmountPayed">
              {{ $t("ETFFlow.payed") }} &#8709;
            </th>
            <th class="text-center" id="thAmountBid">
              {{ $t("ETFFlow.bid") }}
            </th>
            <th class="text-center" id="thAmountAsk">
              {{ $t("ETFFlow.ask") }}
            </th>
            <th class="text-center" id="thOverallPayed">
              {{ $t("ETFFlow.payed") }}
            </th>
            <th class="text-center" id="thOverallBid">
              {{ $t("ETFFlow.bid") }}
            </th>
            <th class="text-center" id="thOverallProfit">
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
