<template>
  <DivError :server-errors="serverErrors" />
  <div
    class="row justify-content-md-center py-4"
    v-if="dataLoaded && etfSummaryReceived"
  >
    <div class="col col-xxl-8">
      <div class="card">
        <div class="card-header text-center p-3">
          <h4>{{ $t("General.etf") }}</h4>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-xs-12 text-center table-responsive">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th class="text-center" rowspan="2" id="thEtf">
                      {{ $t("General.etf") }}
                    </th>
                    <th class="text-center" rowspan="2" id="thShares">
                      {{ $t("ETFFlow.shares") }}
                    </th>
                    <th
                      class="text-center d-none d-md-table-cell"
                      colspan="3"
                      id="thAmount"
                    >
                      {{ $t("ETFFlow.amount") }}
                    </th>
                    <th class="text-center" colspan="3" id="thOverall">
                      {{ $t("ETFFlow.overall") }}
                    </th>
                    <th
                      class="text-center d-none d-md-table-cell"
                      rowspan="2"
                      id="thState"
                    >
                      {{ $t("Reports.state") }}
                    </th>
                  </tr>
                  <tr>
                    <th
                      class="text-center d-none d-md-table-cell"
                      id="thAmountPayed"
                    >
                      {{ $t("ETFFlow.payed") }} &#8709;
                    </th>
                    <th
                      class="text-center d-none d-md-table-cell"
                      id="thAmountBid"
                    >
                      {{ $t("ETFFlow.bid") }}
                    </th>
                    <th
                      class="text-center d-none d-md-table-cell"
                      id="thAmountAsk"
                    >
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

                <tbody v-if="dataLoaded">
                  <EtfTableRowVue
                    v-for="etfData in etfSummaryArray"
                    :key="etfData.etfId"
                    v-bind="etfData"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EtfService from "@/service/EtfService";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { computed, onMounted, ref, watch } from "vue";
import DivError from "../DivError.vue";
import EtfTableRowVue from "./EtfTableRow.vue";

const serverErrors = ref(new Array<string>());

const etfSummaryArray = ref(new Array<EtfSummary>());
const dataLoaded = ref(false);

const props = defineProps({
  year: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
});

const loadData = (year: number, month: number) => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  EtfService.listEtfOverview(year, month)
    .then((_etfSummeryArray) => {
      etfSummaryArray.value = _etfSummeryArray;
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

onMounted(() => {
  loadData(+props.year, +props.month);
});

watch(
  () => ({
    year: props.year,
    month: props.month,
  }),
  (data) => {
    if (data.year && data.month) loadData(+data.year, +data.month);
  },
);

const etfSummaryReceived = computed(() => {
  return etfSummaryArray.value.length > 0;
});
</script>
